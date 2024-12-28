class SpecialAmmoKit extends Item {
    rotationIndex;
    rotateAnimationId;

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
        this.rotateAnimationId = setInterval(()=> { this.rotateAnimation()}, 200);
        this.checkCharPos();
    }

    rotateAnimation() {
        if(!this.collected) {
            this.image.src = `graphics/items/special-ammo/rotation-${(this.rotationIndex+1) % 6}.png`;
            this.rotationIndex++;
        }else {
            clearInterval(this.rotateAnimationId);
            return;
        }
    }
}