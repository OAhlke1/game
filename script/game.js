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
    /* if (window.innerWidth > 800) {
        addKeypressMovingCommands();
    } else { addTouchMovingCommands(); } */
    addKeypressMovingCommands();
    createPlatforms();
    createTraps();
    createEnemies();
    createItems();
    createMenuBar();
}

function setScreenSize() {
    if(!localStorage.canContScales) {
        let scales = JSON.parse(localStorage.canContScales);
        canCont.offsetWidth = scales.canContScales.width;
        canCont.offsetHeight = scales.canContScales.height;
        canvas.style.width = 2*canCont.offsetWidth;
        canvas.style.height = canCont.offsetHeight;
    }else {
        canvas.setAttribute("width", 2*canCont.offsetWidth);
        canvas.setAttribute("height", canCont.offsetHeight);
    }
}

function loadPlayer() {
    bgPlayer = new Audio();
    bgPlayer.src = 'sounds/background.ogg';
    bgPlayer.volume = gameVolume;
    bgPlayer.play();
    bgPlayer.loop = true;
    audioPlayer.push(bgPlayer);
}

function createCanvas() {
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    widthUnit = canCont.offsetWidth/96;
    heightUnit = canCont.offsetHeight/54;
}

function createBackgrounds() {
    backgrounds.push(new Background(0, 0, canvas.offsetWidth, canvas.offsetHeight, 'graphics/background/rotating-galaxy.webp'));
    //backgrounds.push(canvasBackground = new Background('graphics/background/rotating-galaxy.webp'));
}

function createChar() {
    char = new Char(2*widthUnit, 2*heightUnit, widthUnit, canvas.offsetHeight-2*heightUnit, 'graphics/main-char/run/run-right-0.png', widthUnit/3);
}

function createAmmo(x, y, width, height, imagePath) {
    charObjects.ammo.push(new Ammo(x, y, width, height, imagePath));
}

