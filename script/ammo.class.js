class Ammo extends Char {
    flyingDirection;
    decreaseLifeAmount;
    leftCanvas;

    constructor(x, y, width, height, imagePath) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imagePath;
        this.flyingDirection = char.movingDirection;
        this.decreaseLifeAmount = 30;
        this.leftCanvas = false;
        this.trajectoryAnimationId = setInterval(()=>{ this.animateTrajectory(); }, 20);
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
            //console.log(this.x + this.width > elem.x && elem.x + elem.width > this.x);
            if(this.y + this.height > elem.y && elem.y + elem.height > this.y) {
                if(this.x + this.width > elem.x && elem.x + elem.width > this.x) {
                    if(elem.isDangerous) {
                        elem.isDangerous = false;
                        elem.walks = false;
                        elem.lifeAmount -= this.decreaseLifeAmount;
                        elem.hittingAnimationId = setInterval(() => { elem.animateEnemyGotHit(); }, 500/elem.hitImagesAmount);
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
}