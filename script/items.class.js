class Item {
    x;
    y;
    width;
    height;
    standardWidth;
    standardHeight;
    imagePath;
    image;
    collected;
    itemType;
    muted = false;
    standardX; /** @var {number} standardX is the the first x-coordinate of the char. It is the x-coordinate of @this Enemy that is being saved to the browsers local storage */
    standardY; /** @var {number} standardY is the the first y-coordinate of the char. It is the y-coordinate of @this Enemy that is being saved to the browsers local storage */

    /**
     * 
     * @param {number} x the x-coordinate of @this Item
     * @param {number} y the y-coordinate of @this Item
     * @param {number} width the width of @this Item
     * @param {number} height the height of @this Item
     * @param {string} imagePath the image-path of @this Item
     * @param {string} itemType the item-type of @this Item
     * @param {number} increaseLifeAmount the life-amount that @this Item can add to the char
     */
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

    /**
     * 
     * @method checkCharPos checks the position of the char.
     * When the char is directly at @this Item it is being collected.
     */
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

    /**
     * 
     * @method collectItem collects the item.
     * When the item-type (@var itemType) is life-increaser, the @method collectHeart is invoked.
     * When its type is ammo-kit, the @method collectSpecialAmmoKit is invoked.
     */
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

    /**
     * 
     * @method collectHeart sets the items @var collected to true, so that it es collected and not drawn to canvas anymore.
     * Then the chars @var healthAmount is being increased (but not more than the chars maximum healthAmount @var maxHealthAmount)
     * At the end, the remaining items and the chars properties are being saved to the browsers local storage via
     * @method saveNotCollectedItems and @method saveCharProperties
     */
    collectHeart() {
        if(char.healthAmount < char.maxHealthAmount) {
            this.collected = true;
            char.healthAmount += this.increaseLifeAmount;
            if(char.healthAmount > char.maxHealthAmount) {
                char.healthAmount = char.maxHealthAmount;
            }
        }
        saveNotCollectedItems("lifeIncreasing");
        setMenuBarProperties("char");
        //saveCharProperties();
    }

    /**
     * 
     * @method collectSpecialAmmoKit collects @this Item when it is a special-ammo-part.
     * It sets the @var collected to true, incremts the chars @var specialAmmoParts,
     * saves the not collected items, sets the menu-bar propertis, saves the properties of the char
     * and invokes the @method allAmmoKitsCollected to check wether all special-ammo-parts are collected.
     */
    collectSpecialAmmoKit() {
        this.collected = true;
        char.specialAmmoParts = char.specialAmmoParts < 3 ? char.specialAmmoParts+1 : 3;
        saveNotCollectedItems("specialAmmo");
        setMenuBarProperties("specialAmmo");
        //saveCharProperties();
        allAmmoKitsCollected();
    }
}