import { ctx, canvas } from '../core/canvas.js';
import { playSound } from '../utils//sounds.js';
import { createExplosion } from '../entities/explosions.js';
import { isGameEnded, updateGameLogic } from '../core/gameLogic.js';

export const items = [];
const itemSpawnRate = 0.5;

const itemTypes = [
  { type: 'health', image: '../assets/images/health.png' },
  { type: 'ammo', image: '../assets/images/ammunition.png' },
  { type: 'shield', image: '../assets/images/shield.png' },
];

export function createItems(x, y) {
  const randomItem = itemTypes[Math.floor(Math.random() * itemTypes.length)];
  items.push({
    id: Math.random().toString(36).substring(2),
    x,
    y,
    width: 50,
    height: 50,
    velocity: 2,
    type: randomItem.type,
    image: new Image(),
  });
  items[items.length - 1].image.src = randomItem.image;
}
export function spawnItem(x, y) {
  if (Math.random() < itemSpawnRate) {
    const offsetX = (Math.random() - 0.5) * 300; // Random offset between -50 and 50
    const offsetY = (Math.random() - 0.5) * 300; // Random offset between -50 and 50
    createItems(x + offsetX, y + offsetY);
  }
}

export function updateItems(spacecraft) {
  items.forEach((item, index) => {
    item.y += item.velocity;

    // Check collision with player.
    if (
      item.x < spacecraft.x + spacecraft.width &&
      item.x + item.width > spacecraft.x &&
      item.y < spacecraft.y + spacecraft.height &&
      item.y + item.height > spacecraft.y
    ) {
      itemEffect(item.type, spacecraft);
      playSound('item');
      items.splice(index, 1);
    }

    // Remove if off-screen.
    if (item.y > canvas.height + item.height) {
      items.splice(index, 1);
    }
  });

    // Check if health is -1 and trigger explosion and game over
    if (spacecraft.health <= -1 && !isGameEnded()) {
      createExplosion(spacecraft.x, spacecraft.y);
      playSound('explosion');
      updateGameLogic();
    }
  }

export function itemEffect(type, spacecraft) {
  switch (type) {
    case 'health':
      spacecraft.health += 10;
      console.log(`Health increased to: ${spacecraft.health}`);
      break;
    case 'ammo':
      const ammoAmount = 20;
      spacecraft.currentBullets = Math.min(spacecraft.currentBullets + ammoAmount, spacecraft.maxBullets);
      break;
    case 'shield':
    }
}

export function drawItems() {
  items.forEach((item) => {
    if (item.image.complete) {
      ctx.drawImage(item.image, item.x, item.y, item.width, item.height);
    } else {
      ctx.fillStyle = 'white';
      ctx.fillRect(item.x, item.y, item.width, item.height);
    }
  });
}

let shieldStartTime = 0;
let shieldDuration = 5000; // Shield active time (modifiable)
let fadingOut = false;
let opacity = 0.3; // Initial shield opacity
let time = 0; // For breathing effect

// Function to activate the shield
function activateShield() {
    shieldStartTime = performance.now();
    fadingOut = false;
}

// Function to draw the breathing glow shield
export function drawShield(ctx, player) {
    if (shieldStartTime === 0) return; // Shield is not active

    let elapsed = performance.now() - shieldStartTime;

    if (elapsed < shieldDuration) {
        // Breathing effect using a sine wave
        opacity = 0.3 + Math.abs(Math.sin(time * 0.05)) * 0.5;
        time++;
    } else {
        // Start fading out if the shield time has expired
        fadingOut = true;
        opacity -= 0.01; // Gradually decrease opacity
        if (opacity <= 0) {
            shieldStartTime = 0; // Completely remove shield
            opacity = 0.3; // Reset opacity for next activation
            fadingOut = false;
            return;
        }
    }

    // Draw glowing aura
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(0, 255, 255, 0.8)"; // Cyan glow

    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius + 10, 0, Math.PI * 2); // Slightly larger than player
    ctx.fillStyle = "rgba(0, 255, 255, 0.3)";
    ctx.fill();

    ctx.restore();
}
