class Figure {
    width;
    height;
    x;
    y;
    src;
    notAtWall;
    stepLength;
    startingYPos;
    standingPlatformIndex;
    onMovingPlatform;
    jumps;
    falls;
    distanceCharMovingPlatformX;
    jumpFallStepHeight;
    maxJumpHeight;
    hittingEnemyIndex;
    hittingTrapIndex;
    hittingFlyableIndex;
    basicStepLength;
    healthAmount = 100;
    timeNextHit = 0;
    stepAmount = 0;
    movingDirection = 'right';
    figImage = new Image();
    isAlive = true;
    sleeps = false;
    gotHit = false;
    isImmune = false;
    landedOnPlatform = false;
    targeted = false;

    constructor(width, height, x, y, src, stepLength, maxJumpHeight = 5 * wallBrickHeight) {
        this.width = width;
        this.height = 27 * width / 23;
        this.x = x;
        this.y = y;
        this.src = src;
        this.figImage.src = this.src;
        this.stepLength = stepLength;
        this.basicStepLength = stepLength;
        this.notAtWall = true;
        this.jumps = false;
        this.jumpFallStepHeight = wallBrickHeight / 3;
        this.maxJumpHeight = maxJumpHeight;
        this.sleeps = false;
    }

    moveLeft(key) {
        if (controller['left'].pressed) {
            if (!gamePaused && this.isAlive) {
                if (this.standingPlatformIndex >= 0 && this.standingPlatformIndex < platforms.length) {
                    if (this.checkPlatformEnd()) { this.checkIfFalling(); }
                }
                this.setMovingState(key);
                if (this.x <= this.stepLength + wallBrickWidth) {
                    this.x = wallBrickWidth + 1;
                    controller['left'].pressed = false;
                    return;
                } else { this.x -= this.stepLength; }
                //this.checkHitablesXCoords();
            }
            requestAnimationFrame(() => { this.moveLeft(key) });
        }
    }

    moveRight(key) {
        if (controller['right'].pressed) {
            if (!gamePaused && this.isAlive) {
                if (this.standingPlatformIndex > -1 && this.standingPlatformIndex < platforms.length) {
                    if (this.checkPlatformEnd()) {
                        this.checkIfFalling();
                    }
                }
                this.setMovingState(key);
                if (canvas.width - this.x - this.width - wallBrickWidth <= this.stepLength) {
                    this.x = canvas.width - this.width - wallBrickWidth;
                    controller['right'].pressed = false;
                    return;
                } else {
                    if (this.x + this.width - canvas.width >= 0) {
                        this.x += (canvas.width - this.x - this.width);
                    } else { this.x += this.stepLength; }
                }
                //this.checkHitablesXCoords();
            }
            requestAnimationFrame(() => { this.moveRight(key) });
        }
    }

    setMovingState(key) {
        if (!gamePaused && this.isAlive) {
            if (key === "ArrowRight") {
                this.movingDirection = 'right';
                this.stepAmount++;
            } else {
                this.movingDirection = 'left';
                this.stepAmount--;
            }
            if (this.isAlive) {
                this.setImagePath(`../graphics/main-char/run/run-${this.movingDirection}-${Math.abs(this.stepAmount % 12)}.png`);
            }
        }
    }

    checkIfJumping() {
        if (!gamePaused && this.isAlive) {
            if (!this.jumps) {
                playSound('sounds/jump.ogg');
                this.jumps = true;
                this.jump();
            }
        }
    }

    jump(i = this.maxJumpHeight / this.jumpFallStepHeight) {
        if (!gamePaused && this.isAlive && !this.falls) {
            this.onMovingPlatform = false;
            this.falls = false;
            this.stepAmount = 0;
            this.setImagePath(`../graphics/main-char/jump/jump-${this.movingDirection}.png`);
            if (!this.startingYPos) { this.startingYPos = this.y; }
            i--;
            this.y -= this.jumpFallStepHeight;
            if (i <= 0 || this.y <= wallBrickHeight) {
                this.maxJumpHeight = 5*wallBrickWidth;
                this.checkIfFalling(i);
                return;
            }
            requestAnimationFrame(() => { this.jump(i); });
          }
    }

