/**
 * Shared domain types between Cloudflare Worker, Durable Objects, D1 Database, and Frontend.
 */

export type PlayerColor = 'red' | 'blue' | 'green' | 'yellow';
export type GameMode = 'quick' | 'private' | 'public' | 'bot';
export type RoomStatus = 'waiting' | 'starting' | 'playing' | 'finished' | 'cancelled' | 'abandoned' | 'expired';
export type GameStatus = RoomStatus;
export type BotDifficulty = 'easy' | 'medium' | 'hard';
export type SpecialMoveType = 'none' | 'snake' | 'ladder' | 'entry' | 'bounce';

export interface GuestSession {
  guestId: string;
  nickname: string;
  sessionToken: string;
  createdAt: number;
}

export interface GameRules {
  enterOnSix: boolean;
  sixGivesExtraTurn: boolean;
  exact100ToWin: boolean;
  maxConsecutiveSixes?: number;
  turnTimeoutSeconds?: number;
}

export interface Player {
  id: string; // guestId or bot_xxx
  nickname: string;
  playerNumber: 1 | 2 | 3 | 4;
  color: PlayerColor;
  position: number;
  isConnected: boolean;
  isBot: boolean;
  botDifficulty?: BotDifficulty;
  isReady: boolean;
  joinedAt: number;
  lastSeenAt: number;
}

export interface Snake {
  id: string;
  start: number;
  end: number;
}

export interface Ladder {
  id: string;
  start: number;
  end: number;
}

export interface GameEvent {
  id: string;
  timestamp: number;
  type: 'roll' | 'move' | 'snake' | 'ladder' | 'entry' | 'win' | 'turn' | 'join' | 'leave' | 'disconnect' | 'reconnect';
  message: string;
  guestId?: string;
  playerColor?: PlayerColor;
  details?: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  guestId: string;
  nickname: string;
  color?: PlayerColor;
  message: string;
  createdAt: number;
  isSystem?: boolean;
}

export interface SpecialMove {
  type: 'snake' | 'ladder' | 'entry' | 'bounce';
  from: number;
  to: number;
}

export interface MoveResult {
  turnId?: string;
  turnNumber?: number;
  guestId: string;
  nickname?: string;
  diceValue: number;
  oldPosition: number;
  newPosition?: number;
  intermediatePosition?: number;
  finalPosition: number;
  steps: number[];
  specialMove?: SpecialMove;
  isBonusTurn?: boolean;
  isExtraTurn?: boolean;
  isWinner: boolean;
  nextTurnGuestId?: string;
}

export interface GameRoom {
  id: string;
  roomCode: string;
  hostGuestId: string;
  durableObjectId?: string;
  mode: GameMode;
  status: RoomStatus;
  maxPlayers: 2 | 3 | 4;
  currentTurnGuestId?: string;
  winnerGuestId?: string;
  players: Player[];
  rules: GameRules;
  lastDiceResult?: number;
  lastActionId?: string;
  turnNumber: number;
  consecutiveSixes: number;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
  expiresAt?: number;
  events: GameEvent[];
  chat: ChatMessage[];
}

export interface CellCoordinates {
  cell: number;
  row: number;
  col: number;
  x: number;
  y: number;
}

// Database Entity Types
export interface GuestPlayerEntity {
  id: number;
  guest_id: string;
  nickname: string;
  session_token_hash: string;
  created_at: string;
  last_seen_at: string;
  last_ip_hash?: string;
}

export interface GameRoomEntity {
  id: number;
  room_id: string;
  room_code: string;
  host_guest_id: string;
  durable_object_id: string;
  mode: string;
  status: string;
  max_players: number;
  created_at: string;
  started_at?: string;
  finished_at?: string;
  expires_at?: string;
  winner_guest_id?: string;
  total_turns: number;
  duration_seconds: number;
}

export interface GamePlayerEntity {
  id: number;
  room_id: string;
  guest_id: string;
  nickname: string;
  player_number: number;
  color: string;
  final_position: number;
  joined_at: string;
  left_at?: string;
}

export interface GameMoveEntity {
  id: number;
  room_id: string;
  guest_id: string;
  turn_id: string;
  turn_number: number;
  dice_value: number;
  old_position: number;
  dice_destination: number;
  special_move_type: string;
  special_move_from?: number;
  special_move_to?: number;
  final_position: number;
  created_at: string;
}

export interface GameResultEntity {
  id: number;
  room_id: string;
  winner_guest_id: string;
  winner_nickname: string;
  total_players: number;
  total_turns: number;
  duration_seconds: number;
  game_mode: string;
  started_at: string;
  completed_at: string;
}

export interface GameResultPlayerEntity {
  id: number;
  game_result_id: number;
  guest_id: string;
  nickname: string;
  player_number: number;
  final_position: number;
  placement: number;
}

export interface ChatMessageEntity {
  id: number;
  room_id: string;
  guest_id: string;
  nickname: string;
  message: string;
  created_at: string;
}

export interface SnakeEntity {
  id: number;
  start_square: number;
  end_square: number;
  enabled: number;
  created_at: string;
  updated_at: string;
}

export interface LadderEntity {
  id: number;
  start_square: number;
  end_square: number;
  enabled: number;
  created_at: string;
  updated_at: string;
}

export interface GameConfigEntity {
  id: number;
  config_key: string;
  config_value: string;
  updated_at: string;
}
