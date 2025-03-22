class Enemy {
    x;
    y;
    minX;
    maxX;
    width;
    height;
    enemyType;
    lookingDirection;
    decreaseHealthAmount;
    hitImagesAmount;
    walks;
    attackingImagesAmount;
    lifeAmount;
    isDangerous; /** @var {boolean} isDangerous says wether @this Enemy is dangerous or not */
    isAlive; /** @var {boolean} isAlive says wether @this Enemy is alive or not */
    canShoot; /** @var {boolean} canShoot says wether @this Enemy can shoot or not */
    standardImgPath; /** @var {string} standardImgPath is the path to @this Enemys standard image. (The image, when it stands still.) */
    hittingAnimationId; /** @var {number} hittingAnimationId is the id of the animation when @this Enemy got hit */
    hittingAnimationIndex; /** @var {number} hittingAnimationIndex is the index of the array of the hitting-animation-images */
    hittingIndex; /** @var {number} hittingIndex the index of @this Enemys animation when it gets hit */
    hittingSound; /** @var {Audio} hittingSound is the HTML-audio-element for @this Enemys hitting sound */
    walkingIndex; /** @var {number} is the index of @this Enemys walking animation */
    maxLifeAmount; /** @var {number} maxLifeAmount is being saved to the browsers local storage in order to give @this Enemy the full life-amount when the game is being reloaded */
    hitable; /** @var {boolean} hitable says wether @this Enemy can get hit right now or not */
    canWalk; /** @var {boolean} canWalk says wether @this Enemy is able to walk or not */
    muted; /** @var {boolean} muted says wether @this Enemy is muted or not. (For muting the entire game-sound) */
    hitImagesArrays; /** @var {Array} hitImagesArrays is a two dimensional array that saves the hitting-images for both left and right looking-directions */
    standardX; /** @var {number} standardX is the the first x-coordinate of the char. It is the x-coordinate of @this Enemy that is being saved to the browsers local storage */
    standardY; /** @var {number} standardY is the the first y-coordinate of the char. It is the y-coordinate of @this Enemy that is being saved to the browsers local storage */

    /**
     * 
     * @param {number} x the starting x-coordinate of @this Enemy
     * @param {number} y the y-coordinate of @this Enemy
     * @param {number} width the width of @this Enemy
     * @param {number} height the height of @this Enemy
     * @param {number} imgPath the path to the first image (before @this Enemy has moved)
     * @param {string} enemyType the enemy-type of @this Enemy
     * @param {number} decreaseHealthAmount the amount @this Enemy can take away from the char
     * @param {boolean} canShoot says wether @this Enemy can shoot or not
     * @param {string} lookingDirection the looking-direction of @this Enemy
     * @param {number} lifeAmount the life-amount of @this Enemy
     * @param {boolean} walks says wether @this Enemy is walking or not
     * @param {number} hitImagesAmount the amount of images of @this Enemys animation when it gets hit
     * @param {number} attackingImagesAmount the amount of images of @this Enemys animation when it walks/attacks
     */
    constructor(x, y, width, height, imgPath, enemyType, decreaseHealthAmount, canShoot, lookingDirection, lifeAmount, walks, hitImagesAmount, attackingImagesAmount) {
        this.enemyType = enemyType;
        this.lookingDirection = lookingDirection;
        this.x = x;
        this.standardX = x;
        this.y = y;
        this.standardY = y;
        this.minX = x;
        this.maxX = canvas.offsetWidth - widthUnit;
        this.width = width;
        this.height = height;
        this.standardImgPath = imgPath;
        this.decreaseHealthAmount = decreaseHealthAmount;
        this.isDangerous = true;
        this.canShoot = canShoot;
        this.lifeAmount = lifeAmount;
        this.maxLifeAmount = lifeAmount;
        this.hitImagesAmount = hitImagesAmount;
        this.hittingIndex = 0;
        this.hittingAnimationIndex = 0;
        this.walkingIndex = 0;
        this.walks = walks;
        this.attackingImagesAmount = attackingImagesAmount;
        this.isAlive = true;
        this.hitable = true;
        this.canWalk = true;
        this.muted = false;
        this.checkCharPos();
    }

    /**
     * 
     * @method checkCharPos checks the position of the char.
     * When char hits @this Enemy it is not dangerous for the next 1.5 seconds.
     */
    checkCharPos() {
        if (this.isAlive) {
            if (this.isDangerous) {
                if (this.checkIfCanSeeChar()) { this.lookAtChar(); }
                if (this.checkIfHittingChar()) { this.hittingChar(); }
                if (this.checkIfGotHit() && this.isDangerous) {
                    this.isDangerous = false;
                    this.lifeAmount -= char.headJumpAmount;
                    if (this.hitable) { this.hittingAnimationId = setInterval(() => { this.animateEnemyGotHit(); }, 250 / this.hitImagesAmount); }
                } else {
                    this.walks = false;
                    this.targeting = false;
                }
            }
            requestAnimationFrame(() => { this.checkCharPos() });
        } else { return; }
    }

    /**
     * 
     * @returns a boolean wether the char is close enough to @this Enemy
     */
    checkIfCanSeeChar() {
        if (char.y + char.height > this.y && this.y + this.height > char.y) {
            if (char.x + char.width <= this.x) {
                if (Math.abs(char.x + char.width - this.x) <= this.distanceToSeeChar) {
                    return true;
                } else { return false; }
            } else if (char.x >= this.x + this.width) {
                if (Math.abs(this.x + this.width - char.x) <= this.distanceToSeeChar) {
                    return true;
                } else { return false; }
            }
        } else { return false; }
    }

    /**
     * 
     * @method lookAtChar turns the enemy around to look at the char when char is close enough.
     */
    lookAtChar() {
        if (this.x > char.x + char.width) {
            if (this.lookingDirection === "right") {
                this.lookingDirection = "left";
                this.image.src = `./graphics/enemies/${this.enemyType}/attack/attack-${this.lookingDirection}-0.png`;
            }
        } else if (this.x + this.width < char.x) {
            if (this.lookingDirection === "left") {
                this.lookingDirection = "right";
                this.image.src = `./graphics/enemies/${this.enemyType}/attack/attack-${this.lookingDirection}-0.png`;
            }
        }
        this.atLookingAtChar();
    }

    /**
     * 
     * @method atLookingAtChar lets @this Enemy go to the enemy when the enemy is able to walk (@var canWalk).
     * Only when it is not walking yet, the walking-animation is being started.
     * When the char is far away enough from the enemy (the distance is depending on @var distanceToSeeChar), the enemy stops
     * walking and the walking-animation stops.
     */
    atLookingAtChar() {
        if (Math.abs(char.x + char.width - this.x) <= this.distanceToSeeChar / 2 || Math.abs(this.x + this.width - char.x) <= this.distanceToSeeChar / 2) {
            this.targeting = false;
            if (this.canWalk && !this.walks) {
                this.walks = true;
                if (this.enemyType != "flyable") { this.animateWalking(); }
                this.animateWalkingId = setInterval(() => { this.animateWalking(); }, standardFrameRate);
            }
        } else if (Math.abs(char.x + char.width - this.x) > this.distanceToSeeChar / 2 || Math.abs(this.x + this.width - char.x) >= this.distanceToSeeChar / 2) {
            this.targeting = true;
            this.walks = false;
            if (this.animateWalkingId) { clearInterval(this.animateWalkingId); }
            if (this.canShoot) { this.setupShoot(); }
        }
    }

    /**
     * 
     * @method checkIfHittingChar checks if @this Enemy is directly in front of or behind the char.
     * It @returns a boolean wether @this Enemy hits the char or not.
     */
    checkIfHittingChar() {
        if (char.x + char.width > this.x && char.x < this.x + this.width && char.y + char.height > this.y && char.y < this.y + this.height) {
            return true;
        } else { return false; }
    }

    /**
     * 
     * @method hittingChar starts the hitting-animation of the char, when @this Enemy hits the char.
     */
    hittingChar() {
        if (char.y + char.height > this.y && this.y + this.height > char.y) {
            char.hitChar(this.decreaseHealthAmount);
        }
    }

    /**
     * 
     * @returns a boolean wether the enemy got hit.
     */
    checkIfGotHit() {
        if (char.y + char.height <= this.y && Math.abs(this.y - (char.y + char.height)) < char.jumpFallStepHeight) {
            if (char.x + char.width > this.x && this.x + this.width > char.x) {
                return true;
            } else { return false; }
        } else { return false; }
    }

    /**
     * 
     * @method animateWalking animates the walking of @this Enemy , when its @var walks and its @var dangerous are set to true.
     * The @var walkingIndex is the index of the walking image.
     * When it is equal to the amount of walking images of @this Enemy (@var attackingImagesAmount), its value is reset to 0.
     */
    animateWalking() {
        if (this.walks && this.isDangerous) {
            this.x = this.lookingDirection === "right" ? this.x += widthUnit / 5 : this.x -= widthUnit / 5;
            this.image.src = `./graphics/enemies/${this.enemyType}/attack/attack-${this.lookingDirection}-${this.walkingIndex}.png`;
            this.walkingIndex++;
            if (this.walkingIndex === this.attackingImagesAmount) { this.walkingIndex = 0; }
        }
    }

    /**
     * 
     * @method animateEnemyGotHit animates the hitting of @this Enemy as long as its type is not flyable and its not the big boss.
     */
    animateEnemyGotHit() {
        if (this.enemyType != "flyable" && this.enemyType != "big-boss") { this.image = this.hitImagesArrays[this.lookingDirection][this.hittingIndex] }
        this.hittingIndex++;
        if (this.hittingIndex === this.hitImagesAmount) {
            this.hittingIndex = 0;
            if (this.hittingIndex === 0 && this.hittingAnimationIndex === 0 && !gameMuted) { this.playHittingSound(); }
            this.hittingAnimationIndex++;
            if (this.hittingAnimationIndex === 2) {
                this.atEndOfHittingEnemyAnimation();
                return;
            }
        }
        return;
    }

    /**
     * 
     * @method atEndOfHittingEnemyAnimation ends the hitting animation of @this Enemy
     * When the enemys @var lifeAmount has been increased to 0, it is not dangerous anymore
     * and as long as its type is not big-boss, it is not alive anymore. (@var isAlive = false);
     * When @this Enemy is the big-boss, its @var isDefeated is set to true, so that the big boss
     * is defeated.
     * Then every not defeated enemy is being saved to the browsers local storage and the animation cleared.
     */
    atEndOfHittingEnemyAnimation() {this.hittingAnimationIndex = 0;
        if (this.lifeAmount <= 0) {
            this.lifeAmount = 0;
            this.isDangerous = false;
            if (this.enemyType != "big-boss") {
                this.isAlive = false;
            } else {
                this.isDefeated = true;
                clearInterval(this.animateLevitationId);
                this.animateLevitationId = setInterval(() => { this.animateFalling(); }, standardFrameRate);
                if (this.fallingSound.paused) { this.playFallingSound(); }
            }
            saveNotDefeatedEnemies();
            setMenuBarProperties("enemy");
        } else if (this.lifeAmount > 0) { this.isDangerous = true; }
        clearInterval(this.hittingAnimationId);
    }

    /**
     * 
     * @method isHitableAgain makes the enemy hitable again after 1.5 seconds.
     */
    isHitableAgain() {
        setTimeout(() => { this.hitable = true; }, 1500);
    }

    /**
     * 
     * @method playHittingSound plays the sound of @this Enemy when it is being hit.
     */
    playHittingSound() {
        if (this.hittingSound.paused || this.hittingSound.currentTime === 0) {
            this.hittingSound.play();
            this.hittingSound.addEventListener('ended', () => {
                this.hittingSound.currentTime = 0;
                this.hittingSound.pause();
            });
        }
    }
}