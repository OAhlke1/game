class MovingPlatform extends Platform {
    startingPointX;
    startingPointY;

    constructor(startingPointX, endingPointX, y, imgPath) {
        super();
        this.width = walls[0].width * 5;
        this.height = walls[0].height;
        this.startingPointX = startingPointX;
        this.endingPointX = endingPointX;
        this.x = startingPointX;
        this.y = y;
        this.platformImage = new Image();
        this.platformImage.src = imgPath;
        this.isMoving = true;
        this.moveRight();
    }

    moveRight() {
        if (!gamePaused) {
            this.x += walls[0].width / 10;
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
            this.x -= walls[0].width / 10;
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
}