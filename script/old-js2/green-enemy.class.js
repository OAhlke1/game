class GreenEnemy extends Enemy {

    /**
     * 
     * @param {number} x the starting x-coordinate of @this Enemy
     * @param {number} y the y-coordinate of @this Enemy
     * @param {number} width the width of @this Enemy
     * @param {number} height the height of @this Enemy
     * @param {string} enemyType the enemy-type of @this Enemy
     * @param {number} decreaseHealthAmount the amount @this Enemy can take away from the char
     * @param {boolean} canShoot says that @this Enemy can't shoot
     * @param {string} lookingDirection the looking-direction of @this Enemy
     * @param {number} lifeAmount the life-amount of @this Enemy
     * @param {number} distanceToSeeChar the furthermost distance of the char, so that @this Enemy can still see it.
     * @param {boolean} canWalk says wether @this Enemy is able to walk.
     * @param {number} hitImagesAmount the amount of images of @this Enemys animation when it gets hit
     * @param {number} attackingImagesAmount the amount of images of @this Enemys animation when it walks/attacks
     * @param {boolean} isAlive 
     */
    constructor(x, y, width, height, enemyType, decreaseHealthAmount, canShoot, lookingDirection, lifeAmount, distanceToSeeChar, canWalk, hitImagesAmount, attackingImagesAmount, isAlive) {
        super();
        this.x = x;
        this.standardX = x;
        this.y = y;
        this.standardY = y;
        this.width = width;
        this.height = height,
        this.image = new Image();
        this.image.src = './graphics/enemies/green/attack/attack-left-0.png';
        this.enemyType = enemyType;
        this.decreaseHealthAmount = decreaseHealthAmount;
        this.canShoot = canShoot;
        this.lookingDirection = lookingDirection;
        this.lifeAmount = lifeAmount;
        this.maxLifeAmount = lifeAmount;
        this.standardImgPath = `./graphics/enemies/${enemyType}/attack/attack-${lookingDirection}-0.png`;
        this.hittingSound = new Audio();
        this.hittingSound.src = './sounds/enemy-got-hit.mp3';
        this.hittingSound.volume = 0.5;
        this.distanceToSeeChar = distanceToSeeChar;
        this.canWalk = canWalk;
        this.hitImagesAmount = hitImagesAmount;
        this.attackingImagesAmount = attackingImagesAmount;
        this.hitImagesArrays = {
            left: [],
            right: []
        };
        this.attackingImagesArrays = {
            left: [],
            right: []
        };
    }
}