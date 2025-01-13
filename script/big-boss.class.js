class BigBoss extends Shooter {
    animateLevitationId;
    isVisible;
    isDefeated;

    constructor(x, y, width, height, enemyType, decreaseLifeAmount, canShoot, lookingDirection, lifeAmount, distanceToSeeChar, canWalk, hitImagesAmount, attackingImagesAmount) {
        super();
        this.x = x;
        this.standardX = x;
        this.y = y;
        this.standardY = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = `./graphics/enemies/big-boss/putin.png`; //`./graphics/enemies/${enemyType}/attack/attack-${lookingDirection}-0.png`
        this.enemyType = enemyType;
        this.decreaseLifeAmount = decreaseLifeAmount;
        this.canShoot = canShoot;
        this.lookingDirection = lookingDirection;
        this.lifeAmount = lifeAmount;
        this.maxLifeAmount = lifeAmount;
        this.standardImgPath = `./graphics/enemies/${enemyType}/attack/attack-${lookingDirection}-0.png`;
        this.distanceToSeeChar = distanceToSeeChar;
        this.canWalk = canWalk;
        this.hitImagesAmount = hitImagesAmount;
        this.attackingImagesAmount = attackingImagesAmount;
        this.targeting = true;
        this.hasShot = false;
        this.walks = false;
        this.player = new Audio();
        this.player.src = './sounds/enemy-shoots.mp3';
        this.animateLevitationId = setInterval(() => { this.levitateDown() }, 3*standardFrameRate);
        this.ammoImage = new Image();
        this.ammoImage.src = './graphics/enemies/big-boss/shoot.svg';
        this.isVisible = false;
        this.hittingSound = './sounds/big-boss-got-hit.mp3';
        this.hittingSoundPlayer = new Audio;
        this.isDefeated = false;
        this.isDangerous = true;
    }

    levitateUp() {
        if(!this.isDefeated) {
            this.y -= 0.125*heightUnit;
            if(this.y <= 0) {
                clearInterval(this.animateLevitationId);
                this.animateLevitationId = setInterval(()=>{ this.levitateDown(); }, 3*standardFrameRate);
                return;
            }
        }else {
            clearInterval(this.animateLevitationId);
            this.animateLevitationId = setInterval(()=>{ this.animateFalling(); }, 3*standardFrameRate);
        }
    }

    levitateDown() {
        if(!this.isDefeated) {
            this.y += 0.125*heightUnit;
            if(this.y + this.height >= canCont.offsetHeight) {
                clearInterval(this.animateLevitationId);
                this.animateLevitationId = setInterval(()=>{ this.levitateUp(); }, 3*standardFrameRate);
                return;
            }
        }
    }

    animateFalling() {
        this.y += 0.5*heightUnit;
        if(this.y > canvas.offsetHeight) {
            gamePaused = true;
            clearInterval(this.animateLevitationId);
            document.querySelector('.you-won-screen').classList.remove('disNone');
            return;
        }
        this.playFallingSound();
    }

    animateShooting() {
        if(this.isVisible) {
            this.setupShoot(2.5*widthUnit, 2.5*heightUnit);
            setTimeout(() => { this.animateShooting(); }, 1000);
        }
    }

    playFallingSound() {
        //console.log('I am defeated!');
    }
}