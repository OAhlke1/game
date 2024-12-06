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
let backgrounds = [];
let charObjects = {
    ammo: []
};
let hitables = {
    traps: [],
    enemies: [],
    flyables: []
};
let items = {
    lifeIncreasing: []
};
let audioPlayer = [];
let t = -1;
let gamePaused = false;
let canCont = document.querySelector('.canvas-cont');

function initFunctions() {
    wallBrickWidth = 10;
    wallBrickHeight = wallBrickWidth;
    loadPlayer();
    createCanvas();
    createBackgrounds();
    createChar();
    if(window.innerWidth > 800) {
        addKeypressMovingCommands();
    }else {addTouchMovingCommands();}
    createWallsLeftRight();
    createBottomPlatforms();
    createPlatforms();
    createTraps();
    createEnemies();
    createItems();
    createMenuBar();
    //checkForScrolling();
}

function relativeToCanCont() {
    setTimeout(()=>{
        relativeToCanCont();
    }, 100);
}

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
    /* canvas.style.width = `${window.innerHeight * 16/9}px`;
    canvas.style.height = `${window.innerHeight}px`; */
    ctx = canvas.getContext('2d');
    setCanvasSize();
}

function createBackgrounds() {
    backgrounds.push(new Background(0, 0, canvas.width, canvas.height, 'graphics/background/rotating-galaxy.webp'));
    //backgrounds.push(canvasBackground = new Background('graphics/background/rotating-galaxy.webp'));
}

function createChar() {
    char = new Char(2 * wallBrickWidth, 2 * wallBrickHeight, wallBrickWidth, canvas.height - 1.5 * wallBrickHeight, 'graphics/main-char/run/run-right-0.png', wallBrickWidth / 3);
}

function createAmmo(x, y, width, height, imagePath) {
    charObjects.ammo.push(new Ammo(x, y, width, height, imagePath));
}

function createWallsLeftRight() {
    for (let i = 0; i < 100; i++) {
        for (let k = 0; k < 2; k++) {
            if (k === 1) {
                walls.push(new Wall(k * canvas.width - canvas.height / 50, i * canvas.height / 50, wallBrickWidth, wallBrickHeight, 'graphics/walls/grey-wallstone.png'));
            } else {
                if (i < 6) { continue; }
                walls.push(new Wall(k * canvas.width, i * canvas.height / 50, canvas.height / 50, canvas.height / 50, 'graphics/walls/grey-wallstone.png'));
            }
        }
    }
}

