class LifeIncreaser extends Item {
    increaseLifeAmount;
    player;

    constructor(x, y, width, height, imagePath, itemType, increaseLifeAmount) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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