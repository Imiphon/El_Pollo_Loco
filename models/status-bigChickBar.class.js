
class BigChickBar extends DrawableOjects {

    /**
     * First index for HealthBar
     */
    heartIndex = 5;

    /**
     * Initialized all images-pathes
     * Get loadImages() from extended DrawableOjects
     * Get y from World
     */
    constructor(world, x, y) {
        super(120, 40);
        this.loadAllImages(this.images.BIGCHICK_BAR);
        this.world = world;
        this.x = x;
        this.y = y;
        this.showHealthbar(this.heartIndex);
    }

     /**
     * Is geting index from world.updateHeartIndex(newIndex)
     * set new Index for next world.draw
     * @param {number} heartIndex 
     */
    showHealthbar(heartIndex) {
        this.heartIndex = heartIndex;
        let path = this.images.BIGCHICK_BAR[heartIndex];
        this.img = this.imgCache[path];
    }
}