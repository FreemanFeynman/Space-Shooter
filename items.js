import { ctx, canvas } from './canvas.js';
import { playSound } from './sounds.js';
import { createExplosion } from './explosions.js';
import { isGameEnded, updateGameLogic } from './gameLogic.js';

export const items = [];
const itemSpawnRate = 0.5;

const itemTypes = [
  { type: 'health', image: './images/health.png' },
  { type: 'ammo', image: './images/ammunition.png' },
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

// Call this function when a space station is shot.
export function spawnItem(x, y) {
  if (Math.random() < itemSpawnRate) {
    createItems(x, y);
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
      playSound('pickup');
      items.splice(index, 1);
    }

    // Remove if off-screen.
    if (item.y > canvas.height) {
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
      const ammoAmount = 100;
      spacecraft.currentBullets = Math.min(spacecraft.currentBullets + ammoAmount, spacecraft.maxBullets);
      break;
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
