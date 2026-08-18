/**
 * Guest Session Authentication & Cryptographic Utilities
 * Uses Web Crypto API compatible with Cloudflare Workers runtime.
 */

export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateSecureToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`ip_salt_${ip}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

/**
 * Validates a guest player record against a provided session token.
 */
export async function validateGuestSession(
  db: D1Database,
  guestId: string,
  sessionToken?: string
): Promise<boolean> {
  if (!guestId || !sessionToken) return false;

  const expectedHash = await hashToken(sessionToken);
  const result = await db
    .prepare('SELECT session_token_hash FROM guest_players WHERE guest_id = ?')
    .bind(guestId)
    .first<{ session_token_hash: string }>();

  if (!result) return false;
  return result.session_token_hash === expectedHash;
}

/**
 * Registers or updates a guest player in D1.
 */
export async function registerOrUpdateGuest(
  db: D1Database,
  guestId: string,
  nickname: string,
  sessionToken: string,
  ip?: string
): Promise<void> {
  const tokenHash = await hashToken(sessionToken);
  const ipHash = ip ? await hashIp(ip) : null;
  const now = new Date().toISOString();

  await db
    .prepare(
      `INSERT INTO guest_players (guest_id, nickname, session_token_hash, created_at, last_seen_at, last_ip_hash)
       VALUES (?1, ?2, ?3, ?4, ?4, ?5)
       ON CONFLICT(guest_id) DO UPDATE SET
         nickname = ?2,
         session_token_hash = ?3,
         last_seen_at = ?4,
         last_ip_hash = COALESCE(?5, last_ip_hash)`
    )
    .bind(guestId, nickname, tokenHash, now, ipHash)
    .run();
}
