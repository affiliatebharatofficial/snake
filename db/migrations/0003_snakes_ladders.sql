-- Migration 0003: Snakes and Ladders Board Schema
-- Enforces integrity constraints for valid board shortcuts

CREATE TABLE IF NOT EXISTS snakes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  start_square INTEGER NOT NULL CHECK(start_square BETWEEN 2 AND 99),
  end_square INTEGER NOT NULL CHECK(end_square BETWEEN 1 AND 98),
  enabled INTEGER NOT NULL DEFAULT 1 CHECK(enabled IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK (start_square > end_square)
);

CREATE TABLE IF NOT EXISTS ladders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  start_square INTEGER NOT NULL CHECK(start_square BETWEEN 1 AND 98),
  end_square INTEGER NOT NULL CHECK(end_square BETWEEN 2 AND 99),
  enabled INTEGER NOT NULL DEFAULT 1 CHECK(enabled IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  CHECK (start_square < end_square)
);
