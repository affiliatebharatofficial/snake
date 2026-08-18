-- Migration 0001: Initial Schema for Cloudflare D1
-- Creates guest_players, game_rooms, and game_players tables with constraints

-- 1. Guest Players (Login-Free Temporary Identities)
CREATE TABLE IF NOT EXISTS guest_players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guest_id TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  session_token_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_seen_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_ip_hash TEXT
);

-- 2. Game Rooms
CREATE TABLE IF NOT EXISTS game_rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id TEXT UNIQUE NOT NULL,
  room_code TEXT UNIQUE NOT NULL,
  host_guest_id TEXT NOT NULL,
  durable_object_id TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'private' CHECK(mode IN ('quick', 'private', 'public', 'bot')),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK(status IN ('waiting', 'starting', 'playing', 'finished', 'cancelled', 'expired')),
  max_players INTEGER NOT NULL DEFAULT 4 CHECK(max_players BETWEEN 2 AND 4),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  started_at TEXT,
  finished_at TEXT,
  expires_at TEXT,
  winner_guest_id TEXT,
  total_turns INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (host_guest_id) REFERENCES guest_players(guest_id) ON DELETE SET NULL
);

-- 3. Game Players in Rooms
CREATE TABLE IF NOT EXISTS game_players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id TEXT NOT NULL,
  guest_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  player_number INTEGER NOT NULL CHECK(player_number BETWEEN 1 AND 4),
  color TEXT NOT NULL CHECK(color IN ('red', 'blue', 'green', 'yellow')),
  final_position INTEGER NOT NULL DEFAULT 0 CHECK(final_position BETWEEN 0 AND 100),
  joined_at TEXT NOT NULL DEFAULT (datetime('now')),
  left_at TEXT,
  FOREIGN KEY (room_id) REFERENCES game_rooms(room_id) ON DELETE CASCADE,
  FOREIGN KEY (guest_id) REFERENCES guest_players(guest_id) ON DELETE CASCADE,
  UNIQUE(room_id, guest_id),
  UNIQUE(room_id, player_number)
);
