import { ctx, canvas } from '../core/canvas.js';
import { playSound } from '../utils/sounds.js';
import { spacecraft, fireBullet } from '../entities/player.js';

export const nemesis = [];
let lastMissileFiredTimes = {};

const nemesisImage = new Image();
  nemesisImage.src = `../assets/images/nemesis.png`;
  nemesisImage.onload = () => {console.log('Nemesis image loaded')};
  nemesisImage.onload = () => {
    drawNemesis();
  };

  export function createNemesis() {
    const newNemesis = {
      id: Math.random().toString(36).substring(2), // Unique ID for tracking
      x: Math.random() * canvas.width,
      y: -50,
      width: 40,
      height: 40,
      velocity: Math.random() * 2 + 1,
      image: nemesisImage,
      destroyed: false,
    };
  
    nemesis.push(newNemesis);
  }

export function updateNemesis() {

  nemesis.y += nemesis.velocity;

  const dx = spacecraft.x - nemesis.x;
    const dy = spacecraft.y - nemesis.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 600) {
      nemesis.x += (dx / distance) * 2;
      nemesis.y += (dy / distance) * 2;
    }

  // Check for collision with player
  if (
    nemesis.x < spacecraft.x + spacecraft.width &&
    nemesis.x + nemesis.width > spacecraft.x &&
    nemesis.y < spacecraft.y + spacecraft.height &&
    nemesis.y + nemesis.height > spacecraft.y
  ) {
    // Bounce logic
    const dx = spacecraft.x - (nemesis.x + nemesis.width / 2);
    const dy = spacecraft.y - (nemesis.y + nemesis.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      // Calculate a dynamic bounce factor based on proximity
      const bounceStrength = Math.min(50, 500 / distance);

      // Apply force proportional to the inverse of the distance
      spacecraft.x += (dx / distance) * bounceStrength;
      spacecraft.y += (dy / distance) * bounceStrength;

      // Optional: Add some randomness for a more dynamic feel
      spacecraft.x += Math.random() * 2 - 1;
      spacecraft.y += Math.random() * 2 - 1;
    }

    playSound('collision');
  }

  // Remove nemesis if destroyed
  if (nemesis.destroyed) {
    nemesis = null;
  }
}


// Handle nemesis shooting
function handleNemesisShooting(nemesis) {
  const now = Date.now();
  const lastFired = lastMissileFiredTimes[nemesis.id] || 0;

  if (now - lastFired >= 2000 && nemesis.y > 0 && nemesis.y < canvas.height) {
    fireBullet(nemesis);
    lastMissileFiredTimes[nemesis.id] = now; // Update last fired time
  }
}

// Draw nemesis
export function drawNemesis() {

  // Check if the image has loaded
  if (nemesisImage.complete) {
    ctx.drawImage(nemesisImage, nemesis.x, nemesis.y, nemesis.width, nemesis.height);
  } else {
    ctx.fillStyle = 'red'; // Fallback in case the image isn't loaded yet
    ctx.fillRect(nemesis.x, nemesis.y, nemesis.width, nemesis.height);
  }
}

export const nemesisMovements = {
    linear(nemesis, speed, direction) {
      nemesis.x += direction.x * speed;
      nemesis.y += direction.y * speed;
    },
  
    zigZag(nemesis, time, amplitude, speed) {
      nemesis.x += Math.sin(time) * amplitude;
      nemesis.y += speed;
    },
  
    followPlayer(nemesis, spacecraft, speed) {
      const dx = spacecraft.x - nemesis.x;
      const dy = spacecraft.y - nemesis.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 0) {
        nemesis.x += (dx / distance) * speed;
        nemesis.y += (dy / distance) * speed;
      }
    },
  
    random(nemesis, rangeX, rangeY, speed) {
      if (!nemesis.target) {
        nemesis.target = {
          x: nemesis.x + (Math.random() - 0.5) * rangeX,
          y: nemesis.y + (Math.random() - 0.5) * rangeY,
        };
      }
      const dx = nemesis.target.x - nemesis.x;
      const dy = nemesis.target.y - nemesis.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < speed) {
        nemesis.target = null;
      } else {
        nemesis.x += (dx / distance) * speed;
        nemesis.y += (dy / distance) * speed;
      }
    },
  
    formation(nemesis, leader, offsetX, offsetY) {
      nemesis.x = leader.x + offsetX;
      nemesis.y = leader.y + offsetY;
    },
  
    path(nemesis, waypoints, speed) {
      if (!nemesis.currentWaypoint) nemesis.currentWaypoint = 0;
      const target = waypoints[nemesis.currentWaypoint];
      const dx = target.x - nemesis.x;
      const dy = target.y - nemesis.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < speed) {
        nemesis.currentWaypoint = (nemesis.currentWaypoint + 1) % waypoints.length;
      } else {
        nemesis.x += (dx / distance) * speed;
        nemesis.y += (dy / distance) * speed;
      }
    },
  
    orbit(nemesis, centerX, centerY, radius, angle) {
      nemesis.x = centerX + Math.cos(angle) * radius;
      nemesis.y = centerY + Math.sin(angle) * radius;
    },
  };
