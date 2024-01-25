class BottleBar extends DrawableOjects {

    /**
     * Initialized all images-pathes
     * Get loadImages() from extended DrawableOjects
     * Get y from World
     */
    constructor(world, x, y) {
        super(120, 40);
        this.loadAllImages(this.images.BOTTLEBAR);
        this.world = world;
        this.x = x;
        this.y = y;

        this.showBottlebar(0);
    }


    /**
     * shows first index of bottleBar
     * @param {number} bottleIndex 
     */
    showBottlebar(bottleIndex) {
        this.bottleIndex = bottleIndex;
        let path = this.images.BOTTLEBAR[bottleIndex];
        this.img = this.imgCache[path];
    }

    /** 
     * sends new Index to bottleBar
     * @param {number} heartIndex 
     */
    updateBottleBag() {
        let result;
        let bottleCount = this.world.bottleInBag;
        if (bottleCount > 5) {
            result = 5;
        }
        else if (bottleCount > 4) {
            result = 4;
        }
        else if (bottleCount > 3) {
            result = 3;
        }
        else if (bottleCount > 2) {
            result = 2;
        }
        else if (bottleCount > 0) {
            result = 1;
        }
        else {
            result = 0;
        }
        this.showBottlebar(result);
    }
}