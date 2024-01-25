class World {

    /**
     * Creats the healthbar
     * @type {HealthBar}
     */
    healthBar = new HealthBar(this, 10, -10);

    /**
     * Creats the coinBar
     * @type {CoinBar}
     */
    coinBar = new CoinBar(this, 10, 30);

    // for hit chickens
    coins = 0;

    /**
     * Creats the bottleBar
     * Put all of the world in the instanz
     * Put y-coordinate into the instanz
     * @type {BottleBar}
     */
    bottleBar = new BottleBar(this, 10, 70);

    bigChickBar = new BigChickBar(this, 550, 350);

    bottleInBag = 0;

    // Represents first starting point    
    charFixedX = 200;

    //running distance of character in x
    runningMeter = 0;

    //end-point x of game 
    xEnd = 3500;

    /**
     * Represents the main character of the game world.
     * character.x = 100
     * @type {Character}
     */
    character = new Character(this, keys);
    /**
     * Represents the enemies inclusive BigChick in the game world.
     * @type {Array<Chicken>}
     */
    enemies;
    /**
     * Represents dead chicken
     * wich are made in FlyingBottle
     */
    deadChickens = [];
    /**
    * Indicates whether the BigChick is attacking.
    * @type {boolean}
    */
    bigAttack = false;
    /**
       * Represents the clouds in the game world.
       * @type {Array<Cloud>}
       */
    heaven = level.heaven;
    /**
     * Represents the movable clouds in the game world.
     * @type {Array<Cloud>}
     */
    movableClouds = level.movableClouds;
    /**
     * Represents the background objects of the game world.
     * @type {Array<Background>}
     */
    backgroundObjects = level.backgroundObjects;

    splash = false;

    groundBottles = [];

    hearts = [];

    bigAlive = true;

    isRunning = false;

    animationFrames = [];

    secondLevel = false;

    /**
   * Constructs a new World instance representing the game world.
   * 
   * This constructor initializes the game world by setting up the canvas rendering context,
   * drawing the initial game state, and assigning key events.  
   * And it creates the bottle objects.
   * 
   * Additionally, an event listener is added to an HTML element with the ID 'chickenVol' to
   * adjust the volume of the chicken sounds in the game based on user input.
   * 
   * @param {HTMLCanvasElement} canvas - The canvas element on which the game world will be rendered.
   * @param {Object} keys - An object representing the key inputs from the user.
   */
    constructor(canvas, keys) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keys = keys;

        resizeCanvas(this.ctx);  //for view change

        this.createEnemies();
        this.createGroundBottles();
        this.draw();
        this.checkCollision();
        this.createRightBackground();
    }

    /**
     * It initializes the enemies in the game world, 
     * including BigChick.
     */
    createEnemies() {
        this.enemies = level.enemies.map(enemy => {
            if (enemy instanceof BigChick) {
                return new BigChick(this, this.runningMeter, this.xEnd);
            }
            return new Chicken(this);
        });
    }

    /**
     * Initializes small-chicken after BigChick.death().
     */
    createNewEnemies(bigX) {
        let smallChick = new SmallChick(this, bigX);
        this.enemies.push(smallChick);
    }

    /**
     * Is calling after every FlyingBottle.killChicken.
     * Starts end of game if only dead body of bigChick is left.
     * @returns void  
    */
    checkWin() {
        if (this.enemies.length === 1 && !this.bigAlive && this.secondLevel) {
            let applauseSound = APPLAUSE;
            applauseSound.onended = () => {
                openSetting();
            };
            setTimeout(() => {
                playSound(applauseSound, 0.5);
            }, 1000);
        } else {
            return;
        }
    }

    /**
     * Creates ground bottles at specified positions or randomly.
     * @param {number} [xPosition] - The x position to create a bottle at. If not provided, bottles are created at random positions.
     * @returns {Array} An array of ground bottles.
     */
    createGroundBottles(xPosition) {
        if (xPosition) {
            if (xPosition === -1) {
                xPosition = this.getRandomX();
            }
            this.newBottleOnGround(xPosition);
            delete this.character.world.flyingBottle;
        } else {
            for (let i = 0; i < 5; i++) {
                let x = this.getRandomX();
                this.newBottleOnGround(x);
            }
        }
        return this.groundBottles;
    }

    /**
     * Generates a random x position within the game world.
     * @returns {number} A random x position.
     */
    getRandomX() {
        return Math.floor(Math.random() * (this.xEnd)) + this.charFixedX;
    }

    /**
    * Controls new bottle after FlyingBottle.strike
    * @returns {void}
    */
    checkNewBottle() {
        if (this.groundBottles.length > 3) {
            return;
        } else {
            let x = this.getRandomX() - this.runningMeter;
            this.newBottleOnGround(x);
        }
    }

    /**
     * Creates a ground bottle at a specific x position.
     * @param {number} x - The x position to create the bottle at.
     */
    newBottleOnGround(x) {
        let bottle = new GroundBottle(this, x);
        this.groundBottles.push(bottle);
    }

    /**
     * checks collision in MovableObjects if isRunning
     * if true than character lost energy and shows damage animation
     * If bigChick is dead than return
     */
    checkCollision() {
        this.intervallId = setInterval(() => {
            if (!this.isRunning) {
                return;
            } else {
                this.enemies.forEach(enemy => {
                    if (this.character.collision(enemy)) {
                        if (enemy instanceof SmallChick) {
                            if (this.character.comingDown && this.character.jumpStrike(enemy)) {
                                this.smallPunch(enemy);
                            }
                        }
                        if (enemy instanceof BigChick && !this.bigAlive) {
                            return
                        } else {
                            this.character.lostEnergy();
                        }
                    }
                });
            }
        }, 1000/60);    
    }

    /**
     * deletes given object and set new ChickenDead on same place.
     * @param {SmallChick} enemy 
     */
    smallPunch(enemy) {
        playSound(SPLASH, 0.8);
        let deadChicken = new ChickenDead(this, enemy.x, enemy.y, true);
        this.deadChickens.push(deadChicken);
        this.enemies = this.enemies.filter(e => e !== enemy);
        enemy.chickAlive = false;
        this.coinBar.updateCoins(1);
        this.checkWin();
    }

    /**
     * controlls the process of drawing all context
     * gets element groups with addObjInAddToMap()
     * Draws the game world's elements on the canvas.  
     */
    draw() {
        this.clearCanvas();
        this.drawBackground();
        this.drawGameObjects();
        this.drawUIElements();
        this.handleConditionalDrawings();
        this.requestNextAnimationFrame();
    }

    /**
     * Is clearing the last draw
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Is drawing background objects.
     * Translates the canvas in relation to Character position.
     */
    drawBackground() {
        this.addObjInAddToMap(this.heaven);
        this.ctx.translate(0, 0);
        this.addObjInAddToMap(this.backgroundObjects);
        this.addObjInAddToMap(this.movableClouds);
    }

    /**
     * Is drawing gameObjects
     */
    drawGameObjects() {
        this.addObjInAddToMap(this.enemies);
        this.addToMap(this.character);
        this.addObjInAddToMap(this.groundBottles);
        this.addObjInAddToMap(this.deadChickens);
    }

    /**
     * Is drawing the stady bars (UI-elements)
     */
    drawUIElements() {
        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
    }

    /**
     * Handels drawingof objects under special conditions.
     */
    handleConditionalDrawings() {
        if (this.flyingBottle) {
            this.flyingBottleToMap();
        }
        if (this.bigAttack) {
            this.addToMap(this.bigChickBar);
        }
        if (this.hearts.length >= 0) {
            this.addObjInAddToMap(this.hearts);
        }
    }

    /**
     * Is calling next draw() frame if world is running.
     * Cancels old Id 
     */
    requestNextAnimationFrame() {
        this.ctx.translate(0, 0);
        this.animationFrameId = requestAnimationFrame(() => {
            if (this.isRunning)
                if (this.animationFrameId) {
                    cancelAnimationFrame(this.animationFrameId);
                    this.draw();
                }
        });
    }

    /**
     * Draws the flying bottle on the canvas and checks for a strike.
     */
    flyingBottleToMap() {
        this.addToMap(this.flyingBottle);
        if (this.splash == false && this.flyingBottle) {
            this.flyingBottle.isBottleStrike();
        }
    }

    /**
     * Adds each object in the provided array to the map.
     * @param {Array} object - Array of objects to be added.
     */
    addObjInAddToMap(object) {
        object.forEach((obj) => this.addToMap(obj));
    }

    /**
     * Draws the given movable object on the canvas.
     * @param {Object} obj - The object to be drawn. Should have properties: img, x, y, width, height.
     */
    addToMap(obj) {
        this.ctx.save(); //first save standard-direction

        if ('direction' in obj && obj.direction === 1) {
            this.ctx.scale(-1, 1);
        }

        try {
            this.ctx.drawImage(
                obj.img, //?if condition true (or) : if condition false
                ('direction' in obj && obj.direction === 1) ? -obj.x - obj.width : obj.x,
                obj.y,
                obj.width,
                obj.height,
            );
        } catch (error) {
            console.log(error);
            console.log(obj.img + ' is a ' + typeof obj.img);
        }
        this.ctx.restore(); // standard-direction
    }

    /**
    * Is setting new x for background elements,
    * in relation to running meters of character.
    * @param {number} xShift 
    */
    updateBackground(xShift) {
        this.runningMeter -= xShift;
        [this.heaven, this.backgroundObjects, this.enemies, this.movableClouds, this.groundBottles, this.deadChickens, this.hearts].forEach(array => {
            array.forEach(element => {
                element.x += xShift;
            });
        });
    }

    /**
     * Creates additional background elements to fill the right side of the canvas.
     */
    createRightBackground() {
        let rightSide = Math.max(...this.backgroundObjects.map(obj => obj.x + obj.width));

        while (rightSide < this.xEnd + this.canvas.width) {
            [this.heaven, this.backgroundObjects].forEach(array => {
                array.forEach(element => {
                    let newX = element.x + element.width;
                    newX -= 1;  // draw left to eliminate space
                    let newElement = new Background(element.img.src, newX, element.y);
                    array.push(newElement);
                });
            });
            rightSide = Math.max(...this.backgroundObjects.map(obj => obj.x + obj.width));
        }
    }
}