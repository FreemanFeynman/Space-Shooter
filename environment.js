import { ctx, canvas, setupCanvas } from './canvas.js';
import { playSound } from './sounds.js';

let stars = [];
let shootingStars = [];
let backgroundSpeed = 2; // Initialize speed multiplier
let startImage = new Image();
startImage.src = './images/startscreen.png';

const starColors = ['white', 'lightblue', 'yellow', 'lightpurple'];

export function initializeStars() {
  // Populate stars array
  stars = Array.from({ length: 75 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 0.5 + 0.5,
    opacity: Math.random(),
    color: starColors[Math.floor(Math.random() * starColors.length)],
    twinkleSpeed: Math.random() * 0.02 + 0.01,
  }));
  console.log("Stars initialized:", stars);
}

export function updateStars() {
  stars.forEach((star) => {
    star.y += star.speed * backgroundSpeed; // Apply speed multiplier
    star.opacity += star.twinkleSpeed; // Update opacity for twinkling effect
    if (star.opacity > 1 || star.opacity < 0) {
      star.twinkleSpeed *= -1; // Reverse twinkle direction
    }
    if (star.y > canvas.height) {
      star.y = 0; // Reset star to the top
      star.x = Math.random() * canvas.width;
    }
  });

  // Gradually increase the background speed
  backgroundSpeed += 0.001;

  // Update shooting stars
  updateShootingStars();
}

function updateShootingStars() {
  shootingStars.forEach((star, index) => {
    star.x += star.speedX;
    star.y += star.speedY;
    if (star.x > canvas.width || star.y > canvas.height) {
      shootingStars.splice(index, 1); // Remove shooting star if it goes off-screen
    }
  });

  // Randomly add new shooting stars
  if (Math.random() < 0.01) {
    shootingStars.push({
      x: Math.random() * canvas.width,
      y: 0,
      speedX: Math.random() * 2 + 2,
      speedY: Math.random() * 2 + 2,
      length: Math.random() * 80 + 20,
      opacity: Math.random() * 0.5 + 0.5,
    });
  }
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

export function drawStars() {
  stars.forEach((star) => {
    ctx.globalAlpha = star.opacity; // Set opacity for twinkling effect
    ctx.fillStyle = star.color;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1; // Reset opacity

  // Draw shooting stars
  shootingStars.forEach((star) => {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(star.x, star.y);
    ctx.lineTo(star.x - star.length, star.y - star.length);
    ctx.stroke();
  });
}

export function showStartScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const startImage = new Image();
  startImage.src = './images/startscreen.png';
  startImage.onload = () => {
    ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);
    ctx.font = '30px Verdana';
    ctx.fillStyle = 'yellow';
    ctx.textAlign = 'center';
    ctx.fillText('Press SPACE to Start', canvas.width / 2, canvas.height - 50);
    playSound('background');
  };
}

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