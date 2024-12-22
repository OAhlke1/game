class MovingPlatform extends Platform {
    startingPointX;
    endingPointX;
    highestPoint;
    lowestPoint;
    sideways;

    constructor(width, startingPointX, endingPointX, highestPoint, lowestPoint, y, imgPath, sideways) {
        super();
        this.width = width;
        this.height = heightUnit;
        this.startingPointX = startingPointX;
        this.endingPointX = endingPointX;
        this.highestPoint = highestPoint;
        this.lowestPoint = lowestPoint;
        this.x = startingPointX;
        this.y = y;
        this.platformImage = new Image();
        this.platformImage.src = imgPath;
        this.isMoving = true;
        this.sideways = sideways;
        if(this.sideways) {
            this.moveRight();
        }else {
            this.moveDown();
        }
    }

    moveRight() {
        if (!gamePaused) {
            //char.movingDirection = "right";
            checkForScrolling("right");
            this.x += widthUnit / 10;
            if (this.x + this.width >= this.endingPointX) {
                this.x = this.endingPointX - this.width;
                this.moveLeft();
                return;
            }
        }
        requestAnimationFrame(() => {
            drawElements();
            this.moveRight();
        });
    }

    moveLeft() {
        if (!gamePaused) {
            //char.movingDirection = "left";
            checkForScrolling("left");
            this.x -= widthUnit / 10;
            if (this.x <= this.startingPointX) {
                this.x = this.startingPointX;
                this.moveRight();
                return;
            }
        }
        requestAnimationFrame(() => {
            drawElements();
            this.moveLeft();
        });
    }

    moveDown() {
        if (!gamePaused) {
            if(char.onUpwardsMovingPlatform) {
                char.startingYPos = this.y;
            }
            this.y += widthUnit / 10;
            if (this.y + this.height > this.lowestPoint) {
                this.y = this.lowestPoint - this.height;
                this.moveUp();
                return;
            }
        }
        requestAnimationFrame(() => {
            drawElements();
            this.moveDown();
        });
    }

    moveUp() {
        if (!gamePaused) {
            if(!char.onUpwardsMovingPlatform) {
                char.onUpwardsMovingPlatform = true;
                char.startingYPos = this.y;
            }
            this.y -= heightUnit / 10;
            if (this.y <= this.highestPoint) {
                this.y = this.highestPoint;
                this.moveDown();
                return;
            }
        }
        requestAnimationFrame(() => {
            drawElements();
            this.moveUp();
        });
    }
}