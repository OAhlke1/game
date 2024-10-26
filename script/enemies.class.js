class Enemy {
    x;
    y;
    width;
    height;
    enemyType;

    constructor(x, y, width, height, imgPath, enemyType) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imgPath;
        this.enemyType = enemyType;
    }
}