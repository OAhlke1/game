function checkIfBigBossVisible() {
    if (bigBoss.x + canvas.offsetLeft - canCont.offsetWidth <= bigBoss.width / 3) {
        bigBoss.isVisible = true;
        bigBoss.animateShooting();
    } else { bigBoss.isVisible = false; }
}

function setMenubarPosition() {
    menubar.x = canvas.offsetLeft - canCont.offsetLeft + canCont.offsetWidth;
    menubarBackground.x = canvas.offsetLeft - canCont.offsetLeft + canCont.offsetWidth;
}

function setCanvasSize() {
    canvas.style.width = `${2 * canCont.offsetWidth}px`;
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
    let volumeBarInner = event.target.closest('.volumebar-cont').querySelector('.volumebar-inner');
    let volumeBarWidth = event.target.closest('.volumebar-cont').offsetWidth;
    let x = event.clientX;
    gameVolume = ((x - volumeBarInner.getBoundingClientRect().left) / volumeBarWidth) >= 0 ? ((x - volumeBarInner.getBoundingClientRect().left) / volumeBarWidth) : 0;
    gameVolume = gameVolume > 1 ? 1 : gameVolume;
    volumeBarInner.style.width = `${100 * (x - volumeBarInner.getBoundingClientRect().left) / volumeBarWidth}%`;
    if (!document.querySelector('.mute-game').classList.contains('muted')) { audioPlayer.forEach((elem) => { elem.volume = gameVolume; }); }
}

function gameSoundToggle() {
    if (!gameMuted) {
        document.querySelector('.mute-game').classList.add('muted');
        audioPlayer.forEach((elem) => { elem.volume = 0; });
        muteAllPlayers();
        gameMuted = true;
    } else {
        document.querySelector('.mute-game').classList.remove('muted');
        unmuteAllPlayers();
        gameMuted = false;
    }
}

function muteAllPlayers() {
    hitables.enemies.forEach((elem) => {
        elem.hittingSound.volume = 0;
        if (elem.shootingSound) { elem.shootingSound.volume = 0; }
        if (elem.fallingSound) { elem.fallingSound.volume = 0; }
    });
    char.hittingSound.volume = 0;
    char.shootingSound.volume = 0;
    bgPlayer.volume = 0;
}

function unmuteAllPlayers() {
    hitables.enemies.forEach((elem) => {
        elem.hittingSound.volume = 0.5;
        if (elem.shootingSound) { elem.shootingSound.volume = 0.5; }
        if (elem.fallingSound) { elem.fallingSound.volume = 0.5; }
    });
    char.hittingSound.volume = 0.5;
    char.shootingSound.volume = 0.5;
    bgPlayer.volume = 0.125;
}

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
        canCont.style.width = `${window.innerWidth}px`;
        canCont.style.height = `${screen.height}px`;
    }else {
        canCont.style.width = `${0.7 * window.innerWidth}px`;
        canCont.style.height = `${0.7 * screen.height}px`;
    }
    setSizeUnits();
    canvas.setAttribute('width', 96*widthUnit);
    canvas.setAttribute('height', 27*heightUnit);
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
    canvas.setAttribute("width", 96*widthUnit);
    canvas.setAttribute("height", 27*heightUnit);
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
    char.x = widthUnit;
    char.y = 25*heightUnit;
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

function startSavingChar() {
    if(char && !char.hasDoneAnything) {
        char.hasDoneAnything = true;
        saveCharProperties();
    }
}

function saveCharProperties() {
    let charProps = {
        healthAmount: char.healthAmount,
        specialAmmoParts: char.specialAmmoParts,
        x: inFullscreen ? char.x * ratioSmallBigScreenHeight : char.x,
        y: inFullscreen ? char.y * ratioSmallBigScreenHeight : char.y,
        onMovingPlatform: char.onMovingPlatform,
        standingPlatformIndex: char.standingPlatformIndex
    }
    localStorage.setItem("char", JSON.stringify(charProps));    
    setTimeout(saveCharProperties, 1000);
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