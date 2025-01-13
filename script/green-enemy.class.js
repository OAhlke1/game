class GreenEnemy extends Enemy {
    constructor(x, y, width, height, enemyType, imagePath, decreaseHealthAmount, canShoot, lookingDirection, lifeAmount, distanceToSeeChar, canWalk, hitImagesAmount, attackingImagesAmount, isAlive) {
        super();
        this.x = x;
        this.standardX = x;
        this.y = y;
        this.standardY = y;
        this.width = width;
        this.height = height,
        this.image = new Image();
        this.image.src = imagePath;
        this.enemyType = enemyType;
        this.decreaseHealthAmount = decreaseHealthAmount;
        this.canShoot = canShoot;
        this.lookingDirection = lookingDirection;
        this.lifeAmount = lifeAmount;
        this.maxLifeAmount = lifeAmount;
        this.standardImgPath = `./graphics/enemies/${enemyType}/attack/attack-${lookingDirection}-0.png`;
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