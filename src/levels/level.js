import { createEnemy } from "./enemies.js";
import { createSpaceStation } from "./spaceStations.js";
import { getScore } from "./gameLogic.js";
import { playSound } from "./sounds.js";

export let currentLevel = 1;
let enemiesPerLevel = 5;
let spaceStationsPerLevel = 2;
let levelActive = false;
let enemySpawnRate = 4000; // Time in ms between enemy spawns
let stationSpawnRate = 8000; // Time in ms between space station spawns

// Start a new level
export function startLevel(level) {
    currentLevel = level;
    levelActive = true;
    console.log(`Starting Level ${currentLevel}`);

    // Adjust difficulty per level
    enemiesPerLevel += 2;
    spaceStationsPerLevel += 1;
    enemySpawnRate = Math.max(1000, enemySpawnRate - 500); // Faster spawns
    stationSpawnRate = Math.max(4000, stationSpawnRate - 500);

    // Play level start sound
    playSound("level-start");

    // Begin spawning enemies and space stations
    for (let i = 0; i < enemiesPerLevel; i++) {
        setTimeout(createEnemy, i * enemySpawnRate);
    }
    for (let j = 0; j < spaceStationsPerLevel; j++) {
        setTimeout(createSpaceStation, j * stationSpawnRate);
    }
}

// Check if level is complete
export function checkLevelProgress() {
    const score = getScore();
    const targetScore = currentLevel * 1000; // Example: Level 1 requires 1000 points, Level 2 requires 2000, etc.

    if (score >= targetScore) {
        levelActive = false;
        setTimeout(() => startLevel(currentLevel + 1), 3000); // Delay before next level
    }
}
