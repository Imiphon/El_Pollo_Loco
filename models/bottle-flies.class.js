/**
 * Represents a flying bottle in the game, extending the MovableObject class.
 * @extends MovableObject
 */
class FlyingBottle extends MovableObject {

    /**
    * The direction of movement. -1 for left, 1 for right.
    * @type {number}
    */
    direction = -1;

    /**
     * The y-coordinate at which the bottle is considered to be on the ground.
     * @type {number}
     */
    ground = 350;

    /**
     * The speed at which the bottle moves horizontally.
     * @type {number}
     */
    bottleSpeed = 5;

    /**
     * The initial vertical distance the bottle will rise.
     * @type {number}
     */
    rise = 15;

    /**
     * The acceleration of the bottle as it falls.
     * @type {number}
     */
    bottleAcceleration = 0.2;

    /**
     * The vertical speed of the bottle.
     * @type {number}
     */
    verticalSpeed = 0;

    /**
     * The current index for the bottle's animation frames.
     * @type {number}
     */
    currentIndex = 0;

    /**
     * Indicates whether the bottle has hit an enemy.
     * @type {boolean}
     */
    hasHit = false;

    /**
     * Creates a new FlyingBottle object.
     * @param {Object} character - The character object, containing all information about the character and the world.    
     * gets width, height from MovableObject
     * gets all infos of character and therefore of world
     */
    constructor(world, x) {
        super(50, 70); //width, height
        this.world = world;

        this.loadAllImages(this.images.BOTTLE_FLY);
        this.loadAllImages(this.images.BOTTLE_SPLASH);

        this.x = x;
        this.y = 190;

        this.checkX();
    }

    /**
     * Checks if the character is at the end or beginning on x.
     * Is setting the right position for first draw.
     */
    checkX() {
        if (this.x == this.world.charFixedX) {
            this.x = 250;
        }
        if (this.world.character.x > this.world.charFixedX || this.x < this.world.charFixedX) {
            if (this.world.character.direction == -1) {
                this.x = this.world.character.x + 50;
            } else {
                this.x = this.world.character.x;
            }
        }
        this.animateBottle();
    }

    /**
     * Animates the bottle flight 
     */
    animateBottle() {
        if (this.world.splash == false) {
            if (this.currentIndex < this.images.BOTTLE_FLY.length) {
                let path = this.images.BOTTLE_FLY[this.currentIndex];
                this.img = this.imgCache[path];
                this.currentIndex++;
            }
            if (this.currentIndex >= this.images.BOTTLE_FLY.length) {
                this.currentIndex = 0;
            }
        }
        else {
            this.animateSplash();
        }
    }

    /**
     * Handels the bottle' flight, including its rise and fall by gravity
     * Gets the direction from character.throw()
     * setting next flying image with animateBottle
     * @param {number} direction 
     */
    bottleFly(direction) {
        playSound(BOTTLE_FLIES, 0.3);
        this.flyIntervall = setInterval(() => {
            if (this.rise > 0) {
                this.y -= 1;  // Rise 1 pixel at a time
                this.rise--; //decrease rise 
            } else {
                this.bottleGravity();
            }
            this.x += this.bottleSpeed * (direction * -1);
            if (this.y >= this.ground) {
                this.acceleration += 0.5;
            }
            this.animationIndex++;
            if (this.animationIndex % 4 == 0) {
                this.animateBottle();
            }
        }, 1000 / 60);
    }

    /**
     * sets flying bottle deeper 
     * or deletes this and initialized new groundBottle
     */
    bottleGravity() {
        if (!this.world.splash) {
            if (this.isInAir()) {
                this.y += this.verticalSpeed;
                this.verticalSpeed += this.acceleration;

            } else if (this.x < this.world.runningMeter - this.world.runningMeter || this.x > 720) {
                playSound(BLOBB, 0.6);
                clearInterval(this.flyIntervall);
                this.world.createGroundBottles(-1);
            } else {
                let xPosition = this.x;
                playSound(BOTTLE_LANDS, 0.6);
                clearInterval(this.flyIntervall);
                this.world.createGroundBottles(xPosition);
            }
        }
    }

    /**
     * Starts splash animation or delete this and stop the intervals
     */
    animateSplash() {
        if (this.currentIndex < this.images.BOTTLE_SPLASH.length) {
            let path = this.images.BOTTLE_SPLASH[this.currentIndex];
            this.img = this.imgCache[path];
            this.currentIndex++;
        } else {
            delete this.world.bottle;
            clearInterval(this.flyIntervall);
            this.world.flyingBottle = null;
            this.world.splash = false;
        }
    }

    /**
     * Starts splash-sound, sorts between big and small enemy, set coinbar plus
     */
    isBottleStrike() {
        this.strikeInterval = setInterval(() => {
            let hitChicken = this.strike();
            if (hitChicken) {
                world.splash = true;
                playSound(BOTTLE_SPLASH, 0.7);
                if (hitChicken instanceof BigChick) {
                    this.strikeBigChick(hitChicken);
                } else {
                    this.killChicken(hitChicken);
                    world.coinBar.updateCoins(1);
                    playSound(CACKLER_4, 0.4);
                }
                this.world.checkNewBottle();
            }
            clearInterval(this.strikeInterval);
        }, 100);
    }

    /**
     * 
     * @param {BigChick} hittedBigChick 
     * @returns 
     */
    strikeBigChick(hittedBigChick) {
        if (!this.world.bigAlive) {
            return;
        } else {
            hittedBigChick.checkDamage();
            this.world.checkNewBottle();
        }
    }

    /**
     * Deletes this.chicken and initialized new object.
     * @param {Chicken} hitChicken 
     */
    killChicken(hitChicken) {
        if (hitChicken instanceof Chicken) {
            let deadChicken = new ChickenDead(world, hitChicken.x, hitChicken.y);
            world.deadChickens.push(deadChicken);
        }
        if (hitChicken instanceof SmallChick) {
            let deadChicken = new ChickenDead(world, hitChicken.x, hitChicken.y, true);
            world.deadChickens.push(deadChicken);
        }
        hitChicken.chickAlive = false;
        world.enemies = world.enemies.filter(enemy => enemy !== hitChicken);
        playSound(CHARACTER_YEAH, 0.2);
        this.world.checkWin();
    }

    /**
     * Checks if bottle is strike an enemy
     * @returns {boolian}
     */
    strike() {
        if (this.hasHit) {
            return null;
        }
        let hitChicken = null;

        let bottleLeft = this.x;
        let bottleRight = this.x + this.width;
        let bottleTop = this.y;
        let bottleBottom = this.y + this.height;

        this.world.enemies.forEach(enemy => {
            let enemyLeft = enemy.x + 20;
            let enemyRight = enemy.x + enemy.width - 20;
            let enemyTop = enemy.y + 50;
            let enemyBottom = enemy.y + enemy.height - 30;

            if (bottleLeft < enemyRight && bottleRight > enemyLeft &&
                bottleTop < enemyBottom && bottleBottom > enemyTop) {
                hitChicken = enemy;
                this.hasHit = true;
            }
        });

        return hitChicken;
    }

}