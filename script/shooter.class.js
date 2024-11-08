class Shooter extends Enemy {
    /* x;
    y;
    width;
    height;
    image; */
    enemyType;
    targeting = false;
    shoots = false;

    constructor(x, y, width, height, enemyType, decreaseLifeAmount, canShoot, runningDirection, lifeAmount) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height,
        this.image = new Image();
        this.image.src = `graphics/enemies/${enemyType}/attack/attack-${runningDirection}-0.png`;
        this.enemyType = enemyType;
        this.decreaseLifeAmount = decreaseLifeAmount;
        this.canShoot = canShoot;
        this.runningDirection = runningDirection;
        this.lifeAmount = lifeAmount;
    }

    checkIfTargeting() {
        if (figure.y + figure.height > this.y && this.y + this.height > figure.y) {
            return true;
        }else {
            return false;
        }
    }

    setupCannonball() {
        if (!this.gotBeat && this.targeting && !gamePaused) {
            switch (this.runningDirection) {
                case "left":
                    createCannonBall(this.x - wallBrickWidth, this.y + 5, this.runningDirection);
                    break;
                case "right":
                    createCannonBall(this.x + wallBrickWidth, this.y + 5, this.runningDirection);
                    break;
            }
            //this.animateTrajectory();
            setTimeout(()=>{this.setupCannonball();}, 5000);
        }else { return; }
    }
}