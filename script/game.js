let canvas;
let canvasWidth;
let ctx;
let char, wall;
let widthUnit;
let menubarBackground;
let menuBar;
let canvasBackground;
let controller;
let bgPlayer;
let gameVolume = 0.5;
let t = -1;
let gamePaused = false;
let gameMuted = false;
let canCont = document.querySelector('.canvas-cont');
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
    lifeIncreasing: [],
    specialAmmo: []
};
let audioPlayer = [];

function initFunctions() {
    loadPlayer();
    createCanvas();
    setScreenSize();
    createBackgrounds();
    createChar();
    addKeypressMovingCommands();
    createPlatforms();
    createTraps();
    createEnemies();
    createItems();
    //createMenuBar();
}

function setScreenSize() {
    if (localStorage.canContScales) {
        let scales = JSON.parse(localStorage.canContScales);
        canCont.offsetWidth = scales.canContScales.width;
        canCont.offsetHeight = scales.canContScales.height;
        canvas.style.width = 2*canCont.offsetWidth;
        canvas.style.height = canCont.offsetHeight;
    } else {
        canvas.setAttribute("width", 2*canCont.offsetWidth);
        canvas.setAttribute("height", canCont.offsetHeight);
    }
}

function loadPlayer() {
    bgPlayer = new Audio();
    bgPlayer.src = 'sounds/background.mp3';
    bgPlayer.volume = gameVolume;
    bgPlayer.play();
    bgPlayer.loop = true;
    bgPlayer.volume = 0.125;
    audioPlayer.push(bgPlayer);
}

function createCanvas() {
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    widthUnit = canCont.offsetWidth/48;
    heightUnit = canCont.offsetHeight/27;
}

function createBackgrounds() {
    backgrounds.push(new Background(0, 0, canCont.offsetWidth, canCont.offsetHeight, 'graphics/background/background.jpg'));
    //backgrounds.push(canvasBackground = new Background('graphics/background/rotating-galaxy.webp'));
}

function createChar() {
    char = new Char(widthUnit, heightUnit, widthUnit, 25*heightUnit, 'graphics/main-char/run/run-right-0.png', widthUnit/6, 4*heightUnit);
}

function createAmmo(x, y, width, height, imagePath) {
    charObjects.ammo.push(new Ammo(x, y, width, height, imagePath));
}

