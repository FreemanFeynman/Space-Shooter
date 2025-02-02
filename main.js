import { ctx, canvas, setupCanvas } from './canvas.js';
import { updateStars, drawStars, showGameOverScreen} from './environment.js';
import { spacecraft, handlePlayerInput, fireBullet, drawBullets, updateBullets } from './player.js';
import { updateMissiles, drawMissiles } from './projectiles.js';
import { updateGameLogic, drawGameInfo, isGameEnded, getScore } from './gameLogic.js';
import { playSound } from './sounds.js';
import { updateExplosions, drawExplosions } from './explosions.js';
import { createEnemy, updateEnemies, drawEnemies, enemies } from './enemies.js';
import { createSpaceStation, updateSpaceStations, drawSpaceStations } from './spaceStations.js';

let gameStarted = false;
let startImage = new Image();
startImage.src = './images/startscreen.png';

function initializeGame() {
  console.log('Initializing game...');
  setupCanvas();
  console.log('Game initialized successfully.');
}

// Function to display the start screen
function showStartScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);
  ctx.font = '30px Arial';
  ctx.fillStyle = 'yellow';
  ctx.textAlign = 'center';
  ctx.fillText('Press SPACE to Start', canvas.width / 2, canvas.height - 50);
}

window.addEventListener('keydown', (e) => {
  if (!gameStarted && e.key === ' ') {
    gameStarted = true;

    // Initialize game loop and obstacle/enemy creation
    gameLoop();
    setInterval(createSpaceStation, 8000); // Spawn obstacles every x seconds
    setInterval(createEnemy, 10000);   // Spawn enemies every x seconds
  } else if (gameStarted && e.key === ' ' && spacecraft) {
    fireBullet(spacecraft);
    playSound('shoot');
  }
});

function gameLoop() {
  if (!gameStarted) return; // Prevent the game loop from running before the game starts

  try {
    // Update game elements
    handlePlayerInput();
    updateStars();
    updateBullets();
    updateMissiles(spacecraft, enemies);
    updateExplosions();
    updateEnemies(spacecraft);
    updateSpaceStations(spacecraft, enemies);
    updateGameLogic();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawStars();
    spacecraft.draw();
    drawBullets();
    drawMissiles();
    drawExplosions();
    drawEnemies();
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
startImage.onload = () => showStartScreen(); // Show the start screen when the image is loaded
