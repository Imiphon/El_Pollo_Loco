class Level {

    /**
     * This Level is created in level-file.js
     */
    enemies;
    heaven;
    movableClouds;
    backgroundObjects;


    /**
     * imports from level-file.js
     * @param {arr} enemiesVar 
     * @param {arr} heavenVar 
     * @param {arr} movableCloudsVar 
     * @param {arr} backgroundObjectsVar 
     */
    constructor (arr1, arr2, arr3, arr4) {
        this.enemies = arr1;
        this.heaven = arr2;
        this.movableClouds = arr3;
        this.backgroundObjects = arr4;
    }
}