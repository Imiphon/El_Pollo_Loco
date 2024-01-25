let canvas;
let world;
let keys = new Keys();
let setting;

const overlay = document.getElementById("overlay");
const resumeButton = document.getElementById("resumeButton");
const restartButton = document.getElementById("restartButton");
let fromSetting = false;
let betterTurn = false;

window.addEventListener('resize', checkSize);

function checkSize() {
    const maxWidth = 1024;
    if (window.innerWidth <= maxWidth) {
        betterTurn = true;
        openOverlay();
    }
}

/**
 * opens the overlay for some different text
 */
function openOverlay() {
    document.getElementById('helpOverlay').style.display = 'flex';
    if (betterTurn) {
        showHintToTurn();
    }
    if (fromSetting) {
        showSetupExplanation()
    }
    if (!betterTurn && !fromSetting) {
        showExplanation();
    }
}

/**
 * Shows the gameplay and right keys on start site
 */
function showExplanation() {
    let overlayText = document.getElementById('textContainer');
    overlayText.innerHTML = `
    <u>Pollo Loco Gamplay</u><br><br>
    The goal of the game is to knock down all the chickens. First with Tabasco bottles.<br>
    If you have fewer than 2 bottles with you, you will find new bottles throughout the game.<br>
    For a 'normal' dead chicken you get a heart to recharge your energy. But be careful! 
    The number of hearts is limited, so use them sparingly. <br>
    Little chicks you can also knock down with a good jump on it.<br>
    For every dead chicken you geta coin. After the last chicken you can check your playing time.
    <br>
    <u>Keys to use:</u><br>
    move right: <img src="img/arrow-right.png"><br>
    move left: <img src="img/arrow-left.png"><br>
    jump: <img src="img/arrow-up.png"><br>
    throw a bottle: space or <img src="img/throw.png"><br>
    <br>Click anywhere to close.<br>
    `;
}

/**
 * Shows the gameplay and right keys in canvas setting
 */
function showSetupExplanation() {
    let overlayText = document.getElementById('textContainer');
    overlayText.innerHTML = `
     <u>Pollo Loco Gamplay</u><br><br>
     The goal of the game is to knock down all the chickens. First with Tabasco bottles.<br>
     If you have fewer than 2 bottles with you, you will find new bottles throughout the game.<br>
     For a 'normal' dead chicken you get a heart to recharge your energy. But be careful! 
     The number of hearts is limited, so use them sparingly. <br>
     Little chicks you can also knock down with a good jump on it.<br>
     For every dead chicken you geta coin. After the last chicken you can check your playing time.
     <br>
     `;
}

/**
 * Shows the hint if window.innerwidth is to small.
 */
function showHintToTurn() {
    let overlayText = document.getElementById('textContainer');
    overlayText.innerHTML = `
    <div class="turn-text">
    <br>
    Maybe you'll have more fun if you turn your device!<br><br>
    <img src="img/turn.png" id="turnImg">
    <br>Click anywhere to close.<br>
    <div>
    `;
}

function closeOverlay() {
    document.getElementById('helpOverlay').style.display = 'none';
}

let stopwatchInterval;
let stopwatchTime = 0; // time in sec
let settingInstance = null;

const buttonKeyMappings = [
    { buttonId: 'btnLeft', keyProperty: 'LEFT' },
    { buttonId: 'btnRight', keyProperty: 'RIGHT' },
    { buttonId: 'btnUp', keyProperty: 'UP' },
    { buttonId: 'btnThrow', keyProperty: 'SPACE' }
];

buttonKeyMappings.forEach(mapping => {
    const buttonElement = document.getElementById(mapping.buttonId);
    // Mouse Events
    buttonElement.addEventListener('mousedown', () => keys[mapping.keyProperty] = true);
    buttonElement.addEventListener('mouseup', () => keys[mapping.keyProperty] = false);
    buttonElement.addEventListener('mouseleave', () => keys[mapping.keyProperty] = false);
    // Touch Events
    buttonElement.addEventListener('touchstart', (event) => {
        event.preventDefault();
        keys[mapping.keyProperty] = true;
    });
    buttonElement.addEventListener('touchend', (event) => {
        event.preventDefault();
        keys[mapping.keyProperty] = false;
    });
});

/**
 * Resizes the canvas to fit the window while maintaining aspect ratio.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for the drawing surface of the canvas.
 * @returns {number} The scaling ratio applied to the canvas.
 */
function resizeCanvas(ctx) {
    const ratio = Math.min(window.innerWidth / 720, window.innerHeight / 420);
    canvas.width = 720 * ratio;
    canvas.height = 420 * ratio;
    ctx.scale(ratio, ratio);
    return ratio;
}

/**
 * Opens the game settings overlay and pauses the game.
 * If the settings instance is null, a new instance is created,
 * otherwise, the existing settings are opened.
 */
function openSetting() {
    world.isRunning = false;
    if (settingInstance === null) {
        settingInstance = new Setting(canvas, world);
    } else {
        settingInstance = null;
        settingInstance = new Setting(canvas, world);
    }
}

/**
 * Starts a stopwatch timer that increments every second.
 * The stopwatch time is tracked in the global variable 'stopwatchTime'.
 */
function runStopwatch() {
    stopwatchInterval = setInterval(() => {
        stopwatchTime += 1;
    }, 1000);
}

/**
 * Stops the stopwatch and logs the elapsed time in seconds.
 * Clears the interval set by 'runStopwatch' function.
 */
function showStopwatch() {
    clearInterval(stopwatchInterval);
}

/**
 * Initializes the game canvas, hides the start screen, and starts the game loop.
 * Also, sets up the canvas resizing on window resize event and starts the stopwatch.
 */
function startCanvas() {
    let startScreen = document.getElementById('startscreen');
    canvas = document.getElementById('canvas');
    let canvasFrame = document.getElementById('canvas-frame');
    startScreen.style.display = 'none';
    canvasFrame.style.display = 'block';
    canvas.style.display = 'block';
    world = new World(canvas, keys);
    window.addEventListener('resize', () => resizeCanvas(world.ctx));
    world.isRunning = true;
    stopwatchTime = 0;
    runStopwatch();
    loopBackground();
}

/**
 * Handles the 'keydown' event, setting the appropriate flags to true
 * when a corresponding key is pressed.
 * @param {KeyboardEvent} e - The event object containing information about the key pressed.
 */
document.addEventListener('keydown', (e) => {
    // Checks which key was pressed and set the corresponding property of the keys object to true
    switch (e.key) {
        case 'ArrowRight':
            keys.RIGHT = true;
            break;
        case 'ArrowLeft':
            keys.LEFT = true;
            break;
        case 'ArrowUp':
            keys.UP = true;
            break;
        case ' ':
            keys.SPACE = true;
            break;
    }
});

/**
 * Handles the 'keyup' event, setting the appropriate flags to false
 * when a corresponding key is released.
 * @param {KeyboardEvent} e - The event object containing information about the key released.
 */
document.addEventListener('keyup', (e) => {
    // Checks which key was released and set the corresponding property of the keys object to false
    switch (e.key) {
        case 'ArrowRight':
            keys.RIGHT = false;
            break;
        case 'ArrowLeft':
            keys.LEFT = false;
            break;
        case 'ArrowUp':
            keys.UP = false;
            break;
        case ' ':
            keys.SPACE = false;
            break;
    }
});

