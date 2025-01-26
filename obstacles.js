import { ctx, canvas } from './environment.js';
import { createExplosion } from './explosions.js';
import { playSound } from './sounds.js'; // Import playSound function
import { fireMissile } from './projectiles.js'; // Delegate missile creation to projectiles.js
import { spacecraft } from './player.js';

export const obstacles = [];
let lastMissileFiredTimes = {}; // Track the last time each enemy fired a missile

const GRAVITY_CONSTANT = 0.05; // Tweak this value for balancing
const collisiondamageEffect = 0; // Set to 0 for no damage deduction, or a positive number for damage reduction

// Load images for spacestations and enemies
const spacestationImages = Array.from({ length: 10 }, (_, i) => {
  const img = new Image();
  img.src = `./images/spacestation_${i + 1}.png`;
  img.onload = () => console.log(`spacestation image ${img.src} loaded.`);
  img.onerror = () => console.error(`Failed to load spacestation image: ${img.src}`);
  return img;
});

const enemyImages = Array.from({ length: 10 }, (_, i) => {
  const img = new Image();
  img.src = `./images/enemy_spacecraft_${i + 1}.png`;
  img.onload = () => console.log(`Enemy image ${img.src} loaded.`);
  img.onerror = () => console.error(`Failed to load enemy image: ${img.src}`);
  return img;
});

// Function to create a new obstacle
export function createObstacle() {
  const isObstacle = Math.random() < 0.5;
  const imageArray = isObstacle ? enemyImages : spacestationImages;

  obstacles.push({
    id: Math.random().toString(36).substring(2), // Unique ID for tracking
    x: Math.random() * canvas.width,
    y: -50,
    type: isObstacle ? 'enemy' : 'spacestation',
    width: isObstacle ? 80 : 100,
    height: isObstacle ? 80 : 100,
    velocity: Math.random() * 2 + 1,
    image: imageArray[Math.floor(Math.random() * imageArray.length)],
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


// Update obstacles
export function updateObstacles(player) {
  obstacles.forEach((obstacle) => {
    // Vertical movement
    obstacle.y += obstacle.velocity;

    // Handle enemy-specific movement
    if (obstacle.type === 'enemy') {
      // Define speed and threshold for following the player
      const followSpeed = 2; // Speed at which the enemy follows the player
      const followThreshold = 400; // Distance to start following the player

      // Calculate distance to the player
      const dx = player.x - obstacle.x;
      const dy = player.y - obstacle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < followThreshold) {
        // Follow the player when within the threshold distance
        if (distance > 0) {
          obstacle.x += (dx / distance) * followSpeed;
          obstacle.y += (dy / distance) * followSpeed;
        }
      }

    // Optionally, add some randomness to enemy movement when far from the player
    else {
      obstacle.x += Math.random() * 2 - 1; // Small random horizontal drift
      obstacle.y += Math.random() * 2 - 1; // Small random vertical drift
    }

    // Ensure enemy stays within canvas boundaries
    //if (obstacle.x <= 0) obstacle.x = 0;
    //if (obstacle.x + obstacle.width >= canvas.width) obstacle.x = canvas.width - obstacle.width;
    //if (obstacle.y <= 0) obstacle.y = 0;
    //if (obstacle.y + obstacle.height >= canvas.height) obstacle.y = canvas.height - obstacle.height;

    handleEnemyShooting(obstacle);
  }

    // Check for collision with player
    if (
      obstacle.x < spacecraft.x + spacecraft.width &&
      obstacle.x + obstacle.width > spacecraft.x &&
      obstacle.y < spacecraft.y + spacecraft.height &&
      obstacle.y + obstacle.height > spacecraft.y
    ) {
      if (obstacle.type === 'spacestation') {
        // Bounce logic
        const dx = spacecraft.x - (obstacle.x + obstacle.width / 2);
        const dy = spacecraft.y - (obstacle.y + obstacle.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
          const bounceStrength = Math.min(50, 500 / distance); // Adjust max strength and scaling
          spacecraft.x += (dx / distance) * bounceStrength;
          spacecraft.y += (dy / distance) * bounceStrength;

          // Add randomness
          spacecraft.x += Math.random() * 2 - 1;
          spacecraft.y += Math.random() * 2 - 1;
        }

        if (collisiondamageEffect > 0) {
          spacecraft.damage -= collisiondamageEffect;
        }

        playSound('collision');
      } else if (obstacle.type === 'enemy') {
        createExplosion(spacecraft.x, spacecraft.y);
        playSound('explosion');
        spacecraft.damage--;
        obstacle.destroyed = true;
      }
    }

    // Remove off-screen obstacles
    if (obstacle.y > canvas.height) {
      obstacle.destroyed = true;
    }
  });

  // Filter out destroyed obstacles (enemies only)
  obstacles.splice(0, obstacles.length, ...obstacles.filter((obstacle) => !(obstacle.destroyed && obstacle.type === 'enemy')));
}



// Draw obstacles
export function drawObstacles() {
  obstacles.forEach((obstacle) => {
    if (obstacle.image.complete && obstacle.image.naturalWidth > 0) {
      ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    } else {
      ctx.fillStyle = obstacle.type === 'spacestation' ? 'blue' : 'red';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
  });
}
