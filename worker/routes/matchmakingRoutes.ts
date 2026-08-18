/**
 * Matchmaking & Quick Match Queue Route
 */

import { Env } from '../types';
import { handleCreateRoom } from './roomRoutes';

/**
 * POST /api/matchmaking/find
 */
export async function handleMatchmaking(request: Request, env: Env): Promise<Response> {
  try {
    const body = (await request.json()) as {
      guestId: string;
      nickname: string;
      sessionToken: string;
    };

    // Find any existing waiting public/quick room with open slots in D1
    const availableRoom = await env.DB.prepare(
      `SELECT room_code FROM game_rooms
       WHERE mode = 'quick' AND status = 'waiting'
       ORDER BY created_at ASC
       LIMIT 1`
    ).first<{ room_code: string }>();

    if (availableRoom) {
      return new Response(JSON.stringify({ success: true, roomCode: availableRoom.room_code }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If no room found, create a new 2-player quick match room
    const createReq = new Request('http://internal/api/rooms/create', {
      method: 'POST',
      body: JSON.stringify({
        hostGuestId: body.guestId,
        nickname: body.nickname,
        sessionToken: body.sessionToken,
        mode: 'quick',
        maxPlayers: 2,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    return await handleCreateRoom(createReq, env);
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Matchmaking error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
