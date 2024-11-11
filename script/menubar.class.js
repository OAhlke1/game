class Menubar {
    x;
    y;
    width;
    height;
    font;
    fontColor;
    defeatedEnemies;
    backgroundColor = '#000000';

    constructor(x, y, width, height, font, fontColor, defeatedEnemies = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.font = font;
        this.fontColor = fontColor;
        this.defeatedEnemies = char.healthAmount;
    }

    writeMenuTexts() {
        ctx.font = this.font;
        ctx.textBaseline = "top";
        ctx.direction = 'ltr';
        ctx.fillStyle = 'red';
        ctx.fillText(char.healthAmount, this.x+10, this.y);
    }
}