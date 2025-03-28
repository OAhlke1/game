/**
 * 
 * @function whenKeysAreUsable invokes the function of the @param {event} event (the keydown event given to the function) and invokes the function
 * depending on the pressed key
 */
function whenKeysAreUsable(event) {
    if (event.key === "ArrowLeft") {
        goLeftPressed();
    } else if (event.key === "ArrowRight") {
        goRightPressed();
    } else if (event.key === " " && !char.jumps) {
        jumpPressed();
    } else if (event.key === "Shift") {
        runningKeyHeld();
    }
}

/**
 * 
 * @function goLeftPressed sets the @var {object} left of the @var {JSON} controller to true and invokes the function connected to it.
 * (Both only, when the left key is not pressed already)
 */
function goLeftPressed() {
    if (!controller['left'].pressed) {
        controller['left'].pressed = true;
        controller['left'].func();
    }
}

/**
 * 
 * @function goRightPressed sets the @var {object} right of the @var {JSON} controller to true and invokes the function connected to it.
 * (Both only, when the left key is not pressed already)
 */
function goRightPressed() {
    if (!controller['right'].pressed) {
        controller['right'].pressed = true;
        controller['right'].func();
    }
}

/**
 * 
 * @function jumpPressed sets the @var {object} jump of the @var {JSON} controller to true and invokes the function connected to it.
 * (Both only, when the left key is not pressed already)
 */
function jumpPressed() {
    if(!controller['jump'].pressed) {
        controller['jump'].pressed = true;
        controller['jump'].func();
    }
}

/**
 * 
 * @function runningKeyHeld sets the @var {object} run of the @var {JSON} controller to true and invokes the function connected to it.
 * (Both only, when the left key is not pressed already)
 */
function runningKeyHeld() {    
    controller['run'].pressed = true;
    controller['run'].func();
}

/**
 * 
 * @function setKeyUpEvents adds the keyup-events to the @var body
 */
function setKeyUpEvents() {
    body.addEventListener('keyup', (event) => {
        if (!keysUnheld && !keysBlockedForShifting) {
            if (event.key === "ArrowLeft") {
                controller['left'].pressed = false;
                clearInterval(char.movingAnimationId);
            } else if (event.key === "ArrowRight") {
                controller['right'].pressed = false;
                clearInterval(char.movingAnimationId);
            } else if (event.key === "Shift") {
                controller['run'].pressed = false;
                slowDownChar();
            } else if (event.key.toLowerCase() === "e" && char.isAlive && !gamePaused) {
                createCharAmmo(char.movingDirection === "left" ? char.x : char.x + char.width, char.y + 0.35 * widthUnit, 0.75 * widthUnit, 0.25 * heightUnit, char.specialAmmoParts === 3 ? 200 : 30);
            } else if (event.key === "Escape") { turnOffFullScreen(); }
        }
    });
}

/**
 * 
 * @function setController sets up the controller
 */
function setController() {
    controller = {
        "jump": {
            pressed: false,
            func: initJump
        }, "left": {
            pressed: false,
            func: initStepLeft
        }, "right": {
            pressed: false,
            func: initStepRight
        }, "run": {
            pressed: false,
            func: speedUpChar
        }, "volume": {
            pressed: false,
            func: checkVolumeBarEvent
        }
    }
}

/**
 * 
 * @function initJump intializes the jump of the char
 */
function initJump() {
    if (controller['jump'].pressed) {
        controller['jump'].pressed = false;
        char.startingYPos = char.y;
        char.jumps = false;
        char.checkIfJumping();
    }
}

/**
 * 
 * @function initStepLeft intializes the walking left of the char
 */
function initStepLeft() {
    if (controller['left'].pressed) {
        clearInterval(char.movingAnimationId);
        char.movingAnimationId = setInterval(() => {
            char.moveLeft("ArrowLeft");
        }, char.walkingFrameRate);
    }
}

