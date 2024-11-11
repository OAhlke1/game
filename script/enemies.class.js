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
    standardImgPath;
    hitable = true;
    canWalk = true;
    walks;
    gotHit = false;
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
        this.hitImagesAmount = 12;
    }

    checkCharPos() {
        if(this.isDangerous) {
            if(char.y + char.height >= this.y && this.y + this.height > char.y) {
                this.checkIfTargeting();
                this.checkIfHittingChar();
                if(this.checkIfGotHit() && this.isDangerous) { this.animateHit(50); }
            }else {
                this.walks = false;
                this.targeting = false;
            }
            requestAnimationFrame(()=>{this.checkCharPos()});
        }
    }

    lookAtChar() {
        if(this.isDangerous) {
            if(this.x > char.x + char.width) {
                if(this.lookingDirection === "right") {
                    this.lookingDirection = "left";
                    this.image.src = `graphics/enemies/${this.enemyType}/attack/attack-${this.lookingDirection}-0.png`;
                }
            }else if(this.x + this.width < char.x) {
                if(this.lookingDirection === "left") {
                    this.lookingDirection = "right";
                    this.image.src = `graphics/enemies/${this.enemyType}/attack/attack-${this.lookingDirection}-0.png`;
                }
            }
        }
    }

    checkIfTargeting() {
        if(Math.abs(char.x + char.width - this.x) <= this.distanceToSeeChar || Math.abs(this.x + this.width - char.x) <= this.distanceToSeeChar) {
            this.lookAtChar();
            if(Math.abs(char.x + char.width - this.x) <= this.distanceToSeeChar/2 || Math.abs(this.x + this.width - char.x) <= this.distanceToSeeChar/2) {
                this.targeting = false;
                if(this.canWalk) {
                    this.walks = true;
                    this.animateWalking();
                }
            }else if(Math.abs(char.x + char.width - this.x) > this.distanceToSeeChar/2 || Math.abs(this.x + this.width - char.x) >= this.distanceToSeeChar/2) {
                this.targeting = true;
                this.walks = false;
                this.setupCannonball();
            }
        }
    }

    checkIfHittingChar() {
        if(char.x + char.width > this.x && char.x < this.x + this.width) {
            if(this.enemyType === "flyable") {
                if(char.y + char.height > this.y && char.y < this.y + this.height) {
                    char.hitChar();
                    char.decreaseHealth(this.decreaseLifeAmount);
                }
            }else {
                if(char.y + char.height > this.y) {
                    char.hitChar();
                    char.decreaseHealth(this.decreaseLifeAmount);
                }
            }
        }
    }

    checkIfGotHit() {
        if(char.y + char.height >= this.y && Math.abs(this.y - (char.y + char.height)) < char.jumpFallStepHeight) {
            if(char.x + char.width > this.x && this.x + this.width > char.x) {
                return true;
            }
        }
    }

    /* animateWalking(i = 0) {
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
    } */

    animateWalking(i = 0) {
        if(this.walks && !this.gotHit && this.isDangerous) {
            this.x = this.lookingDirection === "right" ? this.x += wallBrickWidth/100 : this.x -= wallBrickWidth/100;
            this.image.src = `graphics/enemies/${this.enemyType}/attack/attack-${this.lookingDirection}-${i}.png`;
            i++;
            if(i === 7) { i = 0; }
            requestAnimationFrame(()=>{ this.animateWalking(i); });
        }
    }

    animateHit(i = 0) {
        if (i % this.hitImagesAmount === 0) { this.image.src = `graphics/enemies/${this.enemyType}/hit/hit-${this.lookingDirection}-${(i / this.hitImagesAmount) % this.hitImagesAmount}.png`; }
        if (i === this.hitImagesAmount * (this.hitImagesAmount-1)) {
            this.lifeAmount -= char.headJumpAmount;
            if (this.lifeAmount <= 0) {
                this.lifeAmount = 0;
                this.image.src = '';
                this.isDangerous = false;
                return;
            } else { this.image.src = this.standardImgPath; }
            if(this.lifeAmount) { setTimeout(() => { this.isDangerous = true; }, 1500); }
            return;
        }
        //console.log(this.hitImagesAmount, i, i % this.hitImagesAmount === 0, this.image.src.includes('attack'));
        i++;
        if(i < 75) {requestAnimationFrame(() => { this.animateHit(i) });}
        return;
    }

    isDangerousAgain() {
        this.isDangerous = true;
    }
}