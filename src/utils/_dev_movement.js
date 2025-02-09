export const enemyMovements = {
  linear(enemy, speed, direction) {
    enemy.x += direction.x * speed;
    enemy.y += direction.y * speed;
  },

  zigZag(enemy, time, amplitude, speed) {
    enemy.x += Math.sin(time) * amplitude;
    enemy.y += speed;
  },

  followPlayer(enemy, player, speed) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0) {
      enemy.x += (dx / distance) * speed;
      enemy.y += (dy / distance) * speed;
    }
  },

  random(enemy, rangeX, rangeY, speed) {
    if (!enemy.target) {
      enemy.target = {
        x: enemy.x + (Math.random() - 0.5) * rangeX,
        y: enemy.y + (Math.random() - 0.5) * rangeY,
      };
    }
    const dx = enemy.target.x - enemy.x;
    const dy = enemy.target.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < speed) {
      enemy.target = null;
    } else {
      enemy.x += (dx / distance) * speed;
      enemy.y += (dy / distance) * speed;
    }
  },

  formation(enemy, leader, offsetX, offsetY) {
    enemy.x = leader.x + offsetX;
    enemy.y = leader.y + offsetY;
  },

  path(enemy, waypoints, speed) {
    if (!enemy.currentWaypoint) enemy.currentWaypoint = 0;
    const target = waypoints[enemy.currentWaypoint];
    const dx = target.x - enemy.x;
    const dy = target.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < speed) {
      enemy.currentWaypoint = (enemy.currentWaypoint + 1) % waypoints.length;
    } else {
      enemy.x += (dx / distance) * speed;
      enemy.y += (dy / distance) * speed;
    }
  },

  orbit(enemy, centerX, centerY, radius, angle) {
    enemy.x = centerX + Math.cos(angle) * radius;
    enemy.y = centerY + Math.sin(angle) * radius;
  },
};

/**
 * Assigns a sequence of movements to a enemy.
 */
export function assignMovementSequence(enemy, sequence) {
  enemy.movementSequence = sequence;
  enemy.currentMovementIndex = 0;
  enemy.movementStartTime = Date.now(); // Track start time for time-based movements
}

/**
 * Updates the enemy movement sequence.
 */
export function updateEnemyMovement(enemy, player) {
  if (!enemy.movementSequence || enemy.movementSequence.length === 0) return;

  const movement = enemy.movementSequence[enemy.currentMovementIndex];
  if (!movement) return;

  const { type, duration, ...params } = movement;

  // Execute movement function based on type
  if (type in enemyMovements) {
    enemyMovements[type](enemy, player, ...Object.values(params));
  }

  // Check if the movement should transition to the next one
  if (duration && Date.now() - enemy.movementStartTime >= duration) {
    enemy.currentMovementIndex = (enemy.currentMovementIndex + 1) % enemy.movementSequence.length;
    enemy.movementStartTime = Date.now(); // Reset the timer for the new movement
  }
}


// Assign a Sequence of Movements
assignMovementSequence(enemy, [
  { type: 'linear', speed: 2, direction: { x: 1, y: 0 }, duration: 3000 }, 
  { type: 'zigZag', time: 0, amplitude: 30, speed: 1, duration: 5000 },
  { type: 'followPlayer', speed: 2, duration: 4000 },
]);


// gameloop

enemies.forEach((enemy) => {
  updateEnemyMovement(enemy, spacecraft); // Update movement
});