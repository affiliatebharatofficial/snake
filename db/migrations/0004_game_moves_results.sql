-- Migration 0004: Game Moves, Game Results, and Chat History

-- Authoritative Game Moves
CREATE TABLE IF NOT EXISTS game_moves (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id TEXT NOT NULL,
  guest_id TEXT NOT NULL,
  turn_id TEXT NOT NULL,
  turn_number INTEGER NOT NULL,
  dice_value INTEGER NOT NULL CHECK(dice_value BETWEEN 1 AND 6),
  old_position INTEGER NOT NULL CHECK(old_position BETWEEN 0 AND 100),
  dice_destination INTEGER NOT NULL CHECK(dice_destination BETWEEN 0 AND 100),
  special_move_type TEXT NOT NULL DEFAULT 'none' CHECK(special_move_type IN ('none', 'snake', 'ladder')),
  special_move_from INTEGER,
  special_move_to INTEGER,
  final_position INTEGER NOT NULL CHECK(final_position BETWEEN 0 AND 100),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (room_id) REFERENCES game_rooms(room_id) ON DELETE CASCADE
);

-- Completed Game Summaries
CREATE TABLE IF NOT EXISTS game_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id TEXT UNIQUE NOT NULL,
  winner_guest_id TEXT NOT NULL,
  winner_nickname TEXT NOT NULL,
  total_players INTEGER NOT NULL CHECK(total_players BETWEEN 1 AND 4),
  total_turns INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  game_mode TEXT NOT NULL,
  started_at TEXT NOT NULL,
  completed_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (room_id) REFERENCES game_rooms(room_id) ON DELETE CASCADE
);

-- Player Final Results
CREATE TABLE IF NOT EXISTS game_result_players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_result_id INTEGER NOT NULL,
  guest_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  player_number INTEGER NOT NULL,
  final_position INTEGER NOT NULL,
  placement INTEGER NOT NULL CHECK(placement BETWEEN 1 AND 4),
  FOREIGN KEY (game_result_id) REFERENCES game_results(id) ON DELETE CASCADE
);

-- Chat Messages (Persisted for active room review)
CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id TEXT NOT NULL,
  guest_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  message TEXT NOT NULL CHECK(length(message) <= 200),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (room_id) REFERENCES game_rooms(room_id) ON DELETE CASCADE
);
