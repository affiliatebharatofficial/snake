/**
 * Cloudflare Worker Environment Bindings
 */

export interface Env {
  DB: D1Database;
  SNAKE_LADDER_ROOM: DurableObjectNamespace;
  ADMIN_SECRET?: string;
  ENVIRONMENT?: string;
  APP_URL?: string;
  ASSETS?: Fetcher;
}
