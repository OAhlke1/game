class Platform extends Wall {
    imgPath;
    platformImage;
    blockAmount;
    isMoving;

    constructor(x, y, width, height, imgPath, blockAmount = 1) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.platformImage = new Image();
        this.platformImage.src = imgPath;
        this.blockAmount = blockAmount;
        this.isMoving = false;
        this.setPlatformImageProps();
    }

    setPlatformImageProps() {
        this.platformImage.width = this.width;
        this.platformImage.height = this.height;
    }

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

    checkIfCharStandsLeftAtPlatform() {
        if(Math.abs(char.x - this.x - this.width) <= 2*char.stepLength) {
            char.atWallRight = false;
            char.atWallLeft = true;
        } else { char.atWallLeft = false; }
    }

    checkIfCharStandsRightAtPlatform() {
        if(Math.abs(this.x - char.x - char.width) <= 2*char.stepLength) {
            char.atWallRight = true;
            char.atWallLeft = false;
        } else{ char.atWallRight = false; }
    }
}