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
    standardImgPath;
    hitable = true;
    audio;

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

    animateHit(hitAmount) {
        if (this.hitable) {
            this.hitAnimationIndexI++;
            if (this.hitAnimationIndexI % 5 === 0) {
                this.image.src = `graphics/enemies/${this.enemyType}/hit/hit-${this.runningDirection}-${(this.hitAnimationIndexI / 5) % 5}.png`;
            }
            if (this.hitAnimationIndexI === 75) {
                this.lifeAmount = this.lifeAmount - hitAmount;
                if (this.lifeAmount <= 0) {
                    this.image.src = '';
                    this.isDangerous = false;
                    return;
                } else { this.image.src = this.standardImgPath; }
                this.hitable = false;
                this.hitAnimationIndexI = 0;
                setTimeout(() => { this.hitableAgain(); }, 1500);
                return;
            }
            if(this.hitAnimationIndexI < 75) {requestAnimationFrame(() => { this.animateHit(hitAmount) });}
        }
        return;
    }

    hitableAgain() {
        this.hitable = true;
        this.isDangerous = true;
    }
}