/**
 * 
 * @function initStepLeftTouch intializes the walking left of the char when the button is touched
 */
function initStepLeftTouch() {
    if (controller['left'].pressed) {
        clearInterval(char.movingAnimationId);
        char.movingAnimationId = setInterval(() => { char.moveLeftTouch("ArrowLeft"); }, char.walkingFrameRate);
    }
}

/**
 * 
 * @function initStepRight intializes the walking right of the char
 */
function initStepRight() {
    if (controller['right'].pressed) {
        clearInterval(char.movingAnimationId);
        char.movingAnimationId = setInterval(() => {
            char.moveRight("ArrowRight"); }, char.walkingFrameRate);
    }
}

/**
 * 
 * @function initStepRightTouch intializes the walking right of the char when the button is touched
 */
function initStepRightTouch() {
    if (controller['right'].pressed) {
        clearInterval(char.movingAnimationId);
        char.movingAnimationId = setInterval(() => { char.moveRightTouch("ArrowRight"); }, char.walkingFrameRate);
    }
}

/**
 * 
 * @function speedUpChar makes the char run by increasing the chars @var {number} walkingFrameRate
 */
function speedUpChar() {
    if (char.walkingFrameRate <= 12) { return; }
    clearInterval(char.movingAnimationId);
    char.walkingFrameRate = 12;
    if(controller['left'].pressed) {
        char.movingAnimationId = setInterval(() => { char.moveLeftTouch("ArrowLeft"); }, char.walkingFrameRate);    
    }else if(controller['right'].pressed) {
        char.movingAnimationId = setInterval(() => { char.moveRightTouch("ArrowRight"); }, char.walkingFrameRate);
    }
}

/**
 * 
 * @function slowDownChar makes the char run by increasing the chars @var {number} walkingFrameRate to the standard value
 */
function slowDownChar() {
    if (char.walkingFrameRate >= 18) { return; }
    clearInterval(char.movingAnimationId);
    char.walkingFrameRate = 18;
    if(controller['left'].pressed) {
        char.movingAnimationId = setInterval(() => { char.moveLeftTouch("ArrowLeft"); }, char.walkingFrameRate);    
    }else if(controller['right'].pressed) {
        char.movingAnimationId = setInterval(() => { char.moveRightTouch("ArrowRight"); }, char.walkingFrameRate);
    }
}

/**
 * 
 * @function touchShooting makes the char shoot when touched on the @var {DOM} canvas
 */
function touchShooting() {
    if (controller['shoot'].pressed) {
        createCharAmmo(char.movingDirection === "left" ? char.x : char.x + char.width, char.y + 0.35 * widthUnit, 0.5 * widthUnit, 0.125 * heightUnit, char.specialAmmoParts === 3 ? 200 : 30);
        document.querySelector('.touch-control.shoot').classList.remove('pressed');
        controller['shoot'].pressed = false;
    }
}

/**
 * @function checkForScrolling shifts the canvas to the left or to the right when the char went far enough to the right of the world
 * @param {string} movingDirection is the @var {string} movingDirection of the char
 */
function checkForScrolling(movingDirection = char.movingDirection) {
    if (parseFloat(canvas.style.left) === 0 && char.x < 2 * canCont.offsetWidth / 3) {
        return;
    } else {
        if (movingDirection === "right" && canCont.offsetLeft + parseFloat(canvas.style.left) + char.x >= 2 * canCont.offsetWidth / 3) {
            if (parseFloat(canvas.style.left) <= canCont.offsetWidth - canvas.offsetWidth) { return; }
            char.scrollingStepAmount++;
        } else if (movingDirection === "left" && canCont.offsetLeft + parseFloat(canvas.style.left) + char.x <= canCont.offsetWidth / 3) {
            if (parseFloat(canvas.style.left) >= 0) { return; }
            char.scrollingStepAmount--;
        }
        canvas.style.left = `-${char.standardStepLength * char.scrollingStepAmount}px`;
        checkIfBigBossVisible();
    }
}

