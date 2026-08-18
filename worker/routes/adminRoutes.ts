/**
 * Admin API Routes for Metrics and Board Configuration
 */

import { Env } from '../types';

export async function handleAdminMetrics(request: Request, env: Env): Promise<Response> {
  const authHeader = request.headers.get('Authorization');
  const adminSecret = env.ADMIN_SECRET;

  if (!adminSecret || !authHeader || !authHeader.includes(adminSecret)) {
    return new Response(JSON.stringify({ error: 'Unauthorized admin access' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const activeRooms = await env.DB.prepare(
      "SELECT count(*) as count FROM game_rooms WHERE status IN ('waiting', 'playing')"
    ).first<{ count: number }>();

    const completedGames = await env.DB.prepare(
      "SELECT count(*) as count FROM game_results"
    ).first<{ count: number }>();

    const totalPlayers = await env.DB.prepare(
      "SELECT count(*) as count FROM guest_players"
    ).first<{ count: number }>();

    return new Response(
      JSON.stringify({
        success: true,
        metrics: {
          activeRooms: activeRooms?.count || 0,
          completedGames: completedGames?.count || 0,
          totalGuests: totalPlayers?.count || 0,
        },
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
