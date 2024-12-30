let canvas;
let canvasWidt;
let ctx;
let char, wall;
let widthUnit;
let menubarBackground;
let canvasBackground;
let controller;
let bgPlayer;
let canCont;
let bigBoss;
let ammoImageSource = './graphics/main-char/ammo/laser.svg';
let gameVolume = 0.5;
let t = -1;
let gamePaused = false;
let gameMuted = false;
let walls = [];
let platforms = [];
let standables = [];
let backgrounds = [];
let audioPlayer = [];
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
let gameJson = {
    screenDimensions: {
        width: 0,
        height: 0
    },
    char: {},
    hitables: {
        traps: [],
        enemies: [],
        flyables: []
    },
    items: {
        lifeIncreasing: [],
        specialAmmo: [],
    }
};
let menuBar = document.querySelector('.menu-bar');

function initFunctions() {
    //clearLocalStorage();
    loadPlayer();
    createScreen();
    setSizeUnits();
    createBackgrounds();
    createChar();
    addKeypressMovingCommands();
    createPlatforms();
    createTraps();
    if(localStorage.items && localStorage.enemies) {
        createEnemies();
        createItems();
        presetMenuBarProperties();
    }else {
        createNewEnemies();
        createNewItems();
    }
    drawElements();
    sizeElements(1);
    sizeMenuBarProperties();
}

function clearLocalStorage() {
    localStorage.removeItem('char');
    localStorage.removeItem('enemies');
    localStorage.removeItem('items');
}

function loadGameJson() {
    gameJson = JSON.parse(localStorage.gameJson);
    items = gameJson.items;
    hitables.enemies = [];
    hitables.enemies = gameJson.hitables.enemies;
    console.log(hitables.enemies);
}

function createGameJson() {
    gameJson = {
        screenDimensions: gameJson.screenDimensions,
        hitables: {
            enemies: hitables.enemies
        },
        items: items
    };
    //saveGameJaon();
}

function setSizeUnits() {
    widthUnit = canCont.offsetWidth/48;
    heightUnit = canCont.offsetHeight/27;
}

function loadPlayer() {
    bgPlayer = new Audio();
    bgPlayer.src = './sounds/background.mp3';
    bgPlayer.volume = gameVolume;
    bgPlayer.play();
    bgPlayer.loop = true;
    bgPlayer.volume = 0.125;
    audioPlayer.push(bgPlayer);
}

function createScreen() {
    canCont = document.querySelector('.canvas-cont');
    canvas = document.querySelector('canvas');
    canvas.setAttribute('width', 2*canCont.offsetWidth);
    canvas.setAttribute('height', canCont.offsetHeight);
    ctx = canvas.getContext('2d');
}

function createBackgrounds() {
    backgrounds.push(new Background(0, 0, canCont.offsetWidth, canCont.offsetHeight, './graphics/background/background.jpg'));
    //backgrounds.push(canvasBackground = new Background('./graphics/background/rotating-galaxy.webp'));
}

function createChar() {
    if(localStorage.char) {
        let charObject = JSON.parse(localStorage.char);
        char = new Char(charObject.width, charObject.height, charObject.standardX, charObject.standardY, charObject.standardImgPath, charObject.standardStepLength, charObject.maxJumpHeight, charObject.specialAmmoParts);
    }else { char = new Char(widthUnit, heightUnit, widthUnit, 25*heightUnit, './graphics/main-char/run/run-right-0.png', widthUnit/6, 4*heightUnit, 0); }
}

function createAmmo(x, y, width, height, imagePath, decreaseLifeAmount) {
    charObjects.ammo.push(new Ammo(x, y, width, height, imagePath, decreaseLifeAmount));
}

function createPlatforms() {
    platforms.push(new Platform(0, 26*heightUnit, 5*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(5*widthUnit, 26*heightUnit, 5*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(10*widthUnit, 26*heightUnit, 5*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(15*widthUnit, 26*heightUnit, 5*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(20*widthUnit, 26*heightUnit, 5*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(25*widthUnit, 26*heightUnit, 5*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(30*widthUnit, 26*heightUnit, 5*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(35*widthUnit, 26*heightUnit, 5*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(40*widthUnit, 26*heightUnit, 5*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(154*widthUnit, 26*heightUnit, 2*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-2.png'));
    platforms.push(new Platform(158*widthUnit, 26*heightUnit, widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(162*widthUnit, 26*heightUnit, 3*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-3.png'));
    platforms.push(new Platform(168*widthUnit, 26*heightUnit, 4*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-4.png'));
    platforms.push(new Platform(5*widthUnit, 26*heightUnit, widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(10*widthUnit, 20*heightUnit, 2*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-2.png'));
    platforms.push(new Platform(20*widthUnit, 20*heightUnit, 5*widthUnit, heightUnit, './graphics/platforms/non-moving-length-5.png'));
    platforms.push(new Platform(5*widthUnit, 11*heightUnit, 4*widthUnit, 0.5*heightUnit, './graphics/walls/ground/ground-tile-length-4.png'));
    platforms.push(new Platform(40*widthUnit, 23*heightUnit, 3*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-3.png'));
    platforms.push(new Platform(41*widthUnit, 17*heightUnit, widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(39*widthUnit, 13*heightUnit, 5*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(38*widthUnit, 12*heightUnit, widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(36*widthUnit, 10*heightUnit, widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(34*widthUnit, 8*heightUnit, widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(32*widthUnit, 6*heightUnit, widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(30*widthUnit, 4*heightUnit, widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(25*widthUnit, 4*heightUnit, 5*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(22*widthUnit, 4*heightUnit, 3*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-3.png'));
    platforms.push(new Platform(45*widthUnit, 12*heightUnit, 3*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-3.png'));
    platforms.push(new Platform(64*widthUnit, 10*heightUnit, 3*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-3.png'));
    platforms.push(new Platform(67*widthUnit, 8*heightUnit, widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(69*widthUnit, 6*heightUnit, widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-1.png'));
    platforms.push(new Platform(71*widthUnit, 4*heightUnit, 5*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(56*widthUnit, 19*heightUnit, 5*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-5.png'));
    platforms.push(new Platform(64*widthUnit, 16*heightUnit, 3*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-3.png'));
    platforms.push(new Platform(70*widthUnit, 19*heightUnit, 5*widthUnit, heightUnit, './graphics/walls/ground/ground-tile-length-5.png'));
    createMovingPlatforms();
}

function createMovingPlatforms() {
    platforms.push(new MovingPlatform(3*widthUnit, heightUnit, 11*widthUnit, 19*widthUnit, 17*heightUnit, 17*heightUnit, 17*heightUnit, './graphics/walls/ground/ground-tile-length-3.png', true));
    platforms.push(new MovingPlatform(3*widthUnit, 0.5*heightUnit, widthUnit, widthUnit, 5*heightUnit, 15*heightUnit, 5*heightUnit, './graphics/walls/ground/ground-tile-length-3.png'));
    platforms.push(new MovingPlatform(2*widthUnit, heightUnit, 6*widthUnit, 10*widthUnit, 24*heightUnit, 23*heightUnit, 23*heightUnit, './graphics/walls/ground/ground-tile-length-2.png', true));
    platforms.push(new MovingPlatform(4*widthUnit, heightUnit, 14*widthUnit, 14*widthUnit, 9*heightUnit, 15*heightUnit, 15*heightUnit, './graphics/walls/ground/ground-tile-length-4.png', false));
    platforms.push(new MovingPlatform(2*widthUnit, 0.25*heightUnit, 35.5*widthUnit, 42*widthUnit, 20*heightUnit, 20*heightUnit, 20*heightUnit, './graphics/walls/ground/ground-tile-length-2.png', true));
    platforms.push(new MovingPlatform(2*widthUnit, 0.25*heightUnit, 41.5*widthUnit, 48*widthUnit, 20*heightUnit, 20*heightUnit, 20*heightUnit, './graphics/walls/ground/ground-tile-length-2.png', true));
    platforms.push(new MovingPlatform(3*widthUnit, heightUnit, 48*widthUnit, 58*widthUnit, 12*heightUnit, 12*heightUnit, 12*heightUnit, './graphics/walls/ground/ground-tile-length-3.png', true));
    platforms.push(new MovingPlatform(2*widthUnit, heightUnit, 59*widthUnit, 65*widthUnit, 12*heightUnit, 12*heightUnit, 12*heightUnit, './graphics/walls/ground/ground-tile-length-2.png', true));
}

function createTraps() {
    hitables.traps.push(new Trap(5*widthUnit, 25*heightUnit, widthUnit, heightUnit, './graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 2));
    hitables.traps.push(new Trap(6*widthUnit, 25*heightUnit, widthUnit, heightUnit, './graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 2));
    hitables.traps.push(new Trap(11*widthUnit, 25*heightUnit, widthUnit, heightUnit, './graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, true, false, -1, 8, 6));
    hitables.traps.push(new Trap(5.125*widthUnit, 10.25*heightUnit, 0.75*widthUnit, 0.75*heightUnit, './graphics/traps/saws/round.png', 'round-saw', '', 25, true, false, -1));
    hitables.traps.push(new Trap(8.125*widthUnit, 10.25*heightUnit, 0.75*widthUnit, 0.75*heightUnit, './graphics/traps/saws/round.png', 'round-saw', '', 25, true, false, -1));
    hitables.traps.push(new Trap(38*widthUnit, 11*heightUnit, widthUnit, heightUnit, './graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 2));
    hitables.traps.push(new Trap(34*widthUnit, 7*heightUnit, widthUnit, heightUnit, './graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 2));
    hitables.traps.push(new Trap(30*widthUnit, 3*heightUnit, widthUnit, heightUnit, './graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 2));
    hitables.traps.push(new Trap(45*widthUnit, 11*heightUnit, widthUnit, heightUnit, './graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 2));
    hitables.traps.push(new Trap(12*widthUnit, 16*heightUnit, widthUnit, heightUnit, './graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, true, true, 35, 8, 0));
    hitables.traps.push(new Trap(2.125*widthUnit, 10.25*heightUnit, 0.75*widthUnit, 0.75*heightUnit, './graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 25, true, true, 36, 8, 0));
}

function createEnemies() {
    if(localStorage.enemies) {
        let enemy;
        let enemiesJson = JSON.parse(localStorage.enemies);
        enemiesJson.forEach((elem)=>{
            if(elem.enemyType === "green") {
                enemy = new GreenEnemy(elem.standardX, elem.standardY, elem.width, elem.height, elem.enemyType, elem.standardImgPath, elem.decreaseLifeAmount, elem.canShoot, elem.lookingDirection, elem.lifeAmount, elem.distanceToSeeChar, elem.canWalk, elem.hitImagesAmount, elem.attackingImagesAmount);
            }else if(elem.enemyType === "shooter") {
                    enemy = new Shooter(elem.standardX, elem.standardY, elem.width, elem.height, elem.enemyType, elem.decreaseLifeAmount, elem.canShoot, elem.lookingDirection, elem.lifeAmount, elem.distanceToSeeChar, elem.canWalk, elem.hitImagesAmount, elem.attackingImagesAmount);
            }else if(elem.enemyType === "big-boss") {
                enemy = new BigBoss(elem.standardX, elem.standardY, elem.width, elem.height, elem.enemyType, elem.decreaseLifeAmount, elem.canShoot, elem.lookingDirection, 1000, 32*widthUnit, elem.canWalk, elem.hitImagesAmount, elem.attackingImagesAmount);
                bigBoss = enemy;
            }
            console.log(enemy.image);
            hitables.enemies.push(enemy);
        })
    }
}

function createNewEnemies() {
    hitables.enemies.push(new GreenEnemy(25*widthUnit, 24*heightUnit, 2*widthUnit, 2*heightUnit, 'green', './graphics/enemies/green/attack/attack-left-0.png', 25, false, 'left', 150, 15*widthUnit, true, 5, 12));
    hitables.enemies.push(new GreenEnemy(35*widthUnit, 24*heightUnit, 2*widthUnit, 2*heightUnit, 'green', './graphics/enemies/green/attack/attack-left-0.png', 25, false, 'left', 150, 15*widthUnit, true, 5, 12));
    hitables.enemies.push(new GreenEnemy(40*widthUnit, 24*heightUnit, 2*widthUnit, 2*heightUnit, 'green', './graphics/enemies/green/attack/attack-left-0.png', 25, false, 'left', 150, 15*widthUnit, true, 5, 12));
    hitables.enemies.push(new BigBoss(86*widthUnit, 0, 10*widthUnit, 20*heightUnit, 'big-boss', 120, true, 'left', 1000, 50*widthUnit, false, 5, 7));
    hitables.enemies.push(new Shooter(21*widthUnit, 19*heightUnit, widthUnit, heightUnit, 'shooter', 60, true, 'left', 100, 32*widthUnit, true, 5, 7));
    hitables.enemies.push(new Shooter(41*widthUnit, 16*heightUnit, widthUnit, heightUnit, 'shooter', 60, true, 'left', 100, 4*widthUnit, false, 5, 7));
    hitables.enemies.push(new Shooter(24*widthUnit, 2.5*heightUnit, 1.5*widthUnit, 1.5*heightUnit, 'shooter', 60, true, 'right', 100, 5*widthUnit, true, 5, 7));
    bigBoss = hitables.enemies[3];
}

function createNewItems() {
    items.lifeIncreasing.push(new LifeIncreaser(6.25*widthUnit, 25*heightUnit, 1.5*widthUnit, 1.5*heightUnit, './graphics/items/heart.png', 'life-increaser', 75));
    items.lifeIncreasing.push(new LifeIncreaser(6.25*widthUnit, 9.5*heightUnit, 1.5*widthUnit, 1.5*heightUnit, './graphics/items/heart.png', 'life-increaser', 75));
    items.specialAmmo.push(new SpecialAmmoKit(1.5*widthUnit, 0.5*heightUnit, widthUnit, heightUnit, './graphics/items/special-ammo/rotation-0.png', 'ammo-kit'));
    items.lifeIncreasing.push(new LifeIncreaser(41.25*widthUnit, 22.5*heightUnit, 0.5*widthUnit, 0.5*heightUnit, './graphics/items/heart.png', 'life-increaser', 25));
    items.lifeIncreasing.push(new LifeIncreaser(39*widthUnit, 12*heightUnit, widthUnit, heightUnit, './graphics/items/heart.png', 'life-increaser', 50));
    items.lifeIncreasing.push(new LifeIncreaser(43*widthUnit, 12*heightUnit, widthUnit, heightUnit, './graphics/items/heart.png', 'life-increaser', 50));
    items.specialAmmo.push(new SpecialAmmoKit(22*widthUnit, 3*heightUnit, widthUnit, heightUnit, './graphics/items/special-ammo/rotation-0.png', 'ammo-kit'));
    items.specialAmmo.push(new SpecialAmmoKit(58*widthUnit, 18*heightUnit, widthUnit, heightUnit, './graphics/items/special-ammo/rotation-0.png', 'ammo-kit'));
}

function createItems() {
    let itemsJson = JSON.parse(localStorage.items);
    let item;
    itemsJson.lifeIncreasing.forEach((elem)=>{
        item = new LifeIncreaser(elem.standardX, elem.standardY, elem.width, elem.height, elem.imagePath, elem.itemType, elem.increaseLifeAmount);
        items.lifeIncreasing.push(item);
    })
    itemsJson.specialAmmo.forEach((elem)=>{
        item = new SpecialAmmoKit(elem.standardX, elem.standardY, elem.width, elem.height, elem.imagePath, elem.itemType);
        items.specialAmmo.push(item);
    })
}

function presetMenuBarProperties() {
    menuBar.querySelector('.special-ammo .items-collected').innerHTML = `${3 - items.specialAmmo.length} / 3`;
    menuBar.querySelector('.defeated-enemies-amount').innerHTML = `${(7 - hitables.enemies.length) <= 0 ? 0 : (7 - hitables.enemies.length)}`;
    menuBar.querySelector('.life-amount .life-amount-bar .life-amount-bar-inner').style.width = `${100*char.healthAmount/char.maxHealthAmount}%`;
}

function setMenuBarProperties(menuType) {
    switch(menuType) {
        case "specialAmmo":
            menuBar.querySelector('.special-ammo .items-collected').innerHTML = `${3 - items.specialAmmo.length} / 3`;
            break;
        case "enemy":
            menuBar.querySelector('.defeated-enemies-amount').innerHTML = `${(7 - hitables.enemies.length) <= 0 ? 0 : (7 - hitables.enemies.length)}`;
            break;
        case "char":
            menuBar.querySelector('.life-amount .life-amount-bar .life-amount-bar-inner').style.width = `${100*char.healthAmount/char.maxHealthAmount}%`;
    }
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
    requestAnimationFrame(()=>{ drawElements(); });
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
        if (elem || elem.isAlive) { ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height); }
    })
    if (hitables.flyables.length) {
        hitables.flyables.forEach((elem) => {
            if (elem.inCanvas) { ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height); }
        })
    }
}

function drawItems() {
    items.lifeIncreasing.forEach((elem) => {
        if (!elem.collected) { ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height); }
    })
    items.specialAmmo.forEach((elem) => {
        if (!elem.collected) { ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height); }
    })
}

function drawChar() {
    if (char.isAlive) { ctx.drawImage(char.figImage, char.x, char.y, char.width, char.height); }
}

function drawCharObjects() {
    charObjects.ammo.forEach((elem) => {
        if (!elem.leftCanvas) { ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height); }
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
        } else if (event.key.toLowerCase() === "d") {
            createAmmo(char.movingDirection === "left" ? char.x : char.x+char.width, char.y+0.35*widthUnit, 0.5*widthUnit, 0.125*heightUnit, ammoImageSource, char.specialAmmoParts === 3 ? 200 : 30);
        } else if (event.key.toLowerCase() === "m") {
            gameSoundOnOffToggle();
        } else if (event.key.toLowerCase() === "f") {
            if(canCont.offsetWidth >= window.innerWidth) {
                turnOffFullScreen();
            }else {turnOnFullScreen(); }
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
        createAmmo(char.movingDirection === "left" ? char.x : char.x+char.width, char.y+0.005*canvas.offsetHeight, widthUnit, widthUnit, './graphics/enemies/shooter/attack/shoot.svg');
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
        checkIfBigBossVisible();
    }
}

function checkIfBigBossVisible() {
    if(bigBoss.x + bigBoss.width + canvas.offsetLeft - canCont.offsetWidth <= bigBoss.width/3) {
        bigBoss.animateShooting();
        bigBoss.isVisible = true;
    }else {
        bigBoss.isVisible = false;
        clearInterval(bigBoss.animateLevitationId);
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
        document.querySelector('.controls .volumebar-cont').addEventListener('mousemove', setWholeVolume);
    } else if (event.type === "mouseup" || event.type === "touchend") {
        controller['volume'].pressed = false;
        event.target.closest('.volumebar-cont').removeEventListener('mousemove', setWholeVolume);
        event.target.closest('.volumebar-cont').addEventListener('mouseup', setWholeVolume);
    }
}

let setWholeVolume = function setWholeVolumeFunc(event) {
    let volumeBarInner = event.target.closest('.volumebar').querySelector('.volumebar-inner');
    let volumeBarWidth = event.target.closest('.volumebar').offsetWidth;
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
    document.querySelector('.turn-fullscreen-on').classList.add('disNone');
    document.querySelector('.controls').classList.add('disNone');
    document.querySelector('.turn-fullscreen-off').classList.remove('disNone');
    resizeElements();
}

function turnOffFullScreen() {
    document.querySelector('.turn-fullscreen-on').classList.remove('disNone');
    document.querySelector('.controls').classList.remove('disNone');
    document.querySelector('.turn-fullscreen-off').classList.add('disNone');
    resizeElements();
}

function sizeElements(scaleFactor) {
    fullScreenButtonToggle(canCont.offsetHeight === window.innerHeight);
    widthUnit *= scaleFactor;
    heightUnit *= scaleFactor;
    resizeCanvasProperties(scaleFactor);
    resizePlatformsProperties(scaleFactor);
    resizeBackgroundsProperties(scaleFactor);
    resizeHitablesProperties(scaleFactor);
    resizeCharProperties(scaleFactor);
    resizeItemsProperties(scaleFactor);
}

function resizeElements() {
    let scaleFactor = setScreenProperties();
    fullScreenButtonToggle(canCont.offsetHeight === window.innerHeight);
    resizeCanvasProperties(scaleFactor);
    resizePlatformsProperties(scaleFactor);
    resizeBackgroundsProperties(scaleFactor);
    resizeHitablesProperties(scaleFactor);
    resizeCharProperties(scaleFactor);
    resizeItemsProperties(scaleFactor);
    sizeMenuBarProperties();
}

function setScreenProperties() {
    let oldCancontSize = parseFloat(canCont.offsetWidth);
    canCont.style.width = canCont.offsetWidth === window.innerWidth ? `${0.8*window.innerWidth}px` : `${window.innerWidth}px`;
    canCont.style.height = canCont.offsetHeight === window.innerHeight ? `${7.2*canCont.offsetWidth/16}px` : `${9*canCont.offsetWidth/16}px`;
    let scaleFactor = parseFloat(canCont.style.width)/oldCancontSize;
    widthUnit *= scaleFactor;
    heightUnit *= scaleFactor;
    return scaleFactor;
}

function fullScreenButtonToggle(inFullscreen) {
    if(inFullscreen) {
        document.querySelector('.turn-fullscreen-on').classList.add('disNone');
        document.querySelector('.turn-fullscreen-off').classList.remove('disNone');
    }else {
        document.querySelector('.turn-fullscreen-on').classList.remove('disNone');
        document.querySelector('.turn-fullscreen-off').classList.add('disNone');
    }
}

function resizeCanvasProperties(scaleFactor) {
    canvas.setAttribute("width", 2*canCont.offsetWidth);
    canvas.setAttribute("height", canCont.offsetHeight);
}

function resizeBackgroundsProperties(scaleFactor) {
    backgrounds.forEach((elem)=>{
        elem.width *= scaleFactor;
        elem.height *= scaleFactor;
    })
}

function resizePlatformsProperties(scaleFactor) {
    platforms.forEach((elem)=>{
        elem.x *= scaleFactor;
        elem.y *= scaleFactor;
        elem.width *= scaleFactor;
        elem.height *= scaleFactor;
        if(elem.isMoving) {
            elem.startingXPos *= scaleFactor;
            elem.endingXPos *= scaleFactor;
            elem.heighestPoint *= scaleFactor;
            elem.lowestPoint *= scaleFactor;
        }
    })
}

function resizeHitablesProperties(scaleFactor) {
    hitables.enemies.forEach((elem)=>{
        elem.x *= scaleFactor;
        elem.standardX *= scaleFactor;
        elem.y *= scaleFactor;
        elem.standardY *= scaleFactor;
        elem.standardWidth *= scaleFactor;
        elem.width *= scaleFactor;
        elem.standardHeight *= scaleFactor;
        elem.height *= scaleFactor;
    })
    hitables.traps.forEach((elem)=>{
        elem.x *= scaleFactor;
        elem.standardX *= scaleFactor;
        elem.y *= scaleFactor;
        elem.standardY *= scaleFactor;
        elem.standardWidth *= scaleFactor;
        elem.width *= scaleFactor;
        elem.standardHeight *= scaleFactor;
        elem.height *= scaleFactor;
        elem.startingXPos *= scaleFactor;
    })
    hitables.flyables.forEach((elem)=>{
        elem.x *= scaleFactor;
        elem.standardX *= scaleFactor;
        elem.y *= scaleFactor;
        elem.standardY *= scaleFactor;
        elem.width *= scaleFactor;
        elem.height *= scaleFactor;
    })
}

function resizeCharProperties(scaleFactor) {
    char.x *= scaleFactor;
    char.y *= scaleFactor;
    char.width *= scaleFactor;
    char.height *= scaleFactor;
    char.standardStepLength *= scaleFactor;
    char.jumpFallStepHeight *= scaleFactor;
    char.maxJumpHeight *= scaleFactor;
}

function resizeItemsProperties(scaleFactor) {
    items.lifeIncreasing.forEach((elem)=>{
        elem.x *= scaleFactor;
        elem.standardX *= scaleFactor;
        elem.y *= scaleFactor;
        elem.standardY *= scaleFactor;
        elem.width *= scaleFactor;
        elem.height *= scaleFactor;
    })
    items.specialAmmo.forEach((elem)=>{
        elem.x *= scaleFactor;
        elem.standardX *= scaleFactor;
        elem.y *= scaleFactor;
        elem.standardY *= scaleFactor;
        elem.width *= scaleFactor;
        elem.height *= scaleFactor;
    })
}

function sizeMenuBarProperties() {
    document.querySelector('.canvas-cont .menu-bar').style.width = `${10*widthUnit}px`;
    document.querySelector('.canvas-cont .menu-bar').style.height = `${heightUnit}px`;
    document.querySelectorAll('.canvas-cont .menu-bar img').forEach((elem)=>{
        elem.style.height = `${0.8*heightUnit}px`;
    })
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
        char.scrollingStepAmount = 0;
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

function resetGame() {
    clearCanvas();
    resizeElements();
}

function saveCharProperties() {
    localStorage.setItem("char", JSON.stringify(char));    
}

function saveNotCollectedItems() {
    let notCollected = {
        lifeIncreasing: [],
        specialAmmo: []
    };
    items.specialAmmo.forEach((elem)=>{
        if(!elem.collected) { notCollected.specialAmmo.push(elem); }
    });
    items.lifeIncreasing.forEach((elem)=>{
        if(!elem.collected) { notCollected.lifeIncreasing.push(elem); }
    });
    localStorage.setItem("items", JSON.stringify(notCollected));
    //saveGameJaon();
    
}

function saveNotDefeatedEnemies() {
    let notDefeated = [];
    hitables.enemies.forEach((elem)=>{
        if(elem.isAlive) { notDefeated.push(elem); }
    });
    localStorage.setItem("enemies", JSON.stringify(notDefeated));
    hitables.enemies = notDefeated;
}

function saveGameJson() {
    gameJson.char = char;
}

function allAmmoKitsCollected() {
    if(char.specialAmmoParts === 3) {
        ammoImageSource = './graphics/main-char/ammo/laser-special.svg';
        char.shootingSound = './sounds/special-shooting-sound.png';
    }
}