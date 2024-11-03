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
let hitables = {
    traps: [],
    enemies: [],
    flyables: []
};
//let traps = [];
//let enemies = [];
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
    canvasBackground = new Background('graphics/background/black-bg.svg');
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
    hitables.traps.push(new Traps(10*wallBrickWidth, canvas.height - 5.5*wallBrickHeight, canvas.width / 40, canvas.width / 40, '../graphics/traps/chainsaws/round.png', 'saw', 10));
    hitables.traps.push(new Traps(50*wallBrickWidth, canvas.height - 3*wallBrickHeight, canvas.width / 40, canvas.width / 40, '../graphics/traps/chainsaws/jagged.png', 'jagged-saw', 20));
}

function createEnemies() {
    hitables.enemies.push(new Enemy(25*wallBrickWidth, canvas.height - 4*wallBrickWidth, 3*wallBrickWidth, 3*wallBrickHeight, 'graphics/enemies/jump-left.png', 'green', 10, false, 'left'));
    hitables.enemies.push(new Enemy(20*wallBrickWidth, canvas.height - 3*wallBrickWidth, 3*wallBrickWidth, 3*wallBrickHeight, 'graphics/enemies/jump-left.png', 'green', 20, false, 'left'));
    hitables.enemies.push(new Enemy(10*wallBrickWidth, wallBrickWidth, 3*wallBrickWidth, 3*wallBrickHeight, 'graphics/enemies/jump-left.png', 'green', 30, false, 'left'));
    hitables.enemies.push(new Shooter(canvas.width-3*wallBrickWidth, canvas.height-3*wallBrickHeight, 2*wallBrickWidth, 2*wallBrickHeight, 'shooter', 15, true, 'left'));
}

function createCannonBall(x, y, flyDirection) {
    hitables.flyables.push(new Cannonball(x, y, flyDirection));
    hitables.flyables[hitables.flyables.length-1].animateTrajectory();
}

function createPlatforms() {
    createNonMovingPlatforms();
    createMovingPlatforms();
}

function createNonMovingPlatforms() {
    platforms.push(new Platform(9*wallBrickWidth, 2*wallBrickHeight, canvas.width / 2, canvas.height - 20*wallBrickHeight, 'graphics/platforms/green-5.png'));
    platforms.push(new Platform(9*wallBrickWidth, 2*wallBrickHeight, canvas.width / 5, canvas.height - 10*wallBrickHeight, 'graphics/platforms/green-5.png'));
}

