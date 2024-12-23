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
        if(this.onMovingPlatform && this.movingPlatformIndex >= 0) {
            if(platforms[this.movingPlatformIndex].sideways) {
                this.x = platforms[this.movingPlatformIndex].x + (this.startingXPos - platforms[this.movingPlatformIndex].startingXPos);
            }else { this.y = platforms[this.movingPlatformIndex].y - this.height; }
            requestAnimationFrame(()=>{ this.checkPlatformCords(); });
        }else { return; }
    }

    animateTrap() {
        let onDangerousState = parseFloat(hitables.traps[0].animationIndex/hitables.traps[0].animationImagesAmount) - Math.floor(hitables.traps[0].animationIndex/hitables.traps[0].animationImagesAmount);
        if(this.trapType === "sting-coming-out") {
            this.image.src = `graphics/traps/stings/${this.trapType}${this.orientation === '' ? '' : '-'+this.orientation}-${this.animationIndex % this.animationImagesAmount}.png`;
            //console.log(imgState, hitables.traps[0].animationIndex % hitables.traps[0].animationImagesAmount, onDangerousState);
            if(onDangerousState < 0.25 || onDangerousState >= 0.75) { //this.animationIndex % this.animationImagesAmount === 0 || this.animationIndex % this.animationImagesAmount === 1 || this.animationIndex % this.animationImagesAmount === 6 ||this.animationIndex % this.animationImagesAmount === 7
                this.isDangerous = false;
            }else { this.isDangerous = true; }
            this.animationIndex++;
        }else {
            clearInterval(this.trapAnimationId);
            return;
        }
    }
}