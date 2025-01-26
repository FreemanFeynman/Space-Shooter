import { ctx } from './environment.js';
import { obstacles } from './obstacles.js';
import { updateScore } from './gameLogic.js';
import { createExplosion } from './explosions.js';
import { playSound } from './sounds.js';

export const spacecraftImage = new Image();
spacecraftImage.src = './images/player.png';
export let bullets = [];

export const spacecraft = {
  x: window.innerWidth / 2,
  y: window.innerHeight - 150,
  width: 125,
  height: 125,
  speed: 10, // Base speed
  velocity: { x: 0, y: 0 }, // Velocity for smooth movement
  acceleration: 1.0, // Acceleration for smooth start
  friction: 0.95, // Friction for gradual stop
  maxSpeed: 15, // Maximum speed
  damage: 5, // Initialize damage
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
  bullets.push({
    x: spacecraft.x,
    y: spacecraft.y - spacecraft.height / 2,
    width: 5,
    height: 10,
    speed: 5,
  });
}

// Update player bullets
export function updateBullets() {
  bullets.forEach((bullet) => {
    bullet.y -= bullet.speed;

    obstacles.forEach((obstacle) => {
      if (
        bullet.x < obstacle.x + obstacle.width &&
        bullet.x + bullet.width > obstacle.x &&
        bullet.y < obstacle.y + obstacle.height &&
        bullet.y + bullet.height > obstacle.y
      ) {
        createExplosion(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
        playSound('explosion'); // Explosion sound
        obstacle.destroyed = true;
        bullet.destroyed = true;

        // Update score based on obstacle type
        if (obstacle.type === 'enemy') {
          updateScore(10);
        } else if (obstacle.type === 'spacestation') {
          updateScore(0);
        }
      }
    });
  });

  bullets = bullets.filter((bullet) => !bullet.destroyed);
}

// Draw bullets
export function drawBullets() {
  bullets.forEach((bullet) => {
    // Gradient effect for bullets
    const gradient = ctx.createLinearGradient(
      bullet.x - bullet.width / 2,
      bullet.y,
      bullet.x + bullet.width / 2,
      bullet.y + bullet.height
    );
    gradient.addColorStop(0, 'yellow');
    gradient.addColorStop(1, 'orange');
    ctx.fillStyle = gradient;

    // Draw the bullet
    ctx.fillRect(bullet.x - bullet.width / 2, bullet.y, bullet.width, bullet.height);

    // Trail effect
    ctx.globalAlpha = 0.5; // Semi-transparent trail
    ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y + bullet.height, bullet.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0; // Reset opacity
  });
}