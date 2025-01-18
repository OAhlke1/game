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
let shiftingCanvasBackAnimationId;
let canContWidthSmall;
let standardFrameRate = 12;
let gameVolume = 0.5;
let t = -1;
let gamePaused = false;
let gameMuted = false;
let inFullscreen = false;
let pageJustLoaded = true;
let ratioSmallBigScreenHeight;
let aspectRatio;
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
let body = document.querySelector('body');
let menuBar = document.querySelector('.menu-bar');
let controlsBar = document.querySelector('.canvas-cont .controls');
let description = document.querySelector('.description');
let openDescription = document.querySelector('.open-description');
let closeDescription = document.querySelector('.close-description');
let gameReloaded;

function initFunctions() {
    gamePaused = true;
    gameReloaded = localStorage.reloaded ? JSON.parse(localStorage.reloaded) : false;
    loadPlayer();
    createScreen();
    setScreenProperties();
    setSizeUnits();
    createBackgrounds();
    if(!char) { createChar(); }
    addKeypressMovingCommands();
    if(platforms.length === 0) { createPlatforms(); }
    if(hitables.traps.length === 0) { createTraps(); }
    if(hitables.enemies.length === 0) { createEnemies(); }
    createItems();
    presetMenuBarProperties();
    drawElements();
    sizeMenuBarProperties();
    if(!gameReloaded) {
        showDescription();
    }else { gamePaused = false; }
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
}

function createGameJson() {
    gameJson = {
        screenDimensions: gameJson.screenDimensions,
        hitables: {
            enemies: hitables.enemies
        },
        items: items
    };
}

function setSizeUnits() {
    aspectRatio = screen.height/screen.width;
    heightUnit = canCont.offsetHeight/27;
    widthUnit = heightUnit;
    ratioSmallBigScreenHeight = canCont.offsetHeight/screen.height;
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
    canContWidthSmall = canCont.offsetWidth;
}

function createBackgrounds() {
    backgrounds.push(new Background(0, 0, canCont.offsetWidth, canCont.offsetHeight, './graphics/background/background.jpg'));
}

function createChar() {
    let charObject;
    if(localStorage.char) { charObject = JSON.parse(localStorage.char); }
    char = new Char(widthUnit, heightUnit, widthUnit, 25*heightUnit, './graphics/main-char/run/run-right-0.png', widthUnit/6, 4.5*heightUnit, charObject ? charObject.specialAmmoParts : 0, charObject ? charObject.healthAmount : 200);
    createHittingCharImagesArrays();
}

function createHittingCharImagesArrays() {
    for(let i=0; i<char.hitImagesAmount; i++) {
        hitImageLeft = new Image();
        hitImageLeft.src = `./graphics/main-char/hit/hit-left-${i}.png`;
        char.hitImagesArrays.left.push(hitImageLeft);
        hitImageRight = new Image();
        hitImageRight.src = `./graphics/main-char/hit/hit-right-${i}.png`;
        char.hitImagesArrays.right.push(hitImageRight);
    }
    createRunningCharImagesArrays();
}

function createRunningCharImagesArrays() {
    for(let i=0; i<12; i++) {
        runImageLeft = new Image();
        runImageLeft.src = `./graphics/main-char/run/run-left-${i}.png`;
        char.runImagesArrays.left.push(runImageLeft);
        runImageRight = new Image();
        runImageRight.src = `./graphics/main-char/run/run-right-${i}.png`;
        char.runImagesArrays.right.push(runImageRight);
    }
    createJumpingCharImages();
}

function createJumpingCharImages() {
    let jumpLeft = new Image();
    let jumpRight = new Image();
    jumpLeft.src = './graphics/main-char/jump/jump-left.png';
    jumpRight.src = './graphics/main-char/jump/jump-right.png';
    char.jumpingImages.left = jumpLeft;
    char.jumpingImages.right = jumpRight;
    createCharAmmoImages();
}

