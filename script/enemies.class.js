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
    walks;
    hittingAnimationId;
    hittingAnimationIndex;
    hittingIndex;
    walkingIndex;
    hitable = true;
    canWalk = true;

    constructor(x, y, width, height, imgPath, enemyType, decreaseLifeAmount, canShoot, lookingDirection, lifeAmount, walks, hitImagesAmount) {
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
        this.hitImagesAmount = hitImagesAmount;
        this.hittingIndex = 0;
        this.hittingAnimationIndex = 0;
        this.walkingIndex = 0;
        this.checkCharPos();
    }

    checkCharPos() {
        if(this.isDangerous) {
            if(this.checkIfCanSeeChar()) { this.lookAtChar(); }
            if(this.checkIfHittingChar()) { this.hittingChar(); }
            if(this.checkIfGotHit() && this.isDangerous) {
                this.isDangerous = false;
                this.lifeAmount -= char.headJumpAmount;
                this.hittingAnimationId = setInterval(() => { this.animateEnemyGotHit(); }, 500/this.hitImagesAmount);
            }else {
                this.walks = false;
                this.targeting = false;
            }
        }
        requestAnimationFrame(()=>{this.checkCharPos()});
    }

    checkIfCanSeeChar() {
        if(char.y + char.height > this.y && this.y + this.height > char.y) {
            if(char.x + char.width <= this.x) {
                if(Math.abs(char.x + char.width - this.x) <= this.distanceToSeeChar) {
                    return true;
                }else { return false; }
            }else if(char.x >= this.x + this.width) {
                if(Math.abs(this.x + this.width - char.x) <= this.distanceToSeeChar) {
                    return true;
                }else { return false; }
            }
        }else { return false; }
    }

    lookAtChar() {
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
        this.atLookingAtChar();
    }

    atLookingAtChar() {
        if(Math.abs(char.x + char.width - this.x) <= this.distanceToSeeChar/2 || Math.abs(this.x + this.width - char.x) <= this.distanceToSeeChar/2) {
            this.targeting = false;
            if(this.canWalk && !this.walks) {
                this.walks = true;
                this.animateWalking();
            }
        }else if(Math.abs(char.x + char.width - this.x) > this.distanceToSeeChar/2 || Math.abs(this.x + this.width - char.x) >= this.distanceToSeeChar/2) {
            this.targeting = true;
            this.walks = false;
            if(this.animateWalkingId) { clearInterval(this.animateWalkingId); }
            this.setupCannonball();
        }
    }

    checkIfHittingChar() {
        if(char.x + char.width > this.x && char.x < this.x + this.width) {
            return true;
        }else { return false; }
    }

    hittingChar() {
        if(this.enemyType === "flyable") {
            if(char.y + char.height > this.y && this.y + this.height > char.y) {
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

    checkIfGotHit() {
        if(char.y + char.height <= this.y && Math.abs(this.y - (char.y + char.height)) < char.jumpFallStepHeight) {
            if(char.x + char.width > this.x && this.x + this.width > char.x) {
                return true; 
            }else { return false; }
        }else { return false; }
    }

    animateWalking() {
        console.log(this.animateWalkingId);
        if(this.walks && this.isDangerous) {
            this.x = this.lookingDirection === "right" ? this.x += wallBrickWidth/5 : this.x -= wallBrickWidth/5;
            this.image.src = `graphics/enemies/${this.enemyType}/attack/attack-${this.lookingDirection}-${this.walkingIndex}.png`;
            this.walkingIndex++;
            if(this.walkingIndex === 7) { this.walkingIndex = 0; }
            this.animateWalkingId = setInterval(()=>{ this.animateWalking(); }, 30);
        }
    }

    animateEnemyGotHit() {
        this.image.src = `graphics/enemies/${this.enemyType}/hit/hit-${this.lookingDirection}-${this.hittingIndex}.png`;
        this.hittingIndex++;
        if (this.hittingIndex === this.hitImagesAmount) {
            this.hittingIndex = 0;
            this.hittingAnimationIndex++;
            if(this.hittingAnimationIndex === 2) {
                this.hittingAnimationIndex = 0;
                if (this.lifeAmount <= 0) {
                    this.lifeAmount = 0;
                    this.image.src = '';
                    this.isDangerous = false;
                    clearInterval(this.hittingAnimationId);
                    return;
                }else if(this.lifeAmount > 0) {
                    this.isDangerous = true;
                    clearInterval(this.hittingAnimationId);
                    return;
                }
            }//else { this.image.src = this.standardImgPath; }
        }
        return;
    }

    isDangerousAgain() {
        this.isDangerous = true;
    }
}