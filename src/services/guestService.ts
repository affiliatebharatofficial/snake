import { GuestSession } from '../game/types';

const GUEST_STORAGE_KEY = 'snake_guest_session';
const RECENT_GAMES_KEY = 'snake_recent_games';

export interface RecentGame {
  id: string;
  roomCode: string;
  mode: string;
  date: number;
  winnerNickname: string;
  isWon: boolean;
  totalPlayers: number;
  finalPosition: number;
}

/**
 * Generates a cryptographically random hexadecimal string of given length.
 */
function generateRandomHex(length: number = 10): string {
  const bytes = new Uint8Array(Math.ceil(length / 2));
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('').slice(0, length);
}

/**
 * Sanitizes and validates player nickname.
 */
export function sanitizeNickname(name: string): string {
  if (!name) return '';
  // Remove HTML tags and abusive characters, limit length to 20
  return name.replace(/[<>&"']/g, '').trim().slice(0, 20);
}

/**
 * Returns a playful default guest nickname if none is provided.
 */
export function generateDefaultNickname(): string {
  const prefixes = ['LuckySnake', 'DiceMaster', 'LadderKing', 'SpeedyCobra', 'RollingViper', 'StarClimber', 'GoldenDice', 'ApexGamer'];
  const num = Math.floor(100 + Math.random() * 900);
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return `${prefix}${num}`;
}

/**
 * Retrieves existing guest session or creates a new one.
 */
export function getOrCreateGuestSession(): GuestSession {
  try {
    const saved = localStorage.getItem(GUEST_STORAGE_KEY);
    if (saved) {
      const session = JSON.parse(saved) as GuestSession;
      if (session.guestId && session.sessionToken) {
        return session;
      }
    }
  } catch (err) {
    console.warn('Failed to load guest session from storage:', err);
  }

  const newSession: GuestSession = {
    guestId: `guest_${generateRandomHex(10)}`,
    nickname: '',
    sessionToken: `st_${generateRandomHex(24)}`,
    createdAt: Date.now(),
  };

  saveGuestSession(newSession);
  return newSession;
}

/**
 * Saves or updates guest session in localStorage.
 */
export function saveGuestSession(session: GuestSession): void {
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save guest session:', err);
  }
}

/**
 * Updates guest nickname.
 */
export function updateGuestNickname(nickname: string): GuestSession {
  const session = getOrCreateGuestSession();
  session.nickname = sanitizeNickname(nickname);
  saveGuestSession(session);
  return session;
}

/**
 * Saves a completed game to local recent history (max 10).
 */
export function saveRecentGame(game: RecentGame): void {
  try {
    const saved = localStorage.getItem(RECENT_GAMES_KEY);
    let list: RecentGame[] = saved ? JSON.parse(saved) : [];
    list = [game, ...list.filter(g => g.id !== game.id)].slice(0, 10);
    localStorage.setItem(RECENT_GAMES_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Failed to save recent game:', err);
  }
}

/**
 * Gets recent games from local storage.
 */
export function getRecentGames(): RecentGame[] {
  try {
    const saved = localStorage.getItem(RECENT_GAMES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}
