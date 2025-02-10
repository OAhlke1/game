class GreenEnemy extends Enemy {
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