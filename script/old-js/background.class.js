class Background {
    x = 0; /** the x-coordinate of @this background */
    y = 0; /** the y-coordinate of @this background */
    width; /** the width of @this background is the width of the canvas-container. */
    height; /** the height of @this background is the height of the canvas-container. */
    image; /** the HTML-image-element of @this background */
    imgPath; /** the path of @this background image */

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
     * @function setBackgroundPosition sets the x-coordinate of @this background depending of the left offset of the canvas.
     */
    setBackgroundPosition() {
        this.x = 0*canCont.offsetLeft - parseFloat(canvas.style.left);
        requestAnimationFrame(()=>{this.setBackgroundPosition()});
    }
}