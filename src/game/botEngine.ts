import { BotDifficulty, Player, PlayerColor } from './types';

const BOT_NAMES = [
  'CobraBot',
  'ViperAI',
  'LadderMaster',
  'DiceBot 3000',
  'ApexRoller',
  'RoboSnake',
  'ByteClimber',
  'PixelPython',
];

/**
 * Creates AI Bot Player object.
 */
export function createBotPlayer(
  playerNumber: 1 | 2 | 3 | 4,
  color: PlayerColor,
  difficulty: BotDifficulty = 'medium'
): Player {
  const name = BOT_NAMES[(playerNumber - 2 + BOT_NAMES.length) % BOT_NAMES.length];
  return {
    id: `bot_${difficulty}_${playerNumber}_${Math.random().toString(36).substring(2, 7)}`,
    nickname: `${name} [BOT]`,
    playerNumber,
    color,
    position: 0,
    isConnected: true,
    isBot: true,
    botDifficulty: difficulty,
    isReady: true,
    joinedAt: Date.now(),
    lastSeenAt: Date.now(),
  };
}

/**
 * Calculates human-like thinking delay based on bot difficulty.
 */
export function getBotTurnDelay(difficulty: BotDifficulty = 'medium'): number {
  switch (difficulty) {
    case 'easy':
      return 1200 + Math.random() * 1000;
    case 'medium':
      return 1000 + Math.random() * 600;
    case 'hard':
      return 700 + Math.random() * 400;
    default:
      return 1000;
  }
}
