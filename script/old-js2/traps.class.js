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

    /**
     * 
     * @param {number} x the x-coordinate of @this Trap
     * @param {number} y the y-coordinate of @this Trap
     * @param {number} width the width of @this Trap
     * @param {number} height the height of @this Trap
     * @param {string} imagePath the image-path  of @this Trap
     * @param {string} trapType the trap-type of @this Trap
     * @param {string} orientation the orientation of @this Trap
     * @param {number} decreaseLifeAmount the amount of life @this Trap can take away from the char
     * @param {boolean} isDangerous says wether @this Trap is dangerous right now or not
     * @param {boolean} onMovingPlatform says wether @this Trap is on a moving platform or not
     * @param {number} movingPlatformIndex the index of the platform @this Trap stands on
     * @param {number} animationImagesAmount of animation-images of @this Trap
     * @param {number} animationIndex the index of the actual animation-image of @this Trap
     */
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
        this.trapAnimationId = setInterval(()=>{this.animateTrap();}, 80*standardFrameRate);
        this.animationImages = {
            ttb: [],
            btt: []
        }
    }

    /**
     * 
     * @method checkCharPos checks the position of the char.
     */
    checkCharPos() {
        if(char.x + char.width > this.x && this.x + this.width > char.x && char.y + char.height > this.y && this.y + this.height > char.y && !char.gotHit) {
            if(this.isDangerous) { char.hitChar(this.decreaseLifeAmount); }
        }
        requestAnimationFrame(()=>{this.checkCharPos()});
    }

    /**
     * 
     * @method checkPlatformCords checks the x or y coordinate of the moving platform @this Trap stands on
     * so that its x- or y-coordinate is being change properly.
     */
    checkPlatformCords() {
        if(this.onMovingPlatform && this.movingPlatformIndex >= 0) {
            if(platforms[this.movingPlatformIndex].sideways) {
                this.x = platforms[this.movingPlatformIndex].x + (this.startingXPos - platforms[this.movingPlatformIndex].startingXPos);
            }else { this.y = platforms[this.movingPlatformIndex].y - this.height; }
            requestAnimationFrame(()=>{ this.checkPlatformCords(); });
        }else { return; }
    }

    /**
     * 
     * @animateTrap is for the sting-trap. It drives the stings in or out and sets its @var isDangerous to true or false, based on the value of @var animationIndex
     */
    animateTrap() {
        if(this.trapType === "sting-coming-out") {
            if(this.orientation) {
                this.image = this.animationImages[this.orientation][this.animationIndex % this.animationImagesAmount];
            }else { this.image.src = `./graphics/traps/stings/${this.trapType}-${this.animationIndex % this.animationImagesAmount}.png`; }
            if(this.animationIndex % this.animationImagesAmount === 0 || this.animationIndex % this.animationImagesAmount === 1 || this.animationIndex % this.animationImagesAmount === 6 ||this.animationIndex % this.animationImagesAmount === 7) {
                this.isDangerous = false;
            }else { this.isDangerous = true; }
            this.animationIndex++;
        }else {
            clearInterval(this.trapAnimationId);
            return;
        }
    }
}