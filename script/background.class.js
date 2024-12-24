class Background {
    x = 0;
    y = 0;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    image;
    imgPath;

    constructor(x, y, width, height, imgPath) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 0.5625*width;
        this.image = new Image();
        this.imgPath = imgPath;
        this.image.src = imgPath;
        this.setBackgroundPosition();
    }

    setBackgroundPosition() {
        this.x = 0*canCont.offsetLeft - parseFloat(canvas.style.left);
        requestAnimationFrame(()=>{this.setBackgroundPosition()});
    }

    fadeOut() {
        this.image.src = './graphics/background/black-bg.svg';
        setTimeout(this.fadeIn, 10000);
        return;
    }

    fadeIn() {
        this.image.src = this.imgPath;
        setTimeout(this.fadeOut, 10000);
        return;
    }
}