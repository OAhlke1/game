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
    isAlive = true;
    sleeps = false;
    gotHit = false;
    isImmune = false;
    landedOnPlatform = false;
    hitByEnemy;
    hitByTrap;
    hittingTrapIndex;
    healthAmount = 100;
    timeNextHit = 0;
    stepAmount = 0;
    movingDirection = 'right';
    figImage = new Image();

    constructor(width, height, x, y, src, stepLength, maxJumpHeight = 5 * wallBrickHeight) {
        this.width = width;
        this.height = 27 * width / 23;
        this.x = x;
        this.y = y;
        this.src = src;
        this.figImage.src = this.src;
        this.stepLength = stepLength;
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
                if (this.checkTrapXCords()) { this.hitChar(); }
                if(this.checkEnemyXCords()) { this.hitChar() }
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
                if(this.checkEnemyXCords()) { this.hitChar() }
                if (this.checkTrapXCords()) { this.hitChar(); }
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
            this.jumps = true;
            this.falls = false;
            this.stepAmount = 0;
            this.setImagePath(`../graphics/main-char/jump/jump-${this.movingDirection}.png`);
            if (!this.startingYPos) { this.startingYPos = this.y; }
            i--;
            this.y -= this.jumpFallStepHeight;
            if (i <= 0 || this.y <= wallBrickHeight) {
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

            if (this.checkTrapXCords()) { this.hitChar(); }

            if(this.checkEnemyXCords()) { this.hitChar() }
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
                if (this.checkTrapXCords()) {
                    this.hitChar();
                }

                if (this.checkPlatformEnd()) {
                    this.checkIfFalling();
                    return;
                }
                this.x = platforms[this.standingPlatformIndex].x + this.distanceCharMovingPlatformX + this.stepAmount * this.stepLength;
                requestAnimationFrame(() => {
                    this.movingWithPlatform();
                });
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

    checkTrapXCords() {
        if (!gamePaused && this.isAlive) {
            for (let i = 0; i < traps.length; i++) {
                if (traps[i].x - (this.x + this.width) >= 0 || this.x - (traps[i].x + traps[i].width) >= 0) {
                    if (i + 1 === traps.length) {
                        this.startingYPos = null;
                        return false;
                    }
                } else if (this.checkTrapYCords(i)) {
                    this.hitByTrap = i;
                    this.hitByEnemy = null;
                    return true;
                }
            }
        }
    }

    checkTrapYCords(i) {
        if (!gamePaused && this.isAlive) {
            if (this.y + this.height >= traps[i].y || this.y < traps[i].y + traps[i].height >= this.y) {
                return true;
            } else {
                if (i + 1 === traps.length) { return false; }
            }
        }
    }

    checkEnemyXCords() {
        if (!gamePaused && this.isAlive) {
            for (let i = 0; i < enemies.length; i++) {
                if(enemies[i]) {
                    if (enemies[i].x - (this.x + this.width) >= 0 || this.x - (enemies[i].x + enemies[i].width) >= 0) {
                        if (i + 1 === enemies.length) {
                            this.startingYPos = null;
                            return false;
                        }
                    } else if (this.checkEnemyYCords(i)) {
                        this.hitByEnemy = i;
                        this.hitByTrap = null;
                        return true;
                    }
                }
            }
        }
    }

    checkEnemyYCords(i) {
        if (!gamePaused && this.isAlive) {
            if(Math.abs(this.y + this.height - enemies[i].y) <= this.jumpFallStepHeight && this.y < enemies[i].y &&  this.falls) {
                console.log('Hi!');
                enemies[i] = null;
                return false;
            }else if (enemies[i].y - (this.y + this.height) < 0 || enemies[i].y + enemies[i].height - this.y < 0) {
                return true;
            } else {
                if (i + 1 === enemies.length) { return false; }
            }
        }
    }

    hitChar() {
        this.gotHit = true;
        this.animateHit();
        if(this.hitByTrap != null) {
            this.decreaseHealth(traps[this.hitByTrap].trapType);
        }else if(this.hitByEnemy != null) {
            this.decreaseHealth(enemies[this.hitByEnemy].enemyType);
        }
        setTimeout(() => { this.gotHit = false }, 1500);
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
            if(this.hitByTrap) {
                switch (type) {
                    case "saw":
                        this.healthAmount -= 10;
                        break;
                    case "jagged-saw":
                        this.healthAmount -= 5;
                        break;
                }
            }else if(this.hitByEnemy) {
                switch (type) {
                    case "green":
                        this.healthAmount -= 20;
                        break;
                }
            }
            if (this.healthAmount <= 0) {
                this.healthAmount = 0;
                this.isAlive = false;
                this.setImagePath(`../graphics/main-char/dead/dead-${this.movingDirection}.png`);
                return;
            }
            setTimeout(() => { this.isImmune = false }, 1500);
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