/**
 * 
 * @function checkIfBigBossVisible checks wether the last-enemy is in the screen or not
 */
function checkIfBigBossVisible() {
    if (canvas.offsetLeft <= canCont.offsetWidth - bigBoss.x) {
        bigBoss.isVisible = true;
    } else { bigBoss.isVisible = false; }
}

/**
 * 
 * @function setWholeVolume sets the entire game-volume
 * @param {event} event is the mousemove event fired to the volume-bar.
 * When the mouse/finger is moved to the right, the width of the inner-volume-bar increases.
 * That width devided by the width of the volume-bar (the parent of the inner-volume-bar) is the
 * factor the whole game volume (@var {number} gameVolume) is multiplied.
 */

let setWholeVolume = function setWholeVolumeFunc(event) {
    let volumeBarInner = event.target.closest('.volumebar-cont').querySelector('.volumebar-inner');
    let volumeBarWidth = document.querySelector('.volumebar').offsetWidth;
    let x = event.clientX;
    gameVolume = ((x - volumeBarInner.getBoundingClientRect().left) / volumeBarWidth) >= 0 ? ((x - volumeBarInner.getBoundingClientRect().left) / volumeBarWidth) : 0;
    gameVolume = gameVolume > 1 ? 1 : gameVolume;
    gameSoundToggleByVolume();
    volumeBarInner.style.width = `${100 * (x - volumeBarInner.getBoundingClientRect().left) / volumeBarWidth}%`;
    unmuteAllPlayers();
}

/**
 * 
 * @function gameSoundToggleByVolume shows hides the mute-/unmute-icon depending on if the @var {number} gameVolume is <= 0 or greater than 0
 */
function gameSoundToggleByVolume() {
    if(gameVolume <= 0) {
        gameVolume = 0;
        document.querySelector('.mute-game').classList.remove('disNone');
        document.querySelector('.unmute-game').classList.add('disNone');
    }else {
        document.querySelector('.mute-game').classList.remove('disNone');
        document.querySelector('.unmute-game').classList.add('disNone');
    }
}

/**
 * 
 * @param {event} event is the mousedown or touchstart event fired to the volume-bar
 * After that event is fired a mouse-move event is added to that element so that the volume
 * changes via mousemove / swiping.
 */
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

/**
 * 
 * @function gameSoundToggle toggles the muting of the game sound.
 * It shows/hides the respective image (speaker for unmuted scratched speaker for muted)
 * and invokes the @function muteAllPlayers or @function unmuteAllPlayers
 */
function gameSoundToggle() {
    if (!document.querySelector('.mute-game').classList.contains('disNone')) {
        document.querySelector('.mute-game').classList.add('disNone');
        document.querySelector('.unmute-game').classList.remove('disNone');
        gameMuted = true;
        muteAllPlayers();
    } else if(document.querySelector('.mute-game').classList.contains('disNone')) {
        document.querySelector('.mute-game').classList.remove('disNone');
        document.querySelector('.unmute-game').classList.add('disNone');
        gameMuted = false;
        unmuteAllPlayers();
    }
}

/**
 * 
 * @function muteAllPlayers sets the volume of all players (that of the enemies, the char, and the game) to 0
 */
function muteAllPlayers() {
    hitables.enemies.forEach((elem) => {
        elem.hittingSound.volume = 0;
        if (elem.shootingSound) { elem.shootingSound.volume = 0; }
        if (elem.fallingSound) { elem.fallingSound.volume = 0; }
    });
    if(bgPlayer) { bgPlayer.volume = 0; }
    char.hittingSound.volume = 0;
    char.shootingSound.volume = 0;
}

/**
 * 
 * @function unmuteAllPlayers sets the volume of all players (that of the enemies, the char, and the game) to 50%
 */
