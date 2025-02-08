import { ctx, canvas, setupCanvas } from './canvas.js';
import { updateStars, drawStars} from '../entities/environment.js';
import { spacecraft, handlePlayerInput, fireBullet, drawBullets, updateBullets, bullets } from '../entities/player.js';
import { updateMissiles, drawMissiles } from '../entities/projectiles.js';
import { updateGameLogic, drawGameInfo, isGameEnded, getScore, showStartScreen, showGameOverScreen, level1Complete } from './gameLogic.js';
import { playSound, stopSound } from '../utils/sounds.js';
import { updateExplosions, drawExplosions } from '../entities/explosions.js';
import { createEnemy, updateEnemies, drawEnemies, enemies } from '../entities/enemies.js';
import { createSpaceStation, updateSpaceStations, drawSpaceStations } from '../entities/spaceStations.js';
import { updateItems, drawItems } from '../entities/items.js';

let gameStarted = false;

function initializeGame() {
  console.log('Initializing game...');
  setupCanvas();
  showStartScreen();
  console.log('Game initialized successfully.');
}

window.addEventListener('keydown', (e) => {
  if (!gameStarted && e.key === ' ') {
    gameStarted = true;
    stopSound('background');

    // Initialize game loop and obstacle/enemy creation
    gameLoop();
    setInterval(createSpaceStation, 20000); // Spawn obstacles every x seconds
    setInterval(() => createEnemy(2), 6000);   // Spawn enemies every x seconds
  } else if (gameStarted && e.key === ' ' && spacecraft) {
    fireBullet(spacecraft);
    playSound('shoot');
  }
});

function gameLoop() {
  if (!gameStarted) return; // Prevent the game loop from running before the game starts

  try {

    //Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update game elements
    handlePlayerInput();
    updateStars();
    updateBullets();
    updateMissiles(spacecraft, enemies);
    updateExplosions();
    updateEnemies(spacecraft);
    updateItems (spacecraft);
    updateSpaceStations(spacecraft, enemies, bullets);
    updateGameLogic(gameLoop);

    drawStars();
    spacecraft.draw();
    drawBullets();
    drawMissiles();
    drawExplosions();
    drawEnemies();
    drawItems();
    drawSpaceStations();
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


// Initializing the start screen
initializeGame();
