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
                //this.checkHitablesXCoords();

                if (this.checkPlatformEnd()) {
                    this.checkIfFalling();
                    return;
                }
                this.x = platforms[this.standingPlatformIndex].x + this.distanceCharMovingPlatformX + this.stepAmount * this.stepLength;
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

    /* checkHitablesXCoords() {
        if (this.checkTrapXCords()) { this.hitChar(); }
        if (this.checkEnemyXCords()) { this.hitChar(); }
        if(this.checkFlyableXCords()) { this.hitChar(); }
    }

    checkTrapXCords() {
        if (!gamePaused && this.isAlive) {
            for (let i = 0; i < hitables.traps.length; i++) {
                if (hitables.traps[i].x - (this.x + this.width) >= 0 || this.x - (hitables.traps[i].x + hitables.traps[i].width) >= 0) {
                    if (i + 1 === hitables.traps.length) {
                        this.startingYPos = null;
                        return false;
                    }
                } else if (this.checkTrapYCords(i)) {
                    this.hittingTrapIndex = i;
                    this.hittingEnemyIndex = -1;
                    this.hittingFlyableIndex = -1;
                    return true;
                }
            }
        }
    }

    checkTrapYCords(i) {
        if (!gamePaused && this.isAlive) {
            if (this.y + this.height > hitables.traps[i].y && hitables.traps[i].y + hitables.traps[i].height > this.y) {
                return true;
            } else {
                if (i + 1 === hitables.traps.length) { return false; }
            }
        }
    }

    checkEnemyXCords() {
        if (!gamePaused && this.isAlive) {
            for (let i = 0; i < hitables.enemies.length; i++) {
                if(hitables.enemies[i]) {
                    if (hitables.enemies[i].x - (this.x + this.width) >= 0 || this.x - (hitables.enemies[i].x + hitables.enemies[i].width) >= 0) {
                        if(hitables.enemies[i].canShoot) {
                            if(hitables.enemies[i].checkIfTargeting() && !hitables.enemies[i].targeting) {
                                hitables.enemies[i].targeting = true;
                                hitables.enemies[i].shoots = true;
                                hitables.enemies[i].setupCannonball();
                            }else if(!hitables.enemies[i].checkIfTargeting()) {
                                hitables.enemies[i].targeting = false;
                                hitables.enemies[i].shoots = false;
                            }
                        }
                        if (i + 1 === hitables.enemies.length) {
                            this.startingYPos = null;
                            return false;
                        }
                    } else if (this.checkEnemyYCords(i) && hitables.enemies[i].isDangerous) {
                        this.hittingTrapIndex = -1;
                        this.hittingEnemyIndex = i;
                        this.hittingFlyableIndex = -1;
                        return true;
                    }                    
                }
            }
        }
    }

    checkEnemyYCords(i) {
        if (!gamePaused && this.isAlive) {
            if(Math.abs(this.y + this.height - hitables.enemies[i].y) < this.jumpFallStepHeight && this.y < hitables.enemies[i].y && this.falls) {
                if(hitables.enemies[i].isDangerous) {
                    hitables.enemies[i].isDangerous = false;
                    hitables.enemies[i].animateHit();
                }
                this.startingYPos = this.y;
                this.jumps = true;
                this.checkIfJumping();
                return false;
            }else if (this.y + this.height > hitables.enemies[i].y && hitables.enemies[i].y + hitables.enemies[i].height > this.y) { // || hitables.enemies[i].y + hitables.enemies[i].height - this.y < 0
                return true;
            } else {
                if (i + 1 === hitables.enemies.length) { return false; }
            }
        }
    }

    checkFlyableXCords() {
        if (!gamePaused && this.isAlive) {
            for (let i = 0; i < hitables.flyables.length; i++) {
                if(hitables.flyables[i]) {
                    if (hitables.flyables[i].x - (this.x + this.width) >= 0 || this.x - (hitables.flyables[i].x + hitables.flyables[i].width) >= 0) {
                        if (i + 1 === hitables.flyables.length) {
                            //this.startingYPos = null;
                            return false;
                        }
                    } else if (this.checkFlyableYCords(i) && hitables.flyables[i].isDangerous) {
                        this.hittingTrapIndex = -1;
                        this.hittingEnemyIndex = -1;
                        this.hittingFlyableIndex = i;
                        return true;
                    }                    
                }
            }
        }
    }

    checkFlyableYCords(i) {
        if (!gamePaused && this.isAlive) {
            if(Math.abs(this.y + this.height - hitables.flyables[i].y) < this.jumpFallStepHeight && this.y < hitables.flyables[i].y && this.falls) {
                if(hitables.flyables[i].isDangerous) {
                    hitables.flyables[i].isDangerous = false;
                    hitables.flyables[i].animateHit();
                }
                this.startingYPos = this.y;
                this.jumps = true;
                this.checkIfJumping();
                return false;
            }else if (this.y + this.height > hitables.flyables[i].y && hitables.flyables[i].y + hitables.flyables[i].height > this.y) { // || hitables.flyables[i].y + hitables.flyables[i].height - this.y < 0
                return true;
            } else {
                if (i + 1 === hitables.flyables.length) { return false; }
            }
        }
    } */

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
                console.log(this.hittingFlyableIndex);
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