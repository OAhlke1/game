class Menubar {
    x;
    y;
    width;
    height;
    font;
    fontColor;
    defeatedEnemies;
    backgroundColor = '#000000';
    lifeImage;
    enemyImage;

    constructor(x, y, width, height, font, fontColor) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.font = font;
        this.fontColor = fontColor;
        this.lifeImage = new Image();
        this.lifeImage.src = '/graphics/items/heart.png';
        this.enemyImage = new Image();
        this.enemyImage.src = '/graphics/enemies/shooter/attack/attack-left-0.png';
    }

    writeMenuTexts() {
        ctx.font = this.font;
        ctx.textBaseline = "top";
        ctx.direction = 'ltr';
        ctx.fillStyle = 'red';
        ctx.drawImage(this.lifeImage, this.x+10, this.y, items.lifeIncreasing[0].width, items.lifeIncreasing[0].height);
        ctx.fillText(char.healthAmount, this.x+40, this.y);
        ctx.drawImage(this.enemyImage, this.x+180, this.y, items.lifeIncreasing[0].width, items.lifeIncreasing[0].height);
        ctx.fillText(char.enemiesKilled, this.x+200, this.y);
    }
}