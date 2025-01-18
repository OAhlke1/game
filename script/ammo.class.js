class Ammo extends Char {
    flyingDirection;
    decreaseLifeAmount;
    shootingSound;
    leftCanvas;

    constructor(x, y, width, height, image, decreaseLifeAmount) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
        this.flyingDirection = char.movingDirection;
        this.decreaseLifeAmount = decreaseLifeAmount;
        this.leftCanvas = false;
        this.shootingSound = new Audio();
        this.shootingSound.src = './sounds/enemy-shoots.mp3';
        if(!gameMuted) { this.playShootingSound(); }
        this.trajectoryAnimationId = setInterval(()=>{ this.animateTrajectory(); }, standardFrameRate);
    }

    animateTrajectory() {
        if(!gamePaused) {
            if(!this.leftCanvas) {
                if(this.flyingDirection === "left") {
                    this.x -= widthUnit/2;
                }else if(this.flyingDirection === "right") {
                    this.x += widthUnit/2;
                }
                this.checkForEnemies();
                this.checkIfStillInCanvas();
            }else {
                clearInterval(this.trajectoryAnimationId);
                return;
            }
        }
    }

    checkForEnemies() {
        hitables.enemies.forEach((elem) => {
            if(this.y + this.height > elem.y && elem.y + elem.height > this.y) {
                if(this.x + this.width > elem.x && elem.x + elem.width > this.x) {
                    if(elem.isDangerous) {
                        elem.walks = false;
                        if(elem.enemyType != "big-boss") {
                            elem.isDangerous = false;
                            elem.lifeAmount -= this.decreaseLifeAmount;
                            elem.hittingAnimationId = setInterval(() => { elem.animateEnemyGotHit(); }, 3*standardFrameRate);
                        }else if(elem.enemyType === "big-boss" && bigBoss.isVisible) {
                            if(char.specialAmmoParts === 3) {
                                //elem.isDangerous = false;
                                elem.lifeAmount -= this.decreaseLifeAmount;
                                elem.hittingAnimationId = setInterval(() => { elem.animateBigBossGotHit(); }, 3*standardFrameRate);
                            }
                        }
                        this.leftCanvas = true;
                        clearInterval(this.trajectoryAnimationId);
                    }
                }
            }
        })
    }

    checkIfStillInCanvas() {
        if(this.x + this.width <= 0 || this.x >= canvas.offsetWidth) { this.leftCanvas = true; }
    }

    playShootingSound() {
        if(!gameMuted && char.isAlive) {
            this.shootingSound.play();
        }
    }
}