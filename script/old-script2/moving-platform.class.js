class MovingPlatform extends Platform {
    startingXPos;
    endingXPos;
    highestPoint;
    lowestPoint;
    sideways;
    directionOneMovingAnimationId;
    directionTwoMovingAnimationId;


    constructor(width, height, startingXPos, endingXPos, highestPoint, lowestPoint, y, imgPath, sideways) {
        super();
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