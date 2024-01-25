/**
 * Represents a dead chicken in the game world.
 * Inherits from DrawableObjects and handles the creation and animation of a dead chicken object.
 */
class ChickenDead extends DrawableOjects {

    /**
     * Creates an instance of ChickenDead.
     * @param {Object} world - The game world context which provides information about the world state.
     * @param {number} x - The x-coordinate where the dead chicken will be positioned in the game world.
     * @param {number} y - The y-coordinate where the dead chicken will be positioned in the game world.
     */
    constructor(world, x, y, small = false) {
        super(70, 100); // width, height
        this.world = world;
        this.x = x;

        this.loadAllImages(this.images.DEAD_CHICKEN);
        this.loadAllImages(this.images.SMALLDEATH);
        if (small) {
            this.animateSmallDeath();
            this.y = y;
        } else {
            this.animateDeadChicken();
            this.y = y + 30;
        }
    }

    /**
     * Animates the dead chicken by assigning an image to it.
     * Also triggers the creation of a heart object.
     */
    animateDeadChicken() {
        let path = this.images.DEAD_CHICKEN[0];
        this.img = this.imgCache[path];
        this.createHeart();
    }

    /**
 * Animates the dead smallChicken by assigning an image to it.
 * Also triggers the creation of a heart object.
 */
    animateSmallDeath() {
        let path = this.images.SMALLDEATH[0];
        this.img = this.imgCache[path];
    }

    /**
     * Creates a heart object at the location of the dead chicken.
     * The heart is added to the world's collection of hearts.
     */
    createHeart() {
        this.world.hearts.push(new Heart(this.world, this.x));
    }
}
