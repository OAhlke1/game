class SpecialAmmoKit extends Item {
    rotationIndex;
    rotateAnimationId;
    rotationImages;

    constructor(x, y, width, height, imagePath, itemType) {
        super();
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
        this.rotateAnimationId = setInterval(()=> { this.rotateAnimation()}, 20*standardFrequency);
        this.checkCharPos();
    }

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