function createCharAmmoImages() {
    let ammoImage = new Image();
    let specialAmmoImage = new Image();
    ammoImage.src = './graphics/main-char/ammo/laser.svg';
    specialAmmoImage.src = './graphics/main-char/ammo/laser-special.svg';
    char.ammoImages.ammo = ammoImage;
    char.ammoImages.specialAmmo = specialAmmoImage;
    setMenuBarProperties("char");
}

function createCharAmmo(x, y, width, height, image, decreaseLifeAmount) {
    charObjects.ammo.push(new Ammo(x, y, width, height, image, decreaseLifeAmount));
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
    createTrapAnimationImages();
}

function createTrapAnimationImages() {
    for(let i=0; i<hitables.traps.length; i++) {
        if(hitables.traps[i].trapType === "sting-coming-out") {
            for(let j=0; j<8; j++) {
                let animationImage = new Image();
                animationImage.src = `./graphics/traps/stings/sting-coming-out-${hitables.traps[i].orientation}-${j}.png`;
                hitables.traps[i].animationImages[hitables.traps[i].orientation].push(animationImage);
            }
        }
    }
}

function createEnemies() {
    let alive;
    hitables.enemies.push(new GreenEnemy(25*widthUnit, 24*heightUnit, 2*widthUnit, 2*heightUnit, 'green', './graphics/enemies/green/attack/attack-left-0.png', 25, false, 'left', 150, 15*widthUnit, true, 5, 12));
    hitables.enemies.push(new GreenEnemy(35*widthUnit, 24*heightUnit, 2*widthUnit, 2*heightUnit, 'green', './graphics/enemies/green/attack/attack-left-0.png', 25, false, 'left', 150, 15*widthUnit, true, 5, 12));
    hitables.enemies.push(new GreenEnemy(40*widthUnit, 24*heightUnit, 2*widthUnit, 2*heightUnit, 'green', './graphics/enemies/green/attack/attack-left-0.png', 25, false, 'left', 150, 15*widthUnit, true, 5, 12));
    hitables.enemies.push(new BigBoss(86*widthUnit, 0, 10*widthUnit, 20*heightUnit, 'big-boss', 120, true, 'left', 1000, 50*widthUnit/3, false, 5, 7));
    hitables.enemies.push(new Shooter(21*widthUnit, 19*heightUnit, widthUnit, heightUnit, 'shooter', 60, true, 'left', 100, 32*widthUnit, true, 5, 7));
    hitables.enemies.push(new Shooter(41*widthUnit, 16*heightUnit, widthUnit, heightUnit, 'shooter', 60, true, 'left', 100, 4*widthUnit, false, 5, 7));
    hitables.enemies.push(new Shooter(24*widthUnit, 2.5*heightUnit, 1.5*widthUnit, 1.5*heightUnit, 'shooter', 60, true, 'right', 100, 5*widthUnit, true, 5, 7));
    bigBoss = hitables.enemies[3];
    createEnemiesHitImagesArrays();
}

function createEnemiesHitImagesArrays() {
    for(let i=0; i<hitables.enemies.length; i++) {
        for(let j=0; j<hitables.enemies[i].hitImagesAmount; j++) {
            let hitImageLeft = new Image();
            hitImageLeft.src = `./graphics/enemies/${hitables.enemies[i].enemyType}/hit/hit-left-${j}.png`;
            hitables.enemies[i].hitImagesArrays.left.push(hitImageLeft);
            let hitImageRight = new Image();
            hitImageRight.src = `./graphics/enemies/${hitables.enemies[i].enemyType}/hit/hit-right-${j}.png`;
            hitables.enemies[i].hitImagesArrays.right.push(hitImageRight);
        }
    }
    createEnemiesAttackingImagesArrays();
}

