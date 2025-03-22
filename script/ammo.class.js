class Ammo extends Char {
    flyingDirection; /** the direction of @this ammo (left or right) depending on the looking-direction of the char. */
    decreaseLifeAmount; /** the amount of life @this ammo can take subtract. */
    shootingSound; /** the audio player for @this ammo */
    leftCanvas; /** a boolean whether @this ammo left canvas. */
    image = new Image(); /** the image for the ammo */

    /**
     * 
     * @param {number} x the starting x-coordinate of @this Ammo
     * @param {number} y the starting y-coordinate of @this Ammo
     * @param {number} width the width of @this Ammo
     * @param {number} height the height of @this Ammo
     * @param {Image} image the image of @this Ammo
     * @param {number} decreaseLifeAmount the life-amount @this ammo can take away from the char
     */
    constructor(x, y, width, height, decreaseLifeAmount, image) {
        super(x, y, width, height);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.flyingDirection = char.movingDirection;
        this.decreaseLifeAmount = decreaseLifeAmount;
        this.leftCanvas = false;
        this.image = image;
        this.shootingSound = new Audio();
        this.shootingSound.src = './sounds/enemy-shoots.mp3';
        this.trajectoryAnimationId = setInterval(() => { this.animateTrajectory(); }, standardFrameRate);
        if (!gameMuted) { this.playShootingSound(); }
    }

    /**
     * 
     * This @method animateTrajectory animates the trajectory of @this ammo of the character.
     * With every iteration, the ammo flies half of a width unit further.
     * Its direction depends on the looking-direction of the char.
     * The function stops when the ammo left the canvas and the animation is being cleared.
     */
    animateTrajectory() {
        if (!gamePaused) {
            if (!this.leftCanvas) {
                if (this.flyingDirection === "left") {
                    this.x -= widthUnit / 2;
                } else if (this.flyingDirection === "right") {
                    this.x += widthUnit / 2;
                }
                this.checkForEnemies();
                this.checkIfStillInCanvas();
            } else {
                clearInterval(this.trajectoryAnimationId);
                return;
            }
        }
    }

    /**
     * 
     * @method checkForEnemies checks whether an enemy gets hit by @this ammo ,
     * looking at the x- and y-coordinates of each enemy.
     * When the ammo is within the enemies y-space and directly in front or behind
     * the enemy, the enemy gets hit, loses that life amount that the ammo subtracts. (@var decreaseLifeAmount)
     */
    checkForEnemies() {
        hitables.enemies.forEach((elem) => {
            if (this.y + this.height > elem.y && elem.y + elem.height > this.y) {
                if (this.x + this.width > elem.x && elem.x + elem.width > this.x) {
                    if (elem.isDangerous) {
                        elem.walks = false;
                        if (elem.enemyType != "big-boss") {
                            elem.isDangerous = false;
                            elem.lifeAmount -= this.decreaseLifeAmount;
                            elem.hittingAnimationId = setInterval(() => { elem.animateEnemyGotHit(); }, 3 * standardFrameRate);
                        } else if (elem.enemyType === "big-boss" && bigBoss.isVisible) {
                            this.whenBigBossIsVisibleAndDangerous(elem);
                        }
                        this.leftCanvas = true;
                        clearInterval(this.trajectoryAnimationId);
                    }
                }
            }
        })
    }

    /**
     * 
     * @param {BigBoss} elem is the big boss.
     * Only if the char has collected all 3 special ammo parts, the @BigBoss can get hit.
     * After hitting the BigBoss, it is not hitable for the next 0.5 seconds.
     */
    whenBigBossIsVisibleAndDangerous(elem) {
        if (char.specialAmmoParts === 3) {
            elem.lifeAmount -= this.decreaseLifeAmount;
            bigBoss.gotHit = true;
            bigBoss.isDangerous = false;
            if (!bigBoss.gotHit) {
                setTimeout(() => {
                    bigBoss.gotHit = false;
                    bigBoss.isDangerous = true;
                }, 500);
            }
            elem.hittingAnimationId = setInterval(() => { elem.animateBigBossGotHit(); }, 3 * standardFrameRate);
        }
    }

    /**
     * @method checkIfStillInCanvas checks whether @this ammo is still in canvas.
     * If so, its @var leftCanvas variable gets the value of true.
     */
    checkIfStillInCanvas() {
        if (this.x + this.width <= 0 || this.x >= canvas.offsetWidth) { this.leftCanvas = true; }
    }

    /**
     * 
     * @method playShootingSound plays the shooting-sound of @this ammo
     */
    playShootingSound() {
        if (!gameMuted && char.isAlive) {
            this.shootingSound.volume = gameVolume*0.5;
            this.shootingSound.play();
        }
    }
}