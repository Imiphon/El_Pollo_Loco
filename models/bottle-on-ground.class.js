class GroundBottle extends DrawableOjects {
    /** 
    * Represents a ground bottle object in the game world.
    * Inherits from DrawableObjects and gets width, height from MovableObject.
    * This class is responsible for creating, displaying, and managing the interactions of a bottle object on the ground. 
    * gets all infos of character and therefore of world
    */
    constructor(world, xPosition) {
        super(50, 70); //width, height
        this.world = world;
        this.loadAllImages(this.images.BOTTLE_GROUND);

        this.x = xPosition;
        this.y = 310;

        this.createGroundBottle();
    }

    /**
     * Creates a ground bottle by randomly selecting an image and setting it as the bottle's image.
     * Also initializes the 'foundMe' method to check for collision with the character.
     */
    createGroundBottle() {
        let oneOfTwo = Math.floor(Math.random() * 2);
        let path = this.images.BOTTLE_GROUND[oneOfTwo];
        this.img = this.imgCache[path];
        this.foundMe();
    }

    /**
     * Checks if the bottle has been found (collided) by the character.
     * If found, it calls the 'getBottle' method and clears the interval check.
     */
    foundMe() {
        let intervalId = setInterval(() => {
            let bottleLeft = this.x;
            let bottleRight = this.x + this.width;
            let bottleTop = this.y;
            let bottleBottom = this.y + this.height;

            let charLeft = this.world.character.x + 20;
            let charRight = this.world.character.x + this.world.character.width - 20;
            let charTop = this.world.character.y + 50;
            let charBottom = this.world.character.y + this.world.character.height - 30;

            if (bottleLeft < charRight && bottleRight > charLeft &&
                bottleTop < charBottom && bottleBottom > charTop) {
                this.getBottle();
                clearInterval(intervalId); //if this bottle is founded
            } else {
                return;
            }
        }, 200);
    }

    /**
     * Handles the logic when a bottle is found.
     * Updates the game state to reflect the found bottle and removes the bottle from the ground.
     */
    getBottle() {
        this.bottleToPepe() // bottleBar Img +10/100
        let index = this.world.groundBottles.indexOf(this);
        if (index !== -1) {
            this.world.groundBottles.splice(index, 1);
        }
    }

    /**
     * Updates the game state to reflect the bottle being added to the character's inventory.
     * Also initiate an object which is playing the found-sound independently.
     */
    bottleToPepe() {
        this.world.bottleInBag += 1;
        this.world.bottleBar.updateBottleBag();
        new SoloSound('audio/ping.mp3');
    }
}