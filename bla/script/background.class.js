class Background {
    x = 0;
    y = 0;
    width;
    height;
    image;
    imgPath;

    /**
     * 
     * @param {number} x the starting x-coordinate of @this Background
     * @param {number} y the y-coordinate of @this Background
     * @param {number} width the width of @this Background
     * @param {number} height the height of @this Background
     * @param {string} imgPath the path to the image of @this Background
     */
    constructor(x, y, width, height, imgPath) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.imgPath = imgPath;
        this.image.src = imgPath;
        this.setBackgroundPosition();
    }

    /**
     * 
     * @method setBackgroundPosition sets the x-coordinate of @this Background depending of the left offset of the canvas.
     */
    setBackgroundPosition() {
        this.x = 0*canCont.offsetLeft - parseFloat(canvas.style.left);
        requestAnimationFrame(()=>{this.setBackgroundPosition()});
    }
}