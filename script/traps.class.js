class Trap {
    width;
    height;
    x;
    y;
    imagePath;
    image;
    trapType;
    orientation;
    decreaseLifeAmount;
    trapAnimationId;
    animationImagesAmount;
    animationIndex;
    isDangerous;
    onMovingPlatform;
    movingPlatformIndex;
    startingXPos;
    animationImages;

    constructor(x, y, width, height, imagePath, trapType, orientation, decreaseLifeAmount, isDangerous, onMovingPlatform, movingPlatformIndex, animationImagesAmount, animationIndex = 0) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = imagePath;
        this.trapType = trapType;
        this.orientation = orientation;
        this.decreaseLifeAmount = decreaseLifeAmount;
        this.isDangerous = isDangerous;
        this.onMovingPlatform = onMovingPlatform;
        this.movingPlatformIndex = movingPlatformIndex;
        this.startingXPos = x;
        this.animationImagesAmount = animationImagesAmount;
        this.animationIndex = animationIndex;
        this.animationImages = [];
        this.checkCharPos();
        this.checkPlatformCords();
        this.trapAnimationId = setInterval(()=>{this.animateTrap();}, 80*standardFrequency);
        this.animationImages = {
            ttb: [],
            btt: []
        }
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
        if(this.onMovingPlatform && this.movingPlatformIndex >= 0) {
            if(platforms[this.movingPlatformIndex].sideways) {
                this.x = platforms[this.movingPlatformIndex].x + (this.startingXPos - platforms[this.movingPlatformIndex].startingXPos);
            }else { this.y = platforms[this.movingPlatformIndex].y - this.height; }
            requestAnimationFrame(()=>{ this.checkPlatformCords(); });
        }else { return; }
    }

    animateTrap() {
        if(this.trapType === "sting-coming-out") {
            if(this.orientation) {
                this.image = this.animationImages[this.orientation][this.animationIndex % this.animationImagesAmount];
            }else { this.image.src = `./graphics/traps/stings/${this.trapType}-${this.animationIndex % this.animationImagesAmount}.png`; }
            if(this.animationIndex % this.animationImagesAmount === 0 || this.animationIndex % this.animationImagesAmount === 1 || this.animationIndex % this.animationImagesAmount === 6 ||this.animationIndex % this.animationImagesAmount === 7) {//onDangerousState < 0.25 || onDangerousState >= 0.75
                this.isDangerous = false;
            }else { this.isDangerous = true; }
            this.animationIndex++;
        }else {
            clearInterval(this.trapAnimationId);
            return;
        }
    }
}