function createEnemiesAttackingImagesArrays() {
    for(let i=0; i<hitables.enemies.length; i++) {
        for(let j=0; j<hitables.enemies[i].attackingImagesAmount; j++) {
            let attackingImageLeft = new Image();
            attackingImageLeft.src = `./graphics/enemies/${hitables.enemies[i].enemyType}/attack/attack-left-${j}.png`;
            hitables.enemies[i].attackingImagesArrays.left.push(hitImageLeft);
            let attackingImageRight = new Image();
            attackingImageRight.src = `./graphics/enemies/${hitables.enemies[i].enemyType}/attack/attack-right-${j}.png`;
            hitables.enemies[i].attackingImagesArrays.right.push(attackingImageRight);
        }
    }
    setEnemiesAliveAndDangerousProperties();
}

function setEnemiesAliveAndDangerousProperties() {
    if(localStorage.enemies) {
        alive = JSON.parse(localStorage.enemies);
        for(let i=0; i<hitables.enemies.length; i++) {
            hitables.enemies[i].isAlive = alive[i];
            hitables.enemies[i].isDangerous = alive[i];
        }
    }
}

function createItems() {
    let collected;
    items.lifeIncreasing.push(new LifeIncreaser(6.25*widthUnit, 25*heightUnit, 1.5*widthUnit, 1.5*heightUnit, './graphics/items/heart.png', 'life-increaser', 75));
    items.lifeIncreasing.push(new LifeIncreaser(6.25*widthUnit, 9.5*heightUnit, 1.5*widthUnit, 1.5*heightUnit, './graphics/items/heart.png', 'life-increaser', 75));
    items.specialAmmo.push(new SpecialAmmoKit(1.5*widthUnit, 0.5*heightUnit, widthUnit, heightUnit, './graphics/items/special-ammo/rotation-0.png', 'ammo-kit'));
    items.lifeIncreasing.push(new LifeIncreaser(41.25*widthUnit, 22.5*heightUnit, 0.5*widthUnit, 0.5*heightUnit, './graphics/items/heart.png', 'life-increaser', 25));
    items.lifeIncreasing.push(new LifeIncreaser(39*widthUnit, 12*heightUnit, widthUnit, heightUnit, './graphics/items/heart.png', 'life-increaser', 50));
    items.lifeIncreasing.push(new LifeIncreaser(43*widthUnit, 12*heightUnit, widthUnit, heightUnit, './graphics/items/heart.png', 'life-increaser', 50));
    items.specialAmmo.push(new SpecialAmmoKit(22*widthUnit, 3*heightUnit, widthUnit, heightUnit, './graphics/items/special-ammo/rotation-0.png', 'ammo-kit'));
    items.specialAmmo.push(new SpecialAmmoKit(58*widthUnit, 18*heightUnit, widthUnit, heightUnit, './graphics/items/special-ammo/rotation-0.png', 'ammo-kit'));
    if(localStorage.items) {
        collected = JSON.parse(localStorage.items);
        for(let i=0; i<items.lifeIncreasing.length; i++) { items.lifeIncreasing[i].collected = collected.lifeIncreasing[i]; }
        for(let i=0; i<items.specialAmmo.length; i++) { items.specialAmmo[i].collected = collected.specialAmmo[i]; }
    }
    createSpecialAmmosAnimationImages();
}

function createSpecialAmmosAnimationImages() {
    for(let i=0; i<items.specialAmmo.length; i++) {
        for(let j=0; j<7; j++) {
            let rotationImage = new Image();
            rotationImage.src = `./graphics/items/special-ammo/rotation-${j}.png`;
            items.specialAmmo[i].rotationImages.push(rotationImage);
        }
    }
}

function presetMenuBarProperties() {
    menuBar.querySelector('.special-ammo .items-collected').innerHTML = `${char.specialAmmoParts}/3`;
    menuBar.querySelector('.defeated-enemies-amount').innerHTML = `${(7 - hitables.enemies.length) <= 0 ? 0 : (7 - hitables.enemies.length)}`;
    menuBar.querySelector('.life-amount .life-amount-bar .life-amount-bar-inner').style.width = `${100*char.healthAmount/char.maxHealthAmount}%`;
}