    checkIfFalling() {
        if (!gamePaused && this.isAlive) {
            if (!this.falls) {
                this.falls = true;
                this.fall();
            }
        }
    }

    fall() {
        if (!gamePaused && this.isAlive) {
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
                this.falls = false;
                return;
            } else if (canvas.height - wallBrickHeight - (this.y + this.height) <= this.jumpFallStepHeight) {
                this.jumps = false;
                this.falls = false;
                this.standingPlatformIndex = -1;
                this.startingYPos = canvas.height - wallBrickHeight - this.height;
                this.y = canvas.height - wallBrickHeight - this.height;
                if (!this.gotHit) { this.setImagePath(`../graphics/main-char/run/run-${this.movingDirection}-${Math.abs(this.stepAmount % 12)}.png`); }
            }

            if (this.startingYPos === this.y) {
                this.jumps = false;
                this.falls = false;
                this.startingYPos = null;
                this.stepAmount = 0;
                if (!this.gotHit) { this.setImagePath(`../graphics/main-char/run/run-${this.movingDirection}-${Math.abs(this.stepAmount % 12)}.png`); }
                return;
            }
            //this.checkHitablesXCoords();
            this.y += this.jumpFallStepHeight;
        }
        requestAnimationFrame(() => {
            this.fall();
        });
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
                        this.x = platforms[this.standingPlatformIndex].x + this.distanceCharMovingPlatformX + this.stepAmount * this.stepLength;
                    }else {
                        this.y = platforms[this.standingPlatformIndex].y - this.height;
                        this.startingYPos = platforms[this.standingPlatformIndex].y;
                        //this.checkIfFalling();
                    }
                }
                requestAnimationFrame(() => {this.movingWithPlatform();});
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
        this.animateHit();
        if(this.hittingTrapIndex > -1) {
            this.decreaseHealth(hitables.traps[this.hittingTrapIndex].trapType);
        }else if(this.hittingEnemyIndex > -1) {
            this.decreaseHealth(hitables.enemies[this.hittingEnemyIndex].enemyType);
        }else if(this.hittingFlyableIndex > -1) {

            this.decreaseHealth(hitables.flyables[this.hittingFlyableIndex].enemyType);
        }
        setTimeout(() => { this.gotHit = false;
         }, 1500);
    }

    animateHit(i = 0) {
        if (this.gotHit) {
            if (this.isAlive) {
                this.setImagePath(`../graphics/main-char/hit/hit-${this.movingDirection}-${i}.png`);
            }
            i++;
            if (i === 7) { i = 0 }
            requestAnimationFrame(() => { this.animateHit(i) });
        } else if (this.isAlive) {
            this.setImagePath(`../graphics/main-char/run/run-${this.movingDirection}-${Math.abs(this.stepAmount % 12)}.png`);
        }
    }

    decreaseHealth(type) {
        if (!this.isImmune) {
            playSound('sounds/hit.ogg');
            this.isImmune = true;
            if(this.hittingTrapIndex > -1) {
                this.healthAmount -= hitables.traps[this.hittingTrapIndex].decreaseLifeAmount;
            }else if(this.hittingEnemyIndex > -1) {
                this.healthAmount -= hitables.enemies[this.hittingEnemyIndex].decreaseLifeAmount;
            }else if(this.hittingFlyableIndex > -1) {
                this.healthAmount -= hitables.flyables[this.hittingFlyableIndex].decreaseLifeAmount;
            }
            if (this.healthAmount <= 0) {
                this.healthAmount = 0;
                this.isAlive = false;
                this.setImagePath(`../graphics/main-char/dead/dead-${this.movingDirection}.png`);
                return;
            }
            setTimeout(() => {this.isImmune = false }, 1500);
        }
    }

    setImagePath(path) {
        if (this.isAlive) {
            this.figImage.src = path;
        } else {
            this.figImage.src = `../graphics/main-char/dead/dead-${this.movingDirection}.png`;
        }
    }
}