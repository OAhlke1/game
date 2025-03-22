class Wall {
    x;
    y;
    width;
    height;
    backgroundColor;
    wallImage;
    wallImageSrc;

    constructor(x, y, width, height, wallImageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.wallImage = new Image();
        this.wallImageSrc = wallImageSrc;
        this.setWallImageProps();
    }

    setWallImageProps() {
        this.wallImage.src = this.wallImageSrc;
        this.wallImage.width = this.width;
        this.wallImage.height = this.height;
    }
}