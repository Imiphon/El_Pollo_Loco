class Background extends MovableObject {
    /**
     * is given to drawable-objects
     */
    width =720;
    height = 460;

/**
 * creates a background img for the game
 * @param {number} imagePath 
 * @param {number} x 
 * @param {number} y 
 */
    constructor(imagePath, x, y){
        super().loadImage(imagePath, x, y);
        this.x = x;
        this.y = y;
    }
}