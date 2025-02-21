class Cannonball extends Enemy {
    flyingDirection; /** the @var lookingDirection of the shooting-enemy */
    trajectoryIntervalId; /** the id of the animation of the trajectory */
    inCanvas = true; /** a boolean whether the shooters ammo still is in canvas */
    isDangerous = true; /** a boolean for @this Cannonball is dangerous */
    
    constructor(width, height, x, y, flyingDirection, ammoImage) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.flyingDirection = flyingDirection;
        this.ammoImage = ammoImage;
        this.decreaseLifeAmount = 5;
        this.enemyType = "flyable";
        this.trajectoryIntervalId = setInterval(()=>{ this.animateTrajectory() }, standardFrameRate);
    }

    /**
     * 
     * @function animateTrajectory animates the trajectory @this Cannonball
     * as long as it is in canvas (@var inCanvas) or the game is not paused.
     * When the cannonball left the canvas or hits the char when dangerous
     * its @var inCanvas and @var isDangerous are being set to false.
     * When the cannonball is at the char, the @function hittingChar of the @this ammos
     * shooter is being invoked.
     */
    animateTrajectory() {
        if(this.inCanvas && !gamePaused){
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
        }else { clearInterval(this.trajectoryIntervalId); }
    }
    
    /**
     * 
     * @function checkIfCannonballLeftCanvas checks, whether the cannonball is directly at the char or not.
     */
    checkIfCannonballLeftCanvas () {
        if(this.x + this.width <= 0 || this.x > canvas.offsetWidth+widthUnit) { return true; }
    }
}