class DrawableOjects {

    /**
    * Shows all images pathes for following objects
    */
    images = new Images();

    /**
    * Represents the dats for the image of the movable object.
    */
    x = 0;
    y = 0;
    width;
    height;

    /**
    * Represents the image of the movable object.
    */
    img;

    /**
     * The array for all images of each singel object.
     */
    imgCache = {};

    /**
    * Presents the index of the imgCage.
    */
    currentImage = 0;

    /**
    * Creates a individual MovableObject instance.
    * is called by 'super(...) in the movableObject
    * @param {number} width - The width of the object.
    * @param {number} height - The height of the object.
    */
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    /**
     * Loads the image for the object from a given path.
     * @param {string} path - The path to the image file.
    */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
        return this.img;
    }

    /**
    * Loads all images in the provided array and stores them in the imgCache.
    * @param {Array<string>} arr - The array containing the paths to the images.
    */
    loadAllImages(arr) {
        arr.forEach(path => {
            let curImg = new Image();
            curImg.src = path;
            this.imgCache[path] = curImg;
        });
    }
}