class Character extends MovableObject {
    energy = 100;
    manSpeed = 5;
    isDead = false;
    damageArray = this.images.CHARACTER_DAMAGE;
    deathArray = this.images.CHARACTER_DEATH;
    sleepArray = this.images.CHARACTER_SLEEP;
    ground = 125;
    canThrow = true;
    hurtAccount = 0;
    standingTime = 0;
    comingDown = false;

    /**  
     * get width, height and energy of img from MovableObject
     */
    constructor(world, keys) {
        super(150, 250); //width, height
        this.world = world;
        this.keys = keys;
        this.loadAllImages(this.images.CHARACTER_STAND);
        this.loadAllImages(this.images.CHARACTER_SLEEP);
        this.loadAllImages(this.images.CHARACTER_WALK);
        this.loadAllImages(this.images.CHARACTER_UP);
        this.loadAllImages(this.images.CHARACTER_DAMAGE);
        this.loadAllImages(this.images.CHARACTER_DEATH);
        this.loadAllImages(this.images.GAMEOVER);
        this.loadImage(this.images.CHARACTER_THROW);

        this.x = world.charFixedX;
        this.y = this.ground;
        this.animateCharacter();

        this.updateCharacter();
    }

    /**
     * Animates the Character (currentImage comes from drawableObject)
     */
    animateCharacter() {
        if (this.animationInterval)
            clearInterval(this.animationInterval);
        this.animationInterval = setInterval(() => {
            let imageArray;
            if (!this.keys.LEFT && !this.keys.RIGHT && !this.keys.UP && !this.keys.DOWN && !this.keys.SPACE) {
                this.standingTime += 100;
                if (this.standingTime > 3000) {
                    imageArray = this.images.CHARACTER_SLEEP;
                    loopSnoring();
                } else {
                    imageArray = this.images.CHARACTER_STAND;
                }
            } else {
                this.somthingHappens();
                if (this.keys.LEFT || this.keys.RIGHT) {
                    imageArray = this.images.CHARACTER_WALK;
                } if (this.keys.UP) {
                    imageArray = this.images.CHARACTER_UP;
                } else if (this.keys.SPACE) {
                    imageArray = this.images.CHARACTER_THROW;
                }
            }
            this.showImageArray(imageArray);
        }, 100);
    }

    somthingHappens() {
        stopSound(SNORE);
        this.standingTime = 0;
    }

    showImageArray(imageArray) {
        let i = this.currentImage % imageArray.length;
        let path = imageArray[i];
        this.img = this.imgCache[path];
        this.currentImage++;
        if (this.currentImage >= imageArray.length)
            this.currentImage = 0;
    }

    /**
     * implements gravity from MovableObjejct
     * checks pressed key and calls right move
     * Prevented gravity if death is true.
     */
    updateCharacter() {
        if (this.updateCharacterId) {
            clearInterval(this.updateCharacterId);
            this.updateCharacterId = null;
        }
        this.updateCharacterId = setInterval(() => {
            if (!this.isDead) {
                this.gravity();
                if (this.keys.RIGHT) {
                    this.moveRight();
                }
                else if (this.keys.LEFT) {
                    this.moveLeft();
                }
                if (this.keys.UP) {
                    this.jumpUp()
                }
                if (this.keys.SPACE) {
                    this.throw();
                }
            }
        }, 1000 / 60);
    }

    /**
     * Checked where the character is walking to the right. 
     * Between runningMeter = 0 (= charFixedX) and xEnd.
     * Or outside 'normal'.
     */
    moveRight() {
        if (this.world.runningMeter <= this.world.xEnd && this.world.runningMeter >= 0) {
            this.manWalking(-1);
        }
        else if (this.world.runningMeter >= this.world.xEnd) {
            this.moveRightOnRightEnd();
        }
        else if (this.world.runningMeter <= this.world.charFixedX) {
            this.moveRightOnLeftStart();
        }
    }

    /**
     * Character is walking right.
     * Canvas doesn't shift.
     */
    moveRightOnRightEnd() {
        if (this.x == 590) {
            this.x = 590;
        }
        else {
            this.x += 5;
            this.direction = -1;
        }
    }

    /**
     * Character is walking left.
     * Canvas doesn't shift.
     */
    moveLeftOnRightEnd() {
        if (this.x > this.world.charFixedX) {
            this.x -= 5;
            this.direction = 1;
        } else {
            this.manWalking(1);
        }
    }

    /**
     * Checked where the character is walking to the left. 
     * Between runningMeter = 0 (= charFixedX) and xEnd.
     * Or outside 'normal'.
     */
    moveLeft() {
        if (this.world.runningMeter <= this.world.xEnd && this.world.runningMeter >= 0) {
            this.manWalking(1)
        }
        else if (this.world.runningMeter <= 0) {
            this.moveLeftOnLeftStart();
        }
        else if (this.world.runningMeter >= this.world.xEnd) {
            this.moveLeftOnRightEnd();
        }
    }

