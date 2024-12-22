class MovingPlatform extends Platform {
    startingXPos;
    endingXPos;
    highestPoint;
    lowestPoint;
    sideways;

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
            if (this.x + this.width >= this.endingXPos) {
                this.x = this.endingXPos - this.width;
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
            if (this.x <= this.startingXPos) {
                this.x = this.startingXPos;
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