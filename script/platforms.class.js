class Platform extends Wall {
    imgPath;
    platformImage;
    blockAmount;
    isMoving;

    constructor(width, height, x, y, imgPath, blockAmount = 1) {
        super();
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.imgPath = imgPath;
        this.platformImage = new Image();
        this.blockAmount = blockAmount;
        this.setPlatformImageProps();
        this.isMoving = false;
    }

    setPlatformImageProps() {
        this.platformImage.width = this.width;
        this.platformImage.height = this.height;
        this.platformImage.src = this.imgPath;
    }
}