    /**
     * Character is walking right.
     * Canvas doesn't shift.
     */
    moveRightOnLeftStart() {
        if (this.x <= this.world.charFixedX) {
            this.x += 5;
            this.direction = -1;
        } else {
            this.manWalking(-1);
            this.x = 200;
        }
    }

    /**
     * Character is walking left.
     * Canvas doesn't shift.
     */
    moveLeftOnLeftStart() {
        if (this.x > -10) {
            this.manSpeed = 0;
            this.x -= 5;
            this.direction = 1;
            this.world.updateBackground(this.manSpeed, true);
        } else if (this.x <= -10) {
            this.x = -10;
        }
    }

    /**
     * Plays the step sound and updates the background based on the character's speed.
     * @param {number} direction 
     */
    manWalking(direction) {
        this.manSpeed = 5 * direction;
        this.direction = 1 * direction;
        playSound(STEP, 0.3);
        this.world.updateBackground(this.manSpeed, false);
    }

    /**
     * Makes the character jump upwards.
     * Updates the character's y-coordinate and the background based on the character's speed.
     * If the character is at the start or end of the world, the speed is set to 0.
     */
    jumpUp() {
        if (this.world.runningMeter <= 0 || this.world.runningMeter >= this.world.xEnd) {
            this.manSpeed = 0;
        }
        else if (!this.keys.RIGHT && !this.keys.LEFT) {
            this.manSpeed = 0;
        }
        this.y -= 15;
        this.comeDown();
        this.world.updateBackground(this.manSpeed);
    }

    /**
    * Makes the character throw a bottle. 
    * Initialized an bottle Object in world.
    * starts bottleFly() in bottle-flies.class
    * @returns {}
    */
    throw() {
        if (this.canThrow && this.world.bottleInBag > 0) {
            this.canThrow = false;
            this.world.flyingBottle = new FlyingBottle(this.world, this.x);
            this.world.flyingBottle.bottleFly(this.direction);
            this.world.bottleInBag -= 1;
            this.world.bottleBar.updateBottleBag();
            setTimeout(() => {
                this.canThrow = true;
            }, 1000);
        } else {
            return;
        }
    }

    /**
     * Takes energy from Character if collision with enemy
     * @returns if death() if true
     */
    lostEnergy() {
        this.somthingHappens();
        if (this.isDead === true) {
            return;
        } else {
            this.energy -= 0.5;
            this.animateDamage();
            this.itHurts();
            this.energyStatus();
            if (this.energy <= 0) {
                this.death()
            }
        }
    }

    /**
     * shows damage images for one time.
     */
    animateDamage() {
        let index = 0;
        const damageInterval = setInterval(() => {
            if (index < this.damageArray.length) {
                let path = this.damageArray[index];
                this.img = this.imgCache[path];
                index++;
            } else {
                clearInterval(damageInterval);
                this.currentImage = 0;
            }
        }, 100);
    }

    /**
     * Plays two different sounds for character hurts
     * @returns if it hurts
     */
    itHurts() {
        if (this.isHurting) {
            return;
        }
        this.isHurting = true;
        if (this.hurtAccount === 2) {
            playSound(OH_NO, 0.2);
            this.hurtAccount = 0;
        } else {
            playSound(HURT, 0.2);
            this.hurtAccount++;
        }
        setTimeout(() => {
            this.isHurting = false;
        }, 1000);
    }

    /**
     * Character is getting energy from a heart.
     */
    getEnergy() {
        this.energy += 20;
        if (this.energy > 100) {
            this.energy = 100;
        }
        this.energyStatus();
    }

    /** 
     * sends new Index to healthBar
     * @param {number} heartIndex 
     */
    energyStatus() {
        let result;
        if (this.energy > 80) {
            result = 5;
        }
        else if (this.energy > 60) {
            result = 4;
        }
        else if (this.energy > 40) {
            result = 3;
        }
        else if (this.energy > 20) {
            result = 2;
        }
        else if (this.energy > 0) {
            result = 1;
        }
        else {
            result = 0;
        }
        this.world.healthBar.showHealthbar(result);
    }

    /**
     * is playing sound and shows images
     * if character is dying.
     */
    death() {
        this.isDead = true;
        playSound(DYING, 0.3);
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
        let index = 0;
        const animateDeath = () => {
            if (index < this.deathArray.length) {
                this.img = this.imgCache[this.deathArray[index]];
                index++;
                setTimeout(animateDeath, 300);
            } else {
                this.animateGameOver();
            }
        };
        animateDeath();
    }

    /**
     * Shows the "GAME OVER" image and opens the setting.class.
     */
    animateGameOver() {
        this.direction = -1;
        this.img = this.imgCache[this.images.GAMEOVER];
        this.x = 0;
        this.y = 0;
        let ratio = resizeCanvas(this.world.ctx);
        this.width = this.world.canvas.width / ratio;
        this.height = this.world.canvas.height / ratio;
        setTimeout(() => {
            openSetting();
        }, 2000);
    }
}