function unmuteAllPlayers() {
    hitables.enemies.forEach((elem) => {
        elem.hittingSound.volume = gameVolume;
        if (elem.shootingSound) { elem.shootingSound.volume = gameVolume; }
        if (elem.fallingSound) { elem.fallingSound.volume = gameVolume; }
    });
    char.hittingSound.volume = gameVolume/2;
    char.shootingSound.volume = gameVolume/2;
    if(bgPlayer) { bgPlayer.volume = gameVolume/4; }
}

/**
 * 
 * @function pauseAllPlayers pauses all the players of each game element
 */
function pauseAllPlayers() {
    hitables.enemies.forEach((elem) => {
        if (elem.hittingSound.currentTime > 0) { elem.hittingSound.pause(); }
        if (elem.shootingSound && elem.shootingSound.currentTime > 0) { elem.shootingSound.pause(); }
        if (elem.fallingSound && elem.fallingSound.currentTime > 0) { elem.fallingSound.pause(); }
    });
    hitables.flyables.forEach((elem) => {
        if (elem.shootingSound && elem.shootingSound.currentTime > 0) { elem.shootingSound.pause(); }
    });
    if (char && char.hittingSound.currentTime > 0) { char.hittingSound.pause(); }
    if (char && char.shootingSound.currentTime > 0) { char.shootingSound.pause(); }
}

/**
 * 
 * @function playAllPlayers pauses all the players of each game element
 */
function playAllPlayers() {
    hitables.enemies.forEach((elem) => {
        if (elem.hittingSound.currentTime > 0) { elem.hittingSound.play(); }
        if (elem.shootingSound && elem.shootingSound.currentTime > 0) { elem.shootingSound.play(); }
        if (elem.fallingSound && elem.fallingSound.currentTime > 0) { elem.fallingSound.play(); }
    });
    if (char.hittingSound.currentTime > 0 && char.gotHit) { char.hittingSound.play(); }
    if (char.shootingSound.currentTime > 0) { char.shootingSound.play(); }
    if (bgPlayer) { bgPlayer.play(); };
}

/**
 * 
 * @function turnOffFullScreen turns the game-view into fullscreen
 */
async function turnOnFullScreen() {
    inFullscreen = true;
    setScreenProperties();
    document.querySelector('.canvas-cont .controls').classList.add('disNone');
    document.querySelector('.canvas-cont .turn-fullscreen-on').classList.add('disNone');
    document.querySelector('.canvas-cont .turn-fullscreen-off').classList.remove('disNone');
    document.querySelector('.terms-and-conditions').classList.add('disNone');
    document.querySelector('.game-headline').classList.add('disNone');
    await body.requestFullscreen().then(() => {
        fullscreenButtonPressed = false;
        fullScreenButtonToggle();
    })
}

/**
 * 
 * @function turnOffFullScreen turns the game-view back to normal view
 */
async function turnOffFullScreen() {
    inFullscreen = false;
    setScreenProperties();
    document.querySelector('.canvas-cont .controls').classList.add('disNone');
    document.querySelector('.canvas-cont .turn-fullscreen-on').classList.remove('disNone');
    document.querySelector('.canvas-cont .turn-fullscreen-off').classList.add('disNone');
    document.querySelector('.game-headline').classList.remove('disNone');
    document.querySelector('.terms-and-conditions').classList.remove('disNone');
    await document.exitFullscreen().then(() => {
        fullscreenButtonPressed = false;
        fullScreenButtonToggle();
    })
}

/**
 * 
 * @function setScreenProperties sets the screen width and height wether the fullscreen is turned on or off.
 * After sizing @var {DOM} canCont the basic width- and height-unit so that the the movement of the elements
 * can be resized properly.
 * Then the canvas is resized because it alway needs a height of 27 height-units and 96 width-units so that the
 * game can be shown correctly regardless of the the @var {DOM} canCont
 */
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