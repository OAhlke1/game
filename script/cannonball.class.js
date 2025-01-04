class Cannonball extends Enemy {
    flyingDirection;
    trajectoryIntervalId;
    inCanvas = true;
    isDangerous = true;
    
    constructor(width, height, x, y, flyingDirection, ammoImageSource) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.flyingDirection = flyingDirection;
        this.ammoImageSource = ammoImageSource;
        this.image = new Image();
        this.image.src = ammoImageSource;
        this.decreaseLifeAmount = 5;
        this.enemyType = "flyable";
        this.trajectoryIntervalId = setInterval(()=>{ this.animateTrajectory() }, standardFrequency);
    }

    animateTrajectory() {
        if(this.inCanvas){
            if(!gamePaused) {
                switch(this.flyingDirection) {
                    case "left":
                        if(this.x + this.width <= 0) { return; }
                        this.x -= 5;
                        break;
                    case "right":
                        if(this.x + this.width >= canvas.offsetWidth) { return; }
                        this.x += 5;
                        break;
                }
                if(this.checkIfCannonballLeftCanvas()) {
                    this.inCanvas = false;
                    this.isDangerous = false;
                }
                if(this.checkIfHittingChar() && this.isDangerous) {
                    this.inCanvas = false;
                    this.isDangerous = false;
                    this.hittingChar();
                }
            }
        }else {
            clearInterval(this.trajectoryIntervalId);
            return;
        }
    }
    
    checkIfCannonballLeftCanvas () {
        if(this.x + this.width <= 0 || this.x > canvas.offsetWidth+widthUnit) { return true; }
    }
}