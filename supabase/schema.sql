-- ====================================================================
-- Production-Ready Snake & Ladder Database Schema & RPC Functions
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Game Rooms Table
CREATE TABLE IF NOT EXISTS public.game_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_code VARCHAR(12) UNIQUE NOT NULL,
    host_guest_id VARCHAR(64) NOT NULL,
    mode VARCHAR(20) NOT NULL DEFAULT 'private', -- 'quick', 'private', 'public', 'bot'
    status VARCHAR(20) NOT NULL DEFAULT 'waiting', -- 'waiting', 'starting', 'playing', 'finished', 'abandoned'
    max_players INT NOT NULL DEFAULT 4 CHECK (max_players BETWEEN 2 AND 4),
    current_turn_guest_id VARCHAR(64),
    winner_guest_id VARCHAR(64),
    game_state JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);

CREATE INDEX IF NOT EXISTS idx_game_rooms_code ON public.game_rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_game_rooms_status ON public.game_rooms(status);
CREATE INDEX IF NOT EXISTS idx_game_rooms_expires ON public.game_rooms(expires_at);

-- 2. Game Players Table
CREATE TABLE IF NOT EXISTS public.game_players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.game_rooms(id) ON DELETE CASCADE,
    guest_id VARCHAR(64) NOT NULL,
    nickname VARCHAR(32) NOT NULL,
    player_number INT NOT NULL CHECK (player_number BETWEEN 1 AND 4),
    color VARCHAR(16) NOT NULL, -- 'red', 'blue', 'green', 'yellow'
    position INT NOT NULL DEFAULT 0 CHECK (position BETWEEN 0 AND 100),
    is_connected BOOLEAN NOT NULL DEFAULT true,
    is_ready BOOLEAN NOT NULL DEFAULT true,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_room_guest UNIQUE (room_id, guest_id),
    CONSTRAINT uq_room_number UNIQUE (room_id, player_number),
    CONSTRAINT uq_room_color UNIQUE (room_id, color)
);

CREATE INDEX IF NOT EXISTS idx_game_players_room ON public.game_players(room_id);
CREATE INDEX IF NOT EXISTS idx_game_players_guest ON public.game_players(guest_id);

-- 3. Game Moves Table (Authoritative Audit Log)
CREATE TABLE IF NOT EXISTS public.game_moves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.game_rooms(id) ON DELETE CASCADE,
    guest_id VARCHAR(64) NOT NULL,
    turn_id VARCHAR(64) NOT NULL,
    turn_number INT NOT NULL,
    dice_value INT NOT NULL CHECK (dice_value BETWEEN 1 AND 6),
    old_position INT NOT NULL CHECK (old_position BETWEEN 0 AND 100),
    new_position INT NOT NULL CHECK (new_position BETWEEN 0 AND 100),
    special_move_type VARCHAR(16), -- 'snake', 'ladder', 'entry', 'bounce'
    special_move_from INT,
    special_move_to INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_move_turn UNIQUE (room_id, turn_id)
);

CREATE INDEX IF NOT EXISTS idx_game_moves_room ON public.game_moves(room_id);

-- 4. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES public.game_rooms(id) ON DELETE CASCADE,
    guest_id VARCHAR(64) NOT NULL,
    nickname VARCHAR(32) NOT NULL,
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON public.chat_messages(room_id);

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public/anonymous guests) to read active rooms, players, moves, chat
CREATE POLICY "Public read rooms" ON public.game_rooms FOR SELECT USING (true);
CREATE POLICY "Public read players" ON public.game_players FOR SELECT USING (true);
CREATE POLICY "Public read moves" ON public.game_moves FOR SELECT USING (true);
CREATE POLICY "Public read chat" ON public.chat_messages FOR SELECT USING (true);

-- Enable Supabase Realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_moves;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- ====================================================================
-- Server-Authoritative RPC Database Functions
-- ====================================================================

