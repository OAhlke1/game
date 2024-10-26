let canvas;
let canvasWidth;
let ctx;
let figure, wall;
let wallBrickWidth;
let menubarBackground;
let menuBar;
let canvasBackground;
let controller;
let bgPlayer;
let walls = [];
let platforms = [];
let standables = [];
let traps = [];
let enemies = [];
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
    canvas.width = window.innerWidth*0.9;
    canvas.height = window.innerWidth*8.1 / 16; // because the ratio shall be 16 / 9
    ctx = canvas.getContext('2d');
}

function createBackground() {
    canvasBackground = new Background('graphics/background/giger.webp');
}

function createFigure() {
    figure = new Figure(2*wallBrickWidth, 2*wallBrickHeight, wallBrickWidth, canvas.height - 3*wallBrickHeight, 'graphics/main-char/run/run-right-0.png', wallBrickWidth/3);
}

function createWallsLeftRight() {
    for (let i = 0; i < 100; i++) {
        for (let k = 0; k < 2; k++) {
            if (k === 1) {
                walls.push(new Wall(k*canvas.width - canvas.height / 50, i*canvas.height / 50, canvas.height / 50, canvas.height / 50, 'graphics/walls/grey-wallstone.png'));
            } else {
                if (i < 6) {
                    continue;
                }
                walls.push(new Wall(k*canvas.width, i*canvas.height / 50, canvas.height / 50, canvas.height / 50, 'graphics/walls/grey-wallstone.png'));
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
                walls.push(new Wall(i*walls[i].width, k*canvas.height - canvas.height / 50, canvas.height / 50, canvas.height / 50, 'graphics/walls/grey-wallstone.png'));
            } else {
                walls.push(new Wall(i*walls[i].width, k*canvas.height / 50, canvas.height / 50, canvas.height / 50, 'graphics/walls/grey-wallstone.png'));
            }
        }
    }
}

function createMenuBar() {
    menuBar = new Menubar(0.75*canvas.width, canvas.height - walls[0].height, 0.25*canvas.width, walls[0].height, `${2400 / 1920}vw SuperLegendBoy`, 'red', 0);
    menubarBackground = new MenubarBackground(menuBar.x, menuBar.y, menuBar.width, menuBar.height);
}

function createTraps() {
    traps.push(new Traps(10*wallBrickWidth, canvas.height - 5.5*wallBrickHeight, canvas.width / 40, canvas.width / 40, '../graphics/traps/chainsaws/round.png', 'saw'));
    traps.push(new Traps(50*wallBrickWidth, canvas.height - 3*wallBrickHeight, canvas.width / 40, canvas.width / 40, '../graphics/traps/chainsaws/jagged.png', 'jagged-saw'));
}

function createEnemies() {
    enemies.push(new Enemy(25*wallBrickWidth, canvas.height - 4*wallBrickWidth, 3*wallBrickWidth, 3*wallBrickHeight, 'graphics/enemies/jump-left.png', 'green'));
    enemies.push(new Enemy(20*wallBrickWidth, canvas.height - 3*wallBrickWidth, 3*wallBrickWidth, 3*wallBrickHeight, 'graphics/enemies/jump-left.png', 'green'));
    enemies.push(new Enemy(10*wallBrickWidth, wallBrickWidth, 3*wallBrickWidth, 3*wallBrickHeight, 'graphics/enemies/jump-left.png', 'green'));
}

function createPlatforms() {
    createNonMovingPlatforms();
    createMovingPlatforms();
}

function createNonMovingPlatforms() {
    platforms.push(new Platform(9*wallBrickWidth, 2*wallBrickHeight, canvas.width / 2 - 100, canvas.height - 20*wallBrickHeight, 'graphics/platforms/green-5.png'));
    platforms.push(new Platform(9*wallBrickWidth, 2*wallBrickHeight, canvas.width / 5 - 50, canvas.height - 10*wallBrickHeight, 'graphics/platforms/green-5.png'));
    //platforms.push(new Platform(100, 20, canvas.width/4-50, 3*canvas.height/5-10, 'graphics/platforms/green-5.png'));
}

function createMovingPlatforms() {
    platforms.push(new MovingPlatform(20*wallBrickWidth, 30*wallBrickWidth, 10*wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png'));
    platforms.push(new MovingPlatform(50*wallBrickWidth, 60*wallBrickWidth, 10*wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png'));
    platforms.push(new MovingPlatform(5*wallBrickWidth, 20*wallBrickWidth, canvas.height - 5*wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png'));
    platforms.push(new MovingPlatform(50 + 20*wallBrickWidth, 200 + 20*wallBrickWidth, canvas.height - 0.30*canvas.height, 'graphics/platforms/moving-platforms/five-wooden-boxes.png'));
}

function drawElements() {
    timer();
    drawBackground();
    drawWalls();
    drawTraps();
    drawPlatforms();
    drawEnemies();
    drawFigure();
    redrawElements();
    drawMenuBar();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
}

function redrawElements() {
    drawBackground();
    drawWalls();
    drawTraps();
    drawPlatforms();
    drawEnemies();
    drawFigure();
    drawMenuBar();
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

function drawTraps() {
    traps.forEach((elem) => {
        ctx.drawImage(elem.trapImage, elem.x, elem.y, elem.width, elem.height);
    })
}

function drawEnemies () {
    enemies.forEach((elem) => {
        if(elem) {
            ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height);
        }
    })
}

function drawFigure() {
    if (figure.isAlive) {
        ctx.drawImage(figure.figImage, figure.x, figure.y, figure.width, figure.height);
    }
}

function addMovingCommands() {
    setController();
    document.querySelector('body').addEventListener('keydown', (event) => {
        figure.sleeps = false;
        t = 0;
        if (event.key === "ArrowLeft" || event.key === "a") {
            if (!controller['left'].pressed) {
                controller['left'].pressed = true;
                controller['left'].func();
            }
        } else if (event.key === "ArrowRight" || event.key === "d") {
            if(!controller['right'].pressed) {
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
                redrawElements();
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
        if (!figure.startingYPos) {
            figure.startingYPos = figure.y;
            figure.jumps = false;
            figure.checkIfJumping();
        }
    }
}

function initStepLeft() {
    if (controller['left'].pressed) {
        figure.moveLeft("ArrowLeft");
    }
}

function initStepRight() {
    if (controller['right'].pressed) {
        figure.moveRight("ArrowRight");
    }
}

function speedUpFigure() {
    if(figure.stepLength === figure.basicStepLength) {
        figure.stepLength = figure.basicStepLength * 1.5;
    }
}

function slowDownFigure() {
    if(1.5 * figure.basicStepLength === figure.stepLength) {
        figure.stepLength = figure.basicStepLength;
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
            figure.sleeps = true;
        }
        setTimeout(timer, 1000);
    }
    return;
}