/**
 * Represents a Cloud in the game, extending the functionalities of MovableObject.
 * @extends MovableObject
 */
class Cloud extends MovableObject {

    /**
     * Indicates whether the cloud is movable.
     * @type {boolean}
     */
    isMovable;

    /**
     * Creates a new Cloud instance.
     * 
     * @param {string} imgPass - The path to the image representing the cloud.
     * @param {boolean} [movable=false] - Indicates whether the cloud is movable. 
     */
    constructor(imgPass, x, y, movable = false, xEnd) {
        super(720, 400); //width, height
        this.loadImage(imgPass);
        this.xEnd = xEnd;
        this.isMovable = movable;
        this.x = x;
        this.y = y;

        if (this.isMovable) {
            this.moveCloud();
        } else {
            this.x = x;
            this.y = y;
        }
    }


    /**
     * clears intervall if it exists
     * looking for the world (as an object).
     */
    moveCloud() {
        if (this.intervallId) {
            clearInterval(this.intervallId);
        }
        this.intervallId = setInterval(() => {
            this.x -= 0.2; // Speed of cloud
            if (this.x < -720) {
                this.x = 720;
            }
            else if (this.x > 720) {
                this.x = -720;
            }
        }, 1000 / 60);
    } 
}
/* 
    moveCloud() {
        if (this.intervallId) {
            clearInterval(this.intervallId);
        }
        const checkWorldDefined = setInterval(() => {
            if (typeof world !== 'undefined') {
                clearInterval(checkWorldDefined); 
                this.startMovingCloud(); 
            }
        }, 100);
    }
        startMovingCloud() {
        this.intervallId = setInterval(() => {
            this.x -= 0.2; // Speed of cloud
            if (this.x < -world.canvas.clientWidth) {
                this.x = world.canvas.clientWidth;
            }
            else if (this.x > world.canvas.clientWidth) {
                this.x = -world.canvas.clientWidth;
            }
        }, 1000 / 60);
    }  
    */

