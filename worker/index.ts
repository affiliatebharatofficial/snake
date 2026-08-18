/**
 * Cloudflare Worker Main Entry Point
 * Handles REST endpoints, CORS, WebSocket upgrade routing to Durable Objects, and Static Assets.
 */

import { Env } from './types';
import { SnakeLadderRoom } from '../durable-objects/SnakeLadderRoom';
import { handleCreateRoom, handleGetRoom } from './routes/roomRoutes';
import { handleMatchmaking } from './routes/matchmakingRoutes';
import { handleAdminMetrics } from './routes/adminRoutes';

// Export the Durable Object class so Cloudflare runtime can instantiate it
export { SnakeLadderRoom };

// Standard CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Guest-Token',
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // 1. Handle CORS Preflights
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 2. Real-Time WebSocket Upgrade Endpoint: /api/ws/:roomCode
      if (url.pathname.startsWith('/api/ws/')) {
        const parts = url.pathname.split('/');
        const roomCode = parts[3]?.toUpperCase();

        if (!roomCode || roomCode.length < 4) {
          return new Response('Invalid room code for WebSocket upgrade', { status: 400 });
        }

        // Direct WebSocket upgrade request to the dedicated Durable Object instance
        const doId = env.SNAKE_LADDER_ROOM.idFromName(roomCode);
        const doStub = env.SNAKE_LADDER_ROOM.get(doId);

        return await doStub.fetch(request);
      }

      // 3. REST API Routes
      if (url.pathname === '/api/rooms/create' && request.method === 'POST') {
        const res = await handleCreateRoom(request, env);
        return addCors(res);
      }

      if (url.pathname.startsWith('/api/rooms/') && request.method === 'GET') {
        const roomCode = url.pathname.split('/')[3];
        const res = await handleGetRoom(roomCode, env);
        return addCors(res);
      }

      if (url.pathname === '/api/matchmaking/find' && request.method === 'POST') {
        const res = await handleMatchmaking(request, env);
        return addCors(res);
      }

      if (url.pathname === '/api/admin/metrics') {
        const res = await handleAdminMetrics(request, env);
        return addCors(res);
      }

      if (url.pathname === '/api/health') {
        return addCors(
          new Response(
            JSON.stringify({
              status: 'healthy',
              service: 'snake-and-ladder-cloudflare-backend',
              timestamp: Date.now(),
            }),
            { headers: { 'Content-Type': 'application/json' } }
          )
        );
      }

      // 4. Static Asset Serving (Cloudflare Pages / Workers static assets)
      if (env.ASSETS) {
        return await env.ASSETS.fetch(request);
      }

      return new Response('Not Found', { status: 404 });
    } catch (err: any) {
      return addCors(
        new Response(JSON.stringify({ error: err.message || 'Worker Internal Error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }
  },
};

function addCors(response: Response): Response {
  const newHeaders = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders)) {
    newHeaders.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
