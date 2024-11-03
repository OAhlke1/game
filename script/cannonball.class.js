class Cannonball extends Enemy {
    x;
    y;
    width = wallBrickWidth;
    height = wallBrickWidth;
    flyingDirection;
    
    constructor(x, y, flyingDirection) {
        super();
        this.x = x;
        this.y = y;
        this.flyingDirection = flyingDirection;
        this.image = new Image();
        this.image.src = 'graphics/enemies/shooter/attack/cannonball.png';
        this.decreaseLifeAmount = 5;
        //this.animateTrajectory();
    }

    animateTrajectory() {
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
        requestAnimationFrame(()=>{ this.animateTrajectory() });
    }
}