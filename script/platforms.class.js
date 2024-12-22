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
        this.setPlatformImageProps();
        this.isMoving = false;
    }

    setPlatformImageProps() {
        this.platformImage.width = this.width;
        this.platformImage.height = this.height;
    }
}