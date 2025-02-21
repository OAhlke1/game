let canvas; /** @var canvas is the DOM-element of the game-canvas */
let ctx; /** @var ctx is the context of the canvas */
let char; /** @var {Char} char is the char */
let widthUnit; /** @var {number} widthUnit is the basic unit for the width */
let controller; /** @var controller is the game controller */
let bgPlayer; /** @var {Audio} is the DOM-element of the audio-player */
let canCont; /** @var canCont is the parent-container of the canvas */
let bigBoss; /** @var {BigBoss} is the last enemy */
let shiftingCanvasBackAnimationId; /** @var {number} shiftingCanvasBackAnimationId is the id for the animation that scrolls the canvas back to 0 */
let standardFrameRate = 12; /** @var {number} standardFrameRate is the standard interval frequency */
let gameVolume = 0.5; /** @var {number} is the standard volume of the game */
let t = -1; /** @var {number} t is the amount of seconds before the game pauses because nothing is done */
let ratioSmallBigScreenHeight = 0.7; /** @var ratioSmallBigScreenHeight is the ratio of the height of @var canCont and the screen height */
let gamePaused = false; /** @var {boolean} gamePaused says wether the game is paused or not */
let gameMuted = false; /** @var {boolean} gameMuted says wether the game is muted or not */
let inFullscreen = false; /** @var {boolean} inFullscreen says wether the game is in fullscreen or not */
let fullscreenButtonPressed = false; /** @var {boolean} fullscreenButtonPressed says wether the fullscreen-button is pressed or not */
let keysBlockedForShifting = false; /** @var {boolean} keysBlockedForShifting says wether the keys are blocked or not */
let keysUnheld; /** @var {boolean} keysUnheld says wether any key is pressed or not ????????????????????????? */
let platforms = []; /** @var {Platforms} is the array of the platforms */
let backgrounds = []; /** @var {Backgrounds} is the array of the backgrounds */
let charObjects = {
    ammo: [] /** @var ammo is the array of the char ammos that has been shot */
}; /** @var {JSON} charObjects is the JSON for all the char object-arrays. */
let hitables = {
    traps: [],  /** @var traps is the array of the traps */
    enemies: [], /** @var enemies is the array of the enemies */
    flyables: [] /** @var flyables is the array of the ammo of the enemies */
}; /** @var {JSON} hitables is the JSON for all traps, enemies and enemies ammos */
let items = {
    lifeIncreasing: [], /** @var lifeIncreasing is the array of the heart-items */
    specialAmmo: [] /** @var specialAmmo is the array of the special-ammo-parts */
}; /** @var {JSON} items is the JSON for all the items */
let body = document.querySelector('body'); /** @var {DOM} body is the documents body */
let menuBar = document.querySelector('.menu-bar'); /** @var {DOM} menuBar is the documents body */
let controlsBar = document.querySelector('.canvas-cont .controls'); /** @var {DOM} controlsBar is the controls-bar */
let description = document.querySelector('.description'); /** @var {DOM} description is the game-description */
let openDescription = document.querySelector('.open-description'); /** @var {DOM} openDescription is the button to open the description */
let closeDescription = document.querySelector('.close-description'); /** @var {DOM} openDescription is the button to close the description */
let rotateDeviceScreen = document.querySelector('.rotate-device-screen'); /** @var {DOM} rotateDeviceScreen is the advice-screen to rotate the screen */
let gameReloaded; /** @var {boolean} gameReloaded says wether the game has been loaded in the past or not. If not, the description is shown automatically. Otherwise its hidden. */

/**
 * 
 * @function initFunction invokes all the functions that set up the game
 */
function initFunctions() {
    loadBasicValues();
    creator();
    if(!gameReloaded) { showDescription(); }
    addEventListeners();
    pausePlayGameToggle();
}

/**
 * 
 * @function autoStartMovingWithPlatform lets the char move with the platform when the chars last position before closing the game was on a moving platform.
 */
function autoStartMovingWithPlatform() {
    if(platforms[char.standingPlatformIndex].sideways) {
        char.onMovingPlatform = true;
        char.x = platforms[char.standingPlatformIndex].x;
    }else { char.y = platforms[char.standingPlatformIndex].y; }
    char.movingWithPlatformAnimationId = setInterval(()=>{ char.movingWithPlatform(); }, standardFrameRate);
}

