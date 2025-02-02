import { ctx, canvas } from './canvas.js';
import { playSound } from './sounds.js';

export const items = [];

const itemTypes = [
  { type: 'health', image: './images/health.png' },
  { type: 'shield', image: './images/shield.png' },
  { type: 'weapon', image: './images/weapon.png' },
];

// Configurable spawn rate: 0.3 means a 30% chance to spawn an item.
export let itemSpawnRate = 1.0;

export function createItems(x, y) {
  const randomItem = itemTypes[Math.floor(Math.random() * itemTypes.length)];
  items.push({
    id: Math.random().toString(36).substring(2),
    x,
    y,
    width: 60,
    height: 60,
    velocity: 2,
    type: randomItem.type,
    image: new Image(),
  });
  items[items.length - 1].image.src = randomItem.image;
}

// Call this function when a space station is shot.
export function spawnItem(x, y) {
  if (Math.random() < itemSpawnRate) {
    createItems(x, y);
  }
}

export function updateItems(player) {
  items.forEach((item, index) => {
    item.y += item.velocity;

    // Check collision with player.
    if (
      item.x < player.x + player.width &&
      item.x + item.width > player.x &&
      item.y < player.y + player.height &&
      item.y + item.height > player.y
    ) {
      applyItemEffect(item.type, player);
      playSound('pickup');
      items.splice(index, 1);
    }

    // Remove if off-screen.
    if (item.y > canvas.height) {
      items.splice(index, 1);
    }
  });
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

function applyItemEffect(type, player) {
  if (type === 'health') {
    player.health = Math.min(player.health + 20, 100); // Heal player.
  } else if (type === 'shield') {
    player.shield = Math.min(player.shield + 15, 100); // Increase shield.
  } else if (type === 'weapon') {
    player.weaponPower += 1; // Upgrade weapon.
  }
}
