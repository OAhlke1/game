

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

function dispatchKeypressLeft(event) {
    const keyPressEvent = new KeyboardEvent('keydown', {
        key: event.target.closest('.touch-control').getAttribute('button-type'),
        code: event.target.closest('.touch-control').getAttribute('button-type'),
        keyCode: +event.target.closest('.touch-control').getAttribute('button-code'),
        bubbles: true
    });
    body.dispatchEvent(keyPressEvent);
}

function dispatchKeypressStopLeft(event) {
    const keyUpEvent = new KeyboardEvent('keyup', {
        key: event.target.closest('.touch-control').getAttribute('button-type'),
        code: event.target.closest('.touch-control').getAttribute('button-type'),
        keyCode: +event.target.closest('.touch-control').getAttribute('button-code'),
        bubbles: true
    });
    body.dispatchEvent(keyUpEvent);
}

function dispatchKeypressRight(event) {
    const keyPressEvent = new KeyboardEvent('keydown', {
        key: event.target.closest('.touch-control').getAttribute('button-type'),
        code: event.target.closest('.touch-control').getAttribute('button-type'),
        keyCode: +event.target.closest('.touch-control').getAttribute('button-code'),
        bubbles: true
    });
    body.dispatchEvent(keyPressEvent);
}

function dispatchKeypressStopRight(event) {
    const keyUpEvent = new KeyboardEvent('keyup', {
        key: event.target.closest('.touch-control').getAttribute('button-type'),
        code: event.target.closest('.touch-control').getAttribute('button-type'),
        keyCode: +event.target.closest('.touch-control').getAttribute('button-code'),
        bubbles: true
    });
    body.dispatchEvent(keyUpEvent);
}

function dispatchKeypressJump(event) {
    const keyPressEvent = new KeyboardEvent('keydown', {
        key: event.target.closest('.touch-control').getAttribute('button-type'),
        code: event.target.closest('.touch-control').getAttribute('button-type'),
        keyCode: +event.target.closest('.touch-control').getAttribute('button-code'),
        bubbles: true
    });
    body.dispatchEvent(keyPressEvent);
}

function dispatchKeypressStopJump(event) {
    const keyUpEvent = new KeyboardEvent('keyup', {
        key: event.target.closest('.touch-control').getAttribute('button-type'),
        code: event.target.closest('.touch-control').getAttribute('button-type'),
        keyCode: +event.target.closest('.touch-control').getAttribute('button-code'),
        bubbles: true
    });
    body.dispatchEvent(keyUpEvent);
}

function dispatchKeypressShoot(event) {
    const keyPressEvent = new KeyboardEvent('keydown', {
        key: event.target.closest('.touch-control').getAttribute('button-type'),
        code: event.target.closest('.touch-control').getAttribute('button-type'),
        keyCode: +event.target.closest('.touch-control').getAttribute('button-code'),
        bubbles: true
    });
    body.dispatchEvent(keyPressEvent);
}

function dispatchKeypressStopShoot(event) {
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
    setKeyDownEvents();
    setKeyUpEvents();
}

function setKeyDownEvents() {
    body.addEventListener('keydown', async (event) => {
        char.sleeps = false;
        t = 0;
        if (event.key.toLowerCase() === "p") {
            if (!gamePaused) {
                pausePlayGameToggle();
            } else {
                pausePlayGameToggle();
                timer();
            }
        } else if (event.key.toLowerCase() === "f" && !fullscreenButtonPressed) {
            fullscreenButtonPressed = true;
            if (inFullscreen) {
                turnOffFullScreen();
            } else { turnOnFullScreen(); }
        } else if (event.key.toLowerCase() === "m") {
            gameSoundToggle();
        }
        if (!keysUnheld && !keysBlockedForShifting) {
            whenKeysAreUsable(event);
        }
    });
}

function whenKeysAreUsable(event) {
    if (event.key === "ArrowLeft") {
        gotLeftPressed();
    } else if (event.key === "ArrowRight") {
        goRightPressed();
    } else if (event.key === " " && !char.jumps) {
        jumpPressed();
    } else if (event.key === "Shift") {
        runningKeyHeld();
    }
}

