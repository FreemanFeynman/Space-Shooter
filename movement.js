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
