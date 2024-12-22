class Trap {
    width;
    height;
    x;
    y;
    imagePath;
    image;
    trapType;
    decreaseLifeAmount;
    trapAnimationId;
    animationIndex;
    isDangerous;
    onMovingPlatform;
    movingPlatformIndex;
    startingXPos;

    constructor(x, y, width, height, imagePath, trapType, decreaseLifeAmount, isDangerous, onMovingPlatform, movingPlatformIndex) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = imagePath;
        this.trapType = trapType;
        this.decreaseLifeAmount = decreaseLifeAmount;
        this.animationIndex = 0;
        this.isDangerous = isDangerous;
        this.onMovingPlatform = onMovingPlatform;
        this.movingPlatformIndex = movingPlatformIndex;
        this.startingXPos = x;
        this.checkCharPos();
        this.checkPlatformCords();
        this.trapAnimationId = setInterval(()=>{this.animateTrap();}, 800);
    }

    checkCharPos() {
        if(char.x + char.width > this.x && this.x + this.width > char.x && char.y + char.height > this.y && this.y + this.height > char.y && !char.gotHit) {
            if(this.isDangerous) {
                char.hitChar();
                char.decreaseHealth(this.decreaseLifeAmount);
            }
        }
        requestAnimationFrame(()=>{this.checkCharPos()});
    }

    checkPlatformCords() {
        //console.log(this.x, platforms[this.movingPlatformIndex].x);
        if(this.onMovingPlatform) {
            if(platforms[this.movingPlatformIndex].sideways) {
                this.x = platforms[this.movingPlatformIndex].x + (this.startingXPos - platforms[this.movingPlatformIndex].startingXPos);
            }else { this.y = platforms[this.movingPlatformIndex].y - this.height; }
            requestAnimationFrame(()=>{ this.checkPlatformCords(); });
        }else { return; }
    }

    animateTrap() {
        if(this.trapType === "coming-out-sting") {
            this.image.src = `graphics/traps/stings/sting-coming-out-${this.animationIndex % 9}.png`;
            if(this.animationIndex % 9 === 0 || this.animationIndex % 9 === 1 || this.animationIndex % 9 === 7 ||this.animationIndex % 9 === 8) {
                this.isDangerous = false;
            }else { this.isDangerous = true; }
            this.animationIndex++;
        }else {
            clearInterval(this.trapAnimationId);
            return;
        }
    }
}