function createMovingPlatforms() {
    platforms.push(new MovingPlatform(20*wallBrickWidth, 30*wallBrickWidth, 10*wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png'));
    platforms.push(new MovingPlatform(50*wallBrickWidth, 60*wallBrickWidth, 10*wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png'));
    platforms.push(new MovingPlatform(5*wallBrickWidth, 20*wallBrickWidth, canvas.height - 5*wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png'));
    platforms.push(new MovingPlatform(25*wallBrickWidth, 200 + 20*wallBrickWidth, canvas.height - 0.30*canvas.height, 'graphics/platforms/moving-platforms/five-wooden-boxes.png'));
    platforms.push(new MovingPlatform(canvas.width/2, 3*canvas.width/4, 25*wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png'));
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
    checkHitablesXCoords();
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

function drawHitables () {
    hitables.traps.forEach((elem) => {
        if(elem || elem.isDangerous) { ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height); }
    })
    hitables.enemies.forEach((elem) => {
        if(elem || elem.isDangerous) { ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height); }
    })
    if(hitables.flyables.length) {
        hitables.flyables.forEach((elem)=>{ ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height); })
    }
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

function checkHitablesXCoords() {
     if (checkTrapXCords()) { figure.hitChar(); }
     if (checkEnemyXCords()) { figure.hitChar(); }
     if(checkFlyableXCords()) { figure.hitChar(); }
 }

function checkTrapXCords() {
     if (!gamePaused && figure.isAlive) {
         for (let i = 0; i < hitables.traps.length; i++) {
             if (hitables.traps[i].x - (figure.x + figure.width) >= 0 || figure.x - (hitables.traps[i].x + hitables.traps[i].width) >= 0) {
                 if (i + 1 === hitables.traps.length) {
                     figure.startingYPos = null;
                     return false;
                 }
             } else if (checkTrapYCords(i)) {
                 figure.hittingTrapIndex = i;
                 figure.hittingEnemyIndex = -1;
                 figure.hittingFlyableIndex = -1;
                 return true;
             }
         }
     }
 }

function checkTrapYCords(i) {
     if (!gamePaused && figure.isAlive) {
         if (figure.y + figure.height > hitables.traps[i].y && hitables.traps[i].y + hitables.traps[i].height > figure.y) {
             return true;
         } else {
             if (i + 1 === hitables.traps.length) { return false; }
         }
     }
 }

function checkEnemyXCords() {
     if (!gamePaused && figure.isAlive) {
         for (let i = 0; i < hitables.enemies.length; i++) {
             if(hitables.enemies[i]) {
                 if (hitables.enemies[i].x - (figure.x + figure.width) >= 0 || figure.x - (hitables.enemies[i].x + hitables.enemies[i].width) >= 0) {
                     if(hitables.enemies[i].canShoot) {
                         if(hitables.enemies[i].checkIfTargeting() && !hitables.enemies[i].targeting) {
                             hitables.enemies[i].targeting = true;
                             hitables.enemies[i].shoots = true;
                             hitables.enemies[i].setupCannonball();
                         }else if(!hitables.enemies[i].checkIfTargeting()) {
                             hitables.enemies[i].targeting = false;
                             hitables.enemies[i].shoots = false;
                         }
                     }
                     if (i + 1 === hitables.enemies.length) {
                         figure.startingYPos = null;
                         return false;
                     }
                 } else if (checkEnemyYCords(i) && hitables.enemies[i].isDangerous) {
                     figure.hittingTrapIndex = -1;
                     figure.hittingEnemyIndex = i;
                     figure.hittingFlyableIndex = -1;
                     return true;
                 }                    
             }
         }
     }
 }

function checkEnemyYCords(i) {
     if (!gamePaused && figure.isAlive) {
         if(Math.abs(figure.y + figure.height - hitables.enemies[i].y) < figure.jumpFallStepHeight && figure.y < hitables.enemies[i].y && figure.falls) {
             if(hitables.enemies[i].isDangerous) {
                 hitables.enemies[i].isDangerous = false;
                 hitables.enemies[i].animateHit();
             }
             figure.startingYPos = figure.y;
             figure.jumps = true;
             figure.checkIfJumping();
             return false;
         }else if (figure.y + figure.height > hitables.enemies[i].y && hitables.enemies[i].y + hitables.enemies[i].height > figure.y) { // || hitables.enemies[i].y + hitables.enemies[i].height - figure.y < 0
             return true;
         } else {
             if (i + 1 === hitables.enemies.length) { return false; }
         }
     }
 }

function checkFlyableXCords() {
     if (!gamePaused && figure.isAlive) {
         for (let i = 0; i < hitables.flyables.length; i++) {
             if(hitables.flyables[i]) {
                 if (hitables.flyables[i].x - (figure.x + figure.width) >= 0 || figure.x - (hitables.flyables[i].x + hitables.flyables[i].width) >= 0) {
                     if (i + 1 === hitables.flyables.length) {
                         //figure.startingYPos = null;
                         return false;
                     }
                 } else if (checkFlyableYCords(i) && hitables.flyables[i].isDangerous) {
                     figure.hittingTrapIndex = -1;
                     figure.hittingEnemyIndex = -1;
                     figure.hittingFlyableIndex = i;
                     return true;
                 }                    
             }
         }
     }
 }

function checkFlyableYCords(i) {
     if (!gamePaused && figure.isAlive) {
         if(Math.abs(figure.y + figure.height - hitables.flyables[i].y) < figure.jumpFallStepHeight && figure.y < hitables.flyables[i].y && figure.falls) {
             if(hitables.flyables[i].isDangerous) {
                 hitables.flyables[i].isDangerous = false;
                 hitables.flyables[i].animateHit();
             }
             figure.startingYPos = figure.y;
             figure.jumps = true;
             figure.checkIfJumping();
             return false;
         }else if (figure.y + figure.height > hitables.flyables[i].y && hitables.flyables[i].y + hitables.flyables[i].height > figure.y) { // || hitables.flyables[i].y + hitables.flyables[i].height - this.y < 0
             return true;
         } else {
             if (i + 1 === hitables.flyables.length) { return false; }
         }
     }
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