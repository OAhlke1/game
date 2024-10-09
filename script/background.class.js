class Background {
    x = 0;
    y = 0;
    width = canvas.width;
    height = canvas.height;
    image;

    constructor(imgPath) {
        this.image = new Image();
        this.image.src = imgPath;
    }
}