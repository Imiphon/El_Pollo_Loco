class Chicken extends MovableObject {
    chickEnergy = 50;
    chickenSpeed = 0.5 + Math.random() * 2;

    /**
     * Creates a new chicken. 
     * Gets width and height from drawableObjects.
     */
    constructor(world) {
        super(70, 100).loadImage(this.images.CHICKEN_WALK[0]);
        this.world = world;
        this.loadAllImages(this.images.CHICKEN_WALK);

        this.x = 220 + Math.random() * 3000;
        this.y = 270;
        this.chickAlive = true;
        this.animateChicken();
        //to get sure that soundPlayer can find world.isRunning we'waiting
        if (this.world) {
            this.chickenMove();
        }
    }

    /**
     * Animates the chicken if it's walking.
     */
    animateChicken() {
        this.animateEnemy(this.images.CHICKEN_WALK, 400);
    }

    /**
     * Is checking and controlling direction.
     * Is calling chicken-sound
     */
    chickenMove() {
        if(this.intervallId) {
            clearInterval(intervallId);
        }
        this.intervallId = setInterval(() => {
            if (!this.world.isRunning) {
                return;
            } else {    
            
                if (this.x <= 0) this.direction = 1;
                else if (this.x + this.width >= 720) this.direction = -1;
                this.playCacklers()
                this.x += this.chickenSpeed * this.direction;
            }
        }, 1000 / 60);
    }

    /**
     * Plays random cacklers rare times.
     * set global currentPlaying
     * set eventlistener for ending of audio
     * @method
     * @memberof Chicken
     */
    playCacklers() {
        if (!this.chickAlive) {
            return;
        }
        if (Math.random() < 0.03) {
            if (this.currentlyPlaying && !this.currentlyPlaying.ended) {
                return;
            }
            let currentCackler = CACKLER_MIX[Math.floor(Math.random() * CACKLER_MIX.length)];
            playSound(currentCackler, 0.8);
            this.currentlyPlaying = currentCackler;
            currentCackler.addEventListener('ended', () => {
                this.currentlyPlaying = null;
            });
        }
    }
}
