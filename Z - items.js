import { ctx, canvas } from './environment.js';

export const items = [];
const itemImages = Array.from({ length: 10 }, (_, i) => {
  const img = new Image();
  img.src = `./images/item_${i + 1}.png`;
  img.onload = () => console.log(`item image ${img.src} loaded.`);
  img.onerror = () => console.error(`Failed to load item image: ${img.src}`);
  return img;
});

export function createItem() {
  const types = ['health', 'shield', 'weapon'];
  const type = types[Math.floor(Math.random() * types.length)];

  items.push({
    x: Math.random() * canvas.width,
    y: -50,
    width: 30,
    height: 30,
    type,
    velocity: 2,
  });
}

export function updateItems(player) {
  items.forEach((item) => {
    item.y += item.velocity;

    // Check for collision with the player
    if (
      item.x < player.x + player.width &&
      item.x + item.width > player.x &&
      item.y < player.y + player.height &&
      item.y + item.height > player.y
    ) {
      handleItemCollection(item.type);
      item.collected = true;
    }

    // Remove items that fall off-screen
    if (item.y > canvas.height) {
      item.destroyed = true;
    }
  });

  // Filter out collected or destroyed items
  items = items.filter((item) => !item.collected && !item.destroyed);
}

function handleItemCollection(type) {
  if (type === 'health') {
    player.health++;
  } else if (type === 'score') {
    player.score += 50;
  } else if (type === 'shield') {
    player.shieldActive = true;
    setTimeout(() => (player.shieldActive = false), 10000); // Shield lasts 10 seconds
  } else if (type === 'weapon') {
    player.weaponLevel++;
  }
}

export function drawItems() {
  items.forEach((item) => {
    ctx.fillStyle = item.type === 'health' ? 'green' :
                    item.type === 'score' ? 'yellow' :
                    item.type === 'shield' ? 'blue' :
                    'red'; // Weapon
    ctx.fillRect(item.x, item.y, item.width, item.height);
  });
}

//=================================================================

// items.js
const items = [
    { id: 1, name: "Health Potion", effect: "heal", value: 20 },
    { id: 2, name: "Speed Boost", effect: "speed", value: 10 },
    { id: 3, name: "Shield", effect: "shield", value: 15 },
];

// Function to randomly select an item
function getRandomItem() {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}

// Function to generate an item when an obstacle is hit
function generateItemFromObstacle(obstacleId) {
    // Associate items with obstacles (basic logic)
    console.log(`Obstacle ${obstacleId} destroyed! Generating an item...`);
    return getRandomItem();
}

module.exports = {
    getRandomItem,
    generateItemFromObstacle,
};
