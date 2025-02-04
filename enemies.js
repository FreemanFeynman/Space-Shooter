import { ctx, canvas } from './canvas.js';
import { fireMissile } from './projectiles.js';
import { createExplosion } from './explosions.js';
import { playSound } from './sounds.js';
import { spaceStations } from './spaceStations.js';
import { updateScore } from './gameLogic.js';

export const enemies = [];
let lastMissileFiredTimes = {}; // Track when each enemy last fired

const enemyImages = Array.from({ length: 10 }, (_, i) => {
  const img = new Image();
  img.src = `./images/enemy_spacecraft_${i + 1}.png`;
  return img;
});

const margin = 50;

export function createEnemy(count = 1) {
  for (let i = 0; i < count; i++) {
    enemies.push({
      id: Math.random().toString(36).substring(2),
      x: Math.random() * (canvas.width - 2 * margin) + margin,
      y: -50,
      width: 75,
      height: 75,
      velocity: Math.random() * 2 + 1,
      image: enemyImages[Math.floor(Math.random() * enemyImages.length)],
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

    if (distance < 400) {
      enemy.x += (dx / distance) * 2;
      enemy.y += (dy / distance) * 2;
    }

    handleEnemyShooting(enemy);

    // Collision with player
    if (
      enemy.x < player.x + player.width &&
      enemy.x + enemy.width > player.x &&
      enemy.y < player.y + player.height &&
      enemy.y + enemy.height > player.y
    ) {
      createExplosion(player.x, player.y);
      playSound('explosion');
      player.health -= 5;
      enemy.destroyed = true;
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
      }
    });

    // Remove if off-screen
    if (enemy.y > canvas.height) {
      enemy.destroyed = true;
    }
  });

  enemies.splice(0, enemies.length, ...enemies.filter((e) => !e.destroyed));
}

export function drawEnemies() {
  enemies.forEach((enemy) => {
    if (enemy.image.complete) {
      ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
    } else {
      ctx.fillStyle = 'red';
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  });
}
