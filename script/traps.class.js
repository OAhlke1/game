class Traps {
    width;
    height;
    x;
    y;
    imagePath;
    image;
    trapImage = new Image();
    trapType;
    decreaseLifeAmount;

    constructor(x, y, width, height, imagePath, trapType, decreaseLifeAmount) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.imagePath = imagePath;
        this.trapImage.src = imagePath;
        this.trapType = trapType;
        this.decreaseLifeAmount = decreaseLifeAmount;
    }
}