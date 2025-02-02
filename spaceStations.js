import { ctx, canvas } from './canvas.js';
import { playSound } from './sounds.js';

export const spaceStations = [];
const collisionDamageEffect = 0;

const spacestationImages = Array.from({ length: 10 }, (_, i) => {
  const img = new Image();
  img.src = `./images/spacestation_${i + 1}.png`;
  return img;
});

export function createSpaceStation() {
  spaceStations.push({
    id: Math.random().toString(36).substring(2),
    x: Math.random() * canvas.width,
    y: -50,
    width: 50,
    height: 50,
    velocity: Math.random() * 2 + 1,
    image: spacestationImages[Math.floor(Math.random() * spacestationImages.length)],
    destroyed: false
  });
}

export function updateSpaceStations(player, bullets) {
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

    let destroyed = false;

    // Check for bullet collision
    bullets = bullets.filter((bullet) => {
      if (
        bullet.x < station.x + station.width &&
        bullet.x + bullet.width > station.x &&
        bullet.y < station.y + station.height &&
        bullet.y + bullet.height > station.y
      ) {
        destroyed = true;
        playSound('explosion');
        return false; // Remove bullet
      }
      return true; // Keep bullet
    });


  });
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
