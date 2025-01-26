function pauseAllPlayers() {
    hitables.enemies.forEach((elem) => {
        if (elem.hittingSound.currentTime > 0) { elem.hittingSound.pause(); }
        if (elem.shootingSound && elem.shootingSound.currentTime > 0) { elem.shootingSound.pause(); }
        if (elem.fallingSound && elem.fallingSound.currentTime > 0) { elem.fallingSound.pause(); }
    });
    hitables.flyables.forEach((elem) => {
        if (elem.shootingSound && elem.shootingSound.currentTime > 0) { elem.shootingSound.pause(); }
    });
    if (char.hittingSound.currentTime > 0) { char.hittingSound.pause(); }
    if (char.shootingSound.currentTime > 0) { char.shootingSound.pause(); }
    if (bgPlayer) { bgPlayer.pause(); }
}

function playAllPlayers() {
    hitables.enemies.forEach((elem) => {
        if (elem.hittingSound.currentTime > 0) { elem.hittingSound.play(); }
        if (elem.shootingSound && elem.shootingSound.currentTime > 0) { elem.shootingSound.play(); }
        if (elem.fallingSound && elem.fallingSound.currentTime > 0) { elem.fallingSound.play(); }
    });
    if (char.hittingSound.currentTime > 0) { char.hittingSound.play(); }
    if (char.shootingSound.currentTime > 0) { char.shootingSound.play(); }
    if (bgPlayer) { bgPlayer.play(); };
}

async function turnOnFullScreen() {
    inFullscreen = true;
    setScreenProperties();
    window.removeEventListener('resize', showHideRotateScreen);
    document.querySelector('.canvas-cont .controls').classList.add('disNone');
    document.querySelector('.canvas-cont .turn-fullscreen-on').classList.add('disNone');
    document.querySelector('.canvas-cont .turn-fullscreen-off').classList.remove('disNone');
    document.querySelector('.game-headline').classList.add('disNone');
    await body.requestFullscreen().then(() => {
        fullscreenButtonPressed = false;
        fullScreenButtonToggle();
    })
}

async function turnOffFullScreen() {
    inFullscreen = false;
    setScreenProperties();
    document.querySelector('.canvas-cont .controls').classList.add('disNone');
    document.querySelector('.canvas-cont .turn-fullscreen-on').classList.remove('disNone');
    document.querySelector('.canvas-cont .turn-fullscreen-off').classList.add('disNone');
    document.querySelector('.game-headline').classList.remove('disNone');
    await document.exitFullscreen().then(() => {
        fullscreenButtonPressed = false;
        fullScreenButtonToggle();
    })
}

function setScreenProperties() {
    if(inFullscreen) {
        canCont.style.width = `${screen.width}px`;
        canCont.style.height = `${screen.height}px`;
    }else {
        canCont.style.width = `${0.7 * screen.width}px`;
        canCont.style.height = `${0.7 * screen.height}px`;
    }
    canvas.setAttribute('width', 32*canCont.offsetHeight/9);
    canvas.setAttribute('height', canCont.offsetHeight);
}

function fullScreenButtonToggle() {
    if (inFullscreen) {
        document.querySelector('.turn-fullscreen-on').classList.add('disNone');
        document.querySelector('.turn-fullscreen-off').classList.remove('disNone');
    } else {
        document.querySelector('.turn-fullscreen-on').classList.remove('disNone');
        document.querySelector('.turn-fullscreen-off').classList.add('disNone');
    }
    resizeCanvasProperties();
}

function resizeCanvasProperties() {
    canvas.setAttribute("width", inFullscreen ? 2*screen.width : 2*canCont.offsetWidth);
    canvas.setAttribute("height", inFullscreen ? screen.height : canCont.offsetHeight);
    if(inFullscreen) {
        canvas.style.left = `${parseFloat(canvas.style.left)/0.7}px`;
    }else { canvas.style.left = `${parseFloat(canvas.style.left)*0.7}px`; }
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
    resizeEnemies();
    resizeTraps();
    resizeFlyables();
    resizeCharProperties();
}

function resizeEnemies() {
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
}

function resizeTraps() {
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
}

