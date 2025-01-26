import { canvas } from './environment.js';
import { createExplosion } from './explosions.js';
import { playSound } from './sounds.js'; // Import playSound function
import { fireMissile } from './projectiles.js'; // Import missile creation from projectiles.js
import { spacecraft } from './player.js';

export const nemesis = [];

const nemesisImages = Array.from({ length: 10 }, (_, i) => {
  const img = new Image();
  img.src = `./images/nemesis_${i + 1}.png`;
  img.onload = () => console.log(`nemesis image ${img.src} loaded.`);
  img.onerror = () => console.error(`Failed to load nemesis image: ${img.src}`);
  return img;
});

export function createNemesis() {
  const nemesis = Math.random() < 0.5;

  nemesis.push({
    id: Math.random().toString(36).substring(2), // Unique ID for tracking
    x: Math.random() * canvas.width,
    y: -50,
    width: 40,
    height: 40,
    velocity: Math.random() * 2 + 1,
    image: nemesisImages,
    destroyed: false,
  });
}


// Update nemesis
export function updateNemesis() {
  nemesis.forEach((nemesis) => {
    nemesis.y += nemesis.velocity;

    if (nemesis.type === 'enemy') {
      handleNemesisShooting(nemesis);
    }

    // Check for collision with player
    if (
      nemesis.x < spacecraft.x + spacecraft.width &&
      nemesis.x + nemesis.width > spacecraft.x &&
      nemesis.y < spacecraft.y + spacecraft.height &&
      nemesis.y + nemesis.height > spacecraft.y
    ) {
      if (nemesis.type === 'nemesis') {
        // Bounce logic
        const dx = spacecraft.x - (nemesis.x + nemesis.width / 2);
        const dy = spacecraft.y - (nemesis.y + nemesis.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        if (distance > 0) {
            // Calculate a dynamic bounce factor based on proximity
            const bounceStrength = Math.min(50, 500 / distance); // Adjust max strength (50) and scaling (500)
    
            // Apply force proportional to the inverse of the distance
            spacecraft.x += (dx / distance) * bounceStrength;
            spacecraft.y += (dy / distance) * bounceStrength;
    
            // Optional: Add some randomness for a more dynamic feel
            spacecraft.x += Math.random() * 2 - 1; // Small random adjustment
            spacecraft.y += Math.random() * 2 - 1;
        }
      
        // Deduct damage if variable is greater than 0
        if (collisiondamageEffect > 0) {
          spacecraft.damage -= collisiondamageEffect;
        }

        playSound('collision');
      } else if (nemesis.type === 'enemy') {
        createExplosion(spacecraft.x, spacecraft.y);
        playSound('explosion');
        spacecraft.damage--;
        nemesis.destroyed = true;
      }
    }

    // Remove off-screen nemesis
    if (nemesis.y > canvas.height) {
      nemesis.destroyed = true;
    }
  });

  // Filter out destroyed nemesis (enemies only)
  nemesis.splice(0, nemesis.length, ...nemesis.filter((nemesis) => !(nemesis.destroyed && nemesis.type === 'enemy')));
}



// Handle nemesis shooting
function handleNemesisShooting(nemesis) {
  const now = Date.now();
  const lastFired = lastMissileFiredTimes[nemesis.id] || 0;

  if (now - lastFired >= 2000 && nemesis.y > 0 && nemesis.y < canvas.height) {
    fireMissile(nemesis);
    lastMissileFiredTimes[nemesis.id] = now; // Update last fired time
  }
}

// Draw nemesiss
export function drawNemesis() {
  nemesiss.forEach((nemesis) => {
    if (nemesis.image.complete && nemesis.image.naturalWidth > 0) {
      ctx.drawImage(nemesis.image, nemesis.x, nemesis.y, nemesis.width, nemesis.height);
    } else {
      ctx.fillStyle = nemesis.type === 'spacestation' ? 'blue' : 'red';
      ctx.fillRect(nemesis.x, nemesis.y, nemesis.width, nemesis.height);
    }
  });
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
  
    followPlayer(nemesis, player, speed) {
      const dx = player.x - nemesis.x;
      const dy = player.y - nemesis.y;
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
