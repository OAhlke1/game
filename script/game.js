let canvas;
let canvasWidth;
let ctx;
let char, wall;
let wallBrickWidth;
let menubarBackground;
let menuBar;
let canvasBackground;
let controller;
let bgPlayer;
let walls = [];
let platforms = [];
let standables = [];
let hitables = {
    traps: [],
    enemies: [],
    flyables: []
};
let audioPlayer = [];
let t = -1;
let gamePaused = false;

loadPlayer();
createCanvas();
createBackground();
createWallsLeftRight();
createWallsTopBottom();
createFigure();
createPlatforms();
createTraps();
createEnemies();
createMenuBar();
addMovingCommands();

function loadPlayer() {
    bgPlayer = new Audio();
    bgPlayer.src = 'sounds/background.ogg';
    bgPlayer.play();
    bgPlayer.loop = true;
    document.querySelectorAll('audio').forEach((elem) => {
        audioPlayer.push(elem);
    })
}

function createCanvas() {
    canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerWidth * 8.1 / 16; // because the ratio shall be 16 / 9
    ctx = canvas.getContext('2d');
}

function createBackground() {
    canvasBackground = new Background('graphics/background/black-bg.svg');
}

function createFigure() {
    char = new Char(2 * wallBrickWidth, 2 * wallBrickHeight, wallBrickWidth, canvas.height - 3 * wallBrickHeight, 'graphics/main-char/run/run-right-0.png', wallBrickWidth / 3);
}

function createWallsLeftRight() {
    for (let i = 0; i < 100; i++) {
        for (let k = 0; k < 2; k++) {
            if (k === 1) {
                walls.push(new Wall(k * canvas.width - canvas.height / 50, i * canvas.height / 50, canvas.height / 50, canvas.height / 50, 'graphics/walls/grey-wallstone.png'));
            } else {
                if (i < 6) {
                    continue;
                }
                walls.push(new Wall(k * canvas.width, i * canvas.height / 50, canvas.height / 50, canvas.height / 50, 'graphics/walls/grey-wallstone.png'));
            }
        }
    }
    wallBrickWidth = walls[0].width;
    wallBrickHeight = walls[0].height;
}

function createWallsTopBottom() {
    for (let i = 0; i < canvas.width / wallBrickWidth; i++) {
        for (let k = 0; k < 2; k++) {
            if (k === 1) {
                walls.push(new Wall(i * walls[i].width, k * canvas.height - canvas.height / 50, canvas.height / 50, canvas.height / 50, 'graphics/walls/grey-wallstone.png'));
            } else {
                walls.push(new Wall(i * walls[i].width, k * canvas.height / 50, canvas.height / 50, canvas.height / 50, 'graphics/walls/grey-wallstone.png'));
            }
        }
    }
}

function createMenuBar() {
    menuBar = new Menubar(0.75 * canvas.width, canvas.height - walls[0].height, 0.25 * canvas.width, walls[0].height, `${2400 / 1920}vw SuperLegendBoy`, 'red', 0);
    menubarBackground = new MenubarBackground(menuBar.x, menuBar.y, menuBar.width, menuBar.height);
}

function createTraps() {
    hitables.traps.push(new Traps(10 * wallBrickWidth, canvas.height - 5.5 * wallBrickHeight, canvas.width / 40, canvas.width / 40, '../graphics/traps/chainsaws/round.png', 'saw', 10));
    hitables.traps.push(new Traps(50 * wallBrickWidth, canvas.height - 3 * wallBrickHeight, canvas.width / 40, canvas.width / 40, '../graphics/traps/chainsaws/jagged.png', 'jagged-saw', 20));
}

function createEnemies() {
    hitables.enemies.push(new Enemy(25 * wallBrickWidth, canvas.height - 4 * wallBrickWidth, 3 * wallBrickWidth, 3 * wallBrickHeight, 'graphics/enemies/jump-left.png', 'green', 10, false, 'left', 100, false));
    hitables.enemies.push(new Enemy(20 * wallBrickWidth, canvas.height - 3 * wallBrickWidth, 3 * wallBrickWidth, 3 * wallBrickHeight, 'graphics/enemies/jump-left.png', 'green', 20, false, 'left', 100, false));
    hitables.enemies.push(new Enemy(10 * wallBrickWidth, wallBrickWidth, 3 * wallBrickWidth, 3 * wallBrickHeight, 'graphics/enemies/jump-left.png', 'green', 30, false, 'left', 100, false));
    hitables.enemies.push(new Shooter(canvas.width - 23 * wallBrickWidth, canvas.height - 3 * wallBrickHeight, 2 * wallBrickWidth, 2 * wallBrickHeight, 'shooter', 15, true, 'left', 100, 10 * wallBrickWidth, true));
    hitables.enemies.push(new Shooter(canvas.width / 2 + 7 * wallBrickWidth, canvas.height - 22 * wallBrickHeight, 2 * wallBrickWidth, 2 * wallBrickHeight, 'shooter', 15, true, 'left', 100, 2 * wallBrickWidth, true));
}

function createPlatforms() {
    createNonMovingPlatforms();
    createMovingPlatforms();
}

function createNonMovingPlatforms() {
    platforms.push(new Platform(canvas.width / 2, canvas.height - 20 * wallBrickHeight, 9 * wallBrickWidth, 2 * wallBrickHeight, 'graphics/platforms/green-5.png'));
    platforms.push(new Platform(canvas.width / 5, canvas.height - 10 * wallBrickHeight, 9 * wallBrickWidth, 2 * wallBrickHeight, 'graphics/platforms/green-5.png'));
}

