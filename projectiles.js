import { ctx } from './canvas.js';
import { createExplosion } from './explosions.js';
import { playSound } from './sounds.js';

export let enemyMissiles = [];

export function fireMissile(enemy) {
  enemyMissiles.push({
    id: Math.random().toString(36).substring(2),
    x: enemy.x + enemy.width / 2,
    y: enemy.y + enemy.height,
    width: 10,
    height: 30,
    speed: 5,
    velocityX: 0,
    velocityY: 0,
    firedAt: Date.now(),
    destroyed: false,
    image: new Image(),
  });
}

// Update enemy missiles
export function updateMissiles(spacecraft) {
  enemyMissiles.forEach((missile) => {
    // Calculate the direction to the player
    const dx = spacecraft.x - missile.x;
    const dy = spacecraft.y - missile.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) { // Ensure we don't divide by zero
      // Normalize direction and calculate velocity
      missile.velocityX = (dx / distance) * missile.speed;
      missile.velocityY = (dy / distance) * missile.speed;

      // Update missile position
      missile.x += missile.velocityX;
      missile.y += missile.velocityY;
    }

    // Check missile lifetime (explode after 4 seconds)
    if (Date.now() - missile.firedAt >= 4000) {
      createExplosion(missile.x, missile.y);
      playSound('explosion'); // Play explosion sound
      missile.destroyed = true;
    }

    // Check collision with the player
    if (
      missile.x < spacecraft.x + spacecraft.width &&
      missile.x + missile.width > spacecraft.x &&
      missile.y < spacecraft.y + spacecraft.height &&
      missile.y + missile.height > spacecraft.y
    ) {
      createExplosion(spacecraft.x, spacecraft.y);
      playSound('explosion'); // Play explosion sound on collision
      spacecraft.health -=10;
      missile.destroyed = true;
    }
  });

  // Filter out destroyed missiles
  enemyMissiles = enemyMissiles.filter((missile) => !missile.destroyed);
}

// Draw projectiles (both bullets and missiles)
export function drawMissiles() {
  enemyMissiles.forEach((missile) => {
    // Gradient effect for missiles
    const gradient = ctx.createLinearGradient(
      missile.x,
      missile.y,
      missile.x + missile.width,
      missile.y + missile.height
    );
    gradient.addColorStop(0, 'purple');
    gradient.addColorStop(1, 'red');
    ctx.fillStyle = gradient;

 // Draw the missile with a glow effect
 ctx.shadowBlur = 10;
 ctx.shadowColor = 'red';
 ctx.beginPath();
 ctx.moveTo(missile.x, missile.y);
 ctx.lineTo(missile.x - missile.width / 2, missile.y + missile.height);
 ctx.lineTo(missile.x + missile.width / 2, missile.y + missile.height);
 ctx.closePath();
 ctx.fill();
 ctx.shadowBlur = 0; // Reset shadow

 // Enhanced trail effect
 ctx.globalAlpha = 0.5; // Semi-transparent trail
 ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
 ctx.beginPath();
 ctx.arc(missile.x, missile.y + missile.height, missile.width / 2, 0, Math.PI * 2);
 ctx.fill();
 ctx.globalAlpha = 1.0; // Reset opacity
});
}
