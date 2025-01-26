import { setupCanvas, updateStars, drawStars, ctx, canvas } from './environment.js';
import { spacecraft, handlePlayerInput, fireBullet, drawBullets, updateBullets } from './player.js';
import { createObstacle, updateObstacles, drawObstacles, obstacles } from './obstacles.js';
import { updateMissiles, drawMissiles } from './projectiles.js';
import { updateGameLogic, drawGameInfo, isGameEnded, getScore } from './gameLogic.js';
import { playSound } from './sounds.js';
import { updateExplosions, drawExplosions } from './explosions.js';
import { showGameOverScreen } from './environment.js';

function initializeGame() {
  console.log('Initializing game...');
  setupCanvas(); // Set up the canvas dimensions
  console.log('Game initialized successfully.');
}

window.addEventListener('keydown', (e) => {
  if (e.key === ' ' && spacecraft) {
    fireBullet(spacecraft);
    playSound('shoot');
  }
});

function gameLoop() {
  try {
    handlePlayerInput();
    updateStars();
    updateBullets();
    updateMissiles(spacecraft, obstacles);
    updateObstacles(spacecraft);
    updateExplosions();
    updateGameLogic();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawStars();
    spacecraft.draw();
    drawBullets();
    drawMissiles();
    drawObstacles();
    drawExplosions();
    drawGameInfo();

    if (!isGameEnded()) {
      requestAnimationFrame(gameLoop);
    } else {
      playSound('explosion');
      showGameOverScreen(getScore());
    }
  } catch (error) {
    console.error('Error in gameLoop:', error);
  }
}

initializeGame();
setInterval(createObstacle, 2000); // Spawn obstacles every 2 seconds
gameLoop();
