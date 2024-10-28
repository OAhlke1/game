class Enemy {
    x;
    y;
    width;
    height;
    enemyType;
    runningDirection = 'left';
    decreaseLifeAmount;
    isDangerous;

    constructor(x, y, width, height, imgPath, enemyType, runningDirection = 'left', decreaseLifeAmount) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imgPath;
        this.enemyType = enemyType;
        this.decreaseLifeAmount = decreaseLifeAmount;
        this.isDangerous = true;
        this.runningDirection = runningDirection;
    }

    animateHit(i = 0, k = 0) {
        this.image.src = `/graphics/enemies/${this.enemyType}/hit/hit-${this.runningDirection}-${k}.png`;
        if((i+1) % 5 === 0 && i > 0) {
            k++;
            console.log(i, k);
        }
        i++;
        if(k === 4) { return; }
        requestAnimationFrame(()=>{this.animateHit(i, k)});
    }
}