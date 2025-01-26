import { ctx, canvas } from './environment.js';
import { createExplosion } from './explosions.js';
import { playSound } from './sounds.js'; // Import playSound function
import { fireMissile } from './projectiles.js'; // Delegate missile creation to projectiles.js
import { spacecraft } from './player.js';

export const enemies = [];
let lastMissileFiredTimes = {}; // Track the last time each enemy fired a missile

const GRAVITY_CONSTANT = 0.05; // Tweak this value for balancing
const collisiondamageEffect = 0; // Set to 0 for no damage deduction, or a positive number for damage reduction

const enemyImages = Array.from({ length: 10 }, (_, i) => {
  const img = new Image();
  img.src = `./images/enemy_spacecraft_${i + 1}.png`;
  img.onload = () => console.log(`Enemy image ${img.src} loaded.`);
  img.onerror = () => console.error(`Failed to load enemy image: ${img.src}`);
  return img;
});

// Function to create a new enemy
export function createEnemy() {
  const isEnemy  =  enemyImages;

  enemies.push({
    id: Math.random().toString(36).substring(2), // Unique ID for tracking
    x: Math.random() * canvas.width,
    y: -50,
    width: 80,
    height: 80,
    velocity: Math.random() * 2 + 1,
    image: isEnemy,
    destroyed: false,
  });
}

// Handle enemy shooting with rate limit
function handleEnemyShooting(enemy) {
  const now = Date.now();
  const lastFired = lastMissileFiredTimes[enemy.id] || 0;

  if (now - lastFired >= 2000 && enemy.y > 0 && enemy.y < canvas.height) {
    fireMissile(enemy);
    lastMissileFiredTimes[enemy.id] = now; // Update last fired time
  }
}



// Update enemies
export function updateenemies(player) {
  enemies.forEach((enemy) => {
    // Vertical movement
    enemy.y += enemy.velocity;

    // Handle enemy-specific movement
    if (enemy.type === 'enemy') {
      const followSpeed = 4; 
      const followThreshold = 800;

      // Calculate distance to the player
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < followThreshold) {
        if (distance > 0) {
          enemy.x += (dx / distance) * followSpeed;
          enemy.y += (dy / distance) * followSpeed;
        }
      }

    // add some randomness to enemy movement when far from the player
    else {
      enemy.x += Math.random() * 2 - 1; // Small random horizontal drift
      enemy.y += Math.random() * 2 - 1; // Small random vertical drift
    }

    // Ensure enemy stays within canvas boundaries
    if (enemy.x <= 0) enemy.x = 0;
    if (enemy.x + enemy.width >= canvas.width) enemy.x = canvas.width - enemy.width;
    if (enemy.y <= 0) enemy.y = 0;
    if (enemy.y + enemy.height >= canvas.height) enemy.y = canvas.height - enemy.height;

    handleEnemyShooting(enemy);
  }

    // Check for collision with player
    if (
      enemy.x < spacecraft.x + spacecraft.width &&
      enemy.x + enemy.width > spacecraft.x &&
      enemy.y < spacecraft.y + spacecraft.height &&
      enemy.y + enemy.height > spacecraft.y
    ) {
      if (enemy.type === 'enemy') {
        createExplosion(spacecraft.x, spacecraft.y);
        playSound('explosion');
        spacecraft.damage--;
        enemy.destroyed = true;
      }
    }

    // Remove off-screen enemies
    if (enemy.y > canvas.height) {
      enemy.destroyed = true;
    }
  });

  // Filter out destroyed enemies (enemies only)
  enemies.splice(0, enemies.length, ...enemies.filter((enemy) => !(enemy.destroyed && enemy.type === 'enemy')));
}



// Draw enemies
export function drawenemies() {
  enemies.forEach((enemy) => {
    if (enemy.image.complete && enemy.image.naturalWidth > 0) {
      ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
    }
  });
}
