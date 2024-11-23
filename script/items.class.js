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
        this.checkCharPos();
    }

    checkCharPos() {
        if(!this.collected) {
            if(char.x + char.width >= this.x && this.x + this.width >= char.x && char.y + char.height >= this.y && this.y + this.height >= char.y) {
                this.collectItem();
            }
            requestAnimationFrame(()=>{this.checkCharPos()});
        }else { return; }
    }

    collectItem() {
        if(!this.collected) {
            switch(this.itemType) {
                case "life-increaser":
                    this.collectHeart();
                    break;
            }
        }
        return;
    }

    collectHeart() {
        if(char.healthAmount < char.maxHealthAmount) {
            this.collected = true;
            char.healthAmount += this.increaseLifeAmount;
            if(char.healthAmount > char.maxHealthAmount) {
                char.healthAmount = char.maxHealthAmount;
            }
        }
    }
}