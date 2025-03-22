class Shooter extends Enemy {
    targeting;
    hasShot;
    walks;
    player;
    ammoImage = new Image();
    shootingSoundPath = './sounds/enemy-shoots.mp3';
    isVisible = true;

    /**
     * 
     * @param {number} x the standing x-coordinate of @this enemy before has moved
     * @param {number} y the y-coordinate of the shooter
     * @param {number} width the width of the shooter
     * @param {number} height the height of the shooter
     * @param {string} enemyType the type of @this enemy
     * @param {number} decreaseHealthAmount the amount that @this shooter can take away from the char when hitting the char.
     * @param {boolean} canShoot boolean wether the char can shoot or not.
     * @param {string} lookingDirection string for the looking direction (left or right)
     * @param {number} lifeAmount the maximum life amount of @this enemy
     * @param {number} distanceToSeeChar the furthest distance @this enemy sees the char. Only when the distance is <= that value, @this enemy shoots
     * @param {boolean} canWalk says wether @this enemy can walk or not
     * @param {number} hitImagesAmount the amount of images the hitting-animation of @this enemy has
     * @param {number} attackingImagesAmount the amount of images the attacking/walking animation has
     */
    constructor(x, y, width, height, enemyType, decreaseHealthAmount, canShoot, lookingDirection, lifeAmount, distanceToSeeChar, canWalk, hitImagesAmount, attackingImagesAmount) {
        super();
        this.x = x;
        this.standardX = x;
        this.y = y;
        this.standardY = y;
        this.width = width;
        this.height = height,
        this.enemyType = enemyType;
        this.lookingDirection = lookingDirection;
        this.image = new Image();
        this.image.src = `./graphics/enemies/${enemyType}/attack/attack-${lookingDirection}-0.png`;
        this.decreaseHealthAmount = decreaseHealthAmount;
        this.canShoot = canShoot;
        this.lifeAmount = lifeAmount;
        this.maxLifeAmount = lifeAmount;
        this.standardImgPath = `./graphics/enemies/${enemyType}/attack/attack-${lookingDirection}-0.png`;
        this.distanceToSeeChar = distanceToSeeChar;
        this.canWalk = canWalk;
        this.hitImagesAmount = hitImagesAmount;
        this.attackingImagesAmount = attackingImagesAmount;
        this.targeting = false;
        this.hasShot = false;
        this.walks = false;
        this.hittingSound = new Audio();
        this.hittingSound.src = './sounds/enemy-got-hit.mp3';
        this.hittingSound.volume = 0.5;
        this.ammoImage = new Image();
        this.ammoImage.src = './graphics/enemies/shooter/attack/shoot.svg';
        this.hitImagesArrays = {
            left: [],
            right: []
        };
        this.attackingImagesArrays = {
            left: [],
            right: []
        }
        this.shootingSoundPath = './sounds/enemy-shoots.mp3';
    }

    /**
     * 
     * @param {number} width the width of @this enemys ammo
     * @param {number} height the height of @this enemys ammo
     * @method setupShoot sets up a new ammo for @this enemy as long as the game is not paused, @this enemy looks at and sees the char, is dangerous
     * and has not shot for within the last second.
     * It invokes @method createNewShoot based on @this enemys looking direction.
     */
    setupShoot(width = 0.5*widthUnit, height = 0.5*heightUnit) {
        if (!gamePaused && this.isDangerous && !this.hasShot && this.isVisible) {
            switch (this.lookingDirection) {
                case "left":
                    this.createNewShoot(width, height, this.enemyType != "big-boss" ? this.x - widthUnit : this.x + this.width/4, this.enemyType != "big-boss" ? this.y + 5*this.height/32 : this.y + this.height/2, this.lookingDirection, this.ammoImage);
                    break;
                case "right":
                    this.createNewShoot(width, height, this.x + widthUnit, this.enemyType != "big-boss" ? this.y + 5*this.height/32 : this.y, this.lookingDirection, this.ammoImage);
                    break;
            }
            this.whenShooterHasShot();
        }else { return; }
    }

    /**
     * 
     * @method whenShooterHasShot sets @this enemys @var hasShot to true, and starts a timeout-function, that sets the @var hasShot to false after 1 second.
     */
    whenShooterHasShot() {
        this.hasShot = true;
        setTimeout(()=>{
            this.hasShot = false;
            if(this.enemyType != "big-boss") {
                if(this.isTargeting && this.isVisible) { this.setupShoot(); }
            }else { if(this.isVisible) { this.setupShoot(); } }
        }, 1000);
    }

    /**
     * 
     * @param {number} width of the ammo
     * @param {number} height of the ammo
     * @param {number} x starting x-coordinate of the ammo
     * @param {number} y starting y-coordinate of the ammo
     * @param {string} flyDirection is actually the looking direction of @this enemy
     * @param {string} ammoImage a string with the image-path of the ammo
     */
    createNewShoot(width, height, x, y, flyDirection, ammoImage) {
        hitables.flyables.push(new Cannonball(width, height, x, y, flyDirection, ammoImage, this.shootingSoundPath));
    }
}