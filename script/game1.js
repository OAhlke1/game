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
let ratioSmallBigScreenHeight = 1;
let oldWindowHeight = window.innerHeight;
let gamePaused = false;
let gameMuted = false;
let inFullscreen = false;
let pageJustLoaded = true;
let fullscreenButtonPressed = false;
let keysBlockedForShifting = false;
let inWideScreenMode = false;
let afterRotatingDevice;
let keysUnheld;
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
    loadBasicValues();
    creator();
    if(!gameReloaded) { showDescription(); }
    addEventListeners();
    gamePaused = false;
}

function loadBasicValues() {
    if(screen.width < screen.height) { document.querySelector('.rotate-device-screen').classList.remove('disNone'); }
    afterRotatingDevice = localStorage.afterRotatingDevice ? true : false;
    gameReloaded = localStorage.reloaded ? JSON.parse(localStorage.reloaded) : false;
}

function creator() {
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
}

function addEventListeners() {
    window.addEventListener('click', ()=>{ if(!bgPlayer) { loadPlayer(); }});
    document.addEventListener('blur', ()=>{ pauseGame(); });
    document.addEventListener('focus', ()=>{
        if(document.querySelector('.controls').classList.contains('disNone') && document.querySelector('.description').classList.contains('disNone')) { unpauseGame(); }
        unholdAllKeys();
    });
    window.addEventListener('resize', showHideRotateScreen);
}

function showHideRotateScreen() {
    if(screen.width < screen.height) {
        pausePlayGameToggle();
        setScreenProperties();
        document.querySelector('.rotate-device-screen').classList.remove('disNone');
    }else if(oldWindowHeight >= window.innerHeight) { location.reload(); }
}

function clearLocalStorage() {
    return new Promise((resolve, reject)=>{
        localStorage.removeItem('char');
        localStorage.removeItem('enemies');
        localStorage.removeItem('items');
        if(!localStorage.char && !localStorage.enemies && !localStorage.items) {
            resolve(true);
        }else {reject( new Error('Local storage not cleared!')); }
    })
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
    createBottomPlatforms();
    createNonMovingPlatforms();
    createMovingPlatforms();
}

function createBottomPlatforms() {
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
}

function createNonMovingPlatforms() {
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
    createStingingTraps();
    createSaws();
    createTrapAnimationImages();
}

function createStingingTraps() {
    hitables.traps.push(new Trap(5*widthUnit, 25*heightUnit, widthUnit, heightUnit, './graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 2));
    hitables.traps.push(new Trap(6*widthUnit, 25*heightUnit, widthUnit, heightUnit, './graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 2));
    hitables.traps.push(new Trap(11*widthUnit, 25*heightUnit, widthUnit, heightUnit, './graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, true, false, -1, 8, 6));
    hitables.traps.push(new Trap(38*widthUnit, 11*heightUnit, widthUnit, heightUnit, './graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 2));
    hitables.traps.push(new Trap(34*widthUnit, 7*heightUnit, widthUnit, heightUnit, './graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 2));
    hitables.traps.push(new Trap(30*widthUnit, 3*heightUnit, widthUnit, heightUnit, './graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 2));
    hitables.traps.push(new Trap(45*widthUnit, 11*heightUnit, widthUnit, heightUnit, './graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, false, false, 0, 8, 2));
    hitables.traps.push(new Trap(12*widthUnit, 16*heightUnit, widthUnit, heightUnit, './graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 15, true, true, 35, 8, 0));
    hitables.traps.push(new Trap(2.125*widthUnit, 10.25*heightUnit, 0.75*widthUnit, 0.75*heightUnit, './graphics/traps/stings/sting-coming-out-btt-0.png', 'sting-coming-out', "btt", 25, true, true, 36, 8, 0));
}

function createSaws() {
    hitables.traps.push(new Trap(5.125*widthUnit, 10.25*heightUnit, 0.75*widthUnit, 0.75*heightUnit, './graphics/traps/saws/round.png', 'round-saw', '', 25, true, false, -1));
    hitables.traps.push(new Trap(8.125*widthUnit, 10.25*heightUnit, 0.75*widthUnit, 0.75*heightUnit, './graphics/traps/saws/round.png', 'round-saw', '', 25, true, false, -1));
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
    hitables.enemies.push(new GreenEnemy(25*widthUnit, 24*heightUnit, 2*widthUnit, 2*heightUnit, 'green', 25, false, 'left', 150, 15*widthUnit, true, 5, 12));
    hitables.enemies.push(new GreenEnemy(35*widthUnit, 24*heightUnit, 2*widthUnit, 2*heightUnit, 'green', 25, false, 'left', 150, 15*widthUnit, true, 5, 12));
    hitables.enemies.push(new GreenEnemy(40*widthUnit, 24*heightUnit, 2*widthUnit, 2*heightUnit, 'green', 25, false, 'left', 150, 15*widthUnit, true, 5, 12));
    hitables.enemies.push(new BigBoss(86*widthUnit, 0, 10*widthUnit, 20*heightUnit, 'big-boss', 120, true, 'left', 1000, 70*widthUnit/3, false, 5, 7));
    hitables.enemies.push(new Shooter(21*widthUnit, 19*heightUnit, widthUnit, heightUnit, 'shooter', 60, true, 'left', 100, 2*widthUnit, true, 5, 7));
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
    createLifeIncreasingItems();
    createSpecialAmmoKitParts();
    if(localStorage.items) {
        collected = JSON.parse(localStorage.items);
        for(let i=0; i<items.lifeIncreasing.length; i++) { items.lifeIncreasing[i].collected = collected.lifeIncreasing[i]; }
        for(let i=0; i<items.specialAmmo.length; i++) { items.specialAmmo[i].collected = collected.specialAmmo[i]; }
    }
    createSpecialAmmosAnimationImages();
}

function createLifeIncreasingItems() {
    items.lifeIncreasing.push(new LifeIncreaser(6.25*widthUnit, 25*heightUnit, 1.5*widthUnit, 1.5*heightUnit, './graphics/items/heart.png', 'life-increaser', 75));
    items.lifeIncreasing.push(new LifeIncreaser(6.25*widthUnit, 9.5*heightUnit, 1.5*widthUnit, 1.5*heightUnit, './graphics/items/heart.png', 'life-increaser', 75));
    items.lifeIncreasing.push(new LifeIncreaser(41.25*widthUnit, 22.5*heightUnit, 0.5*widthUnit, 0.5*heightUnit, './graphics/items/heart.png', 'life-increaser', 25));
    items.lifeIncreasing.push(new LifeIncreaser(39*widthUnit, 12*heightUnit, widthUnit, heightUnit, './graphics/items/heart.png', 'life-increaser', 50));
    items.lifeIncreasing.push(new LifeIncreaser(43*widthUnit, 12*heightUnit, widthUnit, heightUnit, './graphics/items/heart.png', 'life-increaser', 50));
}

function createSpecialAmmoKitParts() {
    items.specialAmmo.push(new SpecialAmmoKit(1.5*widthUnit, 0.5*heightUnit, widthUnit, heightUnit, './graphics/items/special-ammo/rotation-0.png', 'ammo-kit'));
    items.specialAmmo.push(new SpecialAmmoKit(22*widthUnit, 3*heightUnit, widthUnit, heightUnit, './graphics/items/special-ammo/rotation-0.png', 'ammo-kit'));
    items.specialAmmo.push(new SpecialAmmoKit(58*widthUnit, 18*heightUnit, widthUnit, heightUnit, './graphics/items/special-ammo/rotation-0.png', 'ammo-kit'));
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