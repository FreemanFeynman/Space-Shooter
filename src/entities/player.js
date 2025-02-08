import { ctx } from '../core/canvas.js';
import { enemies } from '../entities/enemies.js';
import { spaceStations } from '../entities/spaceStations.js';
import { createExplosion } from '../entities/explosions.js';
import { playSound } from '../utils/sounds.js';
import { spawnItem } from '../entities/items.js';

export const spacecraftImage = new Image();
spacecraftImage.src = '../assets/images/player.png';
export let bullets = [];
export let enemyBulletCount = 0;
export let enemyCollisionCount = 0;

export const spacecraft = {
  x: window.innerWidth / 2,
  y: window.innerHeight - 150,
  width: 100,
  height: 100,
  speed: 10,
  velocity: { x: 0, y: 0 },
  acceleration: 1.1,
  friction: 0.95,
  maxSpeed: 25,
  health: 100,
  maxBullets: 250,
  currentBullets: 20,
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

  // Check for hit with enemies
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
        enemyBulletCount++;
        console.log(`Enemies destroyed by bullets: ${enemyBulletCount}`);
      }
    });
  });

  // Check for collisions with space stations
  bullets.forEach((bullet) => {
    spaceStations.forEach((station) => {
      if (
        bullet.x < station.x + station.width &&
        bullet.x + bullet.width > station.x &&
        bullet.y < station.y + station.height &&
        bullet.y + bullet.height > station.y
      ) {
        // Create explosion and mark the bullet as destroyed
        createExplosion(station.x + station.width / 2, station.y + station.height / 2);
        playSound('explosion');
        bullet.destroyed = true;

        // Spawn item at the space station's location
        spawnItem(station.x + station.width / 2, station.y + station.height / 2);
      }
    });
  });

  bullets.splice(0, bullets.length, ...bullets.filter((bullet) => !bullet.destroyed));
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