function createBottomPlatforms() {
    let createdMovingPlatformAtThisSpot = false;
    for(let i=0; i < canvas.width / wallBrickWidth; i+=5) {
        if(i != 25 && i != 30 && i != 35) {
            platforms.push(new Platform(i*wallBrickWidth, canvas.height - wallBrickHeight, 5*wallBrickWidth, wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png'));
        }else if(!createdMovingPlatformAtThisSpot) {
            createdMovingPlatformAtThisSpot = true;
            platforms.push(new MovingPlatform(i*wallBrickWidth, (i+15)*wallBrickWidth, canvas.height - wallBrickHeight, canvas.height - wallBrickHeight, canvas.height - wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png', true));
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
    hitables.enemies.push(new GreenEnemey(25 * wallBrickWidth, canvas.height - 4 * wallBrickWidth, 2.5 * wallBrickWidth, 2.5 * wallBrickHeight, 'green', 'graphics/enemies/green/attack/attack-left-0.png', 10, false, 'left', 100, 20*wallBrickWidth, true, 5, 12));
    hitables.enemies.push(new GreenEnemey(20 * wallBrickWidth, canvas.height - 3 * wallBrickWidth, 2.5 * wallBrickWidth, 2.5 * wallBrickHeight, 'green', 'graphics/enemies/green/attack/attack-left-0.png', 20, false, 'left', 70, 20*wallBrickWidth, true, 5, 12));
    hitables.enemies.push(new GreenEnemey(10 * wallBrickWidth, wallBrickWidth, 2.5 * wallBrickWidth, 2.5 * wallBrickHeight, 'green', 'graphics/enemies/green/attack/attack-left-0.png', 30, false, 'left', 80, 20*wallBrickWidth, true, 5, 12));
    hitables.enemies.push(new Shooter(canvas.width - 23 * wallBrickWidth, canvas.height - 3 * wallBrickHeight, 2 * wallBrickWidth, 2 * wallBrickHeight, 'shooter', 15, true, 'left', 100, 10 * wallBrickWidth, true, 5, 7));
    hitables.enemies.push(new Shooter(canvas.width / 2 + 7 * wallBrickWidth, canvas.height - 22 * wallBrickHeight, 2 * wallBrickWidth, 2 * wallBrickHeight, 'shooter', 15, true, 'left', 100, 2 * wallBrickWidth, true, 5, 7));
}

function createItems() {
    items.lifeIncreasing.push(new LifeIncreaser(5*wallBrickWidth, canvas.height-2*wallBrickHeight, wallBrickWidth, wallBrickWidth*800/646, 'graphics/items/heart.png', 'life-increaser', 30));
    items.lifeIncreasing.push(new LifeIncreaser(Math.random()*canvas.width-wallBrickWidth, Math.random()*canvas.height-wallBrickHeight, wallBrickWidth, wallBrickWidth*800/646, 'graphics/items/heart.png', 'life-increaser', 30));
    items.lifeIncreasing.push(new LifeIncreaser(Math.random()*canvas.width-wallBrickWidth, Math.random()*canvas.height-wallBrickHeight, wallBrickWidth, wallBrickWidth*800/646, 'graphics/items/heart.png', 'life-increaser', 30));
    items.lifeIncreasing.push(new LifeIncreaser(Math.random()*canvas.width-wallBrickWidth, Math.random()*canvas.height-wallBrickHeight, wallBrickWidth, wallBrickWidth*800/646, 'graphics/items/heart.png', 'life-increaser', 30));
    /* items.lifeIncreasing.push(new LifeIncreaser(Math.random()*canvas.width-wallBrickWidth, Math.random()*canvas.height-wallBrickHeight, wallBrickWidth, wallBrickWidth*800/646, 'graphics/items/heart.png', 'life-increaser', 30));
    items.lifeIncreasing.push(new LifeIncreaser(Math.random()*canvas.width-wallBrickWidth, Math.random()*canvas.height-wallBrickHeight, wallBrickWidth, wallBrickWidth*800/646, 'graphics/items/heart.png', 'life-increaser', 30));
    items.lifeIncreasing.push(new LifeIncreaser(Math.random()*canvas.width-wallBrickWidth, Math.random()*canvas.height-wallBrickHeight, wallBrickWidth, wallBrickWidth*800/646, 'graphics/items/heart.png', 'life-increaser', 30));
    items.lifeIncreasing.push(new LifeIncreaser(Math.random()*canvas.width-wallBrickWidth, Math.random()*canvas.height-wallBrickHeight, wallBrickWidth, wallBrickWidth*800/646, 'graphics/items/heart.png', 'life-increaser', 30));
    items.lifeIncreasing.push(new LifeIncreaser(Math.random()*canvas.width-wallBrickWidth, Math.random()*canvas.height-wallBrickHeight, wallBrickWidth, wallBrickWidth*800/646, 'graphics/items/heart.png', 'life-increaser', 30));
    items.lifeIncreasing.push(new LifeIncreaser(Math.random()*canvas.width-wallBrickWidth, Math.random()*canvas.height-wallBrickHeight, wallBrickWidth, wallBrickWidth*800/646, 'graphics/items/heart.png', 'life-increaser', 30));
    items.lifeIncreasing.push(new LifeIncreaser(Math.random()*canvas.width-wallBrickWidth, Math.random()*canvas.height-wallBrickHeight, wallBrickWidth, wallBrickWidth*800/646, 'graphics/items/heart.png', 'life-increaser', 30)); */
}

function createPlatforms() {
    createNonMovingPlatforms();
    createMovingPlatforms();
}

function createNonMovingPlatforms() {
    platforms.push(new Platform(canvas.width / 2, canvas.height - 20 * wallBrickHeight, 4.5 * wallBrickWidth, 1 * wallBrickHeight, 'graphics/platforms/green-5.png'));
    platforms.push(new Platform(canvas.width / 5, canvas.height - 10 * wallBrickHeight, 4.5 * wallBrickWidth, 1 * wallBrickHeight, 'graphics/platforms/green-5.png'));
}

function createMovingPlatforms() {
    platforms.push(new MovingPlatform(20 * wallBrickWidth, 30 * wallBrickWidth, 0, 0, 10 * wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png', true));
    platforms.push(new MovingPlatform(50 * wallBrickWidth, 60 * wallBrickWidth, 0, 0, 10 * wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png', true));
    platforms.push(new MovingPlatform(5 * wallBrickWidth, 20 * wallBrickWidth, 0, 0, canvas.height - 5 * wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png', true));
    platforms.push(new MovingPlatform(20 * wallBrickWidth, 50 * wallBrickWidth, 0, 0, canvas.height - 0.30 * canvas.height, 'graphics/platforms/moving-platforms/five-wooden-boxes.png', true));
    platforms.push(new MovingPlatform(canvas.width / 2, 3 * canvas.width / 4, 0, 0, 25 * wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png', true));
    platforms.push(new MovingPlatform(wallBrickWidth, 0, 6 * wallBrickHeight, 60 * wallBrickHeight, 6 * wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png', false));
    platforms.push(new MovingPlatform(wallBrickWidth, 0, 6 * wallBrickHeight, 30 * wallBrickHeight, 6 * wallBrickHeight, 'graphics/platforms/moving-platforms/five-wooden-boxes.png', false));
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
}

function drawElements() {
    drawBackgrounds();
    drawWalls();
    drawPlatforms();
    drawHitables();
    drawItems();
    drawChar();
    drawCharObjects();
    drawMenuBar();
}

function drawBackgrounds() {
    backgrounds.forEach((elem)=>{
        ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height);
    });
    //setTimeout(()=>{backgrounds[backgrounds.length-1].fadeOut();}, 10000);
}

function drawWalls() {
    walls.forEach((wall) => {
        ctx.drawImage(wall.wallImage, wall.x, wall.y, wall.width, wall.height);
    })
}

function drawMenuBar() {
    menubarBackground.createMenubarBackground();
    menuBar.writeMenuTexts();
}

function drawPlatforms() {
    for (let i = 0; i < platforms.length; i++) {
        ctx.drawImage(platforms[i].platformImage, platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
    }
}

function drawHitables() {
    hitables.traps.forEach((elem) => {
        if (elem || elem.isDangerous) { ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height); }
    })
    hitables.enemies.forEach((elem, index) => {
        if (elem && elem.isAlive) { ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height); }
    })
    if (hitables.flyables.length) {
        hitables.flyables.forEach((elem) => {
            if (elem.inCanvas) { ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height); }
        })
    }
}

function drawItems() {
    items.lifeIncreasing.forEach((elem) => {
        if(!elem.collected) {
            ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height);
        }
    })
}

function drawChar() {
    if (char.isAlive) {
        ctx.drawImage(char.figImage, char.x, char.y, char.width, char.height);
    }
}

function drawCharObjects() {
    charObjects.ammo.forEach((elem) => {
        if(!elem.leftCanvas) {
            ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height);
        }
    });
}

function addKeypressMovingCommands() {
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
        } else if (event.key === " " && !char.jumps) {
            controller['jump'].pressed = true;
            controller['jump'].func();
        } else if (event.key === "Shift") {
            controller['run'].pressed = true;
            controller['run'].func();
        } else if (event.key === "p" || event.key === "P") {
            if (!gamePaused) {
                gamePaused = true;
            } else {
                gamePaused = false;
                timer();
                //drawElements();
            }
        } else if (event.key === "Alt") {
            createAmmo(char.movingDirection === "left" ? char.x : char.x + char.width, char.y + 0.005*canvas.height, wallBrickWidth, wallBrickWidth, 'graphics/enemies/shooter/attack/cannonball.png');
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
    //drawElements();
}

function addTouchMovingCommands(event = "") {
    if(event === "") {
        setTouchController();
        return;
    }
    event.target.closest('.touch-control').classList.add('pressed');
    switch (event.target.closest('.touch-control').getAttribute('button-type')) {
        case "left": {
            controller['left'].pressed = true;
            controller['left'].func();
            break;
        }
        case "right": {
            controller['right'].pressed = true;
            controller['right'].func();
        }
        case "jump": {
            controller['jump'].pressed = true;
            controller['jump'].func();
        }
    }
}

function removeClassPressed(event) {
    if(event.target.closest('.touch-control').classList.contains('pressed')) {
        event.target.closest('.touch-control').classList.remove('pressed');
        console.log(event.target.closest('.touch-control').getAttribute('button-type'));
        controller[event.target.closest('.touch-control').getAttribute('button-type')].pressed = false;
    }
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

function setTouchController() {
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
        /* if (!char.startingYPos) {
            char.startingYPos = char.y;
            char.jumps = false;
            char.checkIfJumping();
        } */
        char.startingYPos = char.y;
        char.jumps = false;
        char.checkIfJumping();
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

function checkIfAllEnemiesAreDead() {
    if(hitables.enemies.length === char.enemiesKilled) {
        setTimeout(this.resetEnemies, 30000);
    }
}

function resetEnemies() {
    hitables.enemies.forEach((elem)=>{
        elem.lifeAmount = elem.maxLifeAmount;
        elem.isAlive = true;
        elem.hitable = true;
        elem.isDangerous = true;
    })
}

function checkForScrolling(movingDirection = char.movingDirection) {
    if(canvas.offsetLeft - canCont.offsetLeft <= canCont.offsetWidth - canvas.offsetWidth && movingDirection === "right") {
        canvas.style.left = `-${canvas.offsetWidth - canCont.offsetWidth}px`;
        return;
    }else {
        if(Math.abs(canvas.offsetLeft - canCont.offsetLeft + char.x) > 2*canCont.offsetWidth/3 && movingDirection === "right" && controller['right'].pressed) {
            char.totalStepAmount++;
        }else if(Math.abs(canvas.offsetLeft - canCont.offsetLeft + char.x) < canCont.offsetWidth/3 && movingDirection === "left" && controller['left'].pressed) {
            char.totalStepAmount--;
        }
        canvas.style.left = `-${char.standardStepLength*char.totalStepAmount}px`;
    }
    //requestAnimationFrame(()=>{ checkForScrolling(); })
}

function setMenubarPosition() {
    menubar.x = canvas.offsetLeft - canCont.offsetLeft + canCont.offsetWidth;
    menubarBackground.x = canvas.offsetLeft - canCont.offsetLeft + canCont.offsetWidth;
}

function setCanvasSize() {
    canvas.style.width = `${2*canCont.offsetWidth}px`;
    canvas.style.height = `${canCont.offsetHeight}px`;
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