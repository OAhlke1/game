class SpecialAmmoKit extends Item {
    rotateAnimationId; /** the id of the rotating-animation */
    rotationImages; /** an array for all images of the rotating-animation */
    rotationIndex; /** the index of @var rotationImages */

    /**
     * 
     * @param {number} x the x-coordinate of @this Item
     * @param {number} y the y-coordinate of @this Item
     * @param {number} width the width of @this Item
     * @param {number} height the height of @this Item
     * @param {*} imagePath the path to the image of @this Item
     * @param {*} itemType the type of @this Item
     */
    constructor(x, y, width, height, imagePath, itemType) {
        super(x, y, width, height, imagePath, itemType);
        this.x = x;
        this.standardX = x;
        this.y = y;
        this.standardY = y;
        this.width = width;
        this.standardWidth = width;
        this.height = height;
        this.standardHeight = height;
        this.imagePath = imagePath;
        this.image = new Image();
        this.image.src = imagePath;
        this.rotationIndex = 0;
        this.itemType = itemType;
        this.rotationImages = [];
        this.rotateAnimationId = setInterval(()=> { this.rotateAnimation()}, 20*standardFrameRate);
        this.checkCharPos();
    }

    /**
     * 
     * @method rotateAnimation lets @this Item rotate.
     */
    rotateAnimation() {
        if(!this.collected) {
            this.image = this.rotationImages[this.rotationIndex % 6];
            this.rotationIndex++;
        }else {
            clearInterval(this.rotateAnimationId);
            return;
        }
    }
}