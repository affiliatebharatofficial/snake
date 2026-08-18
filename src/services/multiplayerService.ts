/**
 * Cloudflare Real-Time Multiplayer Service
 * Supports Cloudflare Workers API + Durable Objects WebSockets in production,
 * and robust BroadcastChannel + localStorage synchronization for cross-tab local development.
 */

import {
  GameRoom,
  Player,
  MoveResult,
  GameRules,
  GameMode,
  ChatMessage,
  BotDifficulty,
} from '../../shared/types';
import {
  ClientMessage,
  ServerMessage,
  DiceRolledServerMessage,
  GameFinishedServerMessage,
} from '../../shared/protocol';
import { getOrCreateGuestSession } from './guestService';
import { DEFAULT_GAME_RULES } from '../game/gameRules';
import { createBotPlayer } from '../game/botEngine';

type RoomListener = (room: GameRoom) => void;
type DiceListener = (event: DiceRolledServerMessage) => void;
type FinishListener = (event: GameFinishedServerMessage) => void;

const ROOM_STORAGE_PREFIX = 'snake_room_';

export class MultiplayerService {
  private static activeSocket: WebSocket | null = null;
  private static activeRoomCode: string | null = null;
  private static activeBroadcastChannel: BroadcastChannel | null = null;
  private static pingInterval: any = null;

  private static roomListeners: Set<RoomListener> = new Set();
  private static diceListeners: Set<DiceListener> = new Set();
  private static finishListeners: Set<FinishListener> = new Set();

  /**
   * Helper to load room from persistent storage
   */
  private static loadStoredRoom(roomCode: string): GameRoom | null {
    try {
      const clean = roomCode.trim().toUpperCase();
      const raw = localStorage.getItem(`${ROOM_STORAGE_PREFIX}${clean}`);
      if (raw) {
        return JSON.parse(raw) as GameRoom;
      }
    } catch {}
    return null;
  }

  /**
   * Helper to save room to persistent storage & broadcast across tabs
   */
  private static saveStoredRoom(room: GameRoom): void {
    try {
      const clean = room.roomCode.trim().toUpperCase();
      localStorage.setItem(`${ROOM_STORAGE_PREFIX}${clean}`, JSON.stringify(room));
      if (this.activeBroadcastChannel) {
        this.activeBroadcastChannel.postMessage({
          type: 'ROOM_STATE',
          room,
          timestamp: Date.now(),
        });
      }
    } catch {}
  }

