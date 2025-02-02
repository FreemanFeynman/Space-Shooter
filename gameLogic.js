import { ctx } from './canvas.js';
import { spacecraft } from './player.js';

let score = 0;
let isGameOver = false;

export function updateGameLogic() {
  if (spacecraft.damage <= -1) {
    isGameOver = true;
  }
}

export function drawGameInfo() {
  ctx.fillStyle = 'Yellow';
  ctx.font = '20px Verdana';
  ctx.fillText(`Score: ${Math.floor(score)}`, 70, 50);
  ctx.fillText(`Shield: ${spacecraft.damage || 0}`, 70, 80);
}


export function isGameEnded() {
  return isGameOver;
}

export function updateScore(points) {
  score += points;
}

export function getScore() {
  return score;
}