function createMovingPlatforms() {
    platforms.push(new MovingPlatform(20 * wallBrickWidth, 30 * wallBrickWidth, 0, 0, 10 * wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png', true));
    platforms.push(new MovingPlatform(50 * wallBrickWidth, 60 * wallBrickWidth, 0, 0, 10 * wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png', true));
    platforms.push(new MovingPlatform(5 * wallBrickWidth, 20 * wallBrickWidth, 0, 0, canvas.height - 5 * wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png', true));
    platforms.push(new MovingPlatform(20 * wallBrickWidth, 50 * wallBrickWidth, 0, 0, canvas.height - 0.30 * canvas.height, 'graphics/platforms/moving-platforms/five-wooden-boxes.png', true));
    platforms.push(new MovingPlatform(canvas.width / 2, 3 * canvas.width / 4, 0, 0, 25 * wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png', true));
    //platforms.push(new MovingPlatform(canvas.width/2, 3*canvas.width/4, 0, 0, 25*wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png', false));
    platforms.push(new MovingPlatform(1 * wallBrickWidth, 0, 6 * wallBrickHeight, 60 * wallBrickHeight, 6 * wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png', false));
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
}

function drawElements() {
    drawBackground();
    drawWalls();
    drawPlatforms();
    drawHitables();
    drawFigure();
    drawMenuBar();
    //checkHitablesXCoords();
}

function drawBackground() {
    ctx.drawImage(canvasBackground.image, canvasBackground.x, canvasBackground.y, canvasBackground.width, canvasBackground.height);
}

function drawWalls() {
    walls.forEach((wall) => {
        ctx.drawImage(wall.wallImage, wall.x, wall.y, wall.width, wall.height);
    })
}

function drawMenuBar() {
    menubarBackground.createBackground();
    menuBar.writeMenuTexts();
}

function drawPlatforms() {
    for (let i = 0; i < platforms.length; i++) {
        ctx.drawImage(platforms[i].platformImage, platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
    }
}

function drawHitables() {
    hitables.traps.forEach((elem) => {
        if (elem || elem.isDangerous) { if (elem.image.src != '') { ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height); } }
    })
    hitables.enemies.forEach((elem) => {
        if (elem || elem.isDangerous) { if (elem.image.src != '') { ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height); } }
    })
    if (hitables.flyables.length) {
        hitables.flyables.forEach((elem) => { if (elem) { ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height); } })
    }
}

function drawFigure() {
    if (char.isAlive) {
        ctx.drawImage(char.figImage, char.x, char.y, char.width, char.height);
    }
}

function addMovingCommands() {
    setController();
    document.querySelector('body').addEventListener('keydown', (event) => {
        char.sleeps = false;
        t = 0;
        if (event.key === "ArrowLeft" || event.key === "a") {
            if (!controller['left'].pressed) {
                controller['left'].pressed = true;
                controller['left'].func();
            }
        } else if (event.key === "ArrowRight" || event.key === "d") {
            if (!controller['right'].pressed) {
                controller["right"].pressed = true;
                controller['right'].func();
            }
        } else if (event.key === " ") {
            controller['jump'].pressed = true;
            controller['jump'].func();
        } else if (event.key === "Shift") {
            controller['run'].pressed = true;
            controller['run'].func();
        } else if (event.key === "p") {
            if (!gamePaused) {
                gamePaused = true;
            } else {
                gamePaused = false;
                timer();
                drawElements();
            }
        }
    });
    document.querySelector('body').addEventListener('keyup', (event) => {
        if (event.key === "ArrowLeft" || event.key === "a") {
            controller['left'].pressed = false;
        } else if (event.key === "ArrowRight" || event.key === "d") {
            controller['right'].pressed = false;
        } else if (event.key === "Shift") {
            controller['run'].pressed = false;
            slowDownFigure();
        }
    });
    drawElements();
}

function setController() {
    controller = {
        "jump": {
            pressed: false,
            func: initJump
        },
        "left": {
            pressed: false,
            func: initStepLeft
        },
        "right": {
            pressed: false,
            func: initStepRight
        },
        "run": {
            pressed: true,
            func: speedUpFigure
        }
    }
}

function initJump() {
    if (controller['jump'].pressed) {
        if (!char.startingYPos) {
            char.startingYPos = char.y;
            char.jumps = false;
            char.checkIfJumping();
        }
    }
}

function initStepLeft() {
    if (controller['left'].pressed) {
        char.moveLeft("ArrowLeft");
    }
}

function initStepRight() {
    if (controller['right'].pressed) {
        char.moveRight("ArrowRight");
    }
}

function speedUpFigure() {
    if (char.stepLength === char.basicStepLength) {
        char.stepLength = char.basicStepLength * 1.5;
    }
}

function slowDownFigure() {
    if (1.5 * char.basicStepLength === char.stepLength) {
        char.stepLength = char.basicStepLength;
    }
}

function playSound(fileName) {
    let audio = new Audio();
    audio.src = fileName;
    audio.play();
}

function timer() {
    if (!gamePaused) {
        t++;
        if (t === 10) {
            t = 0;
            char.sleeps = true;
        }
        setTimeout(timer, 1000);
    }
    return;
}