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
            if(this.checkIfCanSeeChar()) { this.lookAtChar(); }
            if(this.checkIfHittingChar()) { this.hittingChar(); }
            if(this.checkIfGotHit()) { this.animateEnemyGotHit(); }
            else {
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
        if(this.walks && this.isDangerous) {
            this.x = this.lookingDirection === "right" ? this.x += wallBrickWidth/10 : this.x -= wallBrickWidth/10;
            this.image.src = `graphics/enemies/${this.enemyType}/attack/attack-${this.lookingDirection}-${i}.png`;
            i++;
            if(i === 7) { i = 0; }
            requestAnimationFrame(()=>{ this.animateWalking(i); });
        }
    }

    animateEnemyGotHit(i = 0) {
        if(i === 0) { this.isDangerous = false; }
        if (i % this.hitImagesAmount === 0) { this.image.src = `graphics/enemies/${this.enemyType}/hit/hit-${this.lookingDirection}-${(i / this.hitImagesAmount) % this.hitImagesAmount}.png`; }
        i++;
        if(i < 10*this.hitImagesAmount) {
            requestAnimationFrame(() => {this.animateEnemyGotHit(i)});
        }else if (i === 10*this.hitImagesAmount) {
            this.lifeAmount -= char.headJumpAmount;
            if (this.lifeAmount <= 0) {
                this.lifeAmount = 0;
                this.image.src = '';
                return;
            }else { this.image.src = this.standardImgPath; }
            setTimeout(() => { this.isDangerousAgain(); }, 1500);
            //this.isDangerousAgain();
            return;
        }
        return;
    }

    isDangerousAgain() {
        this.isDangerous = true;
    }
}