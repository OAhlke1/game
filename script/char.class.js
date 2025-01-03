class Char {
    width;
    height;
    x;
    y;
    standardX;
    standardY;
    standardImgPath;
    atWallLeft;
    atWallRight;
    startingYPos;
    standingPlatformIndex;
    onMovingPlatform;
    jumps;
    falls;
    distanceCharMovingPlatformX;
    jumpFallStepHeight;
    maxJumpHeight;
    basicStepLength;
    headJumpAmount;
    movingAnimationId;
    fallAnimationId;
    hittingAnimationId;
    hitImagesAmount;
    bulletAmount;
    stepLength;
    standardStepLength;
    scrollingStepAmount;
    maxHealthAmount;
    hittingAnimationIndex;
    hittingAnimationStep;
    healthAmount;
    timeNextHit;
    stepAmount;
    totalStepAmount;
    enemiesKilled;
    movingDirection;
    figImage;
    isAlive;
    sleeps;
    gotHit;
    isImmune;
    landedOnPlatform;
    targeted;
    onUpwardsMovingPlatform;
    specialAmmoParts;
    shootingSound;

    constructor(width, height, x, y, standardImgPath, stepLength, maxJumpHeight, specialAmmoParts = 0) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.standardX = x;
        this.y = y;
        this.standardY = y;
        this.standardImgPath = standardImgPath;
        this.stepLength = stepLength;
        this.standardStepLength = stepLength;
        this.basicStepLength = stepLength;
        this.atWallLeft = false;
        this.atWallRight = false;
        this.jumps = false;
        this.jumpFallStepHeight = heightUnit / 3;
        this.maxJumpHeight = maxJumpHeight;
        this.sleeps = false;
        this.headJumpAmount = 50;
        this.hitImagesAmount = 8;
        this.bulletAmount = 10;
        this.maxHealthAmount = 200;
        this.standingPlatformIndex = 0;
        this.scrollingStepAmount = 0;
        this.hittingAnimationIndex = 0;
        this.hittingAnimationStep = 0;
        this.healthAmount = 200;
        this.timeNextHit = 0;
        this.stepAmount = 0;
        this.totalStepAmount = 0;
        this.enemiesKilled = 0;
        this.movingDirection = 'right';
        this.figImage = new Image();
        this.figImage.src = this.standardImgPath;
        this.isAlive = true;
        this.sleeps = false;
        this.gotHit = false;
        this.isImmune = false;
        this.landedOnPlatform = false;
        this.targeted = false;
        this.onUpwardsMovingPlatform = false;
        this.specialAmmoParts = specialAmmoParts;
    }

    moveLeft(key) {
        if (controller['left'].pressed) {
            if (!gamePaused && this.isAlive) {
                ////checkIfStandingAtPlatform(if(!this.atWallLeft && !this.falls) { this.atWallLeft = this.checkIfStandingAtPlatform(); }
                if (this.standingPlatformIndex >= 0 && this.standingPlatformIndex < platforms.length && this.checkPlatformEnd()) {
                    this.checkIfFalling();
                }
                this.setMovingState(key);
                checkForScrolling();
                if (this.x <= this.stepLength + widthUnit) {
                    this.x = widthUnit + 1;
                    controller['left'].pressed = false;
                    return;
                } else { this.x = this.atWallLeft ? this.x : this.x - this.stepLength; }
            }
            setTimeout(() => { this.moveLeft(key) }, 10);
        }
    }

    moveLeftTouch(key) {
        if(controller['left'].pressed) {
            if (!gamePaused && this.isAlive) {
                //checkIfStandingAtPlatform(if(!this.atWallLeft && !this.falls) { this.atWallLeft = this.checkIfStandingAtPlatform(); }
                if (this.standingPlatformIndex >= 0 && this.standingPlatformIndex < platforms.length && this.checkPlatformEnd()) {
                    this.checkIfFalling();
                }
                this.setMovingState(key);
                checkForScrolling();
                if (this.x <= this.stepLength + widthUnit) {
                    this.x = widthUnit + 1;
                    controller['left'].pressed = false;
                    return;
                } else { this.x = this.atWallLeft ? this.x : this.x - this.stepLength; }
            }
            setTimeout(() => { this.moveLeft(key) }, 10);
        }
    }

    moveRight(key) {
        if (controller['right'].pressed) {
            if (!gamePaused && this.isAlive) {
                //if(!this.atWallRight && !this.falls) { this.atWallRight = this.checkIfStandingAtPlatform(); }
                if (this.standingPlatformIndex > -1 && this.standingPlatformIndex < platforms.length && this.checkPlatformEnd()) {
                    this.checkIfFalling();
                }
                this.setMovingState(key);
                checkForScrolling();
                if (canvas.offsetWidth - this.x - this.width - widthUnit <= this.stepLength) {
                    this.x = canvas.offsetWidth - this.width - widthUnit;
                    controller['right'].pressed = false;
                    return;
                } else {
                    if (this.x + this.width - canvas.offsetWidth >= 0) {
                        this.x += (canvas.offsetWidth - this.x - this.width);
                    } else { this.x = this.atWallRight ? this.x : this.x + this.stepLength; }
                }
            }
            setTimeout(() => { this.moveRight(key) }, 10);
        }
    }

    moveRightTouch(key) {
        if(controller['right'].pressed) {
            if (!gamePaused && this.isAlive) {
                //if(!this.atWallRight && !this.falls) { this.atWallRight = this.checkIfStandingAtPlatform(); }
                if (this.standingPlatformIndex > -1 && this.standingPlatformIndex < platforms.length && this.checkPlatformEnd()) {
                    this.checkIfFalling();
                }
                this.setMovingState(key);
                checkForScrolling();
                if (canvas.offsetWidth - this.x - this.width - widthUnit <= this.stepLength) {
                    this.x = canvas.offsetWidth - this.width - widthUnit;
                    controller['right'].pressed = false;
                    return;
                } else {
                    if (this.x + this.width - canvas.offsetWidth >= 0) {
                        this.x += (canvas.offsetWidth - this.x - this.width);
                    } else { this.x = this.atWallRight ? this.x : this.x + this.stepLength; }
                }
            }
            setTimeout(() => { this.moveRight(key) }, 10);
        }
    }

    setMovingState(key) {
        if (!gamePaused && this.isAlive) {
            if (key === "ArrowRight") {
                this.movingDirection = 'right';
                this.stepAmount++;
                checkForScrolling();
            } else {
                this.movingDirection = 'left';
                this.stepAmount--;
                checkForScrolling();
            }
            if (this.isAlive) {
                this.setImagePath(`../graphics/main-char/run/run-${this.movingDirection}-${Math.abs(this.stepAmount % 12)}.png`);
            }
        }
    }

    checkIfJumping() {
        if (!gamePaused && this.isAlive) {
            if (!this.jumps) {
                if(!gameMuted) { playSound('./sounds/jump.ogg'); }
                this.jumps = true;
                this.jump();
            }
        }
    }

    jump(i = this.maxJumpHeight / this.jumpFallStepHeight) {
        if (!gamePaused && this.isAlive && !this.falls) {
            this.onMovingPlatform = false;
            this.atWallLeft = false;
            this.atWallRight = false;
            this.stopFalling();
            this.stepAmount = 0;
            this.setImagePath(`../graphics/main-char/jump/jump-${this.movingDirection}.png`);
            if (!this.startingYPos) { this.startingYPos = this.y; }
            i--;
            this.y -= this.jumpFallStepHeight;
            if (i <= 0 || this.y <= heightUnit) {
                this.checkIfFalling(i);
                return;
            }
            setTimeout(() => { this.jump(i); }, 10);
        }
    }

    checkIfFalling() {
        if (!gamePaused && this.isAlive) {
            if (!this.falls) {
                this.falls = true;
                this.fallAnimationId = setInterval(() => { this.fall(); }, 10);
            }
        }
    }

    fall() {
        if (!gamePaused && this.isAlive) {
            if (!this.gotHit) { this.setImagePath(`../graphics/main-char/run/run-${this.movingDirection}-${Math.abs(this.stepAmount % 12)}.png`); }
            if (this.checkPlatformXCords()) {
                this.setImagePath(`../graphics/main-char/run/run-${this.movingDirection}-0.png`);
                this.startingYPos = null;
                this.jumps = false;
                if (platforms[this.standingPlatformIndex].isMoving) {
                    this.onMovingPlatform = true;
                    this.startingPointX = this.x;
                    this.distanceCharMovingPlatformX = this.x - platforms[this.standingPlatformIndex].x;
                    this.movingWithPlatform();
                }
                this.stopFalling();
                return;
            } else if (this.y >= canvas.offsetHeight) {
                this.jumps = false;
                this.falls = false;
                this.healthAmount -= 50;
                this.stopFalling();
                if(this.healthAmount > 0) {
                    this.hitChar();
                    gamePaused = true;
                    resetScreenPosition(parseInt(canvas.style.left));
                }else {
                    this.healthAmount = 0;
                    resetGame();
                }
            }

            if (this.startingYPos === this.y) {
                this.jumps = false;
                this.startingYPos = null;
                this.stepAmount = 0;
                this.stopFalling();
                return;
            }
            this.y += this.jumpFallStepHeight;
        }
    }

    stopFalling() {
        this.falls = false;
        clearInterval(this.fallAnimationId);
    }

    checkPlatformXCords() {
        if (!gamePaused && this.isAlive) {
            for (let i = 0; i < platforms.length; i++) {
                if (platforms[i].x - (this.x + this.width) >= 0 || this.x - (platforms[i].x + platforms[i].width) >= 0) {
                    if (i + 1 === platforms.length) {
                        this.startingYPos = null;
                        return false;
                    }
                } else {
                    if (this.checkPlatformYCords(i)) {
                        this.standingPlatformIndex = i;
                        this.landed = true;
                        this.stepAmount = 0;
                        return true;
                    }
                }
            }
        }
    }

    checkPlatformYCords(i) {
        if (!gamePaused && this.isAlive) {
            if (platforms[i].y - (this.y + this.height) <= this.jumpFallStepHeight && platforms[i].y - (this.y + this.height) >= 0) {
                this.y = platforms[i].y - this.height;
                return true;
            } else {
                if (i + 1 === platforms.length) { return false; }
            }
        }
    }

    movingWithPlatform() {
        if (!gamePaused && this.isAlive) {
            if (this.onMovingPlatform) {
                if (this.checkPlatformEnd()) {
                    this.checkIfFalling();
                    return;
                }else {
                    if(platforms[this.standingPlatformIndex].sideways) {
                        this.x = platforms[this.standingPlatformIndex].x + this.distanceCharMovingPlatformX + this.stepAmount * this.standardStepLength;
                    }else {
                        this.onUpwardsMovingPlatform = true;
                        this.y = platforms[this.standingPlatformIndex].y - this.height;
                    }
                }
                setTimeout(() => {this.movingWithPlatform();}, 10);
            }
            return;
        }
    }

    checkPlatformEnd() {
        if(!this.jumps) {
            if (!gamePaused && this.isAlive) {
                if (this.movingDirection === 'left') {
                    if (platforms[this.standingPlatformIndex].x - this.x - this.width <= 0) {
                        return false;
                    } else {
                        this.startingYPos = null;
                        return true;
                    }
                } else if (this.movingDirection === 'right') {
                    if (platforms[this.standingPlatformIndex].x + platforms[this.standingPlatformIndex].width <= this.x) {
                        this.startingYPos = null;
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }
    }

    hitChar() {
        this.gotHit = true;
        this.hittingAnimationId = setInterval(()=>{ this.animateHit(); }, 20);
        saveCharProperties();
        setTimeout(() => { this.gotHit = false; }, 1500);
    }

    animateHit() {
        if (this.gotHit) {
            if (this.isAlive) { this.setImagePath(`../graphics/main-char/hit/hit-${this.movingDirection}-${this.hittingAnimationIndex}.png`); }
            this.hittingAnimationIndex++;
            if (this.hittingAnimationIndex === this.hitImagesAmount) {
                this.hittingAnimationIndex = 0
                this.hittingAnimationStep++;
                if(this.hittingAnimationStep === 2) {
                    clearInterval(this.hittingAnimationId);
                }
            }
        } else if (this.isAlive) {
            this.setImagePath(`../graphics/main-char/run/run-${this.movingDirection}-${Math.abs(this.stepAmount % 12)}.png`);
        }
    }

    decreaseHealth(decreasingAmount) {
        if (!this.isImmune) {
            if(!gameMuted) { playSound('./sounds/hit.ogg'); }
            this.isImmune = true;
            this.healthAmount -= decreasingAmount;
            if (this.healthAmount <= 0) {
                this.healthAmount = 0;
                this.isAlive = false;
                gamePaused = true;
                this.setImagePath(`../graphics/main-char/dead/dead-${this.movingDirection}.png`);
                return;
            }
            saveCharProperties();
            setMenuBarProperties("char");
            setTimeout(() => {this.isImmune = false }, 1500);
        }
    }

    saveCharProperties() {
        gameJson.char = char;
        localStorage.setItem('gameJson', JSON.stringify(gameJson));
    }

    setImagePath(path) {
        if (this.isAlive) {
            this.figImage.src = path;
        } else {
            this.figImage.src = `../graphics/main-char/dead/dead-${this.movingDirection}.png`;
        }
    }
}