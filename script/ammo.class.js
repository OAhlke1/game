class Ammo extends Char {
    flyingDirection;
    decreaseLifeAmount;
    shootingSoundPlayer;
    leftCanvas;

    constructor(x, y, width, height, imagePath, decreaseLifeAmount) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imagePath;
        this.flyingDirection = char.movingDirection;
        this.decreaseLifeAmount = decreaseLifeAmount;
        this.leftCanvas = false;
        this.shootingSoundPlayer = new Audio();
        if(!gameMuted) { this.playShootingSound(); }
        this.trajectoryAnimationId = setInterval(()=>{ this.animateTrajectory(); }, 10);
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
                        elem.isDangerous = false;
                        elem.walks = false;
                        if(elem.enemyType != "big-boss") {
                            elem.lifeAmount -= this.decreaseLifeAmount;
                            elem.hittingAnimationId = setInterval(() => { elem.animateEnemyGotHit(); }, 500/elem.hitImagesAmount);
                        }else if(elem.enemyType === "big-boss" && bigBoss.isVisible) {
                            if(char.specialAmmoParts === 3) {
                                elem.lifeAmount -= this.decreaseLifeAmount;
                                elem.hittingAnimationId = setInterval(() => { elem.animateEnemyGotHit(); }, 500/elem.hitImagesAmount);
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
        if(!gameMuted) {
            this.shootingSound = './sounds/enemy-shoots.mp3';
            this.shootingSoundPlayer.src = this.shootingSound;
            this.shootingSoundPlayer.play();
        }
    }
}