import { ctx, canvas } from './canvas.js';
import { spacecraft, enemyBulletCount } from '../entities/player.js';
import { enemies, enemyCollisionCount, enemySpaceStationCount } from '../entities/enemies.js';
import { playSound } from '../utils/sounds.js';

let score = 0;
let isGameOver = false;
let level1 = false;

export function updateGameLogic() {
  score = enemyBulletCount + enemyCollisionCount + enemySpaceStationCount;

  if (spacecraft.health <= -1) {
    isGameOver = true;
    console.log("Game Over: Player has no health left.");
  }

  enemies.forEach((enemy) => {
    if (enemy.y > canvas.height) {
      isGameOver = true;
      console.log("Game Over: Enemy went off-screen.");
    }
  });

  if (score > 49) {
    level1 = true;
    console.log("Level 1 Complete: Player has destroyed 50 enemies.");
  }
}

export function drawGameInfo() {
  ctx.fillStyle = 'yellow';
  ctx.font = '20px Verdana';
  ctx.fillText(`Enemy count: ${Math.floor(score)}`, 100, 50);

  if (spacecraft.health <= 5) {
    ctx.fillStyle = 'red';
  } else {
    ctx.fillStyle = 'yellow';
  }
  ctx.fillText(`Energy: ${spacecraft.health || 0}`, 75, 110);

  if (spacecraft.currentBullets <= 10) {
    ctx.fillStyle = 'red';
  } else {
    ctx.fillStyle = 'yellow';
  }
  ctx.fillText(`Weapon: ${spacecraft.currentBullets || 0}`, 80, 80);
}

export function showStartScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const startImage = new Image();
  startImage.src = '../assets/images/startscreen.png';
  startImage.onload = () => {
    ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);
    ctx.font = '40px Constantia';
    ctx.fillStyle = 'yellow';
    ctx.textAlign = 'center';
    ctx.fillText('Press SPACE to Start', canvas.width / 2, canvas.height - 150);
    playSound('background');
  };
}

export function level1Screen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const level1Image = new Image();
  level1Image.src = '../assets/images/level1complete.png';
  level1Image.onload = () => {
    ctx.drawImage(level1Image, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'yellow';
    ctx.font = '48px Comic Sans MS';
    ctx.textAlign = 'center';
    ctx.fillText('You have succesfully stopped the invastion! For now....', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '24px Comic Sans MS';
    ctx.fillText('Prepare for the next assignment.', canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = 'yellow';
    ctx.font = '24px Verdana';
    ctx.fillText(`Enemies destroyed: ${Math.floor(score)}`, 170, 70);
    playSound('background');
  };
}

export function showGameOverScreen(score) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Game Over Text
  ctx.fillStyle = "yellow";
  ctx.font = "48px Comic Sans MS";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 50);
  ctx.font = "24px Comic Sans MS";
  ctx.fillText(`Enemy count: ${Math.floor(score)}`, canvas.width / 2, canvas.height / 2);
  ctx.fillStyle = "darkred";
  ctx.font = "60px Comic Sans MS";
  ctx.fillText("They have breached Earth's defence...", canvas.width / 2, canvas.height / 2 - 150);
  playSound('gameover');

  // Draw Try Again Button
  const buttonX = canvas.width / 2 - 75;
  const buttonY = canvas.height / 2 + 50;
  const buttonWidth = 150;
  const buttonHeight = 50;

  ctx.fillStyle = "black";
  ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

  ctx.fillStyle = "yellow";
  ctx.font = "20px Verdana";
  ctx.fillText("Try Again", canvas.width / 2, canvas.height / 2 + 80);

  canvas.addEventListener("click", function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (
      mouseX > buttonX &&
      mouseX < buttonX + buttonWidth &&
      mouseY > buttonY &&
      mouseY < buttonY + buttonHeight
    ) {
      canvas.removeEventListener("click", handleClick);
      restartGame();
    }
  });
}

function restartGame() {
  // Reload the page to restart the game
  window.location.reload();
}

export function Level1Ended() {
  return level1;
}

export function isGameEnded() {
  return isGameOver;
}

// export function updateScore(points) {
//   score += points;
// }

export function getScore() {
  return score;
}