/**
 * 
 * @function loadBasicValues sets the @var gamePaused to true the @var gameReloaded (when no value for gameReloaded is saved in the browsers local storage, its value is false by default)
 */
function loadBasicValues() {
    gamePaused = true;
    gameReloaded = localStorage.reloaded ? JSON.parse(localStorage.reloaded) : false;
    if(screen.width < screen.height) { rotateDeviceScreen.classList.remove('disNone'); }
}

/**
 * 
 * @function creator invokes all the functions that create the game elements
 */
function creator() {
    createScreen();
    setScreenProperties();
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

/**
 * 
 * @function addEventListeners sets all the event-listeners to the @var body
 */
function addEventListeners() {
    document.addEventListener('click', ()=>{ if(!bgPlayer) { loadBackgroundPlayer(); }}); /** for chrome because in chrome a sound is not played before the user interacts with the browser */
    document.addEventListener('blur', ()=>{ pauseGame(); }); /** when the browsers window is not focused, the game pauses. Because of popups in windows */
    document.addEventListener('focus', ()=>{
        if(document.querySelector('.controls').classList.contains('disNone') && document.querySelector('.description').classList.contains('disNone')) { unpauseGame(); }
        unholdAllKeys();
    });
    window.addEventListener('resize', showRotateScreen);
}

/** 
 * 
 * @function showRotateScreen shows the advice-screen that the 
 */
function showRotateScreen() {
    if(window.innerWidth < screen.height) {
        pausePlayGameToggle();
        rotateDeviceScreen.classList.remove('disNone');
    }
}

/**
 * 
 * @function clearLocalStorage removes all stored items (except the value of gameReloaded) from the browsers local-storage.
 */
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

/**
 * 
 * @function setSizeUnits sets the width- and height-unit.
 */
function setSizeUnits() {
    heightUnit = canCont.offsetHeight/27;
    widthUnit = heightUnit;
}

/**
 * 
 * @function loadBackgroundPlayer loads the DOM-element for the background-music into the @var bgPlayer and sets the players attributes
 * and finally plays the player.
 */
function loadBackgroundPlayer() {
    bgPlayer = new Audio();
    bgPlayer.src = './sounds/background.mp3';
    bgPlayer.volume = gameVolume;
    bgPlayer.loop = true;
    bgPlayer.volume = 0.125;
    bgPlayer.play();
}

/**
 * 
 * @function createScreen loads the canvas parent DOM into @var canCont and the canvas into @var canvas and sets the sizes of the canvas
 * according to the width and height of @var canCont
 */
function createScreen() {
    canCont = document.querySelector('.canvas-cont');
    canvas = document.querySelector('canvas');
    canvas.setAttribute('width', 2*canCont.offsetWidth);
    canvas.setAttribute('height', canCont.offsetHeight);
    ctx = canvas.getContext('2d');
}

/**
 * 
 * @function createBackgrounds creates the backgrounds
 */
function createBackgrounds() {
    backgrounds.push(new Background(0, 0, canCont.offsetWidth, canCont.offsetHeight, './graphics/background/background.jpg'));
}

/**
 * 
 * @function createChar creates the char
 */
function createChar() {
    let charObject; /** @var {JSON} charObject contains the JSON element of the char when the respective char-attributes are saved in the browsers local storage.
                    It stores the chars coordinates, life-amount and the amount of collected special-ammo-parts */
    if(localStorage.char) { charObject = JSON.parse(localStorage.char); }
    char = new Char(widthUnit, heightUnit, localStorage.char ? charObject.x : widthUnit, localStorage.char ? charObject.y : 25*heightUnit, './graphics/main-char/run/run-right-0.png', widthUnit/6, 4.5*heightUnit, charObject ? charObject.specialAmmoParts : 0, charObject ? charObject.healthAmount : 200, charObject ? charObject.onMovingPlatform : false, charObject ? charObject.standingPlatformIndex : 0);
    createHittingCharImagesArrays();
}

/** 
 * 
 * @function createHittingCharImagesArrays stores the images of the hit char into the arrays. Two array because the char can look either left or right.
 */
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

/**
 * 
 * @function createRunningCharImagesArrays stores the images of the running char into the chars @var {JSON} runImages.left and @var {JSON} runImages.right
 * because the char can look either left or right
 */
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

/**
 * 
 * @function createRunningCharImagesArrays stores the images of the jumping char into the chars @var {JSON} jumpImages.left and @var {JSON} jumpImages.right
 * because the char can look either left or right 
 */
function createJumpingCharImages() {
    let jumpLeft = new Image();
    let jumpRight = new Image();
    jumpLeft.src = './graphics/main-char/jump/jump-left.png';
    jumpRight.src = './graphics/main-char/jump/jump-right.png';
    char.jumpingImages.left = jumpLeft;
    char.jumpingImages.right = jumpRight;
    createCharAmmoImages();
}
/**
 * 
 * @function createRunningCharImagesArrays stores the images of the chars ammo into the chars @var {JSON} ammoImages.ammo and @var {JSON} ammoImages.specialAmmo
 */
function createCharAmmoImages() {
    let ammoImage = new Image();
    let specialAmmoImage = new Image();
    ammoImage.src = './graphics/main-char/ammo/laser.svg';
    specialAmmoImage.src = './graphics/main-char/ammo/laser-special.svg';
    char.ammoImages.ammo = ammoImage;
    char.ammoImages.specialAmmo = specialAmmoImage;
    setMenuBarProperties("char");
}

/**
 * 
 * @param {number} x is the starting x-coordinate of the chars ammo
 * @param {number} y is the y-coordinate of the chars ammo
 * @param {number} width is the ammos width
 * @param {number} height is the ammos height
 * @param {string} image is the image-path of the ammo-image
 * @param {number} decreaseLifeAmount is the life-amount the ammo subtracts from an enemy when the ammo hits one
 */
function createCharAmmo(x, y, width, height, image, decreaseLifeAmount) {
    charObjects.ammo.push(new Ammo(x, y, width, height, image, decreaseLifeAmount));
}

/**
 * 
 * @function createPlatforms invokes all the platform-creating functions
 */
function createPlatforms() {
    createBottomPlatforms();
    createNonMovingPlatforms();
    createMovingPlatforms();
}

/**
 * 
 * @function createBottomPlatforms creates the bottom-elements
 */
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

/**
 * 
 * @function createNonMovingPlatforms creates the platforms that are not moving
 */
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

/**
 * 
 * @function createNonMovingPlatforms creates the platforms that are moving
 */
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

/**
 * 
 * @function createPlatforms invokes all the trap-creating functions
 */
function createTraps() {
    createStingingTraps();
    createSaws();
    createStingTrapAnimationImages();
}

/**
 * 
 * @function createStingingTraps creates the sting-traps
 */
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

/**
 * 
 * @function createStingingTraps creates the saws
 */
function createSaws() {
    hitables.traps.push(new Trap(5.125*widthUnit, 10.25*heightUnit, 0.75*widthUnit, 0.75*heightUnit, './graphics/traps/saws/round.png', 'round-saw', '', 25, true, false, -1));
    hitables.traps.push(new Trap(8.125*widthUnit, 10.25*heightUnit, 0.75*widthUnit, 0.75*heightUnit, './graphics/traps/saws/round.png', 'round-saw', '', 25, true, false, -1));
}

/**
 * 
 * @function createStingTrapAnimationImages stores the animation-images of each sting-trap into the respective sting-trap (@var {number} i is the index of the trap-array)
 * @var {number} j is the index of each animation index (there are always 8)
 */
function createStingTrapAnimationImages() {
    for(let i=0; i<hitables.traps.length; i++) {
        if(hitables.traps[i].trapType === "sting-coming-out") {
            for(let j=0; j<8; j++) {
                let animationImage = new Image(); /** @var {Image} is the DOM-element of the sting-image for animation-index @var {number} j */
                animationImage.src = `./graphics/traps/stings/sting-coming-out-${hitables.traps[i].orientation}-${j}.png`;
                hitables.traps[i].animationImages[hitables.traps[i].orientation].push(animationImage);
            }
        }
    }
}

/**
 * 
 * @function createEnemies creates the enemies
 */
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

/**
 * 
 * @function createEnemiesHitImagesArrays stores the hitting-animation-images of each enemy into the respective @var {array} hitImagesArrays.left and @var {array} hitImagesArrays.right
 * because the enemy can either look left or right.
 * (@var {number} i is the index of the enemy) and
 * @var {number} j is the index of each animation index (there are always 8)
 */
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

/**
 * 
 * @function createEnemiesAttackingImagesArrays stores the hitting-animation-images of each enemy into the respective @var {array} attackingImagesArrays.left and @var {array} attackingImagesArrays.right
 * because the enemy can either look left or right.
 * (@var {number} i is the index of the enemy) and
 * @var {number} j is the index of each animation index (there are always 8)
 */
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

/**
 * 
 * @function setEnemiesAliveAndDangerousProperties checks the enemies @var {boolean} alive and @var {boolean} dangerous stored to the browsers local-storage
 * because only the alive and dangerous enemies are considered.
 */
function setEnemiesAliveAndDangerousProperties() {
    if(localStorage.enemies) {
        alive = JSON.parse(localStorage.enemies);
        for(let i=0; i<hitables.enemies.length; i++) {
            hitables.enemies[i].isAlive = alive[i];
            hitables.enemies[i].isDangerous = alive[i];
        }
    }
}

/**
 * 
 * @function createItems invokes the items-creating functions.
 * It then sets the @var {boolean} collected of each @var {Item} item to true or false, depending on the value in @var collected
 * The reason is that the already collected items shall not be collectable again after reloading the game, because only the´items
 * that are not collected are considered.
 */
function createItems() {
    let collected; /** @var {JSON} collected stores the item-JSON when it is set to the browsers local-storage */
    createLifeIncreasingItems();
    createSpecialAmmoKitParts();
    if(localStorage.items) {
        collected = JSON.parse(localStorage.items);
        for(let i=0; i<items.lifeIncreasing.length; i++) { items.lifeIncreasing[i].collected = collected.lifeIncreasing[i]; }
        for(let i=0; i<items.specialAmmo.length; i++) { items.specialAmmo[i].collected = collected.specialAmmo[i]; }
    }
    createSpecialAmmosAnimationImages();
}

/**
 * 
 * @function createLifeIncreasingItems creates the heart-items
 */
function createLifeIncreasingItems() {
    items.lifeIncreasing.push(new LifeIncreaser(6.25*widthUnit, 25*heightUnit, 1.5*widthUnit, 1.5*heightUnit, './graphics/items/heart.png', 'life-increaser', 75));
    items.lifeIncreasing.push(new LifeIncreaser(6.25*widthUnit, 9.5*heightUnit, 1.5*widthUnit, 1.5*heightUnit, './graphics/items/heart.png', 'life-increaser', 75));
    items.lifeIncreasing.push(new LifeIncreaser(41.25*widthUnit, 22.5*heightUnit, 0.5*widthUnit, 0.5*heightUnit, './graphics/items/heart.png', 'life-increaser', 25));
    items.lifeIncreasing.push(new LifeIncreaser(39*widthUnit, 12*heightUnit, widthUnit, heightUnit, './graphics/items/heart.png', 'life-increaser', 50));
    items.lifeIncreasing.push(new LifeIncreaser(43*widthUnit, 12*heightUnit, widthUnit, heightUnit, './graphics/items/heart.png', 'life-increaser', 50));
}

/**
 * 
 * @function createLifeIncreasingItems creates the special-ammo-parts
 */
function createSpecialAmmoKitParts() {
    items.specialAmmo.push(new SpecialAmmoKit(1.5*widthUnit, 0.5*heightUnit, widthUnit, heightUnit, './graphics/items/special-ammo/rotation-0.png', 'ammo-kit'));
    items.specialAmmo.push(new SpecialAmmoKit(22*widthUnit, 3*heightUnit, widthUnit, heightUnit, './graphics/items/special-ammo/rotation-0.png', 'ammo-kit'));
    items.specialAmmo.push(new SpecialAmmoKit(58*widthUnit, 18*heightUnit, widthUnit, heightUnit, './graphics/items/special-ammo/rotation-0.png', 'ammo-kit'));
}