function setMenuBarProperties(menuType) {
    switch(menuType) {
        case "specialAmmo":
            menuBar.querySelector('.special-ammo .items-collected').innerHTML = `${char.specialAmmoParts}/3`;
            break;
        case "enemy":
            menuBar.querySelector('.defeated-enemies-amount').innerHTML = `${(7 - hitables.enemies.length) <= 0 ? 0 : (7 - hitables.enemies.length)}`;
            break;
        case "char":
            menuBar.querySelector('.life-amount .life-amount-bar .life-amount-bar-inner').style.width = `${100*char.healthAmount/char.maxHealthAmount}%`;
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, 2*canCont.offsetWidth, canCont.offsetHeight);
    debugger;
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
        if (elem.isAlive) { ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height); }
    })
    if (hitables.flyables.length) {
        hitables.flyables.forEach((elem) => {
            if (elem.inCanvas) { ctx.drawImage(elem.ammoImage, elem.x, elem.y, elem.width, elem.height); }
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
    body.dispatchEvent(keyPressEvent);
}

function dispatchKeypressStop(event) {
    const keyUpEvent = new KeyboardEvent('keyup', {
        key: event.target.closest('.touch-control').getAttribute('button-type'),
        code: event.target.closest('.touch-control').getAttribute('button-type'),
        keyCode: +event.target.closest('.touch-control').getAttribute('button-code'),
        bubbles: true
    });
    body.dispatchEvent(keyUpEvent);
}

function addKeypressMovingCommands() {
    setController();
    body.addEventListener('keydown', async (event) => {
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
        } else if (event.key.toLowerCase() === "m") {
            gameSoundOnOffToggle();
        } else if(event.key.toLowerCase() === "f" && !inFullscreen) {
            turnOnFullScreen();
        }
    });
    body.addEventListener('keyup', (event) => {
        if (event.key === "ArrowLeft") {
            controller['left'].pressed = false;
            clearInterval(char.movingAnimationId);
        } else if (event.key === "ArrowRight") {
            controller['right'].pressed = false;
            clearInterval(char.movingAnimationId);
        } else if (event.key === "Shift") {
            controller['run'].pressed = false;
            slowDownChar();
        } else if (event.key.toLowerCase() === "d" && char.isAlive) {
            createCharAmmo(char.movingDirection === "left" ? char.x : char.x+char.width, char.y+0.35*widthUnit, 0.75*widthUnit, 0.25*heightUnit, char.specialAmmoParts === 3 ? char.ammoImages.specialAmmo : char. ammoImages.ammo, char.specialAmmoParts === 3 ? 200 : 30);
        } else if (event.key === "Escape" && inFullscreen) { turnOffFullScreen(); }
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
        char.movingAnimationId = setInterval(()=>{ char.moveLeft("ArrowLeft"); }, standardFrameRate);
    }
}

function initStepLeftTouch() {
    if (controller['left'].pressed) {
        //char.moveLeftTouch("ArrowLeft");
        char.movingAnimationId = setInterval(()=>{ char.moveLeftTouch("ArrowLeft"); }, standardFrameRate);
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
        //char.moveRight("ArrowRight");
        char.movingAnimationId = setInterval(()=>{ char.moveRight("ArrowRight"); }, standardFrameRate);
    }
}

function initStepRightTouch() {
    if (controller['right'].pressed) {
        //char.moveRightTouch("ArrowRight");
        char.movingAnimationId = setInterval(()=>{ char.moveRightTouch("ArrowRight"); }, standardFrameRate);
    }
}

function speedUpChar() {
    if(char.stepLength/char.standardStepLength >= 1.5) { return; }
    console.log(char.stepLength, controller['run'].pressed);
    char.stepLength *= 1.5;
}

function slowDownChar() {
    if(char.stepLength/char.standardStepLength <= 1) { return; }
    console.log(char.stepLength, controller['run'].pressed);
    char.stepLength /= 1.5;
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
        createCharAmmo(char.movingDirection === "left" ? char.x : char.x+char.width, char.y+0.35*widthUnit, 0.5*widthUnit, 0.125*heightUnit, char.specialAmmoParts === 3 ? char.ammoImages.specialAmmo : char. ammoImages.ammo, char.specialAmmoParts === 3 ? 200 : 30);
        document.querySelector('.touch-control.shoot').classList.remove('pressed');
        controller['shoot'].pressed = false;
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
    if(bigBoss.x + canvas.offsetLeft - canCont.offsetWidth <= bigBoss.width/3) {
        bigBoss.animateShooting();
        bigBoss.isVisible = true;
    }else {
        //bigBoss.isVisible = false;
        //clearInterval(bigBoss.animateLevitationId);
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

function showHideFullScreenMenuButton() {
    /* if(document.querySelector('.canvas-cont .canvas-cont-controls-toggle').classList.contains('disNone')) {
        document.querySelector('.canvas-cont .canvas-cont-controls-toggle').classList.remove('disNone');
    }else {
        document.querySelector('.canvas-cont .canvas-cont-controls-toggle').classList.add('disNone');
        document.querySelector('.canvas-cont .controls').classList.add('disNone');
    } */
    resetScreenProperties();
}

async function turnOnFullScreen() {
    inFullscreen = true;
    document.querySelector('.canvas-cont .controls').classList.add('disNone');
    document.querySelector('.canvas-cont .turn-fullscreen-on').classList.add('disNone');
    document.querySelector('.canvas-cont .turn-fullscreen-off').classList.remove('disNone');
    document.querySelector('.game-headline').classList.add('disNone');
    await body.requestFullscreen().then(()=>{
        canCont.style.width = inFullscreen ? `${screen.width}px` : '80vw';
        canCont.style.height = inFullscreen ? `${screen.height}px` : '45vw';
        gamePaused = false;
        showHideFullScreenMenuButton();
    })
}

async function turnOffFullScreen() {
    inFullscreen = false;
    canCont.style.width = `${0.7*screen.width}px`;
    canCont.style.height = `${0.7*screen.height}px`;
    document.querySelector('.canvas-cont .controls').classList.add('disNone');
    document.querySelector('.canvas-cont .turn-fullscreen-on').classList.remove('disNone');
    document.querySelector('.canvas-cont .turn-fullscreen-off').classList.add('disNone');
    document.querySelector('.game-headline').classList.remove('disNone');
    gamePaused = false;
    await document.exitFullscreen().then(()=>{
        gamePaused = false;
        showHideFullScreenMenuButton();
    })
}

function sizeElements() {
    setScreenProperties();
    standardFrameRate = inFullscreen ? standardFrameRate/ratioSmallBigScreenHeight : 12;
    fullScreenButtonToggle();
    //resizeCanvasProperties();
    resizePlatformsProperties();
    resizeBackgroundsProperties();
    resizeHitablesProperties();
    resizeCharProperties();
    resizeItemsProperties();
}

/* function resizeElements() {
    resetScreenProperties();
    //standardFrameRate = inFullscreen ? standardFrameRate/ratioSmallBigScreenHeight : 12;
}

function presetScreenProperties() {
    oldCancontSize = canCont.offsetWidth;
    canCont.style.width = window.innerWidth < 801 ? `${window.innerWidth}px` : `${0.7*window.innerWidth}px`;
    canCont.style.height = `${0.5625*parseInt(canCont.style.width)}px`;
    widthUnit *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    heightUnit *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    return ratioSmallBigScreenHeight;
} */

function setScreenProperties() {
    //aspectRatio = screen.height/screen.width;
    canCont.style.width = `${0.7*screen.width}px`;
    canCont.style.height = `${0.7*screen.height}px`;
    canvas.setAttribute('width', 2*canCont.offsetWidth);
    canvas.setAttribute('height', canCont.offsetHeight);
    /* heightUnit = canvas.offsetHeight/27;
    widthUnit = heightUnit/aspectRatio; */
}

function resetScreenProperties() {
    fullScreenButtonToggle();
}

function fullScreenButtonToggle() {
    if(inFullscreen) {
        document.querySelector('.turn-fullscreen-on').classList.add('disNone');
        document.querySelector('.turn-fullscreen-off').classList.remove('disNone');
    }else {
        document.querySelector('.turn-fullscreen-on').classList.remove('disNone');
        document.querySelector('.turn-fullscreen-off').classList.add('disNone');
    }
    resizeCanvasProperties();
}

function resizeCanvasProperties() {
    /* if(pageJustLoaded) {
        pageJustLoaded = false;
    }else if(inFullscreen) {  } */
    canvas.setAttribute("width", inFullscreen ? 2*screen.width : 2*canCont.offsetWidth);
    canvas.setAttribute("height", inFullscreen ? screen.height : canCont.offsetHeight);
    resizePlatformsProperties();
}

function resizePlatformsProperties() {
    platforms.forEach((elem)=>{
        elem.x *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.y *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.width *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.height *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        if(elem.isMoving) {
            elem.startingXPos *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
            elem.endingXPos *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
            elem.heighestPoint *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
            elem.lowestPoint *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        }
    })
    resizeBackgroundsProperties();
}

function resizeBackgroundsProperties() {
    backgrounds.forEach((elem)=>{
        elem.width *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.height *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    })
    resizeHitablesProperties();
}

function resizeHitablesProperties() {
    hitables.enemies.forEach((elem)=>{
        elem.x *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardX *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.y *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardY *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardWidth *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.width *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardHeight *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.height *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.distanceToSeeChar *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    })
    hitables.traps.forEach((elem)=>{
        elem.x *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardX *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.y *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardY *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardWidth *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.width *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardHeight *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.height *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.startingXPos *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    })
    hitables.flyables.forEach((elem)=>{
        elem.x *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardX *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.y *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardY *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.width *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.height *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    })
    resizeCharProperties();
}

function resizeCharProperties() {
    char.x *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    char.y *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    char.width *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    char.height *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    char.stepLength *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    char.standardStepLength *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    char.jumpFallStepHeight *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    char.maxJumpHeight *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    resizeItemsProperties();
}

function resizeItemsProperties() {
    items.lifeIncreasing.forEach((elem)=>{
        elem.x *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardX *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.y *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardY *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.width *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.height *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    })
    items.specialAmmo.forEach((elem)=>{
        elem.x *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardX *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.y *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardY *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.width *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.height *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    })
    sizeMenuBarProperties();
}

function sizeMenuBarProperties() {
    document.querySelector('.canvas-cont .menu-bar').style.width = `${10*widthUnit}px`;
    document.querySelector('.canvas-cont .menu-bar').style.height = `${heightUnit}px`;
    document.querySelectorAll('.canvas-cont .menu-bar img').forEach((elem)=>{
        elem.style.height = `${0.7*heightUnit}px`;
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

function shiftCanvasBack() {
    if(char.isAlive) {
        canvas.style.left = `${parseFloat(canvas.style.left) + widthUnit/3}px`;
        if(parseFloat(canvas.style.left) >= 0) {
            canvas.style.left = '0px';
            resetCharPosition();
            gamePaused = false;
            clearInterval(shiftingCanvasBackAnimationId);
            return;
        }
    }else { clearInterval(shiftingCanvasBackAnimationId); }
}

function resetCharPosition() {
    char.x = widthUnit;
    char.y = 25*heightUnit;
}

function resetGame() {
    clearLocalStorage();
    //shiftCanvasBack();
    //clearCanvas();
    //clearAllElements();
    //unholdAllKeys();
    //initFunctions();
    //if(inFullscreen) {
    //    sizeElements();
    //}
    location.reload();
    return;
    //document.querySelector('.you-win-screen').classList.add('disNone');
    //document.querySelector('.game-over-screen').classList.add('disNone');
}

function clearAllElements() {
    //resetChar();
    //clearEnemies();
    //resetItems();
}

function resetChar() {
    char.x = widthUnit;
    char.y = 25*heightUnit;
    char.healthAmount = char.maxHealthAmount;
    char.specialAmmoParts = 0;
    char.standingPlatformIndex = 0;
    char.isAlive = true;
    char.underGround = false;
    char.gotHit = false;
    char.isImmune = false;
    char.movingDirection = 'right';
}

function clearEnemies() {
    hitables.enemies.forEach((elem)=>{
        elem.isDangerous = false;
        elem.isAlive = false;
    })
    hitables.flyables.forEach((elem)=>{
        elem.isDangerous = false;
        elem.isAlive = false;
    })
    hitables.enemies = [];
    hitables.flyables = [];
}

function resetItems() {
    /* items.lifeIncreasing.forEach((elem)=>{
        elem.collected = false;
    })
    items.specialAmmo.forEach((elem)=>{
        elem.collected = false;
    }) */
    items.lifeIncreasing = [];
    items.specialAmmo = [];
}

function unholdAllKeys() {
    controller['left'].pressed = false;
    controller['right'].pressed = false;
    controller['jump'].pressed = false;
    controller['run'].pressed = false;
}

function saveCharProperties() {
    let charProps = {
        healthAmount: char.healthAmount,
        specialAmmoParts: char.specialAmmoParts
    }
    localStorage.setItem("char", JSON.stringify(charProps));    
}

function saveNotCollectedItems() {
    let collected = {
        lifeIncreasing: [],
        specialAmmo: []
    };
    items.specialAmmo.forEach((elem)=>{
        collected.specialAmmo.push(elem.collected);
    });
    items.lifeIncreasing.forEach((elem)=>{
        collected.lifeIncreasing.push(elem.collected);
    });
    localStorage.setItem("items", JSON.stringify(collected));
    
}

function saveNotDefeatedEnemies() {
    let alive = [];
    hitables.enemies.forEach((elem)=>{
        alive.push(elem.isAlive);
    });
    localStorage.setItem("enemies", JSON.stringify(alive));
    for(let i=0; i<hitables.enemies.length; i++) { hitables.enemies[i].isAlive = alive[i]; }
}

function saveGameJson() {
    gameJson.char = char;
}

function allAmmoKitsCollected() {
    if(char.specialAmmoParts === 3) {
        char.shootingSound = './sounds/special-shooting-sound.png';
    }
}

function canContControlsToggle() {
    if(controlsBar.classList.contains('disNone')) {
        controlsBar.classList.remove('disNone');
        if(!description.classList.contains('disNone')) {
            return;
        }else { gamePaused = true; }
    }else {
        controlsBar.classList.add('disNone');
        if(!description.classList.contains('disNone')) {
            return;
        }else { gamePaused = false; }
    }
}

function showDescription() {
    openDescription.classList.add('disNone');
    closeDescription.classList.remove('disNone');
    description.classList.remove('disNone');
    if(!controlsBar.classList.contains('disNone')) {
        return;
    }else { gamePaused = true; }
}

function hideDescription() {
    console.log('hideDescription');
    openDescription.classList.remove('disNone');
    closeDescription.classList.add('disNone');
    description.classList.add('disNone');
    if(!controlsBar.classList.contains('disNone')) {
        return;
    }else { gamePaused = false; }
    localStorage.setItem('reloaded', JSON.stringify(true));
}

function muteGame() {
    gameMuted = true;
}