import { ctx, canvas } from '../core/canvas.js';
import { fireMissile } from '../entities/projectiles.js';
import { createExplosion } from '../entities/explosions.js';
import { playSound } from '../utils/sounds.js';
import { spaceStations } from './spaceStations.js';

export const enemies = [];
let lastMissileFiredTimes = {}; // Track when each enemy last fired
export let enemyCollisionCount = 0;
export let enemySpaceStationCount = 0;

const enemyImage = new Image();
enemyImage.src = '../assets/images/enemy_spacecraft_1.png';
enemyImage.onload = () => {
  drawEnemies();
};


const margin = 75;

export function createEnemy(count = 1) {
  for (let i = 0; i < count; i++) {
    enemies.push({
      id: Math.random().toString(36).substring(2),
      x: Math.random() * (canvas.width - 2 * margin) + margin,
      y: -50,
      width: 75,
      height: 75,
      velocity: Math.random() * 2 + 1,
      image: enemyImage[Math.floor(Math.random() * enemyImage.length)],
      destroyed: false
    });
  }
}

function handleEnemyShooting(enemy) {
  const now = Date.now();
  if (now - (lastMissileFiredTimes[enemy.id] || 0) >= 6000 && enemy.y > 0) {
    fireMissile(enemy);
    lastMissileFiredTimes[enemy.id] = now;
  }
}

export function updateEnemies(player) {
  enemies.forEach((enemy) => {
    enemy.y += enemy.velocity;

    // Enemy follows player within a certain range
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 600) {
      enemy.x += (dx / distance) * 2;
      enemy.y += (dy / distance) * 2;
    }

    handleEnemyShooting(enemy);
    let margin = 10; // Increase this value to make the hit area larger

    // Collision with player
    if (
      enemy.x < player.x + player.width + margin &&
      enemy.x + enemy.width > player.x - margin &&
      enemy.y < player.y + player.height + margin &&
      enemy.y + enemy.height > player.y - margin
    ) {
      createExplosion(player.x, player.y);
      playSound('explosion');
      player.health -= 1;
      enemy.destroyed = true;
      enemyCollisionCount++;
      console.log(`Enemies destroyed by collision: ${enemyCollisionCount}`);
    }

    spaceStations.forEach((station) => {
      if (
        enemy.x < station.x + station.width &&
        enemy.x + enemy.width > station.x &&
        enemy.y < station.y + station.height &&
        enemy.y + enemy.height > station.y
      ) {
        createExplosion(station.x + station.width / 2, station.y + station.height / 2);
        playSound('explosion');
        enemy.destroyed = true;
        enemySpaceStationCount++;
        console.log(`Enemies destroyed by space station: ${enemySpaceStationCount}`); 
      }
    });

    // Remove if off-screen
    if (enemy.y > canvas.height) {
      enemy.destroyed = true;
    }
  });
}

export function drawEnemies() {
  enemies.forEach((enemy) => {
    // Now we check if the image has loaded
    if (enemyImage.complete) {
      ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    } else {
      ctx.fillStyle = 'red'; // Fallback in case the image isn't loaded yet
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  });
}
