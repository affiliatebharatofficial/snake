-- Migration 0005: Performance Indexes
CREATE INDEX IF NOT EXISTS idx_game_rooms_code ON game_rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_game_rooms_status ON game_rooms(status);
CREATE INDEX IF NOT EXISTS idx_game_rooms_expires ON game_rooms(expires_at);
CREATE INDEX IF NOT EXISTS idx_game_rooms_host ON game_rooms(host_guest_id);

CREATE INDEX IF NOT EXISTS idx_game_players_room ON game_players(room_id);
CREATE INDEX IF NOT EXISTS idx_game_players_guest ON game_players(guest_id);

CREATE INDEX IF NOT EXISTS idx_game_moves_room_turn ON game_moves(room_id, turn_number);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_time ON chat_messages(room_id, created_at);

CREATE INDEX IF NOT EXISTS idx_game_results_completed ON game_results(completed_at);
