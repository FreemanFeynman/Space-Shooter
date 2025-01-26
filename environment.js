export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

export function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

let stars = [];
let backgroundSpeed = 2; // Initialize speed multiplier

export function initializeStars() {
  // Populate stars array
  stars = Array.from({ length: 75 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 0.5 + 0.5,
  }));
  console.log("Stars initialized:", stars);
}

export function updateStars() {
  stars.forEach((star) => {
    star.y += star.speed * backgroundSpeed; // Apply speed multiplier
    if (star.y > canvas.height) {
      star.y = 0; // Reset star to the top
      star.x = Math.random() * canvas.width;
    }
  });

  // Gradually increase the background speed
  backgroundSpeed += 0.001; // Adjust increment for desired intensity
}

function drawBackground() {
  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width
  );
  gradient.addColorStop(0, "black");
  gradient.addColorStop(0.5, "darkblue");
  gradient.addColorStop(1, "purple");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let shootingStars = [];

export function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing

  stars.forEach((star) => {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });

  shootingStars.forEach((star, index) => {
    ctx.strokeStyle = "purple";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(star.x, star.y);
    ctx.lineTo(star.x - star.trailX, star.y - star.trailY);
    ctx.stroke();

    star.x += star.speedX;
    star.y += star.speedY;
    star.trailX *= 0.95; // Reduce trail length
    star.trailY *= 0.95;

    if (star.trailX < 1 || star.trailY < 1) {
      shootingStars.splice(index, 1); // Remove when trail is too small
    }
  });
}

// Add new shooting stars periodically
setInterval(() => {
  shootingStars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height / 2, // Start from the top half
    speedX: Math.random() * 3 + 2,
    speedY: Math.random() * 2 + 1,
    trailX: Math.random() * 50 + 50,
    trailY: Math.random() * 50 + 50,
  });
}, 10000);

export function showGameOverScreen(score) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Game Over Text
  ctx.fillStyle = "yellow";
  ctx.font = "48px Verdana";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 50);
  ctx.font = "24px Verdana";
  ctx.fillText(`Final Score: ${Math.floor(score)}`, canvas.width / 2, canvas.height / 2);

  // Draw Try Again Button
  const buttonX = canvas.width / 2 - 75;
  const buttonY = canvas.height / 2 + 50;
  const buttonWidth = 150;
  const buttonHeight = 50;

  ctx.fillStyle = "black";
  ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

  ctx.fillStyle = "yellow";
  ctx.font = "20px Verdana";
  ctx.fillText("Try Again", canvas.width / 2, canvas.height / 2 + 80);

  canvas.addEventListener("click", function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (
      mouseX > buttonX &&
      mouseX < buttonX + buttonWidth &&
      mouseY > buttonY &&
      mouseY < buttonY + buttonHeight
    ) {
      canvas.removeEventListener("click", handleClick);
      restartGame();
    }
  });
}

function restartGame() {
  // Reload the page to restart the game
  window.location.reload();
}

// Ensure setupCanvas and initializeStars are called in sequence
setupCanvas();
initializeStars();
