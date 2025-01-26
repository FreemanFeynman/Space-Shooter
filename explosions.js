import { ctx } from './environment.js';

export let explosions = [];

export function createExplosion(x, y) {
  explosions.push({
    x,
    y,
    radius: 0,
    maxRadius: 200,
    alpha: 1, // Opacity for fade-out effect
    finished: false,
    particles: createParticles(x, y), // Add particles for extra effect
  });
}

function createParticles(x, y) {
  const particles = [];
  const particleCount = 20; // Number of particles per explosion
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2; // Random direction
    const speed = Math.random() * 2 + 1; // Random speed
    particles.push({
      x,
      y,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      life: Math.random() * 30 + 20, // Random lifespan
      alpha: 1, // Start fully visible
    });
  }
  return particles;
}

export function updateExplosions() {
  explosions.forEach((explosion) => {
    if (explosion.radius < explosion.maxRadius) {
      explosion.radius += 2; // Expand radius gradually
      explosion.alpha -= 0.03; // Gradually reduce opacity
    } else {
      explosion.finished = true;
    }

    // Update particles
    explosion.particles.forEach((particle) => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.life -= 1; // Reduce life
      particle.alpha = Math.max(0, particle.life / 50); // Fade out
    });

    // Remove dead particles
    explosion.particles = explosion.particles.filter((particle) => particle.life > 0);
  });

  // Remove finished explosions
  explosions = explosions.filter((explosion) => !explosion.finished);
}

export function drawExplosions() {
  explosions.forEach((explosion) => {
    // Draw the explosion itself
    const gradient = ctx.createRadialGradient(
      explosion.x,
      explosion.y,
      explosion.radius * 0.3,
      explosion.x,
      explosion.y,
      explosion.radius
    );
    gradient.addColorStop(0, `rgba(255, 165, 0, ${explosion.alpha})`); // Inner orange
    gradient.addColorStop(1, `rgba(255, 0, 0, 0)`); // Outer transparent red

    ctx.beginPath();
    ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw particles
    explosion.particles.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 0, ${particle.alpha})`; // Yellowish particles
      ctx.fill();
    });
  });
}
