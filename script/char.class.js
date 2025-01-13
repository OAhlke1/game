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
    fallingAnimationId;
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
    movingAnimationId;
    jumpingAnimationId;
    jumpingIntervalStep;
    hitImagesArrays;
    runImagesArrays;
    jumpingImages;
    ammoImages;
    underGround;

    constructor(width, height, x, y, standardImgPath, stepLength, maxJumpHeight, specialAmmoParts = 0, healthAmount) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.standardX = x;
        this.y = y;
        this.standardY = y;
        this.standardImgPath = standardImgPath;
        this.stepLength = stepLength;
        this.standardStepLength = stepLength;
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
        this.healthAmount = healthAmount;
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
        this.underGround = false;
        this.specialAmmoParts = specialAmmoParts;
        this.hittingSound = new Audio();
        this.hittingSound.src = './sounds/char-got-hit.ogg';
        this.shootingSound = new Audio();
        this.shootingSound.src = './sounds/enemy-shoots.mp3';
        this.jumpingSound = new Audio();
        this.jumpingSound.src = './sounds/jump.ogg';
        this.hitImagesArrays = {
            left: [],
            right: []
        };
        this.runImagesArrays = {
            left: [],
            right: []
        };
        this.jumpingImages = {
            left: "",
            right: ""
        };
        this.ammoImages = {
            ammo: "",
            specialAmmo: ""
        }
    }

    moveLeft(key) {
        if (controller['left'].pressed) {
            if (!gamePaused && this.isAlive) {
                if (this.standingPlatformIndex >= 0 && this.standingPlatformIndex < platforms.length && this.checkPlatformEnd()) {
                    this.checkIfFalling();
                }
                this.setMovingState(key);
                checkForScrolling();
                if (this.x <= this.stepLength + widthUnit) {
                    this.x = widthUnit + 1;
                    //controller['left'].pressed = false;
                    return;
                } else { this.x = this.atWallLeft ? this.x : this.x - this.stepLength; }
            }
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
                    //this.x = canvas.offsetWidth - this.width - widthUnit;
                    this.x += this.stepLength;
                    return;
                } else {
                    if (this.x + this.width - canvas.offsetWidth >= 0) {
                        this.x += (canvas.offsetWidth - this.x - this.width);
                    } else { this.x = this.atWallRight ? this.x : this.x + this.stepLength; }
                }
            }
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
            this.figImage = this.runImagesArrays[this.movingDirection][Math.abs(this.stepAmount % 12)];
        }
    }

    checkIfJumping() {
        if (!gamePaused && this.isAlive) {
            if (!this.jumps) {
                if(!gameMuted) { this.playJumpingSound(); }
                this.jumps = true;
                this.jumpingIntervalStep = this.maxJumpHeight / this.jumpFallStepHeight;
                this.jumpingAnimationId = setInterval(()=>{ this.jump(); }, standardFrameRate);
            }
        }
    }

    jump() {
        if (!gamePaused && this.isAlive && !this.falls) {
            this.onMovingPlatform = false;
            this.atWallLeft = false;
            this.atWallRight = false;
            this.stopFalling();
            this.stepAmount = 0;
            this.figImage = this.jumpingImages[this.movingDirection];
            if (!this.startingYPos) { this.startingYPos = this.y; }
            this.jumpingIntervalStep--;
            this.y -= this.jumpFallStepHeight;
            if (this.jumpingIntervalStep <= 0 || this.y <= heightUnit) {
                this.checkIfFalling();
                return;
            }
        }
    }

    checkIfFalling() {
        if (!gamePaused && this.isAlive) {
            if (!this.falls) {
                this.falls = true;
                clearInterval(this.jumpingAnimationId);
                this.fallingAnimationId = setInterval(() => { this.fall(); }, standardFrameRate);
            }
        }
    }

    fall() {
        if (!gamePaused && this.isAlive) {
            if (!this.gotHit) { this.setImagePath(`./graphics/main-char/run/run-${this.movingDirection}-${Math.abs(this.stepAmount % 12)}.png`); }
            if (this.checkPlatformXCords()) {
                this.setImagePath(`./graphics/main-char/run/run-${this.movingDirection}-0.png`);
                this.startingYPos = null;
                this.jumps = false;
                if (platforms[this.standingPlatformIndex].isMoving) {
                    this.onMovingPlatform = true;
                    this.movingWidthPlatformAnimationId = setInterval(()=>{ this.movingWithPlatform(); }, standardFrameRate);
                    this.startingPointX = this.x;
                    this.distanceCharMovingPlatformX = this.x - platforms[this.standingPlatformIndex].x;
                    this.movingWithPlatform();
                }
                this.stopFalling();
                return;
            } else if (this.y >= canvas.offsetHeight) {
                this.jumps = false;
                this.falls = false;
                this.underGround = true;
                setMenuBarProperties("char");
                this.decreaseHealth();
                this.stopFalling();
                if(this.healthAmount >= 0) {
                    gamePaused = true;
                    this.hitChar();
                    this.scrollingStepAmount = 0;
                    shiftingCanvasBackAnimationId = setInterval(()=>{shiftCanvasBack();}, standardFrameRate);
                }/* else {
                    this.healthAmount = 0;
                    setMenuBarProperties("char");
                    this.isAlive = false;
                    //resetGame();
                    document.querySelector('.game-over-screen').classList.remove('disNone');
                } */
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
        //this.onMovingPlatform = true;
        clearInterval(this.fallingAnimationId);
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
                    clearInterval(this.movingWidthPlatformAnimationId);
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

    hitChar(decreasingAmount) {
        this.gotHit = true;
        this.decreaseHealth(decreasingAmount);
        if(this.healthAmount > 0) {
            this.hittingAnimationId = setInterval(()=>{ this.animateHit(); }, 3*standardFrameRate);
            saveCharProperties();
            setTimeout(() => { this.gotHit = false; }, 1500);
        }
    }

    animateHit() {
        if (this.gotHit) {
            if (this.isAlive) { this.figImage = this.hitImagesArrays[this.movingDirection][this.hittingAnimationIndex] } //this.setImagePath(`./graphics/main-char/hit/hit-${this.movingDirection}-${this.hittingAnimationIndex}.png`);
            this.hittingAnimationIndex++;
            if (this.hittingAnimationIndex === this.hitImagesAmount) {
                this.hittingAnimationIndex = 0
                this.hittingAnimationStep++;
                if(this.hittingAnimationStep === 2) {
                    clearInterval(this.hittingAnimationId);
                }
            }
        } else if (this.isAlive) {
            this.setImagePath(`./graphics/main-char/run/run-${this.movingDirection}-${Math.abs(this.stepAmount % 12)}.png`);
        }
    }

    decreaseHealth(decreasingAmount = 50) {
        if (!this.isImmune) {
            if(!gameMuted) { this.playHittingSound(); }
            this.isImmune = true;
            this.healthAmount -= decreasingAmount;
            if (this.healthAmount <= 0) {
                this.charIsDead();
                return;
            }
            saveCharProperties();
            setMenuBarProperties("char");
            setTimeout(() => {this.isImmune = false }, 1500);
        }
    }

    charIsDead() {
        this.healthAmount = 0;
        this.isAlive = false;
        this.healthAmount = 200;
        gamePaused = true;
        this.setImagePath(`./graphics/main-char/dead/dead-${this.movingDirection}.png`);
        //this.saveCharProperties();
        document.querySelector('.game-over-screen').classList.remove('disNone');
    }

    saveCharProperties() {
        gameJson.char = char;
        localStorage.setItem('gameJson', JSON.stringify(gameJson));
    }

    setImagePath(path) {
        if (this.isAlive) {
            this.figImage.src = path;
        } else {
            this.figImage.src = `./graphics/main-char/dead/dead-${this.movingDirection}.png`;
        }
    }

    playHittingSound() {
        this.hittingSound.play();
    }

    playJumpingSound() {
        this.jumpingSound.play();
    }


}