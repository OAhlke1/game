class Cannonball extends Enemy {
    flyingDirection;
    inCanvas = true;
    
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
        this.animateTrajectory();
        this.enemyType = "flyable";
    }

    animateTrajectory(i = 0) {
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
                this.destroyCannonBall();
            }
            if(this.checkIfHittingChar()) { this.hittingChar(); }
            requestAnimationFrame(()=>{ this.animateTrajectory(i) });
        }else { return; }
    }
    
    checkIfCannonballLeftCanvas () {
        if(this.x + this.width <= 0 || this.x > canvas.width+wallBrickWidth) { return true; }
    }

    destroyCannonBall() {
        this.inCanvas = false;
        this.image.src = '';
    }
}