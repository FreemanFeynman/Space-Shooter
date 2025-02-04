import { ctx } from './canvas.js';
import { enemies } from './enemies.js';
import { updateScore } from './gameLogic.js';
import { createExplosion } from './explosions.js';
import { playSound } from './sounds.js';

export const spacecraftImage = new Image();
spacecraftImage.src = './images/player.png';
export let bullets = [];

export const spacecraft = {
  x: window.innerWidth / 2,
  y: window.innerHeight - 150,
  width: 100,
  height: 100,
  speed: 10,
  velocity: { x: 0, y: 0 },
  acceleration: 1.0,
  friction: 0.95,
  maxSpeed: 15,
  health: 100,
  maxBullets: 250,
  currentBullets: 50,
  draw() {
    if (spacecraftImage.complete) {
      ctx.drawImage(
        spacecraftImage,
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    } else {
      ctx.fillStyle = 'red';
      ctx.fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    }
  },
  update() {
    // Apply velocity to position
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Apply friction
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;

    // Boundary checks
    this.x = Math.max(this.width / 2, Math.min(window.innerWidth - this.width / 2, this.x));
    this.y = Math.max(this.height / 2, Math.min(window.innerHeight - this.height / 2, this.y));
  },
};

export const keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false };

window.addEventListener('keydown', (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
  }
});

window.addEventListener('keyup', (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
});

export function handlePlayerInput() {
  // Horizontal movement
  if (keys.ArrowLeft) {
    spacecraft.velocity.x = Math.max(
      spacecraft.velocity.x - spacecraft.acceleration,
      -spacecraft.maxSpeed
    );
  }
  if (keys.ArrowRight) {
    spacecraft.velocity.x = Math.min(
      spacecraft.velocity.x + spacecraft.acceleration,
      spacecraft.maxSpeed
    );
  }

  // Vertical movement
  if (keys.ArrowUp) {
    spacecraft.velocity.y = Math.max(
      spacecraft.velocity.y - spacecraft.acceleration,
      -spacecraft.maxSpeed
    );
  }
  if (keys.ArrowDown) {
    spacecraft.velocity.y = Math.min(
      spacecraft.velocity.y + spacecraft.acceleration,
      spacecraft.maxSpeed
    );
  }

  // Update spacecraft position and velocity
  spacecraft.update();
}

export function fireBullet(spacecraft) {
  if (spacecraft.currentBullets > 0) {
    bullets.push({
      x: spacecraft.x,
      y: spacecraft.y - spacecraft.height / 2,
      width: 10,
      height: 10,
      velocity: 10,
      destroyed: false
    });
    spacecraft.currentBullets--; // Decrease the bullet count
    playSound('shoot');
  } else {
    console.log('No bullets left!');
  }
}

export function updateBullets() {
  bullets.forEach((bullet) => {
    bullet.y -= bullet.velocity;
  });

  // Check for collisions with enemies
  bullets.forEach((bullet) => {
    enemies.forEach((enemy) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        // Create explosion and mark the enemy and bullet as destroyed
        createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
        playSound('explosion');
        enemy.destroyed = true;
        bullet.destroyed = true;

        // Update score for destroying an enemy
        updateScore(10);
      }
    });
  });

  // Remove destroyed bullets from the bullets array
  bullets.splice(0, bullets.length, ...bullets.filter((bullet) => !bullet.destroyed));

  // Remove destroyed enemies from the enemies array
  enemies.splice(0, enemies.length, ...enemies.filter((enemy) => !enemy.destroyed));
}

// Draw bullets
export function drawBullets() {
  bullets.forEach((bullet) => {
    if (isFinite(bullet.x) && isFinite(bullet.y)) {
      // Gradient effect for bullets
      const gradient = ctx.createRadialGradient(
        bullet.x,
        bullet.y,
        bullet.width / 4,
        bullet.x,
        bullet.y,
        bullet.width / 2
      );
      gradient.addColorStop(0, 'yellow');
      gradient.addColorStop(1, 'red');
      ctx.fillStyle = gradient;

      // Draw the bullet as a circle with a glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'yellow';
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullet.width / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      // Enhanced trail effect
      ctx.globalAlpha = 0.5; // Semi-transparent trail
      ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y + bullet.height, bullet.width / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0; // Reset opacity
    } else {
      console.error('Invalid bullet coordinates:', bullet);
    }
  });
}