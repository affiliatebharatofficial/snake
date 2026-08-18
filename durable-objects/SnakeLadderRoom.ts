/**
 * Cloudflare Durable Object: SnakeLadderRoom
 * Authoritative real-time state machine for an isolated Snake & Ladder game room.
 */

import {
  GameRoom,
  Player,
  MoveResult,
  GameRules,
  ChatMessage,
  GameEvent,
  BotDifficulty,
  SpecialMove,
} from '../shared/types';
import {
  ClientMessage,
  ServerMessage,
  DiceRolledServerMessage,
  GameFinishedServerMessage,
  RoomStateServerMessage,
} from '../shared/protocol';

interface SessionData {
  guestId: string;
  nickname: string;
  lastPing: number;
}

export class SnakeLadderRoom implements DurableObject {
  private state: DurableObjectState;
  private env: any;
  private room: GameRoom | null = null;
  private sessions: Map<WebSocket, SessionData> = new Map();
  private turnLocked: boolean = false;
  private processedActions: Set<string> = new Set();
  private chatRateLimit: Map<string, { count: number; resetAt: number }> = new Map();

  constructor(state: DurableObjectState, env: any) {
    this.state = state;
    this.env = env;

    // Load persisted state if resuming after hibernate / restart
    this.state.blockConcurrencyWhile(async () => {
      const storedRoom = await this.state.storage.get<GameRoom>('roomState');
      if (storedRoom) {
        this.room = storedRoom;
      }
    });
  }

  // Handle HTTP & WebSocket upgrade requests from Worker
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // 1. WebSocket Upgrade Endpoint: /ws
    if (request.headers.get('Upgrade') === 'websocket') {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);

      await this.handleWebSocketSession(server, url);

      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    // 2. REST API initialization endpoint: POST /init
    if (url.pathname === '/init' && request.method === 'POST') {
      const initData = (await request.json()) as {
        room: GameRoom;
      };
      this.room = initData.room;
      await this.saveRoomState();
      return new Response(JSON.stringify({ success: true, room: this.room }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. REST API state inspection: GET /state
    if (url.pathname === '/state' && request.method === 'GET') {
      return new Response(JSON.stringify({ room: this.room }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404 });
  }

  /**
   * Handle incoming WebSocket connections
   */
  private async handleWebSocketSession(ws: WebSocket, url: URL): Promise<void> {
    ws.accept();

    const guestId = url.searchParams.get('guestId') || '';
    const nickname = url.searchParams.get('nickname') || 'Guest';

    const session: SessionData = {
      guestId,
      nickname,
      lastPing: Date.now(),
    };
    this.sessions.set(ws, session);

    // If player is already in room, mark as connected
    if (this.room && guestId) {
      const existingPlayer = this.room.players.find(p => p.id === guestId);
      if (existingPlayer) {
        existingPlayer.isConnected = true;
        existingPlayer.lastSeenAt = Date.now();
        await this.saveRoomState();
      }
      this.sendTo(ws, {
        type: 'ROOM_STATE',
        room: this.room,
        timestamp: Date.now(),
      });
    }

    ws.addEventListener('message', async event => {
      try {
        const raw = typeof event.data === 'string' ? event.data : new TextDecoder().decode(event.data);
        const message = JSON.parse(raw) as ClientMessage;
        await this.handleClientMessage(ws, session, message);
      } catch (err: any) {
        this.sendError(ws, 'INTERNAL_ERROR', err.message || 'Invalid message payload');
      }
    });

    ws.addEventListener('close', () => {
      this.handleDisconnect(ws, session);
    });

    ws.addEventListener('error', () => {
      this.handleDisconnect(ws, session);
    });
  }

  /**
   * Handle client WebSocket action messages
   */
  private async handleClientMessage(
    ws: WebSocket,
    session: SessionData,
    msg: ClientMessage
  ): Promise<void> {
    if (!this.room) {
      this.sendError(ws, 'ROOM_NOT_FOUND', 'Game room is not initialized');
      return;
    }

    // Action Idempotency
    if (msg.actionId) {
      if (this.processedActions.has(msg.actionId)) {
        if (this.room) {
          this.sendTo(ws, { type: 'ROOM_STATE', room: this.room, timestamp: Date.now() });
        }
        return;
      }
      this.processedActions.add(msg.actionId);
    }

    switch (msg.type) {
      case 'PING': {
        session.lastPing = Date.now();
        this.sendTo(ws, { type: 'PONG', timestamp: Date.now() });
        break;
      }

      case 'JOIN_ROOM': {
        await this.processJoinRoom(ws, session, msg.nickname);
        break;
      }

      case 'READY': {
        const player = this.room.players.find(p => p.id === session.guestId);
        if (player) {
          player.isReady = msg.isReady;
          await this.saveRoomState();
          this.broadcast({
            type: 'PLAYER_READY',
            guestId: player.id,
            isReady: player.isReady,
            timestamp: Date.now(),
          });
        }
        break;
      }

      case 'START_GAME': {
        if (this.room.hostGuestId !== session.guestId) {
          this.sendError(ws, 'INVALID_ACTION', 'Only the room host can start the game');
          return;
        }
        if (this.room.players.length < 2) {
          this.sendError(ws, 'INVALID_ACTION', 'At least 2 players are required to start');
          return;
        }
        this.room.status = 'playing';
        this.room.startedAt = Date.now();
        this.room.currentTurnGuestId = this.room.players[0].id;
        this.room.turnNumber = 1;
        await this.saveRoomState();
        await this.persistGameStarted();

        this.broadcast({
          type: 'GAME_STARTED',
          room: this.room,
          timestamp: Date.now(),
        });
        break;
      }

      case 'ADD_BOT': {
        if (this.room.hostGuestId !== session.guestId) {
          this.sendError(ws, 'INVALID_ACTION', 'Only the host can add bots');
          return;
        }
        if (this.room.players.length >= this.room.maxPlayers) {
          this.sendError(ws, 'ROOM_FULL', 'Room has reached maximum capacity');
          return;
        }

        const colors: ('blue' | 'green' | 'yellow')[] = ['blue', 'green', 'yellow'];
        const botIdx = this.room.players.length;
        const botPlayer: Player = {
          id: `bot_${Date.now()}_${botIdx}`,
          nickname: `Bot ${botIdx} [AI]`,
          playerNumber: (botIdx + 1) as 2 | 3 | 4,
          color: colors[botIdx - 1] || 'yellow',
          position: 0,
          isConnected: true,
          isBot: true,
          botDifficulty: msg.difficulty || 'medium',
          isReady: true,
          joinedAt: Date.now(),
          lastSeenAt: Date.now(),
        };

        this.room.players.push(botPlayer);
        await this.saveRoomState();

        this.broadcast({
          type: 'PLAYER_JOINED',
          player: botPlayer,
          room: this.room,
          timestamp: Date.now(),
        });
        break;
      }

      case 'ROLL_DICE': {
        await this.processRollDice(ws, session.guestId);
        break;
      }

      case 'CHAT_MESSAGE': {
        await this.processChatMessage(ws, session, msg.message);
        break;
      }

      case 'REMATCH': {
        if (this.room.status !== 'finished') return;
        this.room.status = 'playing';
        this.room.winnerGuestId = undefined;
        this.room.turnNumber = 1;
        this.room.consecutiveSixes = 0;
        this.room.players.forEach(p => (p.position = 0));
        this.room.currentTurnGuestId = this.room.players[0].id;
        await this.saveRoomState();

        this.broadcast({
          type: 'REMATCH_ACCEPTED',
          room: this.room,
          timestamp: Date.now(),
        });
        break;
      }

      case 'LEAVE_ROOM': {
        this.handleDisconnect(ws, session);
        break;
      }
    }
  }

  /**
   * Process Player Joining Room
   */
  private async processJoinRoom(
    ws: WebSocket,
    session: SessionData,
    nickname: string
  ): Promise<void> {
    if (!this.room) return;

    if (this.room.status !== 'waiting') {
      const isExisting = this.room.players.some(p => p.id === session.guestId);
      if (!isExisting) {
        this.sendError(ws, 'GAME_ALREADY_STARTED', 'Game is already in progress');
        return;
      }
    }

    let player = this.room.players.find(p => p.id === session.guestId);

    if (player) {
      player.nickname = nickname || player.nickname;
      player.isConnected = true;
      player.lastSeenAt = Date.now();
    } else {
      if (this.room.players.length >= this.room.maxPlayers) {
        this.sendError(ws, 'ROOM_FULL', 'This room is already full');
        return;
      }

      const colors: ('red' | 'blue' | 'green' | 'yellow')[] = ['red', 'blue', 'green', 'yellow'];
      const playerNum = (this.room.players.length + 1) as 1 | 2 | 3 | 4;

      player = {
        id: session.guestId,
        nickname: nickname || `Player ${playerNum}`,
        playerNumber: playerNum,
        color: colors[playerNum - 1],
        position: 0,
        isConnected: true,
        isBot: false,
        isReady: true,
        joinedAt: Date.now(),
        lastSeenAt: Date.now(),
      };
      this.room.players.push(player);
    }

    await this.saveRoomState();
    await this.persistPlayerJoined(player);

    this.broadcast({
      type: 'PLAYER_JOINED',
      player,
      room: this.room,
      timestamp: Date.now(),
    });
  }

  /**
   * Server-Authoritative Dice Roll Execution with Anti-Cheat
   */
  private async processRollDice(ws?: WebSocket, targetGuestId?: string): Promise<void> {
    if (!this.room || this.room.status !== 'playing' || this.turnLocked) {
      if (ws) this.sendError(ws, 'INVALID_ACTION', 'Cannot roll dice right now');
      return;
    }

    const currentTurnId = targetGuestId || this.room.currentTurnGuestId;
    if (currentTurnId !== this.room.currentTurnGuestId) {
      if (ws) this.sendError(ws, 'NOT_YOUR_TURN', 'It is not your turn to roll');
      return;
    }

    const player = this.room.players.find(p => p.id === currentTurnId);
    if (!player) return;

    // Lock Turn during calculation and broadcast
    this.turnLocked = true;

    // 1. Secure Server-Side Random Dice Generation (1 - 6)
    const randomArray = new Uint8Array(1);
    crypto.getRandomValues(randomArray);
    const diceValue = (randomArray[0] % 6) + 1;

    // 2. Movement & Collision Engine Calculation
    const moveResult = this.calculateAuthoritativeMove(player, diceValue);

    // 3. Update Authoritative Room State
    player.position = moveResult.finalPosition;
    this.room.lastDiceResult = diceValue;

    if (diceValue === 6) {
      this.room.consecutiveSixes = (this.room.consecutiveSixes || 0) + 1;
    } else {
      this.room.consecutiveSixes = 0;
    }

    // Determine extra turn or pass turn
    let nextPlayerId = currentTurnId;
    let isExtraTurn = false;

    if (moveResult.isWinner) {
      this.room.status = 'finished';
      this.room.winnerGuestId = player.id;
      this.room.finishedAt = Date.now();
    } else if (diceValue === 6 && this.room.rules.sixGivesExtraTurn && this.room.consecutiveSixes < 3) {
      isExtraTurn = true;
      nextPlayerId = currentTurnId;
    } else {
      const curIdx = this.room.players.findIndex(p => p.id === currentTurnId);
      const nextIdx = (curIdx + 1) % this.room.players.length;
      nextPlayerId = this.room.players[nextIdx].id;
      this.room.turnNumber = (this.room.turnNumber || 1) + 1;
    }

    this.room.currentTurnGuestId = nextPlayerId;

    // Add Event Logs
    this.room.events.unshift({
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      type: moveResult.isWinner ? 'win' : moveResult.specialMove ? (moveResult.specialMove.type as any) : 'roll',
      message: moveResult.isWinner
        ? `🏆 ${player.nickname} reached Square 100 and won the game!`
        : moveResult.specialMove
        ? `${player.nickname} rolled ${diceValue} and took a ${moveResult.specialMove.type} to ${moveResult.finalPosition}`
        : `${player.nickname} rolled ${diceValue} and moved to ${moveResult.finalPosition}`,
      guestId: player.id,
      playerColor: player.color,
    });

    if (this.room.events.length > 25) {
      this.room.events.pop();
    }

    await this.saveRoomState();

    // 4. Asynchronously Persist Move to D1
    this.persistGameMove(player.id, diceValue, moveResult);

    // 5. Broadcast to all players
    const diceMessage: DiceRolledServerMessage = {
      type: 'DICE_ROLLED',
      guestId: player.id,
      diceValue,
      moveResult,
      room: this.room,
      timestamp: Date.now(),
    };
    this.broadcast(diceMessage);

    // 6. Handle Game Completion
    if (moveResult.isWinner) {
      await this.persistGameCompleted(player);
      const winMessage: GameFinishedServerMessage = {
        type: 'GAME_FINISHED',
        winner: player,
        room: this.room,
        timestamp: Date.now(),
      };
      this.broadcast(winMessage);
    } else {
      // 7. Bot AI Turn Automation
      const nextPlayer = this.room.players.find(p => p.id === nextPlayerId);
      if (nextPlayer && nextPlayer.isBot) {
        // Schedule next bot turn in Durable Object
        setTimeout(() => {
          this.processRollDice(undefined, nextPlayer.id);
        }, 1200);
      }
    }

    // Release Turn Lock
    this.turnLocked = false;
  }

  /**
   * Authoritative Move Calculation
   */
  private calculateAuthoritativeMove(player: Player, diceValue: number): MoveResult {
    const oldPosition = player.position;
    const rules = this.room?.rules || {
      sixGivesExtraTurn: true,
      exact100ToWin: true,
      enterOnSix: false,
      maxConsecutiveSixes: 3,
    };

    // Standard Snakes and Ladders Board Map
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

    let intermediate = oldPosition + diceValue;
    const steps: number[] = [];

    // Exact 100 rule check
    if (rules.exact100ToWin && intermediate > 100) {
      intermediate = oldPosition;
      return {
        guestId: player.id,
        diceValue,
        oldPosition,
        intermediatePosition: oldPosition,
        finalPosition: oldPosition,
        isExtraTurn: diceValue === 6 && rules.sixGivesExtraTurn,
        isWinner: false,
        steps: [oldPosition],
      };
    }

    // Populate animated step coordinates
    for (let step = oldPosition + 1; step <= intermediate; step++) {
      steps.push(step);
    }

    let finalPos = intermediate;
    let specialMove: SpecialMove | undefined = undefined;

    if (ladders[intermediate]) {
      finalPos = ladders[intermediate];
      specialMove = { type: 'ladder', from: intermediate, to: finalPos };
      steps.push(finalPos);
    } else if (snakes[intermediate]) {
      finalPos = snakes[intermediate];
      specialMove = { type: 'snake', from: intermediate, to: finalPos };
      steps.push(finalPos);
    }

    const isWinner = finalPos === 100;

    return {
      guestId: player.id,
      diceValue,
      oldPosition,
      intermediatePosition: intermediate,
      finalPosition: finalPos,
      specialMove,
      isExtraTurn: diceValue === 6 && rules.sixGivesExtraTurn && !isWinner,
      isWinner,
      steps,
    };
  }

  /**
   * Process Chat Message with Rate Limiting & Sanitation
   */
  private async processChatMessage(
    ws: WebSocket,
    session: SessionData,
    text: string
  ): Promise<void> {
    if (!this.room || !text.trim()) return;

    // Rate Limiting: Max 20 messages per minute per guest
    const now = Date.now();
    let limiter = this.chatRateLimit.get(session.guestId);
    if (!limiter || now > limiter.resetAt) {
      limiter = { count: 0, resetAt: now + 60 * 1000 };
      this.chatRateLimit.set(session.guestId, limiter);
    }

    limiter.count++;
    if (limiter.count > 20) {
      this.sendError(ws, 'RATE_LIMITED', 'You are sending messages too quickly.');
      return;
    }

    // Sanitize string (max 200 chars, strip dangerous HTML tags)
    const sanitized = text
      .slice(0, 200)
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .trim();

    const chatMsg: ChatMessage = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      guestId: session.guestId,
      nickname: session.nickname,
      message: sanitized,
      createdAt: Date.now(),
      isSystem: false,
    };

    this.room.chat.push(chatMsg);
    if (this.room.chat.length > 50) {
      this.room.chat.shift();
    }

    await this.saveRoomState();
    this.persistChatMessage(chatMsg);

    this.broadcast({
      type: 'CHAT_MESSAGE',
      message: chatMsg,
      timestamp: Date.now(),
    });
  }

  /**
   * Handle Client Disconnect
   */
  private async handleDisconnect(ws: WebSocket, session: SessionData): Promise<void> {
    this.sessions.delete(ws);

    if (!this.room) return;

    const player = this.room.players.find(p => p.id === session.guestId);
    if (player) {
      player.isConnected = false;
      player.lastSeenAt = Date.now();
      await this.saveRoomState();

      this.broadcast({
        type: 'PLAYER_LEFT',
        guestId: session.guestId,
        room: this.room,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * State Storage Helpers
   */
  private async saveRoomState(): Promise<void> {
    if (this.room) {
      await this.state.storage.put('roomState', this.room);
    }
  }

  /**
   * WebSocket Broadcast Utility
   */
  private broadcast(message: ServerMessage): void {
    const payload = JSON.stringify(message);
    for (const [ws] of this.sessions) {
      try {
        ws.send(payload);
      } catch {}
    }
  }

  private sendTo(ws: WebSocket, message: ServerMessage): void {
    try {
      ws.send(JSON.stringify(message));
    } catch {}
  }

  private sendError(ws: WebSocket, code: any, message: string): void {
    this.sendTo(ws, {
      type: 'ERROR',
      code,
      message,
      timestamp: Date.now(),
    });
  }

  /**
   * Asynchronous D1 Persistence Checkpoints
   */
  private async persistPlayerJoined(player: Player): Promise<void> {
    if (!this.env.DB || !this.room) return;
    try {
      await this.env.DB.prepare(
        `INSERT INTO game_players (room_id, guest_id, nickname, player_number, color, joined_at)
         VALUES (?1, ?2, ?3, ?4, ?5, datetime('now'))
         ON CONFLICT(room_id, guest_id) DO UPDATE SET
           nickname = ?3,
           left_at = NULL`
      )
        .bind(this.room.id, player.id, player.nickname, player.playerNumber, player.color)
        .run();
    } catch (e) {
      console.error('D1 persistPlayerJoined error:', e);
    }
  }

  private async persistGameStarted(): Promise<void> {
    if (!this.env.DB || !this.room) return;
    try {
      await this.env.DB.prepare(
        `UPDATE game_rooms SET status = 'playing', started_at = datetime('now') WHERE room_id = ?`
      )
        .bind(this.room.id)
        .run();
    } catch (e) {
      console.error('D1 persistGameStarted error:', e);
    }
  }

  private async persistGameMove(
    guestId: string,
    diceValue: number,
    moveResult: MoveResult
  ): Promise<void> {
    if (!this.env.DB || !this.room) return;
    try {
      await this.env.DB.prepare(
        `INSERT INTO game_moves (room_id, guest_id, turn_id, turn_number, dice_value, old_position, dice_destination, special_move_type, special_move_from, special_move_to, final_position)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)`
      )
        .bind(
          this.room.id,
          guestId,
          `turn_${this.room.turnNumber}`,
          this.room.turnNumber,
          diceValue,
          moveResult.oldPosition,
          moveResult.intermediatePosition,
          moveResult.specialMove ? moveResult.specialMove.type : 'none',
          moveResult.specialMove ? moveResult.specialMove.from : null,
          moveResult.specialMove ? moveResult.specialMove.to : null,
          moveResult.finalPosition
        )
        .run();
    } catch (e) {
      console.error('D1 persistGameMove error:', e);
    }
  }

  private async persistChatMessage(msg: ChatMessage): Promise<void> {
    if (!this.env.DB || !this.room || msg.isSystem) return;
    try {
      await this.env.DB.prepare(
        `INSERT INTO chat_messages (room_id, guest_id, nickname, message) VALUES (?1, ?2, ?3, ?4)`
      )
        .bind(this.room.id, msg.guestId, msg.nickname, msg.message)
        .run();
    } catch (e) {
      console.error('D1 persistChatMessage error:', e);
    }
  }

  private async persistGameCompleted(winner: Player): Promise<void> {
    if (!this.env.DB || !this.room) return;
    try {
      const durationSeconds = this.room.startedAt
        ? Math.floor((Date.now() - this.room.startedAt) / 1000)
        : 0;

      // Update room record
      await this.env.DB.prepare(
        `UPDATE game_rooms SET status = 'finished', finished_at = datetime('now'), winner_guest_id = ?1, total_turns = ?2, duration_seconds = ?3 WHERE room_id = ?4`
      )
        .bind(winner.id, this.room.turnNumber, durationSeconds, this.room.id)
        .run();

      // Insert summary into game_results
      const result = await this.env.DB.prepare(
        `INSERT INTO game_results (room_id, winner_guest_id, winner_nickname, total_players, total_turns, duration_seconds, game_mode, started_at, completed_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, datetime(?8, 'unixepoch'), datetime('now'))`
      )
        .bind(
          this.room.id,
          winner.id,
          winner.nickname,
          this.room.players.length,
          this.room.turnNumber,
          durationSeconds,
          this.room.mode,
          this.room.startedAt ? Math.floor(this.room.startedAt / 1000) : Math.floor(Date.now() / 1000)
        )
        .run();

      // Insert player final standings
      const sorted = [...this.room.players].sort((a, b) => b.position - a.position);
      for (let i = 0; i < sorted.length; i++) {
        const p = sorted[i];
        await this.env.DB.prepare(
          `INSERT INTO game_result_players (game_result_id, guest_id, nickname, player_number, final_position, placement)
           VALUES (?1, ?2, ?3, ?4, ?5, ?6)`
        )
          .bind(result.meta.last_row_id || 1, p.id, p.nickname, p.playerNumber, p.position, i + 1)
          .run();
      }
    } catch (e) {
      console.error('D1 persistGameCompleted error:', e);
    }
  }
}
