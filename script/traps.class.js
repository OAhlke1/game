class Traps {
    width;
    height;
    x;
    y;
    imagePath;
    image;
    trapType;
    decreaseLifeAmount;

    constructor(x, y, width, height, imagePath, trapType, decreaseLifeAmount) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = imagePath;
        this.trapType = trapType;
        this.decreaseLifeAmount = decreaseLifeAmount;
        this.checkCharPos();
    }

    checkCharPos() {
        if(char.x + char.width > this.x && this.x + this.width > char.x && char.y + char.height > this.y && this.y + this.height > char.y && !char.gotHit) {
            char.hitChar();
            char.decreaseHealth(this.decreaseLifeAmount);
        }
        requestAnimationFrame(()=>{this.checkCharPos()});
    }
}