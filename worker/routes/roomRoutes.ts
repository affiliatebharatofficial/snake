/**
 * Room API Routes for Cloudflare Worker
 */

import { Env } from '../types';
import { GameRoom, Player, GameRules, GameMode } from '../../shared/types';
import { registerOrUpdateGuest } from '../auth/guestAuth';

/**
 * Generates an unpredictable 6-character room code.
 */
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  const randomBytes = new Uint8Array(6);
  crypto.getRandomValues(randomBytes);
  for (let i = 0; i < 6; i++) {
    code += chars[randomBytes[i] % chars.length];
  }
  return code;
}

/**
 * POST /api/rooms/create
 */
export async function handleCreateRoom(request: Request, env: Env): Promise<Response> {
  try {
    const body = (await request.json()) as {
      hostGuestId: string;
      nickname: string;
      sessionToken: string;
      mode?: GameMode;
      maxPlayers?: 2 | 3 | 4;
      rules?: GameRules;
      botCount?: number;
    };

    if (!body.hostGuestId || !body.nickname) {
      return new Response(JSON.stringify({ error: 'Missing guest ID or nickname' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Register Guest in D1
    await registerOrUpdateGuest(env.DB, body.hostGuestId, body.nickname, body.sessionToken);

    // 2. Generate Unique Room Code & IDs
    const roomCode = generateRoomCode();
    const roomId = `room_${Date.now()}_${roomCode}`;
    const mode = body.mode || 'private';
    const maxPlayers = body.maxPlayers || 4;

    // 3. Durable Object Instance Allocation
    const doId = env.SNAKE_LADDER_ROOM.idFromName(roomCode);
    const doStub = env.SNAKE_LADDER_ROOM.get(doId);

    const defaultRules: GameRules = body.rules || {
      sixGivesExtraTurn: true,
      exact100ToWin: true,
      enterOnSix: false,
      maxConsecutiveSixes: 3,
    };

    const hostPlayer: Player = {
      id: body.hostGuestId,
      nickname: body.nickname,
      playerNumber: 1,
      color: 'red',
      position: 0,
      isConnected: true,
      isBot: false,
      isReady: true,
      joinedAt: Date.now(),
      lastSeenAt: Date.now(),
    };

    const players: Player[] = [hostPlayer];

    // Add bots if requested
    if (mode === 'bot' || (body.botCount && body.botCount > 0)) {
      const botCount = body.botCount || 1;
      const colors: ('blue' | 'green' | 'yellow')[] = ['blue', 'green', 'yellow'];
      for (let i = 0; i < botCount; i++) {
        const num = (i + 2) as 2 | 3 | 4;
        players.push({
          id: `bot_${Date.now()}_${i + 1}`,
          nickname: `Bot ${i + 1} [AI]`,
          playerNumber: num,
          color: colors[i] || 'yellow',
          position: 0,
          isConnected: true,
          isBot: true,
          botDifficulty: 'medium',
          isReady: true,
          joinedAt: Date.now(),
          lastSeenAt: Date.now(),
        });
      }
    }

    const room: GameRoom = {
      id: roomId,
      roomCode,
      hostGuestId: body.hostGuestId,
      durableObjectId: doId.toString(),
      mode,
      status: mode === 'bot' && players.length >= 2 ? 'playing' : 'waiting',
      maxPlayers,
      currentTurnGuestId: body.hostGuestId,
      players,
      rules: defaultRules,
      turnNumber: 1,
      consecutiveSixes: 0,
      createdAt: Date.now(),
      startedAt: mode === 'bot' ? Date.now() : undefined,
      events: [
        {
          id: `evt_${Date.now()}`,
          timestamp: Date.now(),
          type: 'join',
          message: `${body.nickname} created room ${roomCode}`,
          guestId: body.hostGuestId,
          playerColor: 'red',
        },
      ],
      chat: [
        {
          id: `chat_${Date.now()}`,
          guestId: 'system',
          nickname: 'System',
          message: `Welcome to room ${roomCode}! Roll dice and race to 100!`,
          createdAt: Date.now(),
          isSystem: true,
        },
      ],
    };

    // 4. Initialize Room in Durable Object
    await doStub.fetch('http://internal/init', {
      method: 'POST',
      body: JSON.stringify({ room }),
      headers: { 'Content-Type': 'application/json' },
    });

    // 5. Persist Room Record to D1
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    await env.DB.prepare(
      `INSERT INTO game_rooms (room_id, room_code, host_guest_id, durable_object_id, mode, status, max_players, expires_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`
    )
      .bind(
        roomId,
        roomCode,
        body.hostGuestId,
        doId.toString(),
        mode,
        room.status,
        maxPlayers,
        expiresAt
      )
      .run();

    // Persist Host Player in D1
    await env.DB.prepare(
      `INSERT INTO game_players (room_id, guest_id, nickname, player_number, color)
       VALUES (?1, ?2, ?3, 1, 'red')`
    )
      .bind(roomId, body.hostGuestId, body.nickname)
      .run();

    return new Response(JSON.stringify({ success: true, room }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to create room' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * GET /api/rooms/:roomCode
 */
export async function handleGetRoom(roomCode: string, env: Env): Promise<Response> {
  try {
    const doId = env.SNAKE_LADDER_ROOM.idFromName(roomCode.toUpperCase());
    const doStub = env.SNAKE_LADDER_ROOM.get(doId);

    const res = await doStub.fetch('http://internal/state');
    if (res.ok) {
      const data = await res.json();
      if (data.room) {
        return new Response(JSON.stringify({ success: true, room: data.room }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Fallback query D1 metadata
    const roomRecord = await env.DB.prepare(
      'SELECT * FROM game_rooms WHERE room_code = ?'
    )
      .bind(roomCode.toUpperCase())
      .first();

    if (!roomRecord) {
      return new Response(JSON.stringify({ error: 'Room not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, room: roomRecord }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
