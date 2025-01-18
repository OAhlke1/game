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