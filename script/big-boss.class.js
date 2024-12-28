class BigBoss extends Shooter {
    animateLevitationId;

    constructor(x, y, width, height, enemyType, decreaseLifeAmount, canShoot, lookingDirection, lifeAmount, distanceToSeeChar, canWalk, hitImagesAmount, attackingImagesAmount) {
        super();
        this.x = x;
        this.standardX = x;
        this.y = y;
        this.standardY = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = `./graphics/enemies/${enemyType}/attack/attack-${lookingDirection}-0.png`;
        this.enemyType = enemyType;
        this.decreaseLifeAmount = decreaseLifeAmount;
        this.canShoot = canShoot;
        this.lookingDirection = lookingDirection;
        this.lifeAmount = lifeAmount;
        this.standardImgPath = `./graphics/enemies/${enemyType}/attack/attack-${lookingDirection}-0.png`;
        this.distanceToSeeChar = distanceToSeeChar;
        this.canWalk = canWalk;
        this.hitImagesAmount = hitImagesAmount;
        this.attackingImagesAmount = attackingImagesAmount;
        this.targeting = false;
        this.hasShot = false;
        this.walks = false;
        this.player = new Audio();
        this.player.src = './sounds/enemy-shoots.mp3';
        this.animateLevitationId = setInterval(() => { this.levitateDown() }, 30);
    }

    levitateUp() {
        this.y -= 0.125*heightUnit;
        if(this.y <= 0) {
            clearInterval(this.animateLevitationId);
            this.animateLevitationId = setInterval(()=>{ this.levitateDown(); }, 30);
            return;
        }
    }

    levitateDown() {
        this.y += 0.125*heightUnit;
        if(this.y + this.height >= canCont.offsetHeight) {
            clearInterval(this.animateLevitationId);
            this.animateLevitationId = setInterval(()=>{ this.levitateUp(); }, 30);
            return;
        }
    }
}