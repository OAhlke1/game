class Shooter extends Enemy {
    targeting = false;
    hasShot = false;
    walks = false;

    constructor(x, y, width, height, enemyType, decreaseLifeAmount, canShoot, lookingDirection, lifeAmount, distanceToSeeChar, canWalk, hitImagesAmount, attackingImagesAmount) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height,
        this.image = new Image();
        this.image.src = `graphics/enemies/${enemyType}/attack/attack-${lookingDirection}-0.png`;
        this.enemyType = enemyType;
        this.decreaseLifeAmount = decreaseLifeAmount;
        this.canShoot = canShoot;
        this.lookingDirection = lookingDirection;
        this.lifeAmount = lifeAmount;
        this.standardImgPath = `graphics/enemies/${enemyType}/attack/attack-${lookingDirection}-0.png`;
        this.distanceToSeeChar = distanceToSeeChar;
        this.canWalk = canWalk;
        this.hitImagesAmount = hitImagesAmount;
        this.attackingImagesAmount = attackingImagesAmount;
    }

    setupCannonball() {
        if (!gamePaused && this.targeting && this.isDangerous && !this.hasShot) {
            switch (this.lookingDirection) {
                case "left":
                    this.createCannonBall(0.5*widthUnit, 0.5*heightUnit, this.x - widthUnit, this.y + 5*this.height/32, this.lookingDirection);
                    break;
                case "right":
                    this.createCannonBall(0.5*widthUnit, 0.5*heightUnit, this.x + widthUnit, this.y + 5*this.height/32, this.lookingDirection);
                    break;
            }
            this.hasShot = true;
            setTimeout(()=>{
                this.hasShot = false;
                this.setupCannonball();
            }, 1000);
        }else { return; }
    }

    createCannonBall(width, height, x, y, flyDirection) {
        hitables.flyables.push(new Cannonball(width, height, x, y, flyDirection));
    }
}