class CoinBar extends DrawableOjects {
    // 6 images
    coinIndex = 0;


    /**
     * Initialized all images-pathes
     * Get loadImages() from extended DrawableOjects
     * Get y from World
     */
    constructor(world, x, y) {
        super(120, 40);
        this.loadAllImages(this.images.COINBAR);
        this.world = world;
        this.x = x;
        this.y = y;
        this.updateCoinbar();
    }

    /**
     * called from botttle-flies/ isBottleStrike()
     * @param {*} hit 
     */
    updateCoins(hit) {
        setTimeout(() => {
            this.world.coins += hit;
            this.updateCoinbar();            
        }, 1000);
    }

    updateCoinbar() {        
        let coins = this.world.coins;
        if (coins > 9) {
            this.coinIndex = 5;
        }
        else if (coins > 6) {
            this.coinIndex = 4;
        }
        else if (coins > 4) {
            this.coinIndex = 3;
        }
        else if (coins > 2) {
            this.coinIndex = 2;
        }
        else if (coins > 0) {
            this.coinIndex = 1;
        }
        else {
            this.coinIndex = 0;
        }
        this.showCoinbar();
    }

    showCoinbar() {
        let path = this.images.COINBAR[this.coinIndex];
        this.img = this.imgCache[path];
    }
}

