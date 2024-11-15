class Shooter extends Enemy {
    targeting = false;
    hasShot = false;
    walks = false;

    constructor(x, y, width, height, enemyType, decreaseLifeAmount, canShoot, lookingDirection, lifeAmount, distanceToSeeChar, canWalk) {
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
        this.hitImagesAmount = 5;
        this.checkCharPos();
    }

    setupCannonball() {
        if (!gamePaused && this.targeting && this.isDangerous && !this.hasShot) {
            switch (this.lookingDirection) {
                case "left":
                    this.createCannonBall(this.x - wallBrickWidth, this.y + 5, this.lookingDirection);
                    break;
                case "right":
                    this.createCannonBall(this.x + wallBrickWidth, this.y + 5, this.lookingDirection);
                    break;
            }
            this.hasShot = true;
            setTimeout(()=>{
                this.hasShot = false;
                this.setupCannonball();
            }, 1000);
        }else { return; }
    }

    createCannonBall(x, y, flyDirection) {
        hitables.flyables.push(new Cannonball(x, y, flyDirection));
    }
}