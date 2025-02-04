import { ctx } from './canvas.js';
import { spacecraft } from './player.js';

let score = 0;
let isGameOver = false;

export function updateGameLogic() {
  if (spacecraft.health <= -1 ) {
    isGameOver = true;
  }
}

export function drawGameInfo() {
  ctx.fillStyle = 'Yellow';
  ctx.font = '20px Verdana';
  ctx.fillText(`Score: ${Math.floor(score)}`, 70, 50);

  // Change color to red if health is 5 or less
  if (spacecraft.health <= 5) {
    ctx.fillStyle = 'red';
  } else {
    ctx.fillStyle = 'Yellow';
  }
  ctx.fillText(`Health: ${spacecraft.health || 0}`, 70, 140);

  // Change color to red if bullets are 10 or less
  if (spacecraft.currentBullets <= 10) {
    ctx.fillStyle = 'red';
  } else {
    ctx.fillStyle = 'Yellow';
  }
  ctx.fillText(`Bullets: ${spacecraft.currentBullets || 0}`, 70, 110);
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
