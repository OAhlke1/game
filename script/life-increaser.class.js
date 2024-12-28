class LifeIncreaser extends Item {
    increaseLifeAmount;
    player;

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

    playSound() {
        this.player.play();
        this.player.volume = 0.5;
    }
}