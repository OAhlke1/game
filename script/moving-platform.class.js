class MovingPlatform extends Platform {
    startingPointX;
    endingPointX;
    highestPoint;
    lowestPoint;
    sideways;

    constructor(startingPointX, endingPointX, highestPoint, lowestPoint, y, imgPath,  sideways) {
        super();
        this.width = wallBrickWidth * 5;
        this.height = walls[0].height;
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
            this.x += wallBrickWidth / 10;
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
            this.x -= wallBrickWidth / 10;
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
            this.y += wallBrickWidth / 10;
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
            this.y -= walls[0].height / 10;
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