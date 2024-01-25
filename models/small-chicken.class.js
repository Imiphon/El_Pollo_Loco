class SmallChick extends MovableObject {
    chickEnergy = 50;
    chickenSpeed = 0.5 + Math.random() * 2;

    ploppArray = this.images.EXPLOSIONPICS;

    /**
     * Creates a new chicken. 
     * Gets width and height from drawableObjects.
     */
    constructor(world, x) {
        super(50, 60).loadImage(this.images.SMALLCHICK[0]);
        this.world = world;
        this.loadAllImages(this.images.SMALLCHICK);
        this.loadAllImages(this.images.EXPLOSIONPICS);        
        this.x = x + 50; 
        this.y =  320;
        this.chickAlive = true;
        this.animateBirth();
        
        //to get sure that soundPlayer can find world.isRunning we're waiting

    }

    /**
     * Animates an exlosion with a 'plopp'-sound.
     */
    animateBirth() {
        new SoloSound('audio/plopp.mp3');
           for (let i = 0; i < this.ploppArray.length; i++) {            
            let path = this.ploppArray[i];
            this.img = this.imgCache[path];                     
        } 
        this.animateSmallChicken();
        this.chickenMove();   
    }

    /**
     * Animates the chicken if it's walking.
     */
    animateSmallChicken() {
        this.animateEnemy(this.images.SMALLCHICK, 400);
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
            let currentCackler = SMALLCACKLER;
            playSound(currentCackler, 0.8);
            this.currentlyPlaying = currentCackler;
            currentCackler.addEventListener('ended', () => {
                this.currentlyPlaying = null;
            });
        }
    }
}
