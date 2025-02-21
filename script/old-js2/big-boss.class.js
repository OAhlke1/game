class BigBoss extends Shooter {
    animateLevitationId; /** the id of the up- and down-animation of the @this BigBoss */
    isVisible; /** a boolean for whether the bigBoss is visible or not */
    gotHit; /** a boolean for whether the bigBoss got hit or not */
    isDefeated; /** a boolean for whether the bigBoss got defeated or not */
    fallingSound; /** DOM-element for the falling-sound. */
    fallingEnded; /** a boolean, whether the the BigBoss has left the canvas. */
    fallingAnimationId; /** the id of the falling-animation of the @this BigBoss */

    /**
     * 
     * @param {number} x the x-coordinate of the BigBoss
     * @param {number} y the y-coordinate of the BigBoss
     * @param {number} width the width of the Bigboss
     * @param {number} height the height of the Bigboss
     * @param {string} enemyType the enemy-type of the Bigboss
     * @param {number} decreaseLifeAmount the amount of life, the BigBoss can take away from char
     * @param {boolean} canShoot says that the BigBoss can shoot
     * @param {string} lookingDirection the looking-direction of the Bigboss
     * @param {number} lifeAmount the life-amount of the Bigboss
     * @param {number} distanceToSeeChar the furthermost distance to the char, so that the char is still visible for the BigBoss
     * @param {boolean} canWalk says that the BigBoss can not walk
     * @param {number} hitImagesAmount the amounts of images the animation for hitting the BigBoss has
     * @param {number} attackingImagesAmount the amounts of images the animation for attacking the BigBoss has
     */
    constructor(x, y, width, height, enemyType, decreaseLifeAmount, canShoot, lookingDirection, lifeAmount, distanceToSeeChar, canWalk, hitImagesAmount, attackingImagesAmount) {
        super();
        this.x = x;
        this.standardX = x;
        this.y = y;
        this.standardY = y;
        this.width = width;
        this.height = height;
        this.enemyType = enemyType;
        this.decreaseLifeAmount = decreaseLifeAmount;
        this.canShoot = canShoot;
        this.lookingDirection = lookingDirection;
        this.lifeAmount = lifeAmount;
        this.maxLifeAmount = lifeAmount;
        this.standardImgPath = `./graphics/enemies/big-boss/attack/attack-left-0.png`;
        this.distanceToSeeChar = distanceToSeeChar;
        this.canWalk = canWalk;
        this.hitImagesAmount = hitImagesAmount;
        this.attackingImagesAmount = attackingImagesAmount;
        this.targeting = true;
        this.hasShot = false;
        this.walks = false;
        this.isVisible = false;
        this.isDefeated = false;
        this.isDangerous = true;
        this.fallingEnded = false;
        this.gotHit = false;
        this.shootingSound = new Audio();
        this.shootingSound.src = './sounds/enemy-shoots.mp3';
        this.hittingSound = new Audio();
        this.hittingSound.src = './sounds/enemy-got-hit.mp3';
        this.hittingSound.volume = 0.5;
        this.fallingSound = new Audio();
        this.fallingSound.src = './sounds/big-boss-falling.wav';
        this.fallingSound.volume = 0.5;
        this.animateLevitationId = setInterval(() => { this.levitateDown() }, 3 * standardFrameRate);
        this.image = new Image();
        this.image.src = './graphics/enemies/green/attack/attack-left-0.png';
        this.ammoImage = new Image();
        this.ammoImage.src = './graphics/enemies/big-boss/shoot.svg';
    }

    /** @method levitateDown animates the downwards levitation. */
    levitateDown() {
        if (!this.isDefeated) {
            this.y += 0.125 * heightUnit;
            if (this.y + this.height >= canCont.offsetHeight) {
                clearInterval(this.animateLevitationId);
                this.animateLevitationId = setInterval(() => { this.levitateUp(); }, 3 * standardFrameRate);
                return;
            }
        } else {
            clearInterval(this.animateLevitationId);
            this.fallingAnimationId = setInterval(() => { this.animateFalling(); }, 3 * standardFrameRate);
        }
    }

    /** @method levitateUp animates the upwards levitation. */
    levitateUp() {
        if (!this.isDefeated) {
            this.y -= 0.125 * heightUnit;
            if (this.y <= 0) {
                clearInterval(this.animateLevitationId);
                this.animateLevitationId = setInterval(() => { this.levitateDown(); }, 3 * standardFrameRate);
                return;
            }
        } else {
            clearInterval(this.animateLevitationId);
            this.fallingAnimationId = setInterval(() => { this.animateFalling(); }, 3 * standardFrameRate);
        }
    }

    /**
     * 
     * @method animateBigBossGotHit animates the hitting of the BigBoss.
     */
    animateBigBossGotHit() {
        if (this.gotHit) {
            this.image = this.hitImagesArrays[this.lookingDirection][this.hittingIndex];
            this.hittingIndex++;
            if (this.hittingIndex === this.hitImagesAmount) {
                this.hittingIndex = 0;
                if (this.hittingIndex === 0 && this.hittingAnimationIndex === 0 && !gameMuted) { this.playHittingSound(); }
                this.hittingAnimationIndex++;
                if (this.hittingAnimationIndex === 2) {
                    this.hittingAnimationIndex = 0;
                    if (this.lifeAmount <= 0) {
                        this.whenBigBossIsDead();
                    } else if (this.lifeAmount > 0) { this.isDangerous = true; }
                    clearInterval(this.hittingAnimationId);
                    return;
                }
            }
        }
        return;
    }

    /** 
     * 
     * @method whenBigBossIsDead sets the @var lifeAmount of the BigBoss to 0,
     * sets its @var isDangerous to false and its @var isDefeated to true,
     * stops the levitation animation,
     * starts the falling-sound if it is paused (otherwise it is already playing)
     */
    whenBigBossIsDead() {
        this.lifeAmount = 0;
        this.isDangerous = false;
        this.isDefeated = true;
        clearInterval(this.animateLevitationId);
        this.animateLevitationId = setInterval(() => { this.animateFalling(); }, standardFrameRate);
        if (this.fallingSound.paused) { this.playFallingSound(); }
    }

    /**
     * 
     * @method animateFalling animates the BigBosses falling.
     * When the BigBoss leaves the canvas, @var fallingEnded is set to true,
     * the game is being paused, the falling-animation cleared,
     * the games elements saved to local-storage are deleted,
     * and the winning-screen is being displayed.
     * */
    async animateFalling() {
        this.y += 0.5 * heightUnit;
        if (this.y > canvas.offsetHeight) {
            this.fallingEnded = true;
            pausePlayGameToggle();
            clearInterval(this.animateLevitationId);
            await clearLocalStorage();
            document.querySelector('.you-win-screen').classList.remove('disNone');
            return;
        }
    }

    /**
     * 
     * @method animateShooting animates the trajectory of the BigBosses ammo
     * when the BigBoss is visible, it begins shooting
     */
    animateShooting() {
        if (this.isVisible) {
            this.setupShoot(2.5 * widthUnit, 2.5 * heightUnit);
            setTimeout(() => { this.animateShooting(); }, 1000);
        }
    }

    /**
     * 
     * @method playFallingSound plays the sound of the falling of the BigBoss.
     * For not being automatically repeated, it pauses after its player has ended.
     */
    playFallingSound() {
        pauseAllPlayers();
        this.fallingSound.play();
        this.fallingSound.addEventListener('ended', () => {
            this.fallingSound.currentTime = 0;
            this.fallingSound.pause();
        });
    }
}