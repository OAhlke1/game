class SpecialAmmoKit extends Item {
    rotationIndex;
    rotateAnimationId;

    constructor(x, y, width, height, imgPath) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imgPath;
        this.rotationIndex = 0;
        this.itemType = "ammo-kit";
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