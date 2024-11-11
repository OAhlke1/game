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
        this.checkCharPos();
    }

    checkIfTargeting() {
        if(Math.abs(figure.x + figure.width - this.x) <= this.distanceToSeeChar/2 || Math.abs(this.x + this.width - figure.x) <= this.distanceToSeeChar/2) {
            this.targeting = false;
            this.walks = true;
            this.animateWalking();
        }else if(Math.abs(figure.x + figure.width - this.x) > this.distanceToSeeChar/2 || Math.abs(this.x + this.width - figure.x) >= this.distanceToSeeChar/2) {
            this.targeting = true;
            this.walks = false;
            this.setupCannonball();
        }else {
            return false;
        }
    }

    lookAtChar() {
        if(this.x > figure.x + figure.width) {
            if(this.lookingDirection === "right") {
                this.lookingDirection = "left";
                this.image.src = `graphics/enemies/${this.enemyType}/attack/attack-${this.lookingDirection}-0.png`;
            }
        }else if(this.x + this.width < figure.x) {
            if(this.lookingDirection === "left") {
                this.lookingDirection = "right";
                this.image.src = `graphics/enemies/${this.enemyType}/attack/attack-${this.lookingDirection}-0.png`;
            }
        }
    }

    /* animateWalking(i = 0) {
        if(this.walks) {
            this.x = this.lookingDirection === "right" ? this.x += wallBrickWidth/100 : this.x -= wallBrickWidth/100;
            this.image.src = `graphics/enemies/${this.enemyType}/attack/attack-${this.lookingDirection}-${i}.png`;
            i++;
            if(i === 7) { i = 0; }
            requestAnimationFrame(()=>{ this.animateWalking(i); });
        }
    } */

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