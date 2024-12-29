class Item {
    x;
    y;
    standardX;
    standardY;
    width;
    height;
    standardWidth;
    standardHeight;
    imagePath;
    image;
    collected;
    itemType;

    constructor(x, y, width, height, imagePath, itemType, increaseLifeAmount) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.imagePath = imagePath;
        this.image = new Image();
        this.image.src = imagePath;
        this.itemType = itemType;
        this.increaseLifeAmount = increaseLifeAmount;
        this.checkCharPos();
    }

    checkCharPos() {
        if(!this.collected) {
            if(char.x + char.width >= this.x && this.x + this.width >= char.x && char.y + char.height >= this.y && this.y + this.height >= char.y) {
                if(this.itemType === "ammo-kit") {
                    
                }
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
                    if(char.healthAmount < char.maxHealthAmount) { this.playSound(); }
                    break;
                case "ammo-kit":
                    this.collectSpecialAmmoKit();
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
        saveNotCollectedItems("lifeIncreasing");
        saveCharProperties();
    }

    collectSpecialAmmoKit() {
        this.collected = true;
        char.specialAmmoParts++;
        saveNotCollectedItems("specialAmmo");
        saveCharProperties();
        allAmmoKitsCollected();
    }
}