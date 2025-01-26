const sounds = {
  shoot: new Audio('./sounds/shoot.mp3'),
  explosion: new Audio('./sounds/explosion.mp3'),
  item: new Audio('./sounds/item.mp3'),
  background: new Audio('./sounds/background.mp3'),
  //collision: new Audio('./collision/item.mp3'),
};

// Enable looping for background music
sounds.background.loop = true;

// Preload sounds on user interaction
let soundsPreloaded = false;

function preloadSounds() {
  if (!soundsPreloaded) {
    Object.entries(sounds).forEach(([key, sound]) => {
      sound.play()
        .then(() => {
          sound.pause();
          sound.currentTime = 0;
          console.log(`Sound "${key}" preloaded successfully.`);
        })
        .catch(() => {
          console.warn(`Sound "${key}" preload failed. Browser may restrict autoplay.`);
        });
    });
    soundsPreloaded = true;
  }
}

document.addEventListener('click', preloadSounds);

// Play a sound by type
export function playSound(type) {
  const sound = sounds[type];
  if (sound) {
    try {
      sound.currentTime = 0;
      sound.play().catch((err) => console.warn(`Sound "${type}" playback blocked:`, err));
    } catch (error) {
      console.error(`Error playing sound "${type}":`, error);
    }
  } else {
    console.error(`Sound "${type}" not found.`);
  }
}
