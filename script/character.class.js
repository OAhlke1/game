class Character {
    width;
    height;
    x;
    y;
    src;
    charImage = new Image();

    constructor(width = this.width, height = this.height, x, y, src = this.src) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.src = src;
        this.charImage.src = this.src;
    }

    /* constructor(width = this.width, height = this.height, x, y, src = this.src) {
        this.width = width;
        this.height = height;
        this.src = src;
        this.charImage.src = this.src;
    } */

    moveLeft(key) {
        if(key === "ArrowLeft") {
            if(this.x <= 0) {
                return;
            }else {
                this.x -= 1;
                //console.log(this.x, this.y);
                ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
                ctx.drawImage(this.charImage, this.x, this.y, this.width, this.height);
            }
        }
    }

    moveRight(key) {
        if(key === "ArrowRight") {
            if(this.x >= canvas.offsetWidth - this.width) {
                return;
            }else {
                this.x += 1;
                //console.log(this.x, this.y);
                ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
                ctx.drawImage(this.charImage, this.x+1, this.y, this.width, this.height);
            }
        }
    }

    moveUp(key) {
        if(key === "ArrowUp") {
            if(this.y <= 0) {
                return;
            }else {
                this.y -= 1;
                //console.log(this.x, this.y);
                ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
                ctx.drawImage(this.charImage, this.x, this.y, this.width, this.height);
            }
        }
    }

    moveDown(key) {
        if(key === "ArrowDown") {
            if(this.y >= canvas.offsetHeight - this.height) {
                return;
            }else {
                this.y += 1;
                //console.log(this.x, this.y);
                ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
                ctx.drawImage(this.charImage, this.x, this.y, this.width, this.height);
            }
        }
    }
}