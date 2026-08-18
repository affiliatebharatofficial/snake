import { GameRules, MoveResult, Player, Snake, Ladder, SpecialMove } from './types';
import { DEFAULT_LADDERS, DEFAULT_SNAKES } from './boardConfig';

export const DEFAULT_GAME_RULES: GameRules = {
  enterOnSix: false,          // Default false so beginners can enter on any roll
  sixGivesExtraTurn: true,    // Rolling 6 allows rolling again
  exact100ToWin: true,        // Must land exactly on square 100
  maxConsecutiveSixes: 3,     // 3 consecutive sixes ends turn to prevent infinite loops
  turnTimeoutSeconds: 30,     // 30 seconds turn timeout
};

/**
 * Calculates authoritative game move results given current player, dice value, and rules.
 */
export function calculateMove(
  player: Player,
  diceValue: number,
  allPlayers: Player[],
  currentConsecutiveSixes: number = 0,
  rules: GameRules = DEFAULT_GAME_RULES,
  snakes: Snake[] = DEFAULT_SNAKES,
  ladders: Ladder[] = DEFAULT_LADDERS,
  turnNumber: number = 1
): MoveResult {
  const oldPosition = player.position;
  let intermediatePosition = oldPosition;
  let newPosition = oldPosition;
  const steps: number[] = [];
  let specialMove: SpecialMove | undefined = undefined;

  // Case 1: Player is outside the board (position 0)
  if (oldPosition === 0) {
    if (rules.enterOnSix) {
      if (diceValue === 6) {
        intermediatePosition = 1;
        steps.push(1);
        specialMove = { type: 'entry', from: 0, to: 1 };
      } else {
        // Did not roll 6, cannot enter
        intermediatePosition = 0;
      }
    } else {
      // Enter directly by dice value (e.g. roll 4 -> position 4)
      for (let i = 1; i <= diceValue; i++) {
        steps.push(i);
      }
      intermediatePosition = diceValue;
    }
  } else {
    // Case 2: Player is already on board
    const targetPos = oldPosition + diceValue;

    if (rules.exact100ToWin) {
      if (targetPos > 100) {
        // Exceeds 100: Player cannot move (or stays at old position)
        intermediatePosition = oldPosition;
        specialMove = { type: 'bounce', from: targetPos, to: oldPosition };
      } else {
        for (let pos = oldPosition + 1; pos <= targetPos; pos++) {
          steps.push(pos);
        }
        intermediatePosition = targetPos;
      }
    } else {
      const capped = Math.min(100, targetPos);
      for (let pos = oldPosition + 1; pos <= capped; pos++) {
        steps.push(pos);
      }
      intermediatePosition = capped;
    }
  }

  newPosition = intermediatePosition;

  // Case 3: Check if intermediate position lands on a ladder or snake
  if (newPosition > 0 && newPosition < 100) {
    // Check Ladder
    const ladder = ladders.find(l => l.start === newPosition);
    if (ladder) {
      specialMove = {
        type: 'ladder',
        from: ladder.start,
        to: ladder.end,
      };
      newPosition = ladder.end;
      steps.push(ladder.end);
    } else {
      // Check Snake
      const snake = snakes.find(s => s.start === newPosition);
      if (snake) {
        specialMove = {
          type: 'snake',
          from: snake.start,
          to: snake.end,
        };
        newPosition = snake.end;
        steps.push(snake.end);
      }
    }
  }

  const isWinner = newPosition === 100;

  // Bonus Turn Logic (rolling 6)
  let isBonusTurn = false;
  const newConsecutiveSixes = diceValue === 6 ? currentConsecutiveSixes + 1 : 0;

  if (rules.sixGivesExtraTurn && diceValue === 6 && !isWinner) {
    if (rules.maxConsecutiveSixes && newConsecutiveSixes >= rules.maxConsecutiveSixes) {
      // Reached max sixes: turn forfeit to next player
      isBonusTurn = false;
    } else {
      isBonusTurn = true;
    }
  }

  // Next player determination
  let nextTurnGuestId = player.id;
  if (!isBonusTurn && !isWinner) {
    const currentIndex = allPlayers.findIndex(p => p.id === player.id);
    const nextIndex = (currentIndex + 1) % allPlayers.length;
    nextTurnGuestId = allPlayers[nextIndex].id;
  }

  const turnId = `turn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  return {
    turnId,
    turnNumber,
    guestId: player.id,
    nickname: player.nickname,
    diceValue,
    oldPosition,
    newPosition,
    finalPosition: newPosition,
    steps,
    specialMove,
    isBonusTurn,
    isWinner,
    nextTurnGuestId,
  };
}
