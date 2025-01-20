class BigBoss extends Shooter {
    animateLevitationId;
    isVisible;
    isDefeated;
    fallingSound;
    fallingEnded;

    constructor(x, y, width, height, enemyType, decreaseLifeAmount, canShoot, lookingDirection, lifeAmount, distanceToSeeChar, canWalk, hitImagesAmount, attackingImagesAmount) {
        super();
        this.x = x;
        this.standardX = x;
        this.y = y;
        this.standardY = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = `./graphics/enemies/big-boss/putin.png`;
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
        this.shootingSound = new Audio();
        this.shootingSound.src = './sounds/enemy-shoots.mp3';
        this.hittingSound = new Audio();
        this.hittingSound.src = './sounds/enemy-got-hit.mp3';
        this.hittingSound.volume = 0.5;
        this.fallingSound = new Audio();
        this.fallingSound.src = './sounds/big-boss-falling.wav';
        this.fallingSound.volume = 0.5;
        this.animateLevitationId = setInterval(() => { this.levitateDown() }, 3*standardFrameRate);
        this.ammoImage = new Image();
        this.ammoImage.src = './graphics/enemies/big-boss/shoot.svg';
        this.isVisible = false;
        this.isDefeated = false;
        this.isDangerous = true;
        this.fallingEnded = false;
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

    animateBigBossGotHit() {
        this.image = this.hitImagesArrays[this.lookingDirection][this.hittingIndex];
        this.hittingIndex++;
        if (this.hittingIndex === this.hitImagesAmount) {
            this.hittingIndex = 0;
            if (this.hittingIndex === 0 && this.hittingAnimationIndex === 0 && !gameMuted) { this.playHittingSound(); }
            this.hittingAnimationIndex++;
            if (this.hittingAnimationIndex === 2) {
                this.hittingAnimationIndex = 0;
                if (this.lifeAmount <= 0) {
                    this.lifeAmount = 0;
                    this.isDangerous = false;
                    this.isAlive = false;
                    this.isDefeated = true;
                    clearInterval(this.animateLevitationId);
                    this.animateLevitationId = setInterval(() => { this.animateFalling(); }, standardFrameRate);
                    if (this.fallingSound.paused) { this.playFallingSound(); }
                    saveNotDefeatedEnemies();
                    setMenuBarProperties("enemy");
                } else if (this.lifeAmount > 0) {
                    this.isDangerous = true;
                }
                clearInterval(this.hittingAnimationId);
                return;
            }
        }
        return;
    }

    animateFalling() {
        this.y += 0.5*heightUnit;
        if(this.y > canvas.offsetHeight) {
            if(!this.fallingEnded) {
                this.fallingended = true;
                pausePlayGameToggle();
            }
            clearInterval(this.animateLevitationId);
            document.querySelector('.you-win-screen').classList.remove('disNone');
            return;
        }
    }

    animateShooting() {
        if(this.isVisible) {
            this.setupShoot(2.5*widthUnit, 2.5*heightUnit);
            setTimeout(() => { this.animateShooting(); }, 1000);
        }
    }

    playFallingSound() {
        pauseAllPlayers();
        this.fallingSound.play();
        this.fallingSound.addEventListener('ended', ()=>{
            this.fallingSound.currentTime = 0;
            this.fallingSound.pause();
        });
    }
}