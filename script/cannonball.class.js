class Cannonball extends Enemy {
    flyingDirection;
    inCanvas = true;
    trajectoryIntervalId;
    
    constructor(x, y, flyingDirection) {
        super();
        this.x = x;
        this.y = y;
        this.width = wallBrickWidth;
        this.height = wallBrickWidth;
        this.flyingDirection = flyingDirection;
        this.image = new Image();
        this.image.src = 'graphics/enemies/shooter/attack/cannonball.png';
        this.decreaseLifeAmount = 5;
        this.enemyType = "flyable";
        this.trajectoryIntervalId = setInterval(()=>{ this.animateTrajectory() }, 10);
    }

    animateTrajectory() {
        if(!gamePaused && this.inCanvas) {
            switch(this.flyingDirection) {
                case "left":
                    if(this.x + this.width <= 0) { return; }
                    this.x -= 5;
                    break;
                case "right":
                    if(this.x + this.width >= canvas.width) { return; }
                    this.x += 5;
                    break;
            }
            if(this.checkIfCannonballLeftCanvas()) {
                this.inCanvas = false;
            }
            if(this.checkIfHittingChar()) { this.hittingChar(); }
        }else {
            clearInterval(this.trajectoryIntervalId);
            return;
        }
    }
    
    checkIfCannonballLeftCanvas () {
        if(this.x + this.width <= 0 || this.x > canvas.width+wallBrickWidth) { return true; }
    }
}