function gotLeftPressed() {
    if (!controller['left'].pressed) {
        controller['left'].pressed = true;
        controller['left'].func();
    }
}

function goRightPressed() {
    if (!controller['right'].pressed) {
        controller["right"].pressed = true;
        controller['right'].func();
    }
}

function jumpPressed() {
    controller['jump'].pressed = true;
    controller['jump'].func();
}

function runningKeyHeld() {
    controller['run'].pressed = true;
    controller['run'].func();
}

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
            } else if (event.key.toLowerCase() === "e" && char.isAlive) {
                createCharAmmo(char.movingDirection === "left" ? char.x : char.x + char.width, char.y + 0.35 * widthUnit, 0.75 * widthUnit, 0.25 * heightUnit, char.specialAmmoParts === 3 ? char.ammoImages.specialAmmo : char.ammoImages.ammo, char.specialAmmoParts === 3 ? 200 : 30);
            } else if (event.key === "Escape") { turnOffFullScreen(); }
        }
    });
}

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
        char.movingAnimationId = setInterval(() => { char.moveLeft("ArrowLeft"); }, standardFrameRate);
    }
}

function initStepLeftTouch() {
    if (controller['left'].pressed) {
        char.movingAnimationId = setInterval(() => { char.moveLeftTouch("ArrowLeft"); }, standardFrameRate);
    }
}

function showHideTouchControls() {
    pausePlayGameToggle();
    document.querySelector('.touch-controls .pause-game').classList.add('paused');
    if (!document.querySelector('.touch-controls').classList.contains('shown') && !document.querySelector('.touch-controls').classList.contains('hidden')) {
        document.querySelector('.touch-controls').classList.add('shown');
    } else if (!document.querySelector('.touch-controls').classList.contains('shown')) {
        document.querySelector('.touch-controls').classList.add('shown');
        document.querySelector('.touch-controls').classList.remove('hidden');
    } else if (!document.querySelector('.touch-controls').classList.contains('hidden')) {
        pausePlayGameToggle();
        document.querySelector('.touch-controls .pause-game').classList.remove('paused');
        document.querySelector('.touch-controls').classList.remove('shown');
        document.querySelector('.touch-controls').classList.add('hidden');
    }
}

function initStepRight() {
    if (controller['right'].pressed) {
        char.movingAnimationId = setInterval(() => { char.moveRight("ArrowRight"); }, standardFrameRate);
    }
}

function initStepRightTouch() {
    if (controller['right'].pressed) {
        char.movingAnimationId = setInterval(() => { char.moveRightTouch("ArrowRight"); }, standardFrameRate);
    }
}

function speedUpChar() {
    if (char.stepLength / char.standardStepLength >= 1.5) { return; }
    char.stepLength *= 1.5;
}

function slowDownChar() {
    if (char.stepLength / char.standardStepLength <= 1) { return; }
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
        createCharAmmo(char.movingDirection === "left" ? char.x : char.x + char.width, char.y + 0.35 * widthUnit, 0.5 * widthUnit, 0.125 * heightUnit, char.specialAmmoParts === 3 ? char.ammoImages.specialAmmo : char.ammoImages.ammo, char.specialAmmoParts === 3 ? 200 : 30);
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
    if (parseFloat(canvas.style.left) === 0 && char.x < 2 * canCont.offsetWidth / 3) {
        return;
    } else {
        if (movingDirection === "right" && canCont.offsetLeft + parseFloat(canvas.style.left) + char.x >= 2 * canCont.offsetWidth / 3) {
            if (canvas.offsetLeft + canCont.offsetWidth <= 0) { return; }
            char.scrollingStepAmount++;
        } else if (movingDirection === "left" && canCont.offsetLeft + parseFloat(canvas.style.left) + char.x <= canCont.offsetWidth / 3) {
            if (parseFloat(canvas.style.left) >= 0) { return; }
            char.scrollingStepAmount--;
        }
        canvas.style.left = `-${char.standardStepLength * char.scrollingStepAmount}px`;
        checkIfBigBossVisible();
    }
}