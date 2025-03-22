class MovingPlatform extends Platform {
    startingXPos;
    endingXPos;
    highestPoint;
    lowestPoint;
    sideways;
    directionOneMovingAnimationId;
    directionTwoMovingAnimationId;

    /**
     * 
     * @param {number} width is the width of the platform
     * @param {number} height is the height of the platform
     * @param {number} startingXPos the most left point the sideways moving platform can reach
     * @param {number} endingXPos the most right point the sideways moving platform can reach
     * @param {number} highestPoint the uppermost point the vertically moving platform can reach
     * @param {number} lowestPoint the lowest point the vertically moving platform can reach
     * @param {number} y is the y coordinate the platform. When @this platform moves vertically, it is its starting y-coordinate.
     * @param {string} imgPath the path of the platform image.
     * @param {boolean} sideways tells wether the platform moves sideways or not. When its value is false, the platform moves vertically.
     */
    constructor(width, height, startingXPos, endingXPos, highestPoint, lowestPoint, y, imgPath, sideways) {
        super(startingXPos, y, width, height, imgPath);
        this.width = width;
        this.height = height;
        this.height = heightUnit;
        this.startingXPos = startingXPos;
        this.endingXPos = endingXPos;
        this.highestPoint = highestPoint;
        this.lowestPoint = lowestPoint;
        this.x = startingXPos;
        this.y = y;
        this.platformImage = new Image();
        this.platformImage.src = imgPath;
        this.isMoving = true;
        this.sideways = sideways;
        if(this.sideways) {
            this.directionOneMovingAnimationId = setInterval(()=>{ this.moveRight(); }, 2*standardFrameRate);
        }else {
            this.directionOneMovingAnimationId = setInterval(()=>{ this.moveDown(); }, 2*standardFrameRate);
        }
    }

    /**
     * 
     * @method moveRight shifs the platform to the right until it reaches the limit point to the right (@var endingXPos)
     * When this point is reached, the animation is being cleared (@var directionOneMovingAnimationId is the id for moving right).
     * Then the shifting to the left starts.
     */
    moveRight() {
        if (!gamePaused) {
            checkForScrolling("right");
            this.x += widthUnit / 10;
            if (this.x + this.width >= this.endingXPos) {
                this.x = this.endingXPos - this.width;
                clearInterval(this.directionOneMovingAnimationId);
                this.directionTwoMovingAnimationId = setInterval(()=>{ this.moveLeft(); }, 2*standardFrameRate);
                return;
            }
        }
    }

    /**
     * 
     * @method moveLeft shifs the platform to the left until it reaches the limit point to the left (@var startingXPos)
     * When this point is reached, the animation is being cleared (@var directionTwoMovingAnimationId is the id for moving left).
     * Then the shifting to the left starts.
     */
    moveLeft() {
        if (!gamePaused) {
            checkForScrolling("left");
            this.x -= widthUnit / 10;
            if (this.x <= this.startingXPos) {
                this.x = this.startingXPos;
                clearInterval(this.directionTwoMovingAnimationId);
                this.directionOneMovingAnimationId = setInterval(()=>{ this.moveRight(); }, 2*standardFrameRate);
                return;
            }
        }
    }

    /**
     * 
     * @method moveDown shifs the platform to the bottom until it reaches the limit point to the bottom (@var lowestPoint)
     * When this point is reached, the animation is being cleared (@var directionOneMovingAnimationId is the id for moving downwards).
     * Then the shifting to the top starts.
     */
    moveDown() {
        if (!gamePaused) {
            this.y += widthUnit / 10;
            if (this.y + this.height > this.lowestPoint) {
                this.y = this.lowestPoint - this.height;
                clearInterval(this.directionOneMovingAnimationId);
                this.directionTwoMovingAnimationId = setInterval(()=>{ this.moveUp(); }, 2*standardFrameRate);
                return;
            }
        }
    }

    /**
     * 
     * @method moveUp shifs the platform to the top until it reaches the limit point to the top (@var highestPoint)
     * When this point is reached, the animation is being cleared (@var directionTwoMovingAnimationId is the id for moving upwards).
     * Then the shifting to the bottom starts.
     */
    moveUp() {
        if (!gamePaused) {
            this.y -= heightUnit / 10;
            if (this.y <= this.highestPoint) {
                this.y = this.highestPoint;
                clearInterval(this.directionTwoMovingAnimationId);
                this.directionOneMovingAnimationId = setInterval(()=>{ this.moveDown(); }, 2*standardFrameRate);
                return;
            }
        }
    }
}