function resizeFlyables() {
    hitables.flyables.forEach((elem)=>{
        elem.x *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardX *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.y *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardY *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.width *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.height *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    })
}

function resizeCharProperties() {
    char.x *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    char.y *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    char.floorPosition *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    char.width *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    char.height *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    char.stepLength *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    char.standardStepLength *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    char.jumpFallStepHeight *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    char.maxJumpHeight *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    resizeItemsProperties();
}

function resizeItemsProperties() {
    resizeLifeIncreaser();
    resizeSpecialAmmoParts();
}

function resizeLifeIncreaser() {
    items.lifeIncreasing.forEach((elem)=>{
        elem.x *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardX *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.y *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardY *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.width *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.height *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    })
}

function resizeSpecialAmmoParts() {
    items.specialAmmo.forEach((elem)=>{
        elem.x *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardX *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.y *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.standardY *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.width *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.height *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    })
}

function sizeMenuBarProperties() {
    document.querySelector('.canvas-cont .menu-bar').style.width = `${10*widthUnit}px`;
    document.querySelector('.canvas-cont .menu-bar').style.height = `${heightUnit}px`;
    document.querySelectorAll('.canvas-cont .menu-bar img').forEach((elem)=>{
        elem.style.height = `${0.7*heightUnit}px`;
    })
}

function pausePlayGameToggle() {
    if (gamePaused) {
        gamePaused = false;
        keysUnheld = false;
        playAllPlayers();
    } else {
        gamePaused = true;
        keysUnheld = true;
        pauseAllPlayers();
        unholdAllKeys();
    }
}

function pauseGame() {
    gamePaused = true;
    keysUnheld = true;
    pauseAllPlayers();
    unholdAllKeys();
}

function unpauseGame() {
    gamePaused = false;
    keysUnheld = false;
    playAllPlayers();
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
    let startingOffset = parseFloat(canvas.style.left);
    if(char.isAlive) {
        if(parseFloat(canvas.style.left) === startingOffset) { unholdAllKeys(); }
        keysBlockedForShifting = true;
        canvas.style.left = `${parseFloat(canvas.style.left) + widthUnit/3}px`;
        pauseGame();
        if(parseFloat(canvas.style.left) >= 0) {
            whenCanvasIsShiftedBack();
            return;
        }
    }else {clearInterval(shiftingCanvasBackAnimationId); }
    return;
}

function whenCanvasIsShiftedBack() {
    canvas.style.left = '0px';
    resetCharPosition();
    keysBlockedForShifting = false;
    char.stepLength = char.standardStepLength;
    unpauseGame();
    clearInterval(shiftingCanvasBackAnimationId);
}

function resetCharPosition() {
    console.log(widthUnit, heightUnit);
    char.x = widthUnit;
    char.y = char.floorPosition;
    slowDownChar();
}

async function resetGame() {
    await clearLocalStorage().then(()=>{
        location.reload();
    }).catch((err)=>{ throw err; });
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

function allAmmoKitsCollected() {
    if(char.specialAmmoParts === 3) {
        char.shootingSound = './sounds/special-shooting-sound.png';
    }
}

function canContControlsToggle() {
    if(controlsBar.classList.contains('disNone')) {
        controlsBar.classList.remove('disNone');
        if(!description.classList.contains('disNone')) {
            hideDescription();
            return;
        }else if(!gamePaused) { pausePlayGameToggle(); }
    }else {
        controlsBar.classList.add('disNone');
        if(!description.classList.contains('disNone')) {
            return;
        }else if(gamePaused){ pausePlayGameToggle(); }
    }
}

function showDescription() {
    openDescription.classList.add('disNone');
    closeDescription.classList.remove('disNone');
    description.classList.remove('disNone');
    if(!controlsBar.classList.contains('disNone')) {
        canContControlsToggle();
        return;
    }else { pausePlayGameToggle(); }
}

function hideDescription() {
    openDescription.classList.remove('disNone');
    closeDescription.classList.add('disNone');
    description.classList.add('disNone');
    if(!controlsBar.classList.contains('disNone')) {
        return;
    }else { pausePlayGameToggle(); }
    localStorage.setItem('reloaded', JSON.stringify(true));
}