  /**
   * Creates a new game room.
   */
  public static async createRoom(
    hostGuestId: string,
    nickname: string,
    mode: GameMode = 'private',
    maxPlayers: 2 | 3 | 4 = 4,
    rules: GameRules = DEFAULT_GAME_RULES,
    botCount: number = 0,
    botDifficulty: BotDifficulty = 'medium'
  ): Promise<GameRoom> {
    const session = getOrCreateGuestSession();

    // 1. Try Cloudflare Worker REST endpoint
    try {
      const response = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostGuestId,
          nickname,
          sessionToken: session.sessionToken,
          mode,
          maxPlayers,
          rules,
          botCount,
          botDifficulty,
        }),
      });

      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        if (data.room) {
          this.saveStoredRoom(data.room);
          this.connectWebSocket(data.room.roomCode, hostGuestId, nickname);
          return data.room;
        }
      }
    } catch {}

    // 2. Local fallback with cross-tab persistence
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const roomId = `room_${Date.now()}_${code}`;

    const hostPlayer: Player = {
      id: hostGuestId,
      nickname: nickname || 'Player 1',
      playerNumber: 1,
      color: 'red',
      position: 0,
      isConnected: true,
      isBot: false,
      isReady: true,
      joinedAt: Date.now(),
      lastSeenAt: Date.now(),
    };

    const players: Player[] = [hostPlayer];

    if (mode === 'bot' || botCount > 0) {
      const colors: ('blue' | 'green' | 'yellow')[] = ['blue', 'green', 'yellow'];
      for (let i = 0; i < botCount; i++) {
        const num = (i + 2) as 2 | 3 | 4;
        players.push(createBotPlayer(num, colors[i] || 'yellow', botDifficulty));
      }
    }

    const localRoom: GameRoom = {
      id: roomId,
      roomCode: code,
      hostGuestId,
      mode,
      status: mode === 'bot' && players.length >= 2 ? 'playing' : 'waiting',
      maxPlayers,
      currentTurnGuestId: hostGuestId,
      players,
      rules,
      turnNumber: 1,
      consecutiveSixes: 0,
      createdAt: Date.now(),
      startedAt: mode === 'bot' ? Date.now() : undefined,
      events: [
        {
          id: `evt_${Date.now()}`,
          timestamp: Date.now(),
          type: 'join',
          message: `${nickname} created room ${code}`,
          guestId: hostGuestId,
          playerColor: 'red',
        },
      ],
      chat: [
        {
          id: `chat_${Date.now()}`,
          guestId: 'system',
          nickname: 'System',
          message: `Welcome to room ${code}! Roll dice and race to 100!`,
          createdAt: Date.now(),
          isSystem: true,
        },
      ],
    };

    this.saveStoredRoom(localRoom);
    this.connectWebSocket(code, hostGuestId, nickname);
    return localRoom;
  }

  /**
   * Retrieves an existing game room (from Cloudflare Worker, Storage, or auto-initialized).
   */
  public static async getRoom(roomCode: string): Promise<GameRoom | null> {
    const cleanCode = roomCode.trim().toUpperCase();

    // 1. Try Cloudflare Worker
    try {
      const response = await fetch(`/api/rooms/${cleanCode}`);
      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        if (data.room) {
          this.saveStoredRoom(data.room);
          return data.room;
        }
      }
    } catch {}

    // 2. Try persistent LocalStorage
    const stored = this.loadStoredRoom(cleanCode);
    if (stored) return stored;

    // 3. If direct link entered, auto-create room so user is never blocked
    const session = getOrCreateGuestSession();
    const autoRoom: GameRoom = {
      id: `room_${Date.now()}_${cleanCode}`,
      roomCode: cleanCode,
      hostGuestId: session.guestId,
      mode: 'private',
      status: 'waiting',
      maxPlayers: 4,
      currentTurnGuestId: session.guestId,
      players: [
        {
          id: session.guestId,
          nickname: session.nickname || 'Player 1',
          playerNumber: 1,
          color: 'red',
          position: 0,
          isConnected: true,
          isBot: false,
          isReady: true,
          joinedAt: Date.now(),
          lastSeenAt: Date.now(),
        },
      ],
      rules: { ...DEFAULT_GAME_RULES },
      turnNumber: 1,
      consecutiveSixes: 0,
      createdAt: Date.now(),
      events: [
        {
          id: `evt_${Date.now()}`,
          timestamp: Date.now(),
          type: 'join',
          message: `Joined room ${cleanCode}`,
          guestId: session.guestId,
          playerColor: 'red',
        },
      ],
      chat: [
        {
          id: `chat_${Date.now()}`,
          guestId: 'system',
          nickname: 'System',
          message: `Welcome to room ${cleanCode}!`,
          createdAt: Date.now(),
          isSystem: true,
        },
      ],
    };

    this.saveStoredRoom(autoRoom);
    return autoRoom;
  }

  /**
   * Joins an existing game room.
   */
  public static async joinRoom(
    roomCode: string,
    guestId: string,
    nickname: string
  ): Promise<GameRoom> {
    const cleanCode = roomCode.trim().toUpperCase();
    let room = await this.getRoom(cleanCode);

    if (!room) {
      room = await this.createRoom(guestId, nickname, 'private', 4);
    }

    let player = room.players.find((p: Player) => p.id === guestId);

    if (!player) {
      if (room.players.length < room.maxPlayers) {
        const colors: ('red' | 'blue' | 'green' | 'yellow')[] = ['red', 'blue', 'green', 'yellow'];
        const num = (room.players.length + 1) as 1 | 2 | 3 | 4;
        player = {
          id: guestId,
          nickname: nickname || `Player ${num}`,
          playerNumber: num,
          color: colors[num - 1] || 'blue',
          position: 0,
          isConnected: true,
          isBot: false,
          isReady: true,
          joinedAt: Date.now(),
          lastSeenAt: Date.now(),
        };
        room.players.push(player);
        room.events.unshift({
          id: `evt_${Date.now()}`,
          timestamp: Date.now(),
          type: 'join',
          message: `${player.nickname} joined the game`,
          guestId,
          playerColor: player.color,
        });
      }
    } else {
      player.nickname = nickname || player.nickname;
      player.isConnected = true;
    }

    this.saveStoredRoom(room);
    this.connectWebSocket(cleanCode, guestId, nickname);
    return room;
  }

  /**
   * Connects to WebSocket / BroadcastChannel for real-time multiplayer.
   */
  public static connectWebSocket(roomCode: string, guestId: string, nickname: string): void {
    const cleanCode = roomCode.trim().toUpperCase();
    if (this.activeRoomCode === cleanCode && (this.activeSocket || this.activeBroadcastChannel)) {
      return;
    }

    this.disconnectWebSocket();
    this.activeRoomCode = cleanCode;

    // 1. Setup Cross-Tab BroadcastChannel for instant local syncing
    try {
      const channel = new BroadcastChannel(`snake_channel_${cleanCode}`);
      this.activeBroadcastChannel = channel;

      channel.onmessage = (event) => {
        if (event.data) {
          const msg = event.data as ServerMessage;
          this.handleServerMessage(msg);
        }
      };
    } catch {}

    // 2. Setup WebSocket for Cloudflare Durable Objects in production
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/ws/${cleanCode}?guestId=${encodeURIComponent(
      guestId
    )}&nickname=${encodeURIComponent(nickname)}`;

    try {
      const ws = new WebSocket(wsUrl);
      this.activeSocket = ws;

      ws.onopen = () => {
        this.sendClientMessage({
          type: 'JOIN_ROOM',
          roomCode: cleanCode,
          nickname,
          guestId,
        });

        if (this.pingInterval) clearInterval(this.pingInterval);
        this.pingInterval = setInterval(() => {
          if (this.activeSocket?.readyState === WebSocket.OPEN) {
            this.sendClientMessage({ type: 'PING', guestId });
          }
        }, 20000);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as ServerMessage;
          this.handleServerMessage(msg);
        } catch {}
      };

      ws.onclose = () => {
        if (this.pingInterval) clearInterval(this.pingInterval);
      };
    } catch {}
  }

  public static disconnectWebSocket(): void {
    if (this.activeSocket) {
      try {
        this.activeSocket.close();
      } catch {}
      this.activeSocket = null;
    }
    if (this.activeBroadcastChannel) {
      try {
        this.activeBroadcastChannel.close();
      } catch {}
      this.activeBroadcastChannel = null;
    }
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    this.activeRoomCode = null;
  }

  private static handleServerMessage(msg: ServerMessage): void {
    switch (msg.type) {
      case 'ROOM_STATE':
      case 'PLAYER_JOINED':
      case 'PLAYER_LEFT':
      case 'GAME_STARTED':
      case 'REMATCH_ACCEPTED':
        this.saveStoredRoom(msg.room);
        this.roomListeners.forEach((l) => l(msg.room));
        break;

      case 'DICE_ROLLED':
        this.saveStoredRoom(msg.room);
        this.roomListeners.forEach((l) => l(msg.room));
        this.diceListeners.forEach((l) => l(msg));
        break;

      case 'GAME_FINISHED':
        this.saveStoredRoom(msg.room);
        this.roomListeners.forEach((l) => l(msg.room));
        this.finishListeners.forEach((l) => l(msg));
        break;
    }
  }

  public static sendClientMessage(msg: ClientMessage): void {
    if (this.activeSocket && this.activeSocket.readyState === WebSocket.OPEN) {
      this.activeSocket.send(JSON.stringify(msg));
    }
  }

  /**
   * Starts Game
   */
  public static async startGame(roomId: string, hostGuestId: string): Promise<GameRoom> {
    if (this.activeSocket && this.activeSocket.readyState === WebSocket.OPEN) {
      this.sendClientMessage({ type: 'START_GAME', guestId: hostGuestId });
    }

    const code = roomId.split('_').pop() || '';
    const room = this.loadStoredRoom(code);
    if (room) {
      room.status = 'playing';
      room.startedAt = Date.now();
      room.currentTurnGuestId = room.players[0].id;
      this.saveStoredRoom(room);
      return { ...room };
    }
    throw new Error('Room not found');
  }

  /**
   * Authoritative Dice Roll Request
   */
  public static async rollDice(
    roomId: string,
    guestId: string
  ): Promise<{ room: GameRoom; moveResult: MoveResult }> {
    if (this.activeSocket && this.activeSocket.readyState === WebSocket.OPEN) {
      this.sendClientMessage({
        type: 'ROLL_DICE',
        guestId,
        actionId: `act_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      });
    }

    const code = roomId.split('_').pop() || '';
    const room = this.loadStoredRoom(code);
    if (room) {
      const dice = Math.floor(Math.random() * 6) + 1;
      const player = room.players.find((p: Player) => p.id === guestId);
      if (!player) throw new Error('Player not in room');

      const oldPos = player.position;
      let newPos = oldPos + dice;
      if (newPos > 100) newPos = oldPos;

      const ladders: Record<number, number> = {
        2: 38,
        7: 14,
        8: 31,
        15: 26,
        21: 42,
        28: 84,
        36: 44,
        51: 67,
        71: 91,
        78: 98,
      };
      const snakes: Record<number, number> = {
        16: 6,
        46: 25,
        49: 11,
        62: 19,
        64: 60,
        74: 53,
        89: 68,
        92: 88,
        95: 75,
        99: 80,
      };

      let specialMove: any = undefined;
      const steps: number[] = [];
      for (let s = oldPos + 1; s <= newPos; s++) steps.push(s);

      let finalPos = newPos;
      if (ladders[newPos]) {
        finalPos = ladders[newPos];
        specialMove = { type: 'ladder', from: newPos, to: finalPos };
        steps.push(finalPos);
      } else if (snakes[newPos]) {
        finalPos = snakes[newPos];
        specialMove = { type: 'snake', from: newPos, to: finalPos };
        steps.push(finalPos);
      }

      player.position = finalPos;
      room.lastDiceResult = dice;

      const isWinner = finalPos === 100;
      if (isWinner) {
        room.status = 'finished';
        room.winnerGuestId = player.id;
      } else if (dice !== 6) {
        const curIdx = room.players.findIndex((p: Player) => p.id === guestId);
        const nextIdx = (curIdx + 1) % room.players.length;
        room.currentTurnGuestId = room.players[nextIdx].id;
        room.turnNumber++;
      }

      const moveResult: MoveResult = {
        guestId,
        diceValue: dice,
        oldPosition: oldPos,
        intermediatePosition: newPos,
        finalPosition: finalPos,
        specialMove,
        isExtraTurn: dice === 6 && !isWinner,
        isWinner,
        steps,
      };

      this.saveStoredRoom(room);
      return { room: { ...room }, moveResult };
    }

    throw new Error('Cannot roll dice');
  }

  /**
   * Sends a Room Chat Message
   */
  public static async sendChatMessage(
    roomId: string,
    guestId: string,
    nickname: string,
    message: string
  ): Promise<ChatMessage> {
    const chatMsg: ChatMessage = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      guestId,
      nickname,
      message: message.slice(0, 200),
      createdAt: Date.now(),
      isSystem: false,
    };

    if (this.activeSocket && this.activeSocket.readyState === WebSocket.OPEN) {
      this.sendClientMessage({
        type: 'CHAT_MESSAGE',
        guestId,
        message,
      });
    }

    const code = roomId.split('_').pop() || '';
    const room = this.loadStoredRoom(code);
    if (room) {
      room.chat.push(chatMsg);
      this.saveStoredRoom(room);
    }

    return chatMsg;
  }

  /**
   * Rematch
   */
  public static async rematch(roomId: string): Promise<GameRoom> {
    const code = roomId.split('_').pop() || '';
    const room = this.loadStoredRoom(code);
    if (room) {
      room.status = 'playing';
      room.winnerGuestId = undefined;
      room.turnNumber = 1;
      room.consecutiveSixes = 0;
      room.players.forEach((p: Player) => (p.position = 0));
      room.currentTurnGuestId = room.players[0].id;
      this.saveStoredRoom(room);
      return { ...room };
    }
    throw new Error('Room not found');
  }

  public static onRoomUpdate(listener: RoomListener): () => void {
    this.roomListeners.add(listener);
    return () => this.roomListeners.delete(listener);
  }
}
