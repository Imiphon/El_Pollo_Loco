class SoloSound {

    /**
     * This object takes the passed audio path and plays its
     * sound independently of the original object.
     * @param {string} soundadress
     */
    constructor(sound) {
        this.sound = new Audio(sound);
        this.playSound();
    }

    /**
     * plays the sound.
     */
    playSound() {
        if(isMuted) return;
        this.sound.play().then(() => {
            this.destroy();
        }).catch(error => {
            console.error("Fehler beim Abspielen des Sounds: ", error);
        });
    }
    /**
     * set new Audio to null.
     */
    destroy() {
        this.sound = null; 
    }
}
