/**
 * Represents a BigChick enemy in the game, extending the MovableObject class.
 * @extends MovableObject
 */
class BigChick extends MovableObject {

    /**
     * The current energy level of the BigChick.
     * between 0 and 6
     * @type {number}
     */
    energy = 6;

    /**
     * The speed at which the BigChick moves.
     * @type {number}
     */
    chickenSpeed = 0.5;
    /**
     * An array of images for the BigChick's alert animation.
     * @type {Array}
     */
    alertArray = this.images.BIG_CHICK_ALERT;

    /**
     * An array of images for the BigChick's damage animation.
     * @type {Array}
     */
    damageArray = this.images.BIG_CHICK_HURT;

    /**
     * An array of images for the BigChick's death animation.
     * @type {Array}
     */
    deathArray = this.images.BIG_CHICK_DEAD;

    /**
     * An array of images for the BigChick's attack animation.
     * @type {Array}
     */
    attackArray = this.images.BIG_CHICK_ATTACK;

    /**
     * boolian for sound in reactionSound()
     */
    reaction = false;

    /**
     * Creates a new BigChick object.
     * @param {number} runningMeter - The distance the BigChick has to cover.
     * @param {number} endOfX - The x-coordinate where the BigChick starts.
     */
    constructor(world, runningMeter, endOfX) {
        super(240, 300).loadImage(this.images.BIG_CHICK_ALERT[0]);
        this.world = world;
        this.loadAllImages(this.images.BIG_CHICK_ALERT);
        this.loadAllImages(this.images.BIG_CHICK_ATTACK);
        this.loadAllImages(this.images.BIG_CHICK_HURT);
        this.loadAllImages(this.images.BIG_CHICK_DEAD);
        this.x = endOfX;
        this.y = 90;
        this.runningMeter = runningMeter;
        this.animateBigChick();
    }

    /**
     * Checks the BigChick's damage 
     * and triggers the appropriate animation
     * and starts another func with callback in animateEnemy().
     */
    checkDamage() {
        this.lostEnergy();
        if (this.energy <= 0) {
            if(this.movementInterval){
                clearInterval(this.movementInterval);
            }
            this.animateEnemy(this.damageArray, 100, () => this.death());
        } else {
            this.animateEnemy(this.damageArray, 100, () => this.animateAttack());
        }
    }

    /**
    * Animates the BigChick when it is in an alert state.
    */
    animateBigChick() {
        this.animateEnemy(this.alertArray, 400);
    }

    /**
     * Animates the BigChick when it is attacking.
     */
    animateAttack() {
        if (this.walkSoundInterval) {
            clearInterval(this.walkSoundInterval);
        }
        this.world.bigAttack = true;
        this.startMovement();
        this.animateEnemy(this.attackArray, 400);
        this.reactionSound();
    }

    /**
     * is playing the reationSound of charactter
     * Is taking soundIndex and playing some different sounds of array = BIGWALK
     * creates var playNextSound as a function and starts it directly
     * 
     */
    reactionSound() {
        if (!this.reaction) {
            playSound(BIGOUPS, 0.2);
            this.reaction = true;
            setTimeout(() => {
                this.reactionSound();
            }, 1000);
        } else {
            if (this.walkSoundInterval) {
                clearInterval(this.walkSoundInterval);
            }
            let soundIndex = 0;
            const playNextSound = () => {
                if (soundIndex >= BIGWALK.length) {
                    soundIndex = 0;
                }
                playSound(BIGWALK[soundIndex], 0.3);
                soundIndex++;
            };
            playNextSound();
            this.walkSoundInterval = setInterval(playNextSound, 1000);
        }
    }

    /**
     * Starts the movement of the BigChick.
     */
    startMovement() {
        if(this.movementInterval){
            clearInterval(this.movementInterval);
        }
        this.movementInterval = setInterval(() => {
            if (this.x <= 0) this.direction = 1;
            else if (this.x + this.width >= 720) this.direction = -1;
            this.x += this.chickenSpeed * this.direction;
        }, 1000 / 60);
    }

    /**
     * Reduces the energy of the BigChick.
     */
    lostEnergy() {
        this.energy -= 1;
        this.world.bigChickBar.showHealthbar(this.energy);
    }

    /**
     * Handles the death of the BigChick, stopping its movement and playing the death animation.
     * Is calling creatNewEnemies after impact sound.
     */
    death() {
        playSound(BIGDEATH, 0.5);
        this.world.bigAlive = false;
        this.world.bigAttack = false;
        this.chickenSpeed = 0;
        clearInterval(this.walkSoundInterval);
        if(this.movementInterval){
            clearInterval(this.movementInterval);
        }        
        this.animateEnemy(this.deathArray, 300, () => {
            this.img = this.imgCache[this.deathArray[this.deathArray.length - 1]];
            this.direction = 1;
        });
        setTimeout(() => {
            playSound(BIGIMPACT, 0.8);
            this.reincarnation();
        }, 1000);
        world.coinBar.updateCoins(1);
    }

    /**
     * Is calling this.world.createNewEnemies 
     * gives this.x to new objects
     * reduce intervall in each for loop.
     */
    reincarnation() {
        this.world.secondLevel = true;
        let timing = 0;  
        for (let i = 0; i < 10; i++) {             
            timing += 500;         
            setTimeout(() => {
                this.world.createNewEnemies(this.x);
            }, timing);
            timing -= i * 50;
        }
        setTimeout(() => {
            playSound(OHOH, 0.6);
        }, 3500);
    }
}    
