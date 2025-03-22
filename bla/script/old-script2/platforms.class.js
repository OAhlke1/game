class Platform extends Wall {
    imgPath;
    platformImage;
    isMoving;

    /**
     * 
     * @param {number} x the x-coordinate of the platform.
     * @param {number} y the y-coordinate of the platform
     * @param {number} width the width of the platform
     * @param {number} height the height of the platform
     * @param {string} imgPath the path of the platform image
     */
    constructor(x, y, width, height, imgPath) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.platformImage = new Image();
        this.platformImage.src = imgPath;
        this.isMoving = false;
        this.setPlatformImageProps();
    }

    /**
     * 
     * @method setPlatformImageProps sets the width and height of the platform, so it is
     * rendered correctly.
     */
    setPlatformImageProps() {
        this.platformImage.width = this.width;
        this.platformImage.height = this.height;
    }

    /**
     * 
     * @method checkIfCharStandsAtPlatform checks wether the char still stands on @this platform
     */
    checkIfCharStandsAtPlatform() {
        if(char.y + char.height > this.y && this.y + this.height > char.y && !char.falls) {
            if(!char.atWallLeft && char.atWallRight) {
                this.checkIfCharStandsLeftAtPlatform();
            }else if(!char.atWallRight && char.atWallLeft) {
                this.checkIfCharStandsRightAtPlatform();
            }else if(!char.atWallLeft && !char.atWallRight) {
                this.checkIfCharStandsLeftAtPlatform();
                this.checkIfCharStandsRightAtPlatform();
            }
        }else {
            char.atWallRight = false;
            char.atWallLeft = false;
        }
        requestAnimationFrame(()=>{ this.checkIfCharStandsAtPlatform(); });
    }

    /**
     * 
     * @method checkIfCharStandsLeftAtPlatform checks wether the char stands on the platforms
     * left edge.
     */
    checkIfCharStandsLeftAtPlatform() {
        if(Math.abs(char.x - this.x - this.width) <= 2*char.stepLength) {
            char.atWallRight = false;
            char.atWallLeft = true;
        } else { char.atWallLeft = false; }
    }

    /**
     * 
     * @method checkIfCharStandsRightAtPlatform checks wether the char stands on the platforms
     * right edge.
     */
    checkIfCharStandsRightAtPlatform() {
        if(Math.abs(this.x - char.x - char.width) <= 2*char.stepLength) {
            char.atWallRight = true;
            char.atWallLeft = false;
        } else{ char.atWallRight = false; }
    }
}