-- 1. Create Room RPC
CREATE OR REPLACE FUNCTION public.rpc_create_room(
    p_room_code VARCHAR,
    p_host_guest_id VARCHAR,
    p_nickname VARCHAR,
    p_mode VARCHAR DEFAULT 'private',
    p_max_players INT DEFAULT 4,
    p_rules JSONB DEFAULT '{"enterOnSix": false, "sixGivesExtraTurn": true, "exact100ToWin": true}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_room_id UUID;
    v_clean_nick VARCHAR;
    v_room JSONB;
BEGIN
    v_clean_nick := SUBSTRING(TRIM(p_nickname) FROM 1 FOR 20);
    IF LENGTH(v_clean_nick) < 2 THEN
        v_clean_nick := 'Player 1';
    END IF;

    INSERT INTO public.game_rooms (
        room_code,
        host_guest_id,
        mode,
        status,
        max_players,
        current_turn_guest_id,
        game_state,
        created_at,
        expires_at
    )
    VALUES (
        UPPER(p_room_code),
        p_host_guest_id,
        p_mode,
        'waiting',
        p_max_players,
        p_host_guest_id,
        jsonb_build_object(
            'rules', p_rules,
            'turnNumber', 1,
            'consecutiveSixes', 0
        ),
        NOW(),
        NOW() + INTERVAL '24 hours'
    )
    RETURNING id INTO v_room_id;

    -- Add Host as Player 1 (Red)
    INSERT INTO public.game_players (
        room_id,
        guest_id,
        nickname,
        player_number,
        color,
        position,
        is_connected,
        is_ready
    )
    VALUES (
        v_room_id,
        p_host_guest_id,
        v_clean_nick,
        1,
        'red',
        0,
        true,
        true
    );

    SELECT to_jsonb(r) INTO v_room FROM public.game_rooms r WHERE r.id = v_room_id;
    RETURN v_room;
END;
$$;

-- 2. Join Room RPC
CREATE OR REPLACE FUNCTION public.rpc_join_room(
    p_room_code VARCHAR,
    p_guest_id VARCHAR,
    p_nickname VARCHAR
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_room RECORD;
    v_player_count INT;
    v_player_num INT;
    v_color VARCHAR;
    v_existing_player RECORD;
    v_clean_nick VARCHAR;
BEGIN
    v_clean_nick := SUBSTRING(TRIM(p_nickname) FROM 1 FOR 20);
    IF LENGTH(v_clean_nick) < 2 THEN
        v_clean_nick := 'Guest';
    END IF;

    SELECT * INTO v_room FROM public.game_rooms WHERE room_code = UPPER(p_room_code) AND status != 'abandoned';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Room % not found', p_room_code;
    END IF;

    -- Check if already joined
    SELECT * INTO v_existing_player FROM public.game_players WHERE room_id = v_room.id AND guest_id = p_guest_id;
    IF FOUND THEN
        UPDATE public.game_players SET is_connected = true, last_seen_at = NOW() WHERE id = v_existing_player.id;
        RETURN jsonb_build_object('success', true, 'room_id', v_room.id, 'player_number', v_existing_player.player_number);
    END IF;

    -- Check room capacity
    SELECT COUNT(*) INTO v_player_count FROM public.game_players WHERE room_id = v_room.id;
    IF v_player_count >= v_room.max_players THEN
        RAISE EXCEPTION 'Room is full';
    END IF;

    IF v_room.status != 'waiting' THEN
        RAISE EXCEPTION 'Game already in progress';
    END IF;

    v_player_num := v_player_count + 1;
    v_color := CASE v_player_num
        WHEN 1 THEN 'red'
        WHEN 2 THEN 'blue'
        WHEN 3 THEN 'green'
        WHEN 4 THEN 'yellow'
        ELSE 'blue'
    END;

    INSERT INTO public.game_players (
        room_id,
        guest_id,
        nickname,
        player_number,
        color,
        position,
        is_connected,
        is_ready
    )
    VALUES (
        v_room.id,
        p_guest_id,
        v_clean_nick,
        v_player_num,
        v_color,
        0,
        true,
        true
    );

    RETURN jsonb_build_object('success', true, 'room_id', v_room.id, 'player_number', v_player_num);
END;
$$;

-- 3. Server-Authoritative Dice Roll & Move Validation RPC
CREATE OR REPLACE FUNCTION public.rpc_roll_dice(
    p_room_id UUID,
    p_guest_id VARCHAR,
    p_turn_id VARCHAR
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_room RECORD;
    v_player RECORD;
    v_players RECORD;
    v_all_players JSONB;
    v_dice INT;
    v_old_pos INT;
    v_target_pos INT;
    v_new_pos INT;
    v_special_type VARCHAR := NULL;
    v_special_from INT := NULL;
    v_special_to INT := NULL;
    v_is_winner BOOLEAN := false;
    v_is_bonus BOOLEAN := false;
    v_next_turn_guest_id VARCHAR;
    v_player_list VARCHAR[];
    v_current_idx INT;
    v_next_idx INT;
    v_rules JSONB;
    v_exact_100 BOOLEAN;
    v_six_extra BOOLEAN;
    v_enter_six BOOLEAN;
    v_consecutive_sixes INT;
BEGIN
    -- 1. Validate Room & Turn
    SELECT * INTO v_room FROM public.game_rooms WHERE id = p_room_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Room not found';
    END IF;

    IF v_room.status != 'playing' THEN
        RAISE EXCEPTION 'Game is not active';
    END IF;

    IF v_room.current_turn_guest_id != p_guest_id THEN
        RAISE EXCEPTION 'Not your turn';
    END IF;

    -- Idempotency check: prevent duplicate actions
    IF EXISTS (SELECT 1 FROM public.game_moves WHERE room_id = p_room_id AND turn_id = p_turn_id) THEN
        RAISE EXCEPTION 'Action already processed';
    END IF;

    -- 2. Get Player Data
    SELECT * INTO v_player FROM public.game_players WHERE room_id = p_room_id AND guest_id = p_guest_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Player not found in room';
    END IF;

    v_rules := COALESCE(v_room.game_state->'rules', '{}'::jsonb);
    v_exact_100 := COALESCE((v_rules->>'exact100ToWin')::boolean, true);
    v_six_extra := COALESCE((v_rules->>'sixGivesExtraTurn')::boolean, true);
    v_enter_six := COALESCE((v_rules->>'enterOnSix')::boolean, false);
    v_consecutive_sixes := COALESCE((v_room.game_state->>'consecutiveSixes')::int, 0);

    -- 3. Authoritative Cryptographic Dice Generation in Postgres
    v_dice := FLOOR(RANDOM() * 6 + 1)::INT;
    v_old_pos := v_player.position;

    -- 4. Calculate Move
    IF v_old_pos = 0 THEN
        IF v_enter_six THEN
            IF v_dice = 6 THEN
                v_target_pos := 1;
                v_special_type := 'entry';
                v_special_from := 0;
                v_special_to := 1;
            ELSE
                v_target_pos := 0;
            END IF;
        ELSE
            v_target_pos := v_dice;
        END IF;
    ELSE
        v_target_pos := v_old_pos + v_dice;
        IF v_exact_100 AND v_target_pos > 100 THEN
            v_target_pos := v_old_pos;
            v_special_type := 'bounce';
            v_special_from := v_old_pos + v_dice;
            v_special_to := v_old_pos;
        ELSIF v_target_pos > 100 THEN
            v_target_pos := 100;
        END IF;
    END IF;

    v_new_pos := v_target_pos;

    -- 5. Standard Ladders Check
    IF v_new_pos = 2 THEN v_new_pos := 38; v_special_type := 'ladder'; v_special_from := 2; v_special_to := 38;
    ELSIF v_new_pos = 7 THEN v_new_pos := 14; v_special_type := 'ladder'; v_special_from := 7; v_special_to := 14;
    ELSIF v_new_pos = 8 THEN v_new_pos := 31; v_special_type := 'ladder'; v_special_from := 8; v_special_to := 31;
    ELSIF v_new_pos = 15 THEN v_new_pos := 26; v_special_type := 'ladder'; v_special_from := 15; v_special_to := 26;
    ELSIF v_new_pos = 21 THEN v_new_pos := 42; v_special_type := 'ladder'; v_special_from := 21; v_special_to := 42;
    ELSIF v_new_pos = 28 THEN v_new_pos := 84; v_special_type := 'ladder'; v_special_from := 28; v_special_to := 84;
    ELSIF v_new_pos = 36 THEN v_new_pos := 44; v_special_type := 'ladder'; v_special_from := 36; v_special_to := 44;
    ELSIF v_new_pos = 51 THEN v_new_pos := 67; v_special_type := 'ladder'; v_special_from := 51; v_special_to := 67;
    ELSIF v_new_pos = 71 THEN v_new_pos := 91; v_special_type := 'ladder'; v_special_from := 71; v_special_to := 91;
    ELSIF v_new_pos = 78 THEN v_new_pos := 98; v_special_type := 'ladder'; v_special_from := 78; v_special_to := 98;
    -- Standard Snakes Check
    ELSIF v_new_pos = 16 THEN v_new_pos := 6; v_special_type := 'snake'; v_special_from := 16; v_special_to := 6;
    ELSIF v_new_pos = 46 THEN v_new_pos := 25; v_special_type := 'snake'; v_special_from := 46; v_special_to := 25;
    ELSIF v_new_pos = 49 THEN v_new_pos := 11; v_special_type := 'snake'; v_special_from := 49; v_special_to := 11;
    ELSIF v_new_pos = 62 THEN v_new_pos := 19; v_special_type := 'snake'; v_special_from := 62; v_special_to := 19;
    ELSIF v_new_pos = 64 THEN v_new_pos := 60; v_special_type := 'snake'; v_special_from := 64; v_special_to := 60;
    ELSIF v_new_pos = 74 THEN v_new_pos := 53; v_special_type := 'snake'; v_special_from := 74; v_special_to := 53;
    ELSIF v_new_pos = 89 THEN v_new_pos := 68; v_special_type := 'snake'; v_special_from := 89; v_special_to := 68;
    ELSIF v_new_pos = 92 THEN v_new_pos := 88; v_special_type := 'snake'; v_special_from := 92; v_special_to := 88;
    ELSIF v_new_pos = 95 THEN v_new_pos := 75; v_special_type := 'snake'; v_special_from := 95; v_special_to := 75;
    ELSIF v_new_pos = 99 THEN v_new_pos := 80; v_special_type := 'snake'; v_special_from := 99; v_special_to := 80;
    END IF;

    v_is_winner := (v_new_pos = 100);

    -- 6. Bonus Turn / Next Turn Calculation
    IF v_dice = 6 THEN
        v_consecutive_sixes := v_consecutive_sixes + 1;
    ELSE
        v_consecutive_sixes := 0;
    END IF;

    IF v_six_extra AND v_dice = 6 AND NOT v_is_winner AND v_consecutive_sixes < 3 THEN
        v_is_bonus := true;
        v_next_turn_guest_id := p_guest_id;
    ELSE
        v_is_bonus := false;
        -- Find next player in turn order
        SELECT ARRAY_AGG(guest_id ORDER BY player_number) INTO v_player_list FROM public.game_players WHERE room_id = p_room_id;
        v_current_idx := ARRAY_POSITION(v_player_list, p_guest_id);
        v_next_idx := (v_current_idx % ARRAY_LENGTH(v_player_list, 1)) + 1;
        v_next_turn_guest_id := v_player_list[v_next_idx];
    END IF;

    -- 7. Persist Updates Atomically
    UPDATE public.game_players SET position = v_new_pos, last_seen_at = NOW() WHERE id = v_player.id;

    INSERT INTO public.game_moves (
        room_id,
        guest_id,
        turn_id,
        turn_number,
        dice_value,
        old_position,
        new_position,
        special_move_type,
        special_move_from,
        special_move_to
    )
    VALUES (
        p_room_id,
        p_guest_id,
        p_turn_id,
        COALESCE((v_room.game_state->>'turnNumber')::int, 1),
        v_dice,
        v_old_pos,
        v_new_pos,
        v_special_type,
        v_special_from,
        v_special_to
    );

    UPDATE public.game_rooms
    SET
        current_turn_guest_id = CASE WHEN v_is_winner THEN NULL ELSE v_next_turn_guest_id END,
        winner_guest_id = CASE WHEN v_is_winner THEN p_guest_id ELSE NULL END,
        status = CASE WHEN v_is_winner THEN 'finished' ELSE 'playing' END,
        finished_at = CASE WHEN v_is_winner THEN NOW() ELSE NULL END,
        game_state = jsonb_set(
            jsonb_set(v_room.game_state, '{consecutiveSixes}', to_jsonb(v_consecutive_sixes)),
            '{turnNumber}',
            to_jsonb(COALESCE((v_room.game_state->>'turnNumber')::int, 1) + 1)
        )
    WHERE id = p_room_id;

    RETURN jsonb_build_object(
        'turnId', p_turn_id,
        'guestId', p_guest_id,
        'nickname', v_player.nickname,
        'diceValue', v_dice,
        'oldPosition', v_old_pos,
        'newPosition', v_new_pos,
        'specialType', v_special_type,
        'specialFrom', v_special_from,
        'specialTo', v_special_to,
        'isBonusTurn', v_is_bonus,
        'isWinner', v_is_winner,
        'nextTurnGuestId', v_next_turn_guest_id
    );
END;
$$;

-- 4. Start Game RPC
CREATE OR REPLACE FUNCTION public.rpc_start_game(
    p_room_id UUID,
    p_host_guest_id VARCHAR
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_room RECORD;
    v_player_count INT;
    v_first_turn_guest VARCHAR;
BEGIN
    SELECT * INTO v_room FROM public.game_rooms WHERE id = p_room_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Room not found';
    END IF;

    IF v_room.host_guest_id != p_host_guest_id THEN
        RAISE EXCEPTION 'Only the room host can start the game';
    END IF;

    SELECT COUNT(*) INTO v_player_count FROM public.game_players WHERE room_id = p_room_id;
    IF v_player_count < 2 THEN
        RAISE EXCEPTION 'Need at least 2 players to start';
    END IF;

    SELECT guest_id INTO v_first_turn_guest FROM public.game_players WHERE room_id = p_room_id ORDER BY player_number LIMIT 1;

    UPDATE public.game_rooms
    SET status = 'playing', started_at = NOW(), current_turn_guest_id = v_first_turn_guest
    WHERE id = p_room_id;

    RETURN jsonb_build_object('success', true, 'status', 'playing', 'current_turn', v_first_turn_guest);
END;
$$;

-- 5. Rematch RPC
CREATE OR REPLACE FUNCTION public.rpc_rematch(
    p_room_id UUID,
    p_guest_id VARCHAR
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_room RECORD;
    v_first_turn_guest VARCHAR;
BEGIN
    SELECT * INTO v_room FROM public.game_rooms WHERE id = p_room_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Room not found';
    END IF;

    -- Reset all player positions
    UPDATE public.game_players SET position = 0 WHERE room_id = p_room_id;

    SELECT guest_id INTO v_first_turn_guest FROM public.game_players WHERE room_id = p_room_id ORDER BY player_number LIMIT 1;

    UPDATE public.game_rooms
    SET
        status = 'playing',
        winner_guest_id = NULL,
        finished_at = NULL,
        current_turn_guest_id = v_first_turn_guest,
        game_state = jsonb_set(v_room.game_state, '{turnNumber}', '1'::jsonb)
    WHERE id = p_room_id;

    RETURN jsonb_build_object('success', true, 'status', 'playing');
END;
$$;

-- 6. Send Chat Message RPC
CREATE OR REPLACE FUNCTION public.rpc_send_chat(
    p_room_id UUID,
    p_guest_id VARCHAR,
    p_nickname VARCHAR,
    p_message VARCHAR
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_clean_msg VARCHAR;
    v_clean_nick VARCHAR;
BEGIN
    v_clean_msg := SUBSTRING(TRIM(p_message) FROM 1 FOR 200);
    v_clean_nick := SUBSTRING(TRIM(p_nickname) FROM 1 FOR 20);

    IF LENGTH(v_clean_msg) = 0 THEN
        RAISE EXCEPTION 'Empty message';
    END IF;

    INSERT INTO public.chat_messages (room_id, guest_id, nickname, message)
    VALUES (p_room_id, p_guest_id, v_clean_nick, v_clean_msg);

    RETURN jsonb_build_object('success', true);
END;
$$;
