class Shooter extends Enemy {
    targeting;
    hasShot;
    walks;
    player;
    ammoImage;

    constructor(x, y, width, height, enemyType, decreaseHealthAmount, canShoot, lookingDirection, lifeAmount, distanceToSeeChar, canWalk, hitImagesAmount, attackingImagesAmount) {
        super();
        this.x = x;
        this.standardX = x;
        this.y = y;
        this.standardY = y;
        this.width = width;
        this.height = height,
        this.image = new Image();
        this.image.src = `./graphics/enemies/${enemyType}/attack/attack-${lookingDirection}-0.png`;
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
        this.targeting = false;
        this.hasShot = false;
        this.walks = false;
        this.shootingSound = new Audio();
        this.shootingSound.src = './sounds/enemy-shoots.mp3';
        this.shootingSound.volume = 0.25;
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
    }

    setupShoot(width = 0.5*widthUnit, height = 0.5*heightUnit) {
        if (!gamePaused && this.targeting && this.isDangerous && !this.hasShot) {
            if(!gameMuted) { this.playShootingSound(); }
            switch (this.lookingDirection) {
                case "left":
                    this.createNewShoot(width, height, this.enemyType != "big-boss" ? this.x - widthUnit : this.x + this.width/4, this.y + 5*this.height/32, this.lookingDirection, this.ammoImage);
                    break;
                case "right":
                    this.createNewShoot(width, height, this.x + widthUnit, this.y + 5*this.height/32, this.lookingDirection, this.ammoImage);
                    break;
            }
            this.hasShot = true;
            setTimeout(()=>{
                this.hasShot = false;
                this.setupShoot();
            }, 1000);
        }else { return; }
    }

    createNewShoot(width, height, x, y, flyDirection, ammoImage) {
        hitables.flyables.push(new Cannonball(width, height, x, y, flyDirection, ammoImage));
    }

    playShootingSound() {
        this.shootingSound.play();
    }
}