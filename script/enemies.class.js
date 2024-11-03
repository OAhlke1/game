class Enemy {
    x;
    y;
    width;
    height;
    enemyType;
    runningDirection;
    decreaseLifeAmount;
    isDangerous;
    canShoot;
    hitAnimationIndexI = 0;
    gotBeat = false;

    constructor(x, y, width, height, imgPath, enemyType, decreaseLifeAmount, canShoot, runningDirection) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imgPath;
        this.enemyType = enemyType;
        this.decreaseLifeAmount = decreaseLifeAmount;
        this.isDangerous = true;
        this.canShoot = canShoot;
        this.runningDirection = runningDirection;
    }

    animateHit() {
        this.gotBeat = true;
        this.hitAnimationIndexI++;
        if(this.hitAnimationIndexI % 5 === 0) {
            this.image.src = `graphics/enemies/${this.enemyType}/hit/hit-${this.runningDirection}-${(this.hitAnimationIndexI/5) % 5}.png`;
        }
        if(this.hitAnimationIndexI >= 75) {
            this.image.src = '';
            return;
        }
        requestAnimationFrame(()=>{this.animateHit()});
    }
}