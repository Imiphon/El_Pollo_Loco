//used in character 
const STEP = new Audio('audio/step.mp3');
const HURT = new Audio('audio/char_ay.mp3');
const OH_NO = new Audio('audio/char_ouh.mp3');
const DYING = new Audio('audio/char_oh-no.mp3');
const SNORE = new Audio('audio/char_snore.mp3');

//used in world
const OHOH = new Audio('audio/char_oh-oh.mp3');

//used in bigChick 
const BIGOUPS = new Audio('audio/char_oops.mp3');
const BIGDEATH = new Audio('audio/big_death.mp3');
const APPLAUSE = new Audio('audio/applause2.mp3');
const BIGIMPACT = new Audio('audio/big_Impact.mp3');
const BIGWALK = [
  new Audio('audio/big_cackler.mp3'),
  new Audio('audio/big_step.mp3'),
  new Audio('audio/big_jump.mp3'),
  new Audio('audio/big_landing.mp3')
];

//used in bottle-flies
const BOTTLE_SPLASH = new Audio('audio/bottle_crash.mp3');
const BOTTLE_LANDS = new Audio('audio/bottle_lands.mp3');
const BOTTLE_FLIES = new Audio('audio/bottle_flies.mp3');
const CHARACTER_YEAH = new Audio('audio/char_yeah.mp3');

//used in bottleOnGround/bottleToPepe()
const BOTTLE_PLUS = new Audio('audio/ping.mp3');

//will be used in Chicken
const CACKLER_1 = new Audio('audio/cackler-solo_1.mp3');
const CACKLER_2 = new Audio('audio/cackler-solo_2.mp3');
const CACKLER_3 = new Audio('audio/cackler-solo_3.mp3');
const CACKLER_4 = new Audio('audio/cackler_hit.mp3');
const CACKLER_MIX = [CACKLER_1, CACKLER_2, CACKLER_3];

//will be used in smallChick
const EXPLOSION = new Audio('audio/explosion.mp3');
const SMALLCACKLER = new Audio('audio/cackler_small.mp3');
const PLOPP = new Audio('audio/plopp.mp3');
const BLOBB = new Audio('audio/blobb1.mp3');
const SPLASH = new Audio('audio/chick-splash.mp3');

const NEWHEART = new Audio('audio/new_heart.mp3');


let DESSERTSOUND = new Audio('audio/savanne.mp3');
DESSERTSOUND.loop = true;
SNORE.loop = true;

const allAudio = document.querySelectorAll('mp3');

let isMuted = false;

/**
 * Is playing any sound from the game
 * @param {audio} sound 
 * @param {volume} volume 
 */
function playSound(sound, volume) {
  if (world.isRunning && !isMuted) {
    let currentSound = sound;
    currentSound.play();
    currentSound.volume = volume;
  }
}

/**
 * Stopps the current audio sound
 * @param {audio} sound 
 */
function stopSound(sound) {
  if (sound) {
    sound.pause();
    sound.currentTime = 0;
  } else {
    console.error('Sound not found:', sound);
  }
}

/**
 * Repeats (specialy) the background sound
 * sets volume to 0 if setting is open
 */
function loopBackground() {
  DESSERTSOUND.volume = 0.3;
  if(world.isRunning && !isMuted) {
      DESSERTSOUND.play();
  } else {
    stopSound(DESSERTSOUND);
  }  
} 

/**
 * Repeats (specialy) the background sound
 * sets volume to 0 if setting is open
 */
function loopSnoring() {
  DESSERTSOUND.volume = 0.3;
  if(world.isRunning && !isMuted) {
    SNORE.play();
  } else {
    stopSound(SNORE);
  }  
} 