function createPlatforms() {
    /* Bottom */
    platforms.push(new Platform(0, 53*heightUnit, 5*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(5*widthUnit, 53*heightUnit, 5*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(10*widthUnit, 53*heightUnit, 5*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new MovingPlatform(2*widthUnit, 15*widthUnit, 20*widthUnit, 53*heightUnit, 53*heightUnit, 53*heightUnit, 'graphics/walls/ground/ground-tile-length-2.png', true));
    platforms.push(new Platform(21*widthUnit, 53*heightUnit, 130*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-long.png'));
    platforms.push(new Platform(154*widthUnit, 53*heightUnit, 2*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-2.png'));
    platforms.push(new Platform(158*widthUnit, 53*heightUnit, widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(162*widthUnit, 53*heightUnit, 3*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-3.png'));
    platforms.push(new Platform(168*widthUnit, 53*heightUnit, 4*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-4.png'));
    platforms.push(new Platform(5*widthUnit, 53*heightUnit, widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(10*widthUnit, 49*heightUnit, 2*widthUnit, heightUnit, 'graphics/walls/ground/ground-tile-length-2.png'));
    platforms.push(new MovingPlatform(widthUnit, 12*widthUnit, 20*widthUnit, 47*heightUnit, 47*heightUnit, 47*heightUnit, 'graphics/walls/ground/ground-tile-length-1.png', true));
    platforms.push(new MovingPlatform(2*widthUnit, 22*widthUnit, 30*widthUnit, 44*heightUnit, 44*heightUnit, 44*heightUnit, 'graphics/walls/ground/ground-tile-length-2.png', true));
}

function createTraps() {
    hitables.traps.push(new Traps(5*widthUnit, 52*heightUnit, widthUnit, heightUnit, '../graphics/traps/stings/sting-coming-out-0.png', 'coming-out-sting', 15, true, false));
    hitables.traps.push(new Traps(6*widthUnit, 52*heightUnit, widthUnit, heightUnit, '../graphics/traps/stings/sting-coming-out-0.png', 'coming-out-sting', 15, true, false));
    hitables.traps.push(new Traps(11*widthUnit, 52*heightUnit, widthUnit, heightUnit, '../graphics/traps/stings/sting-coming-out-0.png', 'coming-out-sting', 15, true, true, 0));
    hitables.traps.push(new Traps(169*widthUnit, 52*heightUnit, widthUnit, heightUnit, '../graphics/traps/stings/sting-coming-out-0.png', 'coming-out-sting', 15, true, true, 0));
    hitables.traps.push(new Traps(170*widthUnit, 52*heightUnit, widthUnit, heightUnit, '../graphics/traps/stings/sting-coming-out-0.png', 'coming-out-sting', 15, true, true, 0));
}

function createMenuBar() {
    menuBar = new Menubar(0.75*canvas.offsetWidth, canvas.offsetHeight-heightUnit, 0.25*canvas.offsetWidth, heightUnit, `${2400/1920}vw SuperLegendBoy`, 'red', 0);
    menubarBackground = new MenubarBackground(menuBar.x, menuBar.y, menuBar.width, menuBar.height);
}

function createEnemies() {
    hitables.enemies.push(new GreenEnemey(25*widthUnit, canvas.offsetHeight-4*widthUnit, 2.5*widthUnit, 2.5*heightUnit, 'green', 'graphics/enemies/green/attack/attack-left-0.png', 10, false, 'left', 100, 20*widthUnit, true, 5, 12));
    hitables.enemies.push(new GreenEnemey(20*widthUnit, canvas.offsetHeight-3*widthUnit, 2.5*widthUnit, 2.5*heightUnit, 'green', 'graphics/enemies/green/attack/attack-left-0.png', 20, false, 'left', 70, 20*widthUnit, true, 5, 12));
    hitables.enemies.push(new GreenEnemey(10*widthUnit, widthUnit, 2.5*widthUnit, 2.5*heightUnit, 'green', 'graphics/enemies/green/attack/attack-left-0.png', 30, false, 'left', 80, 20*widthUnit, true, 5, 12));
    hitables.enemies.push(new Shooter(canvas.offsetWidth-23*widthUnit, canvas.offsetHeight-3*heightUnit, 2*widthUnit, 2*heightUnit, 'shooter', 15, true, 'left', 100, 10*widthUnit, true, 5, 7));
    hitables.enemies.push(new Shooter(canvas.offsetWidth/2+7*widthUnit, canvas.offsetHeight-22*heightUnit, 2*widthUnit, 2*heightUnit, 'shooter', 15, true, 'left', 100, 2*widthUnit, true, 5, 7));
}

function createItems() {
    items.lifeIncreasing.push(new LifeIncreaser(5*widthUnit, canvas.offsetHeight-2*heightUnit, widthUnit, widthUnit*800/646, 'graphics/items/heart.png', 'life-increaser', 30));
    items.lifeIncreasing.push(new LifeIncreaser(Math.random()*canvas.offsetWidth-widthUnit, Math.random()*canvas.offsetHeight-heightUnit, widthUnit, widthUnit*800/646, 'graphics/items/heart.png', 'life-increaser', 30));
    items.lifeIncreasing.push(new LifeIncreaser(Math.random()*canvas.offsetWidth-widthUnit, Math.random()*canvas.offsetHeight-heightUnit, widthUnit, widthUnit*800/646, 'graphics/items/heart.png', 'life-increaser', 30));
    items.lifeIncreasing.push(new LifeIncreaser(Math.random()*canvas.offsetWidth-widthUnit, Math.random()*canvas.offsetHeight-heightUnit, widthUnit, widthUnit*800/646, 'graphics/items/heart.png', 'life-increaser', 30));
    items.specialAmmo.push(new SpecialAmmoKit(10*widthUnit, 50*heightUnit, 2*widthUnit, 2.4*heightUnit, 'graphics/items/special-ammo/rotation-0.png'));
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
    //drawMenuBar();
    drawCharObjects();
}

function drawBackgrounds() {
    backgrounds.forEach((elem) => {
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
    /* for (let i = 0; i < platforms.length; i++) {
        ctx.drawImage(platforms[i].platformImage, platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
    } */
    platforms.forEach((elem)=>{
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
                //drawElements();
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
    //drawElements();
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
        //controller['left'].pressed = false;
        char.moveLeft("ArrowLeft");
    }
}

function initStepLeftTouch() {
    if(controller['left'].pressed) {
        char.moveLeftTouch("ArrowLeft");
    }
}

function showHideTouchControls() {
    gamePaused = true;
    document.querySelector('.touch-controls .pause-game').classList.add('paused');
    if(!document.querySelector('.touch-controls').classList.contains('shown') && !document.querySelector('.touch-controls').classList.contains('hidden')) {
        document.querySelector('.touch-controls').classList.add('shown');
    }else if(!document.querySelector('.touch-controls').classList.contains('shown')) {
        document.querySelector('.touch-controls').classList.add('shown');
        document.querySelector('.touch-controls').classList.remove('hidden');
    }else if(!document.querySelector('.touch-controls').classList.contains('hidden')) {
        gamePaused = false;
        document.querySelector('.touch-controls .pause-game').classList.remove('paused');
        document.querySelector('.touch-controls').classList.remove('shown');
        document.querySelector('.touch-controls').classList.add('hidden');
    }
}

function initStepRight() {
    if (controller['right'].pressed) {
        //controller['right'].pressed = false;
        char.moveRight("ArrowRight");
    }
}

function initStepRightTouch() {
    if(controller['right'].pressed) {
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
    if(!gameMuted) {
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
    /* if (canvas.offsetLeft-canCont.offsetLeft <= canCont.offsetWidth-canvas.offsetWidth && movingDirection === "right") {
        //char.totalStepAmount++;
        //canvas.style.left = `-${canvas.offsetWidth-canCont.offsetWidth}px`;
        return;
    }else {
        if ((canCont.offsetLeft+parseFloat(canvas.style.left)+char.x) >= 2*canCont.offsetWidth/3 && movingDirection === "right" && controller['right'].pressed) {
            char.totalStepAmount++;
        } else if ((canCont.offsetLeft+parseFloat(canvas.style.left)+char.x) <= canCont.offsetWidth/3 && movingDirection === "left" && controller['left'].pressed) {
            char.totalStepAmount--;
        }
        canvas.style.left = `-${char.stepLength*char.totalStepAmount}px`;
    } */
   if(parseFloat(canvas.style.left) === 0 && char.x < 2*canCont.offsetWidth/3) {
        return;
   } else {
    if(movingDirection === "right" && canCont.offsetLeft+parseFloat(canvas.style.left)+char.x >= 2*canCont.offsetWidth/3) {
        if(canvas.offsetLeft+canCont.offsetWidth <= 0) {
            return;
        }
        char.scrollingStepAmount++;
    }else if(movingDirection === "left" && canCont.offsetLeft+parseFloat(canvas.style.left)+char.x <= canCont.offsetWidth/3) {
        if(parseFloat(canvas.style.left) >= 0) {
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
    if(event.type === "mousedown" || event.type === "touchstart") {
        controller['volume'].pressed = true;
        document.querySelector('.volumebar-cont').addEventListener('mousemove', setWholeVolume);
    }else if(event.type === "mouseup" || event.type === "touchend") {
        controller['volume'].pressed = false;
        document.querySelector('.volumebar-cont').removeEventListener('mousemove', setWholeVolume);
        document.querySelector('.volumebar-cont').addEventListener('mouseup', setWholeVolume);
    }
}

let setWholeVolume = function setWholeVolumeFunc(event) {
    let index;
    if(event.type === "mousedown" || "mouseup") {
        index = event.type = 0;
    }else { index = 1; }
    let volumeBarInner = document.querySelectorAll('.volumebar .volumebar-inner')[index];
    let volumeBarWidth = document.querySelectorAll('.volumebar')[index].offsetWidth;
    let x = event.clientX;
    gameVolume = ((x-volumeBarInner.getBoundingClientRect().left)/volumeBarWidth) >= 0 ? ((x-volumeBarInner.getBoundingClientRect().left)/volumeBarWidth) : 0;
    gameVolume = gameVolume > 1 ? 1 : gameVolume;
    volumeBarInner.style.width = `${100*(x-volumeBarInner.getBoundingClientRect().left)/volumeBarWidth}%`;
    if(!document.querySelector('.mute-game').classList.contains('muted')) { audioPlayer.forEach((elem)=>{ elem.volume = gameVolume; }); }
}

function gameSoundOnOffToggle() {
    if(!document.querySelector('.mute-game').classList.contains('muted')) {
        document.querySelector('.mute-game').classList.add('muted');
        audioPlayer.forEach((elem)=>{ elem.volume = 0; });
        gameMuted = true;
    }else {
        document.querySelector('.mute-game').classList.remove('muted');
        audioPlayer.forEach((elem)=>{ elem.volume = gameVolume; });
        gameMuted = false;
    }
}

function turnOnFullScreen() {
    canCont.style.width = `${window.innerWidth}px`;
    canCont.style.height = `${9*canCont.offsetWidth/16}px`;
    canvas.style.width = `${2*canCont.offsetWidth}px`;
    canvas.style.height = `${canCont.offsetHeight}px`;
    localStorage.setItem('canContScales', JSON.stringify({width: canCont.offsetWidth, height: canCont.offsetHeight}));
    document.querySelector('.turn-fullscreen-on').classList.add('disNone');
    document.querySelector('.turn-fullscreen-off').classList.remove('disNone');
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
    if(gamePaused) {
        document.querySelector('.pause-game').classList.remove('paused');
        gamePaused = false;
    }else {
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