class Background {
    x = 0;
    y = 0;
    width = canvas.width;
    height = canvas.height;

    constructor(imgPath) {
        this.image = new Image();
        this.image.src = imgPath;
    }
}