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
    standardImgPath;
    
    constructor(x, y, width, height, imgPath, enemyType, decreaseLifeAmount, canShoot, runningDirection, lifeAmount) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imgPath;
        this.standardImgPath = imgPath;
        this.enemyType = enemyType;
        this.decreaseLifeAmount = decreaseLifeAmount;
        this.isDangerous = true;
        this.canShoot = canShoot;
        this.runningDirection = runningDirection;
        this.lifeAmount = lifeAmount;
    }

    animateHit() {
        this.gotBeat = true;
        this.hitAnimationIndexI ++;
        if(this.hitAnimationIndexI % 5 === 0) {
            this.image.src = `graphics/enemies/${this.enemyType}/hit/hit-${this.runningDirection}-${(this.hitAnimationIndexI/5) % 5}.png`;
        }
        if(this.hitAnimationIndexI >= 75) {
            this.image.src = this.standardImgPath;
            if(this.lifeAmount <= 0) {
                this.image.src = '';
            }else { this.image.src = this.standardImgPath; }
            return;
        }
        requestAnimationFrame(()=>{this.animateHit()});
    }
}