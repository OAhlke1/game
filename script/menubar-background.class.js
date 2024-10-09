class MenubarBackground extends Menubar {
    backgroundColor = '#000000';

    constructor(x, y, width, height) {
        super(x, y, width, height);
        console.log(menuBar.x);
    }

    createBackground() {
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}