/**
 * Represents a heart object in the game world.
 * Inherits from DrawableObjects and is responsible for the creation, display, and interaction of heart objects.
 */
class Heart extends DrawableOjects {

    

    /**
     * Creates an instance of Heart.
     * @param {Object} world - The game world context, providing information about the character and the world state.
     * @param {number} xPosition - The x-coordinate where the heart will be positioned in the game world.
    * get width, height from MovableObject
    * gets all infos of world and x of death chicken
    */
    constructor(world, xPosition) {
        super(30, 30); //width, height
        this.world = world;
        this.loadAllImages(this.images.HEART);

        this.x = xPosition +20;
        this.y = 320;
        this.character = world.character;
        this.createHeart();

    }

    /**
     * Initializes the heart object by setting its image and starting the collision detection.
     */
    createHeart() {
        let path = this.images.HEART[0];
        this.img = this.imgCache[path];
        this.foundMe();
    }

    /**
     * Continuously checks if the heart has been collected (collided) by the character.
     * If collected, it calls the 'getHeart' method and clears the interval check.
     */
    foundMe() {
        if(this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.intervallId = setInterval(() => {
            let heartLeft = this.x;
            let heartRight = this.x + this.width;
            let heartTop = this.y;
            let heartBottom = this.y + this.height;

            let charLeft = this.character.x + 20;
            let charRight = this.character.x + this.character.width - 20;
            let charTop = this.character.y + 50;
            let charBottom = this.character.y + this.character.height;

            if (heartLeft < charRight && heartRight > charLeft &&
                heartTop < charBottom && heartBottom > charTop) {
                this.getHeart();
                clearInterval(this.intervalId); //if this heart is founded
            } else {
                return;
            }
        }, 200);
    }

    /**
     * Handles the logic when a heart is collected.
     * Updates the character's energy state and removes the heart from the world if collected.
     */
    getHeart() {
        let index = this.world.hearts.indexOf(this);
        if (this.character.energy === 100) {
            return;
        } else {
            if (index !== -1) {
                this.character.getEnergy();
                playSound(NEWHEART, 0.4);
                this.world.hearts.splice(index, 1);
            } 
        }
    }  
}