class Traps {
    width;
    height;
    x;
    y;
    imagePath;
    image;
    trapImage = new Image();

    constructor(width, height, x, y, imagePath) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.imagePath = imagePath;
        this.trapImage.src = imagePath;
    }
}