-- Seed Data for Cloudflare D1 Database

-- 1. Default Ladders (Bottom ➔ Top)
INSERT OR IGNORE INTO ladders (id, start_square, end_square, enabled) VALUES
  (1, 2, 38, 1),
  (2, 7, 14, 1),
  (3, 8, 31, 1),
  (4, 15, 26, 1),
  (5, 21, 42, 1),
  (6, 28, 84, 1),
  (7, 36, 44, 1),
  (8, 51, 67, 1),
  (9, 71, 91, 1),
  (10, 78, 98, 1);

-- 2. Default Snakes (Head ➔ Tail)
INSERT OR IGNORE INTO snakes (id, start_square, end_square, enabled) VALUES
  (1, 16, 6, 1),
  (2, 46, 25, 1),
  (3, 49, 11, 1),
  (4, 62, 19, 1),
  (5, 64, 60, 1),
  (6, 74, 53, 1),
  (7, 89, 68, 1),
  (8, 92, 88, 1),
  (9, 95, 75, 1),
  (10, 99, 80, 1);

-- 3. Default Game Configuration
INSERT OR IGNORE INTO game_config (config_key, config_value) VALUES
  ('max_players', '4'),
  ('min_players', '2'),
  ('exact_100_required', 'true'),
  ('roll_six_again', 'true'),
  ('must_roll_six_to_start', 'false'),
  ('max_consecutive_sixes', '3'),
  ('room_expiry_waiting_minutes', '30'),
  ('room_expiry_finished_hours', '24'),
  ('disconnect_grace_seconds', '30'),
  ('rate_limit_chat_per_minute', '20');
