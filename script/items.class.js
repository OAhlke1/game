class Item {
    x;
    y;
    width;
    height;
    image;
    collected;
    itemType;

    constructor(x, y, width, height, imagePath) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imagePath;
        requestAnimationFrame(()=>{ this.checkCharPos(); });   
    }

    checkCharPos() {
        /* console.log(char.x + char.width > this.x && this.x + this.width > char.x && char.y + char.height > this.y && this.y + this.height > char.y);
        if(char.x + char.width > this.x && this.x + this.width > char.x && char.y + char.height > this.y && this.y + this.height > char.y) {
            this.collectItem();
            return;
        } */
        if(char.x + char.width >= this.x && this.x + this.width >= char.x) {
            if(char.y + char.height >= this.y && this.y + this.height >= char.y) {
                this.collectItem();
                return;
            }
        }
        requestAnimationFrame(() => { this.checkCharPos(); });
    }

    collectItem() {
        if(!this.collected) {
            if(this.itemType === "life-increaser" && char.healthAmount < char.maxHealthAmount) {
                if(char.healthAmount < char.maxHealthAmount) {
                    char.healthAmount += this.increaseLifeAmount;
                    if(char.healthAmount > char.maxHealthAmount) { char.healthAmount = 200; }
                    this.collected = true;
                    this.image.src = '';
                }
            }
        }
    }
}