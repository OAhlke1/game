class Item {
    x;
    y;
    width;
    height;
    image;
    collected = false;
    itemType;

    constructor(x, y, width, height, imagePath) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imagePath;
        this.checkCharPos();
    }

    checkCharPos() {
        if(!this.collected) {
            if(char.x + char.width > this.x && this.x + this.width > char.x) {
                if(char.y + char.height > this.y && this.y + this.height > char.y) {
                    this.collectItem();
                    return;
                }
            }
            requestAnimationFrame(this.checkCharPos());
        }
    }

    collectItem() {
        this.collected = true;
        this.image.src = '';
        if(this.itemType === "lifeIncreaser") { char.lifeAmount += increaseLifeAmount; }
    }
}