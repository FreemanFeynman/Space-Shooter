import { ctx, canvas } from '../core/canvas.js';
import { playSound } from '../utils/sounds.js';
import { spawnItem } from '../entities/items.js';
import { bullets } from '../entities/player.js';
import { createExplosion } from '../entities/explosions.js';


export const spaceStations = [];
const collisionDamageEffect = 0;

const spacestationImages = Array.from({ length: 10 }, (_, i) => {
  const img = new Image();
  img.src = `../assets/images/spacestation_${i + 1}.png`;
  return img;
});

export function createSpaceStation() {
  spaceStations.push({
    id: Math.random().toString(36).substring(2),
    x: Math.random() * canvas.width,
    y: -50,
    width: 150,
    height: 150,
    velocity: Math.random() * 2 + 1,
    image: spacestationImages[Math.floor(Math.random() * spacestationImages.length)],
    destroyed: false,
    hitCount: 2 // Initialize with 2 hits required
  });
}

export function updateSpaceStations(player) {
  spaceStations.forEach((station) => {
    station.y += station.velocity;

    // Collision with player (Bouncing effect)
    if (
      station.x < player.x + player.width &&
      station.x + station.width > player.x &&
      station.y < player.y + player.height &&
      station.y + station.height > player.y
    ) {
      const dx = player.x - (station.x + station.width / 2);
      const dy = player.y - (station.y + station.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const bounceStrength = Math.min(50, 500 / distance);
        player.x += (dx / distance) * bounceStrength;
        player.y += (dy / distance) * bounceStrength;
        player.x += Math.random() * 2 - 1;
        player.y += Math.random() * 2 - 1;
      }

      if (collisionDamageEffect > 0) player.damage -= collisionDamageEffect;

      playSound('collision');
    }

    // Collision with bullets
    for (let j = bullets.length - 1; j >= 0; j--) {
      let bullet = bullets[j];
      if (
        bullet.x < station.x + station.width &&
        bullet.x + bullet.width > station.x &&
        bullet.y < station.y + station.height &&
        bullet.y + bullet.height > station.y
      ) {
        bullets.splice(j, 1); // Remove bullet
        station.hitCount += 1; // Increment hit count
        console.log(`Space station hit!: ${station.hitCount}`);
        createExplosion(station.x + station.width / 2, station.y + station.height / 2);
        playSound('explosion');
        if (station.hitCount <= 0) {
          station.destroyed = false; // Mark as destroyed if hit count is zero
          spawnItem(station.x, station.y); // Spawn item when space station is destroyed
        }
        break; // Exit inner loop since bullet is processed
      }
    }

    // Remove if off-screen
    if (station.y > canvas.height) station.destroyed = true;
  });

  // Remove destroyed space stations
  spaceStations.splice(0, spaceStations.length, ...spaceStations.filter((s) => !s.destroyed));
}

export function drawSpaceStations() {
  spaceStations.forEach((station) => {
    if (station.image.complete) {
      ctx.drawImage(station.image, station.x, station.y, station.width, station.height);
    } else {
      ctx.fillStyle = 'blue';
      ctx.fillRect(station.x, station.y, station.width, station.height);
    }
  });
}