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
    hittingSound;
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
    floorPosition;
    walkingFrameRate;

    /**
     * 
     * @param {number} width is the width of the char
     * @param {number} height is the height of the char
     * @param {number} x is the x-coordinate of the char
     * @param {number} y is the y-coordinate of the char
     * @param {string} standardImgPath is the path to the char-image
     * @param {number} stepLength is the length of a single step the char goes
     * @param {number} maxJumpHeight the maximum jump-height
     * @param {number} specialAmmoParts the amount of already collected special-ammo-parts
     * @param {number} healthAmount the amount of life the char has
     * @param {boolean} onMovingPlatform says wether the char stands on a moving platform or not
     * @param {number} standingPlatformIndex is the index of the platform in the platform-array that the char stands on
     */
    constructor(width, height, x, y, standardImgPath, stepLength, maxJumpHeight, specialAmmoParts = 0, healthAmount, onMovingPlatform, standingPlatformIndex) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.standardX = x; /** @var {number} standardX is the first x-coordinate of the char when the game is opened at first */
        this.y = y;
        this.standardY = y; /** @var {number} standardY is the first y-coordinate of the char when the game is opened at first */
        this.standardImgPath = standardImgPath;
        this.stepLength = stepLength;
        this.standardStepLength = stepLength; /** @var {number} standardStepLength is the normal steplength of the char when it is not running */
        this.atWallLeft = false; /** @var {boolean} atWallLeft says wether the char stands left at a wall */
        this.atWallRight = false; /** @var {boolean} atWallRight says wether the char stands right at a wall */
        this.jumps = false; /** @var {boolean} jumps says wether the char jumps or not */
        this.jumpFallStepHeight = heightUnit / 3; /** @var {number} jumpFallStepHeight is the standard height unit for jumping and falling */
        this.maxJumpHeight = maxJumpHeight; /** @var {number} maxJumpHeight is the maximum jump-height */
        this.sleeps = false; /** @var {boolean} sleeps says wether the char sleeps or not */
        this.headJumpAmount = 50; /** @var {number} headJumpAmount is the amount that the char takes away from an enemy when jumping on its */
        this.hitImagesAmount = 8; /** @var {number} hitImagesAmount is the amount of images of the chars animation when it gets hit */
        this.bulletAmount = 10; /** @var {number} bulletAmount is the amount that a bullet takes away from an enemies health amount */
        this.maxHealthAmount = 200; /** @var {number} maxHealthAmount is the chars maximum health amount */
        this.standingPlatformIndex = standingPlatformIndex; /** @var {number} standingPlatformIndex is the index of the platform the char stands on */
        this.scrollingStepAmount = 0; /** @var {number} scrollingStepAmount is the amount of steps the char has shifted the canvas to the left while walking */
        this.hittingAnimationIndex = 0; /** @var {number} hittingAnimationIndex is the actual index of the animation when the char got hit */
        this.hittingAnimationStep = 0; /** @var {number} hittingAnimationStep is the amount of cycles the animation when the char got hit is been going through */
        this.healthAmount = healthAmount; /** @var {number} healthAmount is the actual amount of the chars health */
        this.timeNextHit = 0;
        this.stepAmount = 0; /** @var {number} stepAmount is the amount of steps the enemy has been making ????????????????????????????? */
        this.totalStepAmount = 0; /** @var totalStepAmount is the entire amount of all steps of the char ????????????????????????????? */
        this.enemiesKilled = 0; /** @var {number} enemiesKilled is the amount of defeated enemies */
        this.movingDirection = 'right'; /** @var movingDirection is the direction the char is moving at */
        this.figImage = new Image(); /** is the DOM-element of the char-image */
        this.figImage.src = this.standardImgPath;
        this.isAlive = true; /** @var {boolean} says wether the char is alive or not */
        this.sleeps = false; /** @var {boolean} sleeps says wether the char sleeps or not */
        this.gotHit = false; /** @var {boolean} gotHit says wether the char got hit by an enemy/trap or not */
        this.isImmune = false; /** @var {boolean} isImmune says wether the char is immune against attacks or not */
        this.landedOnPlatform = true; /** @var {boolean} landedOnPlatform says wether the char landed on a platform or not */
        this.targeted = false; /** @var {boolean} targeted says wether the char got hit by an enemy/trap or not */
        this.onUpwardsMovingPlatform = false; /** @var {boolean} onUpwardsMovingPlatform says wether the char is on an upwards moving platform or not */
        this.underGround = false; /** @var {boolean} underGround says wether the char is under the ground or not */
        this.specialAmmoParts = specialAmmoParts > 3 ? 3 : specialAmmoParts; /** @var {number} specialAmmoParts is the amount of the colleced special-ammo-parts */
        this.hittingSound = new Audio(); /** @var {Audio} hittingSound is the sound for when the char got hit */
        this.hittingSound.src = './sounds/char-got-hit.ogg';
        this.hittingSound.volume = 0.5;
        this.shootingSound = new Audio(); /** @var {Audio} shootingSound is the sound for when the char shoots ??????????????????????????????????????????????? */
        this.shootingSound.src = './sounds/enemy-shoots.mp3';
        this.shootingSound.volume = 0.5;
        this.jumpingSound = new Audio();/** @var {Audio} jumpingSound is the sound for when the char jumps */
        this.jumpingSound.src = './sounds/jump.ogg';
        this.jumpingSound.volume = 0.5;
        this.floorPosition = y; /** @var {number} floorPosition is the chars y-coordinate on the floor */
        this.hitImagesArrays = {
            left: [],
            right: []
        }; /** @var {array} hitImagesArrays is the array for the images of the animation when the char got hit */
        this.runImagesArrays = {
            left: [],
            right: []
        }; /** @var {array} runImagesArrays is the array for all running-images */
        this.jumpingImages = {
            left: "",
            right: ""
        }; /** @var {array} hitImagesArrays is the array for all jumping-images */
        this.ammoImages = {
            ammo: "",
            specialAmmo: ""
        } /** @var {array} hitImagesArrays is the array for both amma-iamges (the normal and special shoot) */
        this.onMovingPlatform = onMovingPlatform; /** @var {boolean} onMovingPlatform says wether the char is on a sideways moving platform or not */
        this.hasDoneAnything = false; /** @var {boolean} hasDoneAnything says wether the char has done anything yet or not ?????????????????????????????????????????????????? */
        this.walkingFrameRate = 18; /** @var {number} walkingFrameRate is the frame-rate for the walking-animation */
    }

    /**
     * 
     * @param {string} key is the code of the pressed key
     * @method moveLeft lets the char go left.
     * When the char is on a platform or on the beginning of the game, it stops walking.
     */
    moveLeft(key) {
        startSavingChar();
        if (controller['left'].pressed && !gamePaused && this.isAlive) {
            if (this.standingPlatformIndex >= 0 && this.standingPlatformIndex < platforms.length && this.checkPlatformEnd()) { this.checkIfFalling(); }
            this.setMovingState(key);
            checkForScrolling();
            if (this.x <= this.stepLength + widthUnit) {
                this.x = widthUnit + 1;
                return;
            } else { this.x = this.atWallLeft ? this.x : this.x - this.stepLength; }
        }
    }

    /**
     * 
     * @param {string} key is the code of the pressed key
     * @method moveRight lets the char go right.
     * When the char is on a platform it stops walking.
     */
    moveRight(key) {
        startSavingChar();
        if (controller['right'].pressed && !gamePaused && this.isAlive) {
            if (this.standingPlatformIndex > -1 && this.standingPlatformIndex < platforms.length && this.checkPlatformEnd()) { this.checkIfFalling(); }
            this.setMovingState(key);
            checkForScrolling();
            if (canvas.offsetWidth - this.x - this.width - widthUnit <= this.stepLength) {
                this.x += this.stepLength;
                return;
            } else {
                if (this.x + this.width - canvas.offsetWidth >= 0) {
                    this.x += (canvas.offsetWidth - this.x - this.width);
                } else { this.x = this.atWallRight ? this.x : this.x + this.stepLength; }
            }
        }
    }

    /**
     * 
     * @param {string} key 
     * @method moveLeftTouch does the same as @method moveLeft but it simply is for the
     * touch-controls.
     */
    moveLeftTouch(key) {
        startSavingChar();
        if(controller['left'].pressed && !gamePaused && this.isAlive) {
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

    /**
     * 
     * @param {string} key 
     * @method moveRightTouch does the same as @method moveRight but it simply is for the
     * touch-controls.
     */
    moveRightTouch(key) {
        startSavingChar();
        if(controller['right'].pressed && !gamePaused && this.isAlive) {
            if (this.standingPlatformIndex > -1 && this.standingPlatformIndex < platforms.length && this.checkPlatformEnd()) { this.checkIfFalling(); }
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

    /**
     * 
     * @param {string} key is the code to the pressed key (left or right arrow)
     * @method setMovingState checks if the left or the right arrow is pressed.
     * As long as the char is alive and the game not paused, the char walks.
     */
    setMovingState(key) {
        if (!gamePaused && this.isAlive && !keysBlockedForShifting) {
            if (key === "ArrowRight") {
                this.movingDirection = 'right';
                this.stepAmount++;
                checkForScrolling();
            } else if (key === "ArrowLeft") {
                this.movingDirection = 'left';
                this.stepAmount--;
                checkForScrolling();
            }
            this.figImage = this.runImagesArrays[this.movingDirection][Math.abs(this.stepAmount % 12)];
        }
    }

    /**
     * 
     * @method checkIfJumping checks wether the char jumps or not.
     * If not, and if the game is not paused and the char is alive and has landed on a platform (to avoid double-jumps),
     * the jumping animation starts.
     */
    checkIfJumping() {
        if (!gamePaused && this.isAlive && this.landedOnPlatform && !this.jumps) {
            if(!gameMuted) { this.playJumpingSound(); }
            this.jumps = true;
            this.jumpingIntervalStep = this.maxJumpHeight / this.jumpFallStepHeight;
            this.jumpingAnimationId = setInterval(()=>{ this.jump(); }, standardFrameRate);
        }
    }

    /**
     * 
     * @method jump makes the char jump.
     */
    jump() {
        startSavingChar();
        if (!gamePaused && this.isAlive && !this.falls && this.landedOnPlatform) {
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

    /**
     * 
     * @method checkIfFalling checks if the char falls and resets the depending variables.
     */
    checkIfFalling() {
        if (!gamePaused && this.isAlive) {
            if (!this.falls) {
                this.landedOnPlatform = false;
                this.falls = true;
                clearInterval(this.jumpingAnimationId);
                this.fallingAnimationId = setInterval(() => { this.fall(); }, standardFrameRate);
            }
        }
    }

    /**
     * 
     * @method fall makes the char fall.
     */
    fall() {
        startSavingChar();
        if (!gamePaused && this.isAlive) {
            if (!this.gotHit) { this.setImagePath(`./graphics/main-char/run/run-${this.movingDirection}-${Math.abs(this.stepAmount % 12)}.png`); }
            if (this.checkPlatformXCords()) {
                this.whenReachingPlatform();
                return;
            } else if (this.y >= canvas.offsetHeight) { this.whenUnderPlatform(); }
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

    /**
     * 
     * @method whenReachingPlatform resets all the depending variables, when the char landed on a platform / the ground.
     */
    whenReachingPlatform() {
        this.setImagePath(`./graphics/main-char/run/run-${this.movingDirection}-0.png`);
        this.startingYPos = null;
        this.jumps = false;
        if (platforms[this.standingPlatformIndex].isMoving) {
            this.onMovingPlatform = true;
            this.movingWithPlatformAnimationId = setInterval(()=>{ this.movingWithPlatform(); }, standardFrameRate);
            this.startingPointX = this.x;
            this.distanceCharMovingPlatformX = this.x - platforms[this.standingPlatformIndex].x;
            this.movingWithPlatform();
        }
        this.stopFalling();
    }

    /**
     * 
     * @method whenUnderPlatform resets the depending variables and invokes the depending functions when the char is
     * under the ground.
     */
    whenUnderPlatform() {this.jumps = false;
        this.falls = false;
        this.underGround = true;
        setMenuBarProperties("char");
        this.decreaseHealth();
        this.stopFalling();
        if(this.healthAmount >= 0) {
            pausePlayGameToggle();
            this.hitChar();
            this.scrollingStepAmount = 0;
            shiftingCanvasBackAnimationId = setInterval(()=>{shiftCanvasBack();}, standardFrameRate);
        }
    }

    /**
     * 
     * @method stopFalling resets all the depending variables and stops the falling animation
     */
    stopFalling() {
        this.falls = false;
        this.landedOnPlatform = true;
        clearInterval(this.fallingAnimationId);
    }

    /**
     * 
     * @method checkPlatformXCords checks the x-coordinates of each platform.
     * When the char is in the range of a platforms x-coordinates the @method checkPlatformYCords is being invoked.
     */
    checkPlatformXCords() {
        if (!gamePaused && this.isAlive) {
            for (let i = 0; i < platforms.length; i++) {
                if (platforms[i].x - (this.x + this.width) >= 0 || this.x - (platforms[i].x + platforms[i].width) >= 0) {
                    if (i + 1 === platforms.length) {
                        this.startingYPos = null;
                        return false;
                    }
                } else if (this.checkPlatformYCords(i)) {
                    this.standingPlatformIndex = i;
                    this.landedOnPlatform = true;
                    this.stepAmount = 0;
                    return true;
                }
            }
        }
    }

    /**
     * 
     * @param {number} i is the index of the platform in the platforms-array.
     * @returns {boolean} that says wether the char also stands on that specific platform or not.
     * @method checkPlatformYCords checks wether the char is on the platform with the index i.
     */
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

    /**
     * 
     * @method movingWithPlatform adds the actual x- or y-coordinate of the moving-platform to the x- or y-coordinate of the char.
     * When the platform moves sideways, the distance from the char to the the platforms left edge is also being involved.
     */
    movingWithPlatform() {
        if (!gamePaused && this.isAlive && this.landedOnPlatform && this.onMovingPlatform) {
            if (this.checkPlatformEnd()) {
                clearInterval(this.movingWithPlatformAnimationId);
                this.checkIfFalling();
                return;
            }else {
                if(platforms[this.standingPlatformIndex].sideways) {
                    this.x = platforms[this.standingPlatformIndex].x + this.distanceCharMovingPlatformX + this.stepAmount * this.standardStepLength;
                }else { this.y = platforms[this.standingPlatformIndex].y - this.height; }
            }
            return;
        }
    }

    /**
     * 
     * @method checkPlatformEnd checks wether the char is at the left or right end of the platform and returns the respective boolean
     */
    checkPlatformEnd() {
        if(!this.jumps && !gamePaused && this.isAlive) {
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
                } else { return false; }
            }
        }
    }

    /**
     * 
     * @method hitChar initiates the animation when the char gets hit by a trap / an enemy
     * @param {number} decreasingAmount is the amount that is subtracted from the chars health-amount.
     */
    hitChar(decreasingAmount) {
        this.gotHit = true;
        this.decreaseHealth(decreasingAmount);
        if(this.healthAmount > 0) {
            this.hittingAnimationId = setInterval(()=>{ this.animateHit(); }, 3*standardFrameRate);
            startSavingChar();
            setTimeout(() => { this.gotHit = false; }, 1500);
        }
    }

    /**
     * 
     * @method animateHit is the animation when the char gets hit by a trap / an enemy
     */
    animateHit() {
        if (this.gotHit) {
            if (this.isAlive) { this.figImage = this.hitImagesArrays[this.movingDirection][this.hittingAnimationIndex] }
            this.hittingAnimationIndex++;
            if (this.hittingAnimationIndex === this.hitImagesAmount) {
                this.hittingAnimationIndex = 0
                this.hittingAnimationStep++;
                if(this.hittingAnimationStep === 2) {
                    clearInterval(this.hittingAnimationId);
                }
            }
        } else if (this.isAlive) { this.setImagePath(`./graphics/main-char/run/run-${this.movingDirection}-${Math.abs(this.stepAmount % 12)}.png`); }
    }

    /**
     * 
     * @method decreasehealth decreases the health of the char and sets the appropriate variables.
     * @param {number} decreasingAmount is the amount that is being subtracted by the char.
     */
    decreaseHealth(decreasingAmount = 50) {
        if (!this.isImmune) {
            if(!gameMuted) { this.playHittingSound(); }
            this.isImmune = true;
            this.healthAmount -= decreasingAmount;
            if (this.healthAmount <= 0) {
                this.charIsDead();
                return;
            }
            startSavingChar();
            setMenuBarProperties("char");
            setTimeout(() => {this.isImmune = false }, 1500);
        }
    }

    /**
     * 
     * @method charIsDead sets the appropriate variables and shows the game-over-screen.
     */
    async charIsDead() {
        this.healthAmount = 0;
        this.isAlive = false;
        this.healthAmount = 200;
        this.hasDoneAnything = "char is dead now!";
        pausePlayGameToggle();
        await clearLocalStorage();
        document.querySelector('.game-over-screen').classList.remove('disNone');
    }

    /**
     * 
     * @method setImagePath sets the path for @this figImage
     * @param {string} path is the image-path
     */
    setImagePath(path) {
        if (this.isAlive) {
            this.figImage.src = path;
        } else {
            this.figImage.src = `./graphics/main-char/dead/dead-${this.movingDirection}.png`;
        }
    }

    /**
     * 
     * @method playHittingSound plays the sound when the char gets hit
     */
    playHittingSound() {
        this.hittingSound.play();
    }

    /**
     * 
     * @method playJumpingSound plays the sound when the char jumps
     */
    playJumpingSound() {
        this.jumpingSound.play();
    }
}