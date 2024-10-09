class Figure {
    width;
    height;
    x;
    y;
    src;
    figImage = new Image();
    notAtWall;
    stepLength;
    startingYPos;
    stepAmount = 0;
    movingDirection = 'right';
    standingPlatformIndex;
    onMovingPlatform;
    jumps;
    falls;
    distanceCharMovingPlatformX;
    jumpFallStepHeight;
    maxJumpHeight;
    sleeps = false;f

    constructor(width, height, x, y, src, stepLength, maxJumpHeight = 10 * wallBrickHeight) {
        this.width = width;
        this.height = height;
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
        if (!gamePaused) {
            if (this.standingPlatformIndex >= 0 && this.standingPlatformIndex < platforms.length) {
                if (this.checkPlatformEnd()) {
                    this.checkIfFalling();
                }
            }
            this.setMovingState(key);
            if (this.x <= this.stepLength + wallBrickWidth) {
                this.x = wallBrickWidth + 1;
                return;
            } else {
                this.x -= this.stepLength;
            }
        }
    }

    moveRight(key) {
        if (!gamePaused) {
            if (this.standingPlatformIndex >= 0 && this.standingPlatformIndex < platforms.length) { // this.y + this.height < canvas.height - wallBrickHeight
                if (this.checkPlatformEnd()) {
                    this.checkIfFalling();
                }
            }
            this.setMovingState(key);
            if (canvas.width - this.x - this.width - wallBrickWidth <= this.stepLength) {
                this.x = canvas.width - this.width - wallBrickWidth;
                return;
            } else {
                if (this.x + this.width - canvas.width >= 0) {
                    this.x += (canvas.width - this.x - this.width);
                } else {
                    this.x += this.stepLength;
                }
            }
        }
    }

    setMovingState(key) {
        if (!gamePaused) {
            if (key === "ArrowRight") {
                this.movingDirection = 'right';
                this.stepAmount++;
                this.resetFigImg(`graphics/main-char/run/run-${this.movingDirection}-${Math.abs(this.stepAmount) % 11}.png`);
            } else {
                this.movingDirection = 'left';
                this.stepAmount--;
                this.resetFigImg(`graphics/main-char/run/run-${this.movingDirection}-${11 - (Math.abs(this.stepAmount) % 11)}.png`);
            }
        }
    }

    checkIfJumping() {
        if (!gamePaused) {
            if (!this.jumps) {
                this.jumps = true;
                this.jump();
            }
        }
    }

    jump(i = this.maxJumpHeight / this.jumpFallStepHeight) {
        if (!gamePaused) {
            this.onMovingPlatform = false;
            this.jumps = true;
            this.falls = false;
            this.stepAmount = 0;
            this.resetFigImg(`graphics/main-char/jump/jump-${this.movingDirection}.png`);
            if (!this.startingYPos) { this.startingYPos = this.y; }
            i--;
            this.y -= this.jumpFallStepHeight;
            if (i === 0 || this.y <= wallBrickHeight) {
                this.checkIfFalling(i);
                return;
            }
        }
        requestAnimationFrame(() => { this.jump(i); });
    }

    checkIfFalling() {
        if (!gamePaused) {
            if (!this.falls) {
                this.falls = true;
                this.fall();
            }
        }
    }

    fall() {
        if (!gamePaused) {
            if (this.checkPlatformXCords()) {
                this.resetFigImg(`graphics/main-char/run/run-${this.movingDirection}-0.png`);
                this.startingYPos = null;
                this.jumps = false;
                if (platforms[this.standingPlatformIndex].isMoving) {
                    this.onMovingPlatform = true;
                    this.startingPointX = this.x;
                    this.distanceCharMovingPlatformX = this.startingPointX - platforms[this.standingPlatformIndex].x;
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
            }
            if (this.startingYPos && this.y === this.startingYPos) {
                this.jumps = false;
                this.falls = false;
                this.startingYPos = null;
                this.stepAmount = 0;
                this.resetFigImg(`graphics/main-char/run/run-${this.movingDirection}-${this.stepAmount}.png`);
                return;
            }
            this.y += this.jumpFallStepHeight;
        }
        requestAnimationFrame(() => {
            this.fall();
        });
    }

    checkPlatformXCords() {
        if (!gamePaused) {
            for (let i = 0; i < platforms.length; i++) {
                if (platforms[i].x - (this.x + this.width) >= 0 || this.x - (platforms[i].x + platforms[i].width) >= 0) {
                    if (i + 1 === platforms.length) {
                        this.startingYPos = null;
                        return false;
                    }
                } else {
                    if (this.checkPlatformYCords(i)) {
                        this.standingPlatformIndex = i;
                        return true;
                    }
                }
            }
        }
    }

    checkPlatformYCords(i) {
        if (!gamePaused) {
            if (platforms[i].y - (this.y + this.height) <= this.jumpFallStepHeight && platforms[i].y - (this.y + this.height) >= 0) {
                this.y = platforms[i].y - this.height;
                return true;
            } else {
                if (i + 1 === platforms.length) { return false; }
            }
        }
    }

    checkPlatformEnd() {
        if (!gamePaused) {
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

    movingWithPlatform() {
        if (!gamePaused) {
            if (this.onMovingPlatform) {
                this.x = platforms[this.standingPlatformIndex].x + this.distanceCharMovingPlatformX + this.stepAmount * this.stepLength;
                if (this.checkPlatformEnd()) {
                    this.checkIfFalling();
                    return;
                }
                requestAnimationFrame(() => {
                    this.movingWithPlatform();
                });
            }
            return;
        }else {
            requestAnimationFrame(() => {
                this.movingWithPlatform();
            });
        }
    }

    resetFigImg(path) {
        if (!gamePaused) {
            if (this.sleeps) {
                this.figImage.src = '';
            } else {
                this.figImage.src = path;
            }
        }
    }
}