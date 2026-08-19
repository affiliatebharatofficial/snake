import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameRoom, Player, BotDifficulty } from '../game/types';
import {
  getOrCreateGuestSession,
  updateGuestNickname,
  saveRecentGame,
} from '../services/guestService';
import { MultiplayerService } from '../services/multiplayerService';
import { sound } from '../game/soundEngine';
import { getBotTurnDelay } from '../game/botEngine';

import { GameBoard } from '../components/board/GameBoard';
import { Dice3D } from '../components/game/Dice3D';
import { PlayerList } from '../components/game/PlayerList';
import { TurnIndicator } from '../components/game/TurnIndicator';
import { GameEventLog } from '../components/game/GameEventLog';
import { GameChat } from '../components/game/GameChat';
import { VictoryModal } from '../components/game/VictoryModal';
import { WaitingRoom } from '../components/game/WaitingRoom';
import { NicknameModal } from '../components/modals/NicknameModal';
import { SEOHead } from '../components/common/SEOHead';

export const GamePage: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState(getOrCreateGuestSession());
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [isRolling, setIsRolling] = useState(false);
  const [movingPlayerId, setMovingPlayerId] = useState<string | undefined>(undefined);
  const [isSpecialMoving, setIsSpecialMoving] = useState(false);
  const [moveBanner, setMoveBanner] = useState<{ text: string; type: 'normal' | 'ladder' | 'snake' } | null>(null);
  const [isNickModalOpen, setIsNickModalOpen] = useState(false);

  const isTurnProcessingRef = useRef(false);
  const [isTurnProcessing, setIsTurnProcessing] = useState(false);
  const botTimeoutRef = useRef<any>(null);

  // Subscribe to real-time room state updates
  useEffect(() => {
    const unsub = MultiplayerService.onRoomUpdate(updatedRoom => {
      if (!isTurnProcessingRef.current) {
        setRoom({ ...updatedRoom });
      }
    });
    return () => unsub();
  }, []);

  // Load or join room
  const loadRoom = useCallback(async () => {
    if (!roomCode) return;
    try {
      setIsLoading(true);
      let r = await MultiplayerService.getRoom(roomCode);
      if (!r) {
        if (!session.nickname) {
          setIsNickModalOpen(true);
          setIsLoading(false);
          return;
        }
        r = await MultiplayerService.joinRoom(
          roomCode,
          session.guestId,
          session.nickname
        );
      } else {
        const isInRoom = r.players.some((p: Player) => p.id === session.guestId);
        if (!isInRoom && r.status === 'waiting') {
          if (!session.nickname) {
            setIsNickModalOpen(true);
            setIsLoading(false);
            return;
          }
          r = await MultiplayerService.joinRoom(
            roomCode,
            session.guestId,
            session.nickname
          );
        }
      }
      setRoom({ ...r });
      setIsLoading(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to join this game room.');
      setIsLoading(false);
    }
  }, [roomCode, session.guestId, session.nickname]);

  useEffect(() => {
    loadRoom();
    return () => {
      if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
    };
  }, [loadRoom]);

  // Synchronized slow, smooth step-by-step movement animation
  const animateMoveSteps = useCallback(
    async (
      playerId: string,
      playerNickname: string,
      diceValue: number,
      steps: number[],
      specialMove?: { type: string; from: number; to: number }
    ) => {
      setMovingPlayerId(playerId);

      // 1. Regular square-by-square slow hops
      for (let i = 0; i < steps.length; i++) {
        const stepPos = steps[i];

        sound.playStep(i);
        setMoveBanner({
          text: `🎲 ${playerNickname} rolled ${diceValue} (Square ${stepPos})`,
          type: 'normal',
        });

        setRoom(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            players: prev.players.map(pl =>
              pl.id === playerId ? { ...pl, position: stepPos } : pl
            ),
          };
        });

        // Slow, clear hop speed (420ms per cell)
        await new Promise(r => setTimeout(r, 420));
      }

      // 2. Special Action (Ladder Climb or Snake Slide)
      if (specialMove) {
        // Pause on the trigger square so player clearly sees what they landed on
        await new Promise(r => setTimeout(r, 600));

        if (specialMove.type === 'ladder') {
          setMoveBanner({
            text: `🪜 LADDER! Climbing from Square ${specialMove.from} to ${specialMove.to}!`,
            type: 'ladder',
          });
          sound.playLadder();
          setIsSpecialMoving(true);

          setRoom(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              players: prev.players.map(pl =>
                pl.id === playerId ? { ...pl, position: specialMove.to } : pl
              ),
            };
          });

          // Smooth 950ms ladder climb
          await new Promise(r => setTimeout(r, 950));
          setIsSpecialMoving(false);
          await new Promise(r => setTimeout(r, 400));
        } else if (specialMove.type === 'snake') {
          setMoveBanner({
            text: `🐍 SNAKE BITE! Sliding from Square ${specialMove.from} down to ${specialMove.to}!`,
            type: 'snake',
          });
          sound.playSnake();
          setIsSpecialMoving(true);

          setRoom(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              players: prev.players.map(pl =>
                pl.id === playerId ? { ...pl, position: specialMove.to } : pl
              ),
            };
          });

          // Smooth 950ms snake descent
          await new Promise(r => setTimeout(r, 950));
          setIsSpecialMoving(false);
          await new Promise(r => setTimeout(r, 400));
        }
      }

      setMovingPlayerId(undefined);

      // Keep banner visible briefly so players understand the outcome
      setTimeout(() => {
        setMoveBanner(null);
      }, 1500);
    },
    []
  );

  // Unified Dice Roll Event Handler (animates rolls for all players and bots)
  useEffect(() => {
    const unsubDice = MultiplayerService.onDiceRolled(async (diceMsg) => {
      const { moveResult, room: updatedRoom, diceValue, guestId } = diceMsg;
      if (!moveResult || !updatedRoom) return;

      isTurnProcessingRef.current = true;
      setIsTurnProcessing(true);
      setIsRolling(true);
      sound.playDiceRoll();

      const rollingPlayer = updatedRoom.players.find(p => p.id === guestId);
      const nickname = rollingPlayer ? rollingPlayer.nickname : 'Player';

      // 1. Min 700ms rolling visual animation
      await new Promise(r => setTimeout(r, 700));

      // 2. Stop rolling and show landed dice value
      setIsRolling(false);
      setRoom(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          lastDiceResult: diceValue,
        };
      });

      // 3. Announce roll result
      setMoveBanner({
        text: `🎲 ${nickname} rolled a ${diceValue}!`,
        type: 'normal',
      });

      if (diceValue === 6 && !moveResult.isWinner) {
        sound.playSix();
      }

      // 4. Clear pause before piece begins step hops
      await new Promise(r => setTimeout(r, 650));

      // 5. Animate step-by-step cell hops
      if (moveResult.steps && moveResult.steps.length > 0) {
        await animateMoveSteps(
          moveResult.guestId,
          nickname,
          diceValue,
          moveResult.steps,
          moveResult.specialMove
        );
      } else if (moveResult.oldPosition + diceValue > 100) {
        setMoveBanner({
          text: `🎲 ${nickname} rolled ${diceValue} (Need exact roll to reach 100!)`,
          type: 'normal',
        });
        await new Promise(r => setTimeout(r, 1000));
      }

      // 6. Update to authoritative final room state
      setRoom({ ...updatedRoom });

      if (moveResult.isWinner && rollingPlayer) {
        saveRecentGame({
          id: `game_${Date.now()}`,
          roomCode: updatedRoom.roomCode,
          mode: updatedRoom.mode,
          date: Date.now(),
          winnerNickname: rollingPlayer.nickname,
          isWon: rollingPlayer.id === session.guestId,
          totalPlayers: updatedRoom.players.length,
          finalPosition: rollingPlayer.position,
        });
      }

      setIsRolling(false);
      setMovingPlayerId(undefined);
      setIsTurnProcessing(false);
      isTurnProcessingRef.current = false;
    });

    return () => unsubDice();
  }, [animateMoveSteps, session.guestId]);

  // Handle authoritative dice roll trigger
  const handleRollDice = useCallback(
    async (targetGuestId?: string) => {
      if (
        !room ||
        room.status !== 'playing' ||
        isRolling ||
        movingPlayerId !== undefined ||
        isTurnProcessingRef.current
      )
        return;

      const currentTurnId = targetGuestId || room.currentTurnGuestId;
      if (currentTurnId !== room.currentTurnGuestId) return;

      isTurnProcessingRef.current = true;
      setIsTurnProcessing(true);

      try {
        await MultiplayerService.rollDice(
          room.id,
          currentTurnId || session.guestId
        );
      } catch (err: any) {
        console.error('Roll error:', err);
        isTurnProcessingRef.current = false;
        setIsTurnProcessing(false);
      }
    },
    [room, isRolling, movingPlayerId, session.guestId]
  );

  // Bot Turn Engine
  useEffect(() => {
    if (
      !room ||
      room.status !== 'playing' ||
      isRolling ||
      movingPlayerId !== undefined ||
      isTurnProcessing ||
      isTurnProcessingRef.current
    )
      return;

    const currentPlayer = room.players.find(p => p.id === room.currentTurnGuestId);
    if (currentPlayer && currentPlayer.isBot) {
      const delay = getBotTurnDelay(currentPlayer.botDifficulty);
      if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);

      botTimeoutRef.current = setTimeout(() => {
        if (!isTurnProcessingRef.current) {
          handleRollDice(currentPlayer.id);
        }
      }, delay);
    }

    return () => {
      if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
    };
  }, [room, isRolling, movingPlayerId, isTurnProcessing, handleRollDice]);

  // Start Game
  const handleStartGame = async () => {
    if (!room) return;
    try {
      const updated = await MultiplayerService.startGame(room.id, session.guestId);
      setRoom({ ...updated });
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Add Bot
  const handleAddBot = async () => {
    if (!room || room.players.length >= room.maxPlayers) return;
    const colors: ('blue' | 'green' | 'yellow')[] = ['blue', 'green', 'yellow'];
    const botIdx = room.players.length;
    const bot = {
      id: `bot_med_${Date.now()}`,
      nickname: `Bot ${botIdx} [AI]`,
      playerNumber: (botIdx + 1) as 2 | 3 | 4,
      color: colors[botIdx - 1],
      position: 0,
      isConnected: true,
      isBot: true,
      botDifficulty: 'medium' as BotDifficulty,
      isReady: true,
      joinedAt: Date.now(),
      lastSeenAt: Date.now(),
    };
    room.players.push(bot);
    setRoom({ ...room });
  };

  // Send Message
  const handleSendMessage = async (text: string) => {
    if (!room) return;
    const msg = await MultiplayerService.sendChatMessage(
      room.id,
      session.guestId,
      session.nickname,
      text
    );
    setRoom(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        chat: [...prev.chat, msg],
      };
    });
  };

  // Rematch
  const handleRematch = async () => {
    if (!room) return;
    try {
      const resetRoom = await MultiplayerService.rematch(room.id);
      setRoom({ ...resetRoom });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleNicknameConfirm = (nick: string) => {
    const updated = updateGuestNickname(nick);
    setSession(updated);
    setIsNickModalOpen(false);
    loadRoom();
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[70vh]">
        <div className="w-12 h-12 rounded-2xl bg-[#382b1e] border border-[#523d2b] flex items-center justify-center animate-spin mb-4">
          <div className="w-5 h-5 rounded bg-amber-500" />
        </div>
        <h3 className="font-heading font-black text-xl text-[#fffdfa]">Entering Room...</h3>
        <p className="text-xs text-[#a8998a] mt-1">Connecting to game session</p>
      </div>
    );
  }

  if (errorMessage || !room) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto min-h-[70vh]">
        <div className="p-6 rounded-3xl bg-[#29221b] border-2 border-[#523d2b] shadow-2xl space-y-4 w-full">
          <h3 className="font-heading font-bold text-lg text-[#fffdfa]">Room Unavailable</h3>
          <p className="text-xs text-[#a8998a]">
            {errorMessage || 'This game room has expired or does not exist.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-5 rounded-xl btn-primary text-white font-heading font-bold text-sm transition-colors cursor-pointer"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Waiting Lobby
  if (room.status === 'waiting') {
    return (
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 min-h-[80vh]">
        <WaitingRoom
          room={room}
          myGuestId={session.guestId}
          onStartGame={handleStartGame}
          onAddBot={handleAddBot}
          onLeaveRoom={() => navigate('/')}
        />
      </div>
    );
  }

  const currentTurnPlayer = room.players.find(p => p.id === room.currentTurnGuestId);
  const isMyTurn = room.currentTurnGuestId === session.guestId;
  const winnerPlayer = room.winnerGuestId
    ? room.players.find(p => p.id === room.winnerGuestId)
    : undefined;

  return (
    <div className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex flex-col">
      <SEOHead
        title={`Snake & Ladder Room: ${room.roomCode}`}
        description="Active private Snake & Ladder online multiplayer game session."
        noIndex={true}
      />

      {/* Turn Indicator Banner */}
      <div className="mb-4">
        <TurnIndicator
          currentTurnPlayer={currentTurnPlayer}
          isMyTurn={isMyTurn}
        />
      </div>

      {/* Main Game Tabletop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Left Column (Desktop: Players & Events) */}
        <div className="hidden lg:block lg:col-span-3 space-y-4">
          <PlayerList
            players={room.players}
            currentTurnGuestId={room.currentTurnGuestId}
            myGuestId={session.guestId}
            hostGuestId={room.hostGuestId}
          />
          <GameEventLog events={room.events} />
        </div>

        {/* Center Column: 10x10 Board as Main Focus */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <GameBoard
            players={room.players}
            currentTurnGuestId={room.currentTurnGuestId}
            movingPlayerId={movingPlayerId}
            isSpecialMoving={isSpecialMoving}
            moveBanner={moveBanner}
          />
        </div>

        {/* Right Column: Dice & Chat */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <Dice3D
            value={room.lastDiceResult || 1}
            isRolling={isRolling}
            isMoving={movingPlayerId !== undefined}
            isMyTurn={isMyTurn}
            disabled={room.status !== 'playing' || !isMyTurn || isRolling || movingPlayerId !== undefined}
            onRoll={() => handleRollDice()}
          />

          {/* Mobile Players View */}
          <div className="block lg:hidden">
            <PlayerList
              players={room.players}
              currentTurnGuestId={room.currentTurnGuestId}
              myGuestId={session.guestId}
              hostGuestId={room.hostGuestId}
            />
          </div>

          {/* Mobile Events View */}
          <div className="block lg:hidden">
            <GameEventLog events={room.events} />
          </div>

          {/* Chat */}
          <GameChat
            chat={room.chat}
            myGuestId={session.guestId}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>

      {/* Victory Celebration Modal */}
      {room.status === 'finished' && winnerPlayer && (
        <VictoryModal
          winner={winnerPlayer}
          players={room.players}
          turnCount={room.turnNumber}
          onRematch={handleRematch}
          onHome={() => navigate('/')}
        />
      )}

      {/* Direct URL Nickname Modal */}
      <NicknameModal
        isOpen={isNickModalOpen}
        initialNickname={session.nickname}
        onConfirm={handleNicknameConfirm}
        onClose={() => {
          setIsNickModalOpen(false);
          navigate('/');
        }}
        title="Enter Your Nickname to Join"
      />
    </div>
  );
};
