class Setting {

    /**
    * Constructs a new Setting object.
    * @param {HTMLCanvasElement} canvas - The canvas element on which to draw the settings.
    * @param {object} world - The world context in which the settings are applied.
    */
    constructor(canvas, world) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.world = world;
        this.getRatio();
        this.loadVolImages();
        this.setCanvasDimensions();
        this.drawSetting();
    }

    /**
     * takes the actual ratio of users display     * 
     */
    getRatio() {
        let ratio = resizeCanvas(this.world.ctx);
        this.width = world.canvas.width / ratio;
        this.height = world.canvas.height / ratio;
    }

    /**
     * Opens same old instance of setting.class
     */
    openSetting() {
        debugger;
        this.drawSetting();
    }

    /**
     * Is loading both images to be prepared
     * Initializes Var for Image objects 
     */
    loadVolImages() {
        this.muteImage = this.loadImage('img/mute-32.png');
        this.soundImage = this.loadImage('img/volume-32.png');
        this.drawVolImg();
    }

    /**
     * Updates and redraws the volume image based on the mute status.
     */

    drawVolImg() {
        this.ctx.clearRect(100, 280, 32, 32);
        if (isMuted) {
            this.soundImage = this.loadImage('img/mute-32.png');
            this.soundImage.onload = () => {
                this.ctx.drawImage(this.muteImage, 100, 280, 32, 32);
            };
        } else {
            this.soundImage = this.loadImage('img/volume-32.png');
            this.soundImage.onload = () => {
                this.ctx.drawImage(this.soundImage, 100, 280, 32, 32);
            };
        }
    }

    /**
    * Loads an image from a given path.
    * @param {string} path - The path to the image to be loaded.
    * @return {HTMLImageElement} The loaded image.
    */
    loadImage(path) {
        let img = new Image();
        img.src = path;
        return img;
    }

    /**
    * Draws the settings interface on the canvas.
    * new start of background sound to get !isRunning
    */
    drawSetting() {
        this.drawHelp();
        this.helptext();
        this.drawGamePlay();
        this.drawRestart();
        this.drawXPlayForward();
        this.drawTimer();
        this.setEventlistener();
        loopBackground();
        this.hideSettingBtn();
    }

    /**
     * Is hiding the setting btn
     */
    hideSettingBtn() {
        this.settingBtn = document.getElementById('settingBtn');
        this.settingBtn.style.display = 'none';
        this.mobile = document.getElementById('mobile');
        this.mobile.style.display = 'none';
    }

    /** 
    * Founds current ratio for canvas, 
    * to set two eventListeners in right position
    */
    setCanvasDimensions() {
        this.xRatio = this.canvas.width / 720;
        this.yRatio = this.canvas.height / 420;
    }

    /**
     * Draws the help icon.
     */
    drawHelp() {
        let img = this.loadImage('img/question-32.png');
        img.onload = () => {
            this.ctx.drawImage(img, 100, 70, 32, 32);
        };
    }

    /**
     * Displays the help text with control icons.
     */
    helptext() {
        let icons = {
            left: 'img/arrow-left.png',
            right: 'img/arrow-right.png',
            up: 'img/arrow-up.png',
            throw: 'img/throw.png'
        };

        this.drawControlIcon(icons.left, 160, 70, 'LEFT');
        this.drawControlIcon(icons.right, 260, 70, 'RIGHT');
        this.drawControlIcon(icons.up, 360, 70, 'UP');
        this.drawControlIcon(icons.throw, 440, 70, 'or SPACE for THROW');
    }

    /**
     * Draws a control icon at specified coordinates.
     * @param {string} path - The path to the icon image.
     * @param {number} x - The x-coordinate for the icon.
     * @param {number} y - The y-coordinate for the icon.
     * @param {string} text - The text to display next to the icon.
     */
    drawControlIcon(path, x, y, text) {
        let img = this.loadImage(path);
        img.onload = () => {
            this.ctx.drawImage(img, x, y, 32, 32);
            this.ctx.fillStyle = '#fdc701';
            this.ctx.font = '16px zabars';
            this.ctx.fillText(text, x + 40, y + 24);
        };
    }

    /**
     * Draws the 'Play Forward' button.
     */
    drawGamePlay() {
        let img = this.loadImage('img/running-32.png');
        img.onload = () => {
            this.ctx.drawImage(img, 100, 140, 32, 32);
            this.ctx.font = '32px zabars';
            this.ctx.fillText('Game Play', 160, 170);
        };
    }

    /**
     * Is opening the overlay and text for gamePlay in script.js
     * Sets 'fromSetting' in script.js true.
     */
    settingOpenGamePlay() {
        fromSetting = true;
        openOverlay();
    }

    /**
     * xbtn to close the setting and go on.
     */
    drawXPlayForward() {
        let img = this.loadImage('img/close-window-48.png');
        img.onload = () => {
            this.ctx.drawImage(img, 600, 20, 32, 32);
        };
    }

    /**
     * Draws the 'Restart' button.
     */
    drawRestart() {
        let img = this.loadImage('img/skip-to-start-32.png');
        img.onload = () => {
            this.ctx.drawImage(img, 100, 210, 32, 32);
            this.ctx.font = '32px zabars';
            this.ctx.fillText('new Start', 160, 240);
        };
    }


    /**
     * Toggles the sound on or off.
     */
    toggleSound() {
        isMuted = !isMuted;
        this.drawVolImg();
        setTimeout(() => {
            this.isToggled = false;
        }, 500);
    }

    /**
     * Draws the timer on the canvas.
     */
    drawTimer() {
        let img = this.loadImage('img/timer-32.png');
        img.onload = () => {
            this.ctx.drawImage(img, 100, 350, 32, 32);
            this.ctx.fillStyle = '#fdc701';
            this.ctx.font = '32px zabars';
            this.ctx.fillText(this.formatTime(stopwatchTime), 170, 375);
            this.ctx.fillText('Hit Coins: ' + this.world.coins, 320, 375);
        };
        showStopwatch(); //stopps the timer in script.js
    }

    /**
     * Formats a given time in seconds to a minute:second format.
     * @param {number} timeInSeconds - The time in seconds.
     * @return {string} The formatted time as a string.
     */
    formatTime(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    /**
     * Sets up event listeners for both click and touch events.
     * create boolian to check if listener still exist:
     */
    setEventlistener() {
        if (!this.eventListenersAdded) {
            this.clickHandler = this.handleCanvasClick.bind(this);
            this.touchStartHandler = this.handleCanvasTouch.bind(this);

            this.canvas.addEventListener('click', this.clickHandler);
            this.canvas.addEventListener('touchstart', this.touchStartHandler);

            this.canvas.style.cursor = 'pointer';
            this.eventListenersAdded = true;
        }
    }

    /**
     * Handles canvas click events.
     * @param {MouseEvent} event - The mouse event object.
     */
    handleCanvasClick(event) {
        if (this.isClicked) {
            return;
        }
        this.isClicked = true;
        const canvasRect = this.canvas.getBoundingClientRect();
        const clickX = event.clientX - canvasRect.left;
        const clickY = event.clientY - canvasRect.top;
        this.sortEvent(clickX, clickY);
        setTimeout(() => {
            this.isClicked = false;
        }, 500);
    }

    /**
     * Handles canvas touch events to support mobile interactions.
     * @param {TouchEvent} event - The touch event object.
     */
    handleCanvasTouch(event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.isClicked) {
            return;
        }
        if (!this.isClicked) {
            this.isClicked = true;
            const canvasRect = this.canvas.getBoundingClientRect();
            const touch = event.touches[0] || event.changedTouches[0];
            const touchX = touch.clientX - canvasRect.left;
            const touchY = touch.clientY - canvasRect.top;
            this.sortEvent(touchX, touchY);
        }
        setTimeout(() => {
            this.isClicked = false;
        }, 500);
    }

    /**
     * Determines the action based on the x and y coordinates of the event.
     * @param {number} myX - The x-coordinate of the event.
     * @param {number} myY - The y-coordinate of the event.
     */
    sortEvent(myX, myY) {
        const {
            scaledX1, scaledX2, scaledX3, scaledY1, scaledY2, scaledY3, scaledY4, scaledY5, scaledY6, scaledY7
        } = this.checkCurrentRatio(this.xRatio, this.yRatio);

        //closeSetting
        if (myX >= scaledX1 && myX <= scaledX2 && myY >= scaledY1 && myY <= scaledY2) {
            this.settingOpenGamePlay();
        } else if (myX >= scaledX3 && myX <= scaledX3 + 32 * this.xRatio && myY >= scaledY7 && myY <= scaledY7 + 32 * this.yRatio) {
            this.closeSetting();
        } else if (myX >= scaledX1 && myX <= scaledX2 && myY >= scaledY3 && myY <= scaledY4) {
            window.location.reload();
        } else if (myX >= scaledX1 && myX <= scaledX2 && myY >= scaledY5 && myY <= scaledY6) {
            if (this.isToggled) {
                return;
            } else {
                if (!this.isToggled) {
                    this.isToggled = true;
                    this.toggleSound();
                }
            }
        }
    }

    /**
     * Calculates and returns the current ratio of canvas dimensions to the original dimensions.
     * @param {number} xRatio - The current x-axis ratio of the canvas.
     * @param {number} yRatio - The current y-axis ratio of the canvas.
     * @return {object} An object containing the scaled x and y coordinates.
     */
    checkCurrentRatio(xRatio, yRatio) {
        return {
            scaledX1: 100 * xRatio,
            scaledX2: 232 * xRatio,
            scaledX3: 600 * xRatio,
            scaledY1: 150 * yRatio,
            scaledY2: 182 * yRatio,
            scaledY3: 220 * yRatio,
            scaledY4: 252 * yRatio,
            scaledY5: 280 * yRatio,
            scaledY6: 312 * yRatio,
            scaledY7: 20 * yRatio
        };
    }

    /**
     * Closes the settings menu and resumes the game or application.
     */
    closeSetting() {
        this.world.isRunning = true;
        this.world.draw();
        loopBackground();
        runStopwatch();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.eventListenersAdded) {
            this.canvas.removeEventListener('click', this.clickHandler);
            this.canvas.removeEventListener('touchstart', this.touchStartHandler);
            this.eventListenersAdded = false;
        }
        this.settingBtn.style.display = 'block';
        this.mobile.style.display = 'flex';
    }
}