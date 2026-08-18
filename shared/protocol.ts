/**
 * Type-Safe WebSocket Message Protocol for Cloudflare Workers & Durable Objects
 */

import { GameRoom, MoveResult, ChatMessage, Player, GameRules, BotDifficulty } from './types';

// ==========================================
// Client -> Server Action Messages
// ==========================================

export type ClientMessageType =
  | 'JOIN_ROOM'
  | 'READY'
  | 'START_GAME'
  | 'ADD_BOT'
  | 'ROLL_DICE'
  | 'CHAT_MESSAGE'
  | 'REMATCH'
  | 'LEAVE_ROOM'
  | 'RECONNECT'
  | 'PING';

export interface BaseClientMessage {
  type: ClientMessageType;
  guestId: string;
  sessionToken?: string;
  actionId?: string;
}

export interface JoinRoomClientMessage extends BaseClientMessage {
  type: 'JOIN_ROOM';
  roomCode: string;
  nickname: string;
}

export interface ReadyClientMessage extends BaseClientMessage {
  type: 'READY';
  isReady: boolean;
}

export interface StartGameClientMessage extends BaseClientMessage {
  type: 'START_GAME';
}

export interface AddBotClientMessage extends BaseClientMessage {
  type: 'ADD_BOT';
  difficulty?: BotDifficulty;
}

export interface RollDiceClientMessage extends BaseClientMessage {
  type: 'ROLL_DICE';
}

export interface ChatMessageClientMessage extends BaseClientMessage {
  type: 'CHAT_MESSAGE';
  message: string;
}

export interface RematchClientMessage extends BaseClientMessage {
  type: 'REMATCH';
}

export interface LeaveRoomClientMessage extends BaseClientMessage {
  type: 'LEAVE_ROOM';
}

export interface ReconnectClientMessage extends BaseClientMessage {
  type: 'RECONNECT';
  roomCode: string;
}

export interface PingClientMessage extends BaseClientMessage {
  type: 'PING';
}

export type ClientMessage =
  | JoinRoomClientMessage
  | ReadyClientMessage
  | StartGameClientMessage
  | AddBotClientMessage
  | RollDiceClientMessage
  | ChatMessageClientMessage
  | RematchClientMessage
  | LeaveRoomClientMessage
  | ReconnectClientMessage
  | PingClientMessage;

// ==========================================
// Server -> Client Broadcast Messages
// ==========================================

export type ServerMessageType =
  | 'ROOM_STATE'
  | 'PLAYER_JOINED'
  | 'PLAYER_LEFT'
  | 'PLAYER_READY'
  | 'GAME_STARTED'
  | 'TURN_CHANGED'
  | 'DICE_ROLLED'
  | 'PLAYER_MOVED'
  | 'SNAKE_TRIGGERED'
  | 'LADDER_TRIGGERED'
  | 'GAME_FINISHED'
  | 'REMATCH_ACCEPTED'
  | 'CHAT_MESSAGE'
  | 'ERROR'
  | 'PONG';

export interface BaseServerMessage {
  type: ServerMessageType;
  timestamp: number;
}

export interface RoomStateServerMessage extends BaseServerMessage {
  type: 'ROOM_STATE';
  room: GameRoom;
}

export interface PlayerJoinedServerMessage extends BaseServerMessage {
  type: 'PLAYER_JOINED';
  player: Player;
  room: GameRoom;
}

export interface PlayerLeftServerMessage extends BaseServerMessage {
  type: 'PLAYER_LEFT';
  guestId: string;
  newHostGuestId?: string;
  room: GameRoom;
}

export interface PlayerReadyServerMessage extends BaseServerMessage {
  type: 'PLAYER_READY';
  guestId: string;
  isReady: boolean;
}

export interface GameStartedServerMessage extends BaseServerMessage {
  type: 'GAME_STARTED';
  room: GameRoom;
}

export interface TurnChangedServerMessage extends BaseServerMessage {
  type: 'TURN_CHANGED';
  currentTurnGuestId: string;
  turnNumber: number;
}

export interface DiceRolledServerMessage extends BaseServerMessage {
  type: 'DICE_ROLLED';
  guestId: string;
  diceValue: number;
  moveResult: MoveResult;
  room: GameRoom;
}

export interface PlayerMovedServerMessage extends BaseServerMessage {
  type: 'PLAYER_MOVED';
  guestId: string;
  oldPosition: number;
  newPosition: number;
  steps: number[];
}

export interface SnakeTriggeredServerMessage extends BaseServerMessage {
  type: 'SNAKE_TRIGGERED';
  guestId: string;
  from: number;
  to: number;
}

export interface LadderTriggeredServerMessage extends BaseServerMessage {
  type: 'LADDER_TRIGGERED';
  guestId: string;
  from: number;
  to: number;
}

export interface GameFinishedServerMessage extends BaseServerMessage {
  type: 'GAME_FINISHED';
  winner: Player;
  room: GameRoom;
}

export interface RematchAcceptedServerMessage extends BaseServerMessage {
  type: 'REMATCH_ACCEPTED';
  room: GameRoom;
}

export interface ChatMessageServerMessage extends BaseServerMessage {
  type: 'CHAT_MESSAGE';
  message: ChatMessage;
}

export interface ErrorServerMessage extends BaseServerMessage {
  type: 'ERROR';
  code:
    | 'ROOM_NOT_FOUND'
    | 'ROOM_FULL'
    | 'ROOM_EXPIRED'
    | 'GAME_ALREADY_STARTED'
    | 'NOT_YOUR_TURN'
    | 'INVALID_SESSION'
    | 'INVALID_ACTION'
    | 'DUPLICATE_ACTION'
    | 'GAME_FINISHED'
    | 'PLAYER_NOT_IN_ROOM'
    | 'RATE_LIMITED'
    | 'INTERNAL_ERROR';
  message: string;
}

export interface PongServerMessage extends BaseServerMessage {
  type: 'PONG';
}

export type ServerMessage =
  | RoomStateServerMessage
  | PlayerJoinedServerMessage
  | PlayerLeftServerMessage
  | PlayerReadyServerMessage
  | GameStartedServerMessage
  | TurnChangedServerMessage
  | DiceRolledServerMessage
  | PlayerMovedServerMessage
  | SnakeTriggeredServerMessage
  | LadderTriggeredServerMessage
  | GameFinishedServerMessage
  | RematchAcceptedServerMessage
  | ChatMessageServerMessage
  | ErrorServerMessage
  | PongServerMessage;
