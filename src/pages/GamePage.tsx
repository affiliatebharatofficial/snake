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
  const [isNickModalOpen, setIsNickModalOpen] = useState(false);

  const botTimeoutRef = useRef<any>(null);

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

  // Synchronized step-by-step movement animation
  const animateMoveSteps = useCallback(async (playerId: string, steps: number[], specialType?: string) => {
    setMovingPlayerId(playerId);

    for (let i = 0; i < steps.length; i++) {
      const stepPos = steps[i];
      const isLastStep = i === steps.length - 1;

      // If this is the special destination step (e.g. snake slide or ladder climb)
      if (isLastStep && specialType) {
        if (specialType === 'snake') {
          // Play snake hiss/bite right before slide
          sound.playSnake();
          await new Promise(r => setTimeout(r, 200));
        } else if (specialType === 'ladder') {
          // Play ladder climb right before ascension
          sound.playLadder();
          await new Promise(r => setTimeout(r, 150));
        }
      } else {
        // Regular piece step hop
        sound.playStep(i);
      }

      setRoom(prev => {
        if (!prev) return prev;
        const copy = { ...prev };
        const p = copy.players.find(pl => pl.id === playerId);
        if (p) p.position = stepPos;
        return copy;
      });

      await new Promise(r => setTimeout(r, specialType && isLastStep ? 450 : 200));
    }

    setMovingPlayerId(undefined);
  }, []);

  // Handle authoritative dice roll
  const handleRollDice = useCallback(async (targetGuestId?: string) => {
    if (!room || room.status !== 'playing' || isRolling) return;

    const currentTurnId = targetGuestId || room.currentTurnGuestId;
    if (currentTurnId !== room.currentTurnGuestId) return;

    setIsRolling(true);
    sound.playDiceRoll();

    // 700ms rolling sequence
    await new Promise(r => setTimeout(r, 700));

    try {
      const { room: updatedRoom, moveResult } = await MultiplayerService.rollDice(
        room.id,
        currentTurnId || session.guestId
      );

      // Trigger movement sequence
      await animateMoveSteps(
        moveResult.guestId,
        moveResult.steps,
        moveResult.specialMove?.type
      );

      setRoom({ ...updatedRoom });

      if (moveResult.diceValue === 6 && !moveResult.isWinner) {
        sound.playSix();
      }

      if (moveResult.isWinner) {
        const winnerPlayer = updatedRoom.players.find((p: Player) => p.id === moveResult.guestId);
        if (winnerPlayer) {
          saveRecentGame({
            id: `game_${Date.now()}`,
            roomCode: updatedRoom.roomCode,
            mode: updatedRoom.mode,
            date: Date.now(),
            winnerNickname: winnerPlayer.nickname,
            isWon: winnerPlayer.id === session.guestId,
            totalPlayers: updatedRoom.players.length,
            finalPosition: winnerPlayer.position,
          });
        }
      }
    } catch (err: any) {
      console.error('Roll error:', err);
    } finally {
      setIsRolling(false);
    }
  }, [room, isRolling, animateMoveSteps, session.guestId]);

  // Bot Turn Engine
  useEffect(() => {
    if (!room || room.status !== 'playing' || isRolling) return;

    const currentPlayer = room.players.find(p => p.id === room.currentTurnGuestId);
    if (currentPlayer && currentPlayer.isBot) {
      const delay = getBotTurnDelay(currentPlayer.botDifficulty);
      if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);

      botTimeoutRef.current = setTimeout(() => {
        handleRollDice(currentPlayer.id);
      }, delay);
    }

    return () => {
      if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
    };
  }, [room, isRolling, handleRollDice]);

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
          />
        </div>

        {/* Right Column: Dice & Chat */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <Dice3D
            value={room.lastDiceResult || 1}
            isRolling={isRolling}
            isMyTurn={isMyTurn}
            disabled={room.status !== 'playing' || !isMyTurn}
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