function createPlatforms() {
    platforms.push(new Platform(0, 26*heightUnit, 5*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(5*widthUnit, 26*heightUnit, 5*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(10*widthUnit, 26*heightUnit, 5*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(15*widthUnit, 26*heightUnit, 5*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(20*widthUnit, 26*heightUnit, 5*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(25*widthUnit, 26*heightUnit, 5*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(30*widthUnit, 26*heightUnit, 5*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(35*widthUnit, 26*heightUnit, 5*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(40*widthUnit, 26*heightUnit, 5*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(154*widthUnit, 26*heightUnit, 2*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-2.png'));
    platforms.push(new Platform(158*widthUnit, 26*heightUnit, widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(162*widthUnit, 26*heightUnit, 3*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-3.png'));
    platforms.push(new Platform(168*widthUnit, 26*heightUnit, 4*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-4.png'));
    platforms.push(new Platform(5*widthUnit, 26*heightUnit, widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(10*widthUnit, 20*heightUnit, 2*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-2.png'));
    platforms.push(new Platform(20*widthUnit, 20*heightUnit, 5*widthUnit, heightUnit, 'graphics/platforms/non-moving-length-5.png'));
    platforms.push(new Platform(5*widthUnit, 11*heightUnit, 4*widthUnit, 0.5*heightUnit, 'graphics/walls/ground/ground-tile-length-4.png'));
    platforms.push(new Platform(40*widthUnit, 23*heightUnit, 3*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-3.png'));
    platforms.push(new Platform(41*widthUnit, 17*heightUnit, widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(39*widthUnit, 13*heightUnit, 5*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(38*widthUnit, 12*heightUnit, widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(36*widthUnit, 10*heightUnit, widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(34*widthUnit, 8*heightUnit, widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(32*widthUnit, 6*heightUnit, widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(30*widthUnit, 4*heightUnit, widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(25*widthUnit, 4*heightUnit, 5*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(22*widthUnit, 4*heightUnit, 3*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-3.png'));
    platforms.push(new Platform(45*widthUnit, 12*heightUnit, 3*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-3.png'));
    platforms.push(new Platform(64*widthUnit, 10*heightUnit, 3*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-3.png'));
    platforms.push(new Platform(67*widthUnit, 8*heightUnit, widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(69*widthUnit, 6*heightUnit, widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(71*widthUnit, 4*heightUnit, 5*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(56*widthUnit, 19*heightUnit, 5*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(64*widthUnit, 16*heightUnit, 3*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-3.png'));
    platforms.push(new Platform(70*widthUnit, 19*heightUnit, 5*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-5.png'));
    createMovingPlatforms();
}

function createMovingPlatforms() {
    platforms.push(new MovingPlatform(3*widthUnit, heightUnit, 11*widthUnit, 19*widthUnit, 17*heightUnit, 17*heightUnit, 17*heightUnit, 'graphics/walls/ground/ground-tile-length-3.png', true));
    platforms.push(new MovingPlatform(3*widthUnit, 0.5*heightUnit, widthUnit, widthUnit, 5*heightUnit, 15*heightUnit, 5*heightUnit, 'graphics/walls/ground/ground-tile-length-3.png'));
    platforms.push(new MovingPlatform(2*widthUnit, heightUnit, 6*widthUnit, 10*widthUnit, 24*heightUnit, 23*heightUnit, 23*heightUnit, 'graphics/walls/ground/ground-tile-length-2.png', true));
    platforms.push(new MovingPlatform(4*widthUnit, heightUnit, 14*widthUnit, 14*widthUnit, 9*heightUnit, 15*heightUnit, 15*heightUnit, 'graphics/walls/ground/ground-tile-length-4.png', false));
    platforms.push(new MovingPlatform(2*widthUnit, 0.25*heightUnit, 35.5*widthUnit, 42*widthUnit, 20*heightUnit, 20*heightUnit, 20*heightUnit, 'graphics/walls/ground/ground-tile-length-2.png', true));
    platforms.push(new MovingPlatform(2*widthUnit, 0.25*heightUnit, 41.5*widthUnit, 48*widthUnit, 20*heightUnit, 20*heightUnit, 20*heightUnit, 'graphics/walls/ground/ground-tile-length-2.png', true));
    platforms.push(new MovingPlatform(3*widthUnit, heightUnit, 48*widthUnit, 58*widthUnit, 12*heightUnit, 12*heightUnit, 12*heightUnit, 'graphics/walls/ground/ground-tile-length-3.png', true));
    platforms.push(new MovingPlatform(2*widthUnit, heightUnit, 59*widthUnit, 65*widthUnit, 12*heightUnit, 12*heightUnit, 12*heightUnit, 'graphics/walls/ground/ground-tile-length-2.png', true));
}

function createTraps() {
    hitables.traps.push(new Trap(5*widthUnit, 25*heightUnit, widthUnit, heightUnit, 'graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 2));
    hitables.traps.push(new Trap(6*widthUnit, 25*heightUnit, widthUnit, heightUnit, 'graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 2));
    hitables.traps.push(new Trap(11*widthUnit, 25*heightUnit, widthUnit, heightUnit, 'graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, true, false, -1, 8, 6));
    //hitables.traps.push(new Trap(169*widthUnit, 25*heightUnit, widthUnit, heightUnit, 'graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, true, true, 0, 8, 0));
    hitables.traps.push(new Trap(5.125*widthUnit, 10.25*heightUnit, 0.75*widthUnit, 0.75*heightUnit, 'graphics/traps/saws/round.png', 'round-saw', '', 25, true, false, -1));
    hitables.traps.push(new Trap(8.125*widthUnit, 10.25*heightUnit, 0.75*widthUnit, 0.75*heightUnit, 'graphics/traps/saws/round.png', 'round-saw', '', 25, true, false, -1));
    hitables.traps.push(new Trap(38*widthUnit, 11*heightUnit, widthUnit, heightUnit, 'graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 2));
    hitables.traps.push(new Trap(36*widthUnit, 9*heightUnit, widthUnit, heightUnit, 'graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 6));
    hitables.traps.push(new Trap(34*widthUnit, 7*heightUnit, widthUnit, heightUnit, 'graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 2));
    hitables.traps.push(new Trap(32*widthUnit, 5*heightUnit, widthUnit, heightUnit, 'graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 6));
    hitables.traps.push(new Trap(30*widthUnit, 3*heightUnit, widthUnit, heightUnit, 'graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 2));
    hitables.traps.push(new Trap(45*widthUnit, 11*heightUnit, widthUnit, heightUnit, 'graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 2));
    hitables.traps.push(new Trap(12*widthUnit, 16*heightUnit, widthUnit, heightUnit, 'graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, true, true, 35, 8, 0));
    hitables.traps.push(new Trap(2.125*widthUnit, 10.25*heightUnit, 0.75*widthUnit, 0.75*heightUnit, 'graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 25, true, true, 36, 8, 0));
}

function createEnemies() {
    hitables.enemies.push(new Shooter(21*widthUnit, 19*heightUnit, widthUnit, heightUnit, 'shooter', 60, true, 'left', 100, 20*widthUnit, false, 5, 7));
    hitables.enemies.push(new GreenEnemy(25*widthUnit, 24*heightUnit, 2*widthUnit, 2*heightUnit, 'green', 'graphics/enemies/green/attack/attack-left-0.png', 25, false, 'left', 150, 15*widthUnit, true, 5, 12));
    hitables.enemies.push(new GreenEnemy(35*widthUnit, 24*heightUnit, 2*widthUnit, 2*heightUnit, 'green', 'graphics/enemies/green/attack/attack-left-0.png', 25, false, 'left', 150, 15*widthUnit, true, 5, 12));
    hitables.enemies.push(new GreenEnemy(40*widthUnit, 24*heightUnit, 2*widthUnit, 2*heightUnit, 'green', 'graphics/enemies/green/attack/attack-left-0.png', 25, false, 'left', 150, 15*widthUnit, true, 5, 12));
    hitables.enemies.push(new Shooter(41*widthUnit, 16*heightUnit, widthUnit, heightUnit, 'shooter', 60, true, 'left', 100, 20*widthUnit, false, 5, 7));
    hitables.enemies.push(new Shooter(24*widthUnit, 2.5*heightUnit, 1.5*widthUnit, 1.5*heightUnit, 'shooter', 60, true, 'right', 100, 20*widthUnit, false, 5, 7));
}

function createItems() {
    items.lifeIncreasing.push(new LifeIncreaser(6.25*widthUnit, 9.5*heightUnit, 1.5*widthUnit, 1.5*heightUnit, 'graphics/items/heart.png', 'life-increaser', 75));
    items.specialAmmo.push(new SpecialAmmoKit(1.5*widthUnit, 0.5*heightUnit, widthUnit, heightUnit, 'graphics/items/special-ammo/rotation-0.png'));
    items.lifeIncreasing.push(new LifeIncreaser(41.25*widthUnit, 22.5*heightUnit, 0.5*widthUnit, 0.5*heightUnit, 'graphics/items/heart.png', 'life-increaser', 25));
    items.lifeIncreasing.push(new LifeIncreaser(39*widthUnit, 12*heightUnit, widthUnit, heightUnit, 'graphics/items/heart.png', 'life-increaser', 50));
    items.lifeIncreasing.push(new LifeIncreaser(43*widthUnit, 12*heightUnit, widthUnit, heightUnit, 'graphics/items/heart.png', 'life-increaser', 50));
    items.specialAmmo.push(new SpecialAmmoKit(22*widthUnit, 3*heightUnit, widthUnit, heightUnit, 'graphics/items/special-ammo/rotation-0.png'));
}

function createMenuBar() {
    menuBar = new Menubar(0.75*canvas.offsetWidth, canvas.offsetHeight-heightUnit, 0.25*canvas.offsetWidth, heightUnit, `${2400/1920}vw SuperLegendBoy`, 'red', 0);
    menubarBackground = new MenubarBackground(menuBar.x, menuBar.y, menuBar.width, menuBar.height);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
}

function drawElements() {
    drawBackgrounds();
    drawPlatforms();
    drawHitables();
    drawItems();
    drawChar();
    //drawMenuBar();
    drawCharObjects();
}

function drawBackgrounds() {
    backgrounds.forEach((elem) => {
        ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height);
    });
}

function drawMenuBar() {
    menubarBackground.createMenubarBackground();
    menuBar.writeMenuTexts();
}

function drawPlatforms() {
    platforms.forEach((elem) => {
        ctx.drawImage(elem.platformImage, elem.x, elem.y, elem.width, elem.height);
    });
}

function drawHitables() {
    hitables.traps.forEach((elem) => {
        if (elem || elem.isDangerous) { ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height); }
    })
    hitables.enemies.forEach((elem) => {
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
        if (!elem.collected) {
            ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height);
        }
    })
    items.specialAmmo.forEach((elem) => {
        if (!elem.collected) {
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
        if (!elem.leftCanvas) {
            ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height);
        }
    });
}

function dispatchKeypress(event) {
    const keyPressEvent = new KeyboardEvent('keydown', {
        key: event.target.closest('.touch-control').getAttribute('button-type'),
        code: event.target.closest('.touch-control').getAttribute('button-type'),
        keyCode: +event.target.closest('.touch-control').getAttribute('button-code'),
        bubbles: true
    });
    document.querySelector('body').dispatchEvent(keyPressEvent);
}

function dispatchKeypressStop(event) {
    const keyUpEvent = new KeyboardEvent('keyup', {
        key: event.target.closest('.touch-control').getAttribute('button-type'),
        code: event.target.closest('.touch-control').getAttribute('button-type'),
        keyCode: +event.target.closest('.touch-control').getAttribute('button-code'),
        bubbles: true
    });
    document.querySelector('body').dispatchEvent(keyUpEvent);
}

function addKeypressMovingCommands() {
    setController();
    document.querySelector('body').addEventListener('keydown', (event) => {
        char.sleeps = false;
        t = 0;
        if (event.key === "ArrowLeft") {
            if (!controller['left'].pressed) {
                controller['left'].pressed = true;
                controller['left'].func();
            }
        } else if (event.key === "ArrowRight") {
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
        } else if (event.key.toLowerCase() === "p") {
            if (!gamePaused) {
                gamePaused = true;
            } else {
                gamePaused = false;
                timer();
            }
        } else if (event.key.toLowerCase() === "w") {
            createAmmo(char.movingDirection === "left" ? char.x : char.x+char.width, char.y+0.005*widthUnit+canvas.offsetHeight, widthUnit*10, heightUnit*10, '/graphics/enemies/shooter/attack/cannonball.png');
        } else if (event.key.toLowerCase() === "m") {
            gameSoundOnOffToggle();
        }
    });
    document.querySelector('body').addEventListener('keyup', (event) => {
        if (event.key === "ArrowLeft" || event.key === "a") {
            controller['left'].pressed = false;
        } else if (event.key === "ArrowRight" || event.key === "d") {
            controller['right'].pressed = false;
        } else if (event.key === "Shift") {
            controller['run'].pressed = false;
            slowDownChar();
        }
    });
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
            pressed: false,
            func: speedUpChar
        },
        "volume": {
            pressed: false,
            func: checkVolumeBarEvent
        }
    }
}

function initJump() {
    if (controller['jump'].pressed) {
        controller['jump'].pressed = false;
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

function initStepLeftTouch() {
    if (controller['left'].pressed) {
        char.moveLeftTouch("ArrowLeft");
    }
}

function showHideTouchControls() {
    gamePaused = true;
    document.querySelector('.touch-controls .pause-game').classList.add('paused');
    if (!document.querySelector('.touch-controls').classList.contains('shown') && !document.querySelector('.touch-controls').classList.contains('hidden')) {
        document.querySelector('.touch-controls').classList.add('shown');
    } else if (!document.querySelector('.touch-controls').classList.contains('shown')) {
        document.querySelector('.touch-controls').classList.add('shown');
        document.querySelector('.touch-controls').classList.remove('hidden');
    } else if (!document.querySelector('.touch-controls').classList.contains('hidden')) {
        gamePaused = false;
        document.querySelector('.touch-controls .pause-game').classList.remove('paused');
        document.querySelector('.touch-controls').classList.remove('shown');
        document.querySelector('.touch-controls').classList.add('hidden');
    }
}

function initStepRight() {
    if (controller['right'].pressed) {
        char.moveRight("ArrowRight");
    }
}

function initStepRightTouch() {
    if (controller['right'].pressed) {
        char.moveRightTouch("ArrowRight");
    }
}

function speedUpChar() {
    if (char.stepLength === char.basicStepLength) {
        char.stepLength = char.basicStepLength*1.5;
    }
}

function setRunningCharTouch() {
    if (!document.querySelector('.touch-control.run').classList.contains('pressed')) {
        document.querySelector('.touch-control.run').classList.add('pressed');
    } else { document.querySelector('.touch-control.run').classList.remove('pressed'); }
    restyleRunningTouchButton();
    return document.querySelector('.touch-control.run').classList.contains('pressed');
}

function restyleRunningTouchButton() {
    document.querySelectorAll('.touch-control.run svg rect').forEach((elem) => {
        if (elem.closest('.touch-control').classList.contains('pressed')) {
            elem.setAttribute('fill', 'blue');
        } else { elem.setAttribute('fill', 'red'); }
    })
}

function touchShooting() {
    if (controller['shoot'].pressed) {
        createAmmo(char.movingDirection === "left" ? char.x : char.x+char.width, char.y+0.005*canvas.offsetHeight, widthUnit, widthUnit, 'graphics/enemies/shooter/attack/cannonball.png');
        document.querySelector('.touch-control.shoot').classList.remove('pressed');
        controller['shoot'].pressed = false;
    }
}

function slowDownChar() {
    if (1.5*char.basicStepLength === char.stepLength) {
        char.stepLength = char.basicStepLength;
    }
}

function playSound(fileName) {
    if (!gameMuted) {
        let audio = new Audio();
        audio.src = fileName;
        audio.volume = gameVolume;
        audioPlayer.push(audio);
        audio.play();
    }
}

function checkIfAllEnemiesAreDead() {
    if (hitables.enemies.length === char.enemiesKilled) {
        setTimeout(this.resetEnemies, 30000);
    }
}

function resetEnemies() {
    hitables.enemies.forEach((elem) => {
        elem.lifeAmount = elem.maxLifeAmount;
        elem.isAlive = true;
        elem.hitable = true;
        elem.isDangerous = true;
    })
}

function checkForScrolling(movingDirection = char.movingDirection) {
    if (parseFloat(canvas.style.left) === 0 && char.x < 2*canCont.offsetWidth/3) {
        return;
    } else {
        if (movingDirection === "right" && canCont.offsetLeft+parseFloat(canvas.style.left)+char.x >= 2*canCont.offsetWidth/3) {
            if (canvas.offsetLeft+canCont.offsetWidth <= 0) {
                return;
            }
            char.scrollingStepAmount++;
        } else if (movingDirection === "left" && canCont.offsetLeft+parseFloat(canvas.style.left)+char.x <= canCont.offsetWidth/3) {
            if (parseFloat(canvas.style.left) >= 0) {
                return;
            }
            char.scrollingStepAmount--;
        }
        canvas.style.left = `-${char.standardStepLength*char.scrollingStepAmount}px`;
    }
}

function setMenubarPosition() {
    menubar.x = canvas.offsetLeft-canCont.offsetLeft+canCont.offsetWidth;
    menubarBackground.x = canvas.offsetLeft-canCont.offsetLeft+canCont.offsetWidth;
}

function setCanvasSize() {
    canvas.style.width = `${2*canCont.offsetWidth}px`;
    canvas.style.height = `${canCont.offsetHeight}px`;
}

function checkVolumeBarEvent(event) {
    if (event.type === "mousedown" || event.type === "touchstart") {
        controller['volume'].pressed = true;
        document.querySelector('.volumebar-cont').addEventListener('mousemove', setWholeVolume);
    } else if (event.type === "mouseup" || event.type === "touchend") {
        controller['volume'].pressed = false;
        document.querySelector('.volumebar-cont').removeEventListener('mousemove', setWholeVolume);
        document.querySelector('.volumebar-cont').addEventListener('mouseup', setWholeVolume);
    }
}

let setWholeVolume = function setWholeVolumeFunc(event) {
    let index;
    if (event.type === "mousedown" || "mouseup") {
        index = event.type = 0;
    } else { index = 1; }
    let volumeBarInner = document.querySelectorAll('.volumebar .volumebar-inner')[index];
    let volumeBarWidth = document.querySelectorAll('.volumebar')[index].offsetWidth;
    let x = event.clientX;
    gameVolume = ((x-volumeBarInner.getBoundingClientRect().left)/volumeBarWidth) >= 0 ? ((x-volumeBarInner.getBoundingClientRect().left)/volumeBarWidth) : 0;
    gameVolume = gameVolume > 1 ? 1 : gameVolume;
    volumeBarInner.style.width = `${100*(x-volumeBarInner.getBoundingClientRect().left)/volumeBarWidth}%`;
    if (!document.querySelector('.mute-game').classList.contains('muted')) { audioPlayer.forEach((elem) => { elem.volume = gameVolume; }); }
}

function gameSoundOnOffToggle() {
    if (!document.querySelector('.mute-game').classList.contains('muted')) {
        document.querySelector('.mute-game').classList.add('muted');
        audioPlayer.forEach((elem) => { elem.volume = 0; });
        gameMuted = true;
    } else {
        document.querySelector('.mute-game').classList.remove('muted');
        audioPlayer.forEach((elem) => { elem.volume = gameVolume; });
        gameMuted = false;
    }
}

function turnOnFullScreen() {
    canCont.style.width = `${window.innerWidth}px`;
    canCont.style.height = `${9*canCont.offsetWidth/16}px`;
    canvas.setAttribute("width", 2*canCont.offsetWidth);
    canvas.setAttribute("height", canCont.offsetHeight);
    widthUnit = window.innerWidth/48;
    heightUnit = window.innerHeight/27;
    clearCanvas();
    recreateElements();
    //localStorage.setItem('canContScales', JSON.stringify({ width: canCont.offsetWidth, height: canCont.offsetHeight }));
    document.querySelector('.turn-fullscreen-on').classList.add('disNone');
    document.querySelector('.turn-fullscreen-off').classList.remove('disNone');
}

function recreateElements() {
    hitables.traps = [];
    hitables.enemies = [];
    platforms = [];
    createTraps();
    createEnemies();
    createPlatforms();
}

function turnOffFullScreen() {
    canCont.style.width = `${0.8*window.innerWidth}px`;
    canCont.style.height = `${9*canCont.offsetWidth/16}px`;
    canvas.style.width = `${2*canCont.offsetWidth}px`;
    canvas.style.height = `${canCont.offsetHeight}px`;
    document.querySelector('.turn-fullscreen-on').classList.remove('disNone');
    document.querySelector('.turn-fullscreen-off').classList.add('disNone');
    document.querySelector('#canCont-width').value = canCont.offsetWidth;
    document.querySelector('#canvas-width').value = canvas.offsetWidth;
    document.querySelector('#wallbrickwidth').value = widthUnit;
    document.querySelector('#wallbrickheight').value = heightUnit;
}

function pauseGame() {
    if (gamePaused) {
        document.querySelector('.pause-game').classList.remove('paused');
        gamePaused = false;
    } else {
        document.querySelector('.pause-game').classList.add('paused');
        gamePaused = true;
    }
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

function resetScreenPosition(i) {
    i += widthUnit;
    canvas.style.left = `${i}px`;
    if(i >= 0) {
        canvas.style.left = '0px';
        resetCharPosition();
        gamePaused = false;
        return;
    }
    setTimeout(()=>{resetScreenPosition(i);}, 30);
}

function resetCharPosition() {
    char.x = widthUnit;
    char.y = 25*heightUnit;
}