let canvas;
let character = new Character(50, 50, 0, 0, 'graphics/tesseract.svg');
let ctx;

function init() {
    loadCanvas();
}

function loadCanvas() {
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    let centerX = (canvas.offsetWidth - character.charImage.offsetWidth)/2;
    let centerY = (canvas.offsetHeight - character.charImage.offsetHeight)/2;
    ctx.drawImage(character.charImage, 0, 0, 50, 50);
    document.querySelector('body').addEventListener('keydown', (event)=>{
        character.moveLeft(event.key);
        character.moveRight(event.key);
        character.moveUp(event.key);
        character.moveDown(event.key);
    })
}