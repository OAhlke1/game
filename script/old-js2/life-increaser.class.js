class LifeIncreaser extends Item {
    increaseLifeAmount;
    player;

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
        this.itemType = itemType;
        this.increaseLifeAmount = increaseLifeAmount;
        this.collected = false;
        this.player = new Audio();
        this.player.src = "sounds/got-life.mp3";
    }

    /**
     * 
     * @method playSound plays the sound of @this Item
     */
    playSound() {
        this.player.play();
        this.player.volume = 0.5;
    }
}