class Enemy {
    x;
    y;
    minX;
    maxX;
    width;
    height;
    enemyType;
    lookingDirection;
    decreaseLifeAmount;
    isDangerous;
    canShoot;
    hitAnimationIndexI = 0;
    standardImgPath;
    hitable = true;
    walks;
    animationId;

    constructor(x, y, width, height, imgPath, enemyType, decreaseLifeAmount, canShoot, lookingDirection, lifeAmount, walks) {
        this.x = x;
        this.y = y;
        this.minX = x;
        this.maxX = canvas.width-wallBrickWidth;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imgPath;
        this.standardImgPath = imgPath;
        this.enemyType = enemyType;
        this.decreaseLifeAmount = decreaseLifeAmount;
        this.isDangerous = true;
        this.canShoot = canShoot;
        this.lookingDirection = lookingDirection;
        this.lifeAmount = lifeAmount;
        this.walks = walks;
    }

    checkCharPos() {
        if(figure.y + figure.height > this.y && this.y + this.height > figure.y) {
            if(Math.abs(figure.x + figure.width - this.x) <= this.distanceToSeeChar || Math.abs(this.x + this.width - figure.x) <= this.distanceToSeeChar) {
                this.lookAtChar();
                if(this.canShoot) { this.checkIfTargeting(); }
            }
        }else {
            this.walks = false;
            this.targeting = false;
        }
        requestAnimationFrame(()=>{this.checkCharPos()});
    }

    checkIfHittingChar() {
        if(figure.x + figure.width > this.x && figure.x < this.x + this.width) {
            if(figure.y + figure.height > this.y && figure.y < this.y + this.height) {
                return true;
            }
        }else { return false; }
    }

    animateWalking(i = 0) {
        if(!gamePaused && this.targeting && this.isDangerous) {
            if(this.lookingDirection === "left") {
                this.x -= wallBrickWidth/100;
            }else if(this.lookingDirection === "right") {
                this.x += wallBrickWidth/100;
            }
            if(this.x === wallBrickWidth) {
                this.lookingDirection = "right";
            }else if(this.x + this.width >= canvas.width - wallBrickWidth) {
                this.lookingDirection = "left";
            }
            this.image.src = `graphics/enemies/${this.enemyType}/attack/attack-${this.lookingDirection}-${i}.png`;
            i++;
            if(i === 7) { i = 0; }
            requestAnimationFrame(()=>{ this.animateWalking(i) });
        }
    }

    animateHit(hitAmount) {
        if (this.hitable) {
            this.hitAnimationIndexI++;
            if (this.hitAnimationIndexI % 5 === 0) {
                this.image.src = `graphics/enemies/${this.enemyType}/hit/hit-${this.lookingDirection}-${(this.hitAnimationIndexI / 5) % 5}.png`;
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