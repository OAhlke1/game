class Enemy {
    x;
    y;
    width;
    height;

    constructor(x, y, width, height, imgPath) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imgPath;
    }
}