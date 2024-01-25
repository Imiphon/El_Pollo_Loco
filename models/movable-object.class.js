/**
 * Represents a movable object in the game, providing the base properties and methods needed for movement.
 * @extends DrawableOjects
 */
class MovableObject extends DrawableOjects {
    /**
 * The direction of movement. -1 for left, 1 for right.
 * @type {number}
 */
    direction = -1;
    /**
     * The tempo to load new images in character.animation()
     * @type {number}
     */
    animationIndex = 100;

    /**
     * The position of the object, determined by x and y coordinates.
     * @type {Object}
     */
    position = this.x && this.y;

    /**
     * The angle for sinus tangent, random start between 0 and 2π.
     * @type {number}
     */
    angle = Math.random() * Math.PI * 2;

    /**
     * The speed at which the object is jumping.
     * @type {number}
     */
    jumpSpeed = 0;

    /**
     * The acceleration of the object.
     * @type {number}
     */
    acceleration = 1;

    /**
     * Checks if the object is in the air.
     * @returns {boolean} True if the object is in the air, false otherwise.
     */
    isInAir() {
        //higher then (individual) start y
        return this.y < this.ground;
    }

    /**
     * Applies gravity to the object, adjusting its y position and jump speed.
     */
    gravity() {
        if (this.isInAir()) {
            this.y += this.jumpSpeed;
            this.jumpSpeed += this.acceleration;
        } else {
            this.y = this.ground;
            this.jumpSpeed = 0;
        }
    }

    /**
     * Checks if object is high enough.
     */
    comeDown(){
        if(this.comeDownintervall){
            clearInterval(this.comeDownintervall)
        }
        this.comeDownintervall = setInterval(() => {
            if (this.y < this.ground - 30) {
                this.comingDown = true;
            } else if (this.y === this.ground) {
                this.comingDown = false;
            }
        }, 1000/60);
    }

    /**
     * Checks for collision between the character and any enemy.
     * @param {Object} enemy - The enemy object to check for collision.
     * @returns {boolean} True if a collision is detected, false otherwise.
     */
    collision(enemy) {
        return this.x + 110 >= enemy.x &&
            this.y + this.height > enemy.y &&
            this.x <= enemy.x + enemy.width - 30 &&
            this.y < enemy.y + enemy.height;
    }

    /**
     * Checks if Character jumps on enemies head.
     * @param {SmallChick} enemy 
     * @returns boolian
     */
    jumpStrike(enemy) {
        let verticalCollision = this.y + this.height > enemy.y + 10 && this.y + this.height < enemy.y + 40;
        let horizontalCollision = this.x + 20 < enemy.x && this.x + 90 > enemy.x ;
        return verticalCollision && horizontalCollision;
    }

    /**
     * Animates the enemy object.
     * @param {Array} imageArray - An array of images for the animation.
     * @param {number} intervalTime - The time interval between animation frames.
     * @param {Function} [callback] - A callback function to be called after the animation.
     */
    animateEnemy(imageArray, intervalTime, callback) {
        if (this.currentInterval) {
            clearInterval(this.currentInterval);
        }
        let index = 0;
        this.currentInterval = setInterval(() => {
            let path = imageArray[index];
            this.img = this.imgCache[path];
            index++;
            if (index >= imageArray.length) {
                if (callback) {
                    callback();
                } else {
                    index = 0; // Restart the animateEnemy with new function
                }
            }
        }, intervalTime);
    }



}
