/**
 * 
 * @function fullScreenButtonToggle toggles the button-image for the fullscreen.
 */
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

/**
 * 
 * @function resizeCanvasProperties resizes the canvas depending on the the fullscreen-state of the game
 */
function resizeCanvasProperties() {
    canvas.setAttribute("width", 96*widthUnit);
    canvas.setAttribute("height", 27*heightUnit);
    if(inFullscreen) {
        canvas.style.left = `${parseFloat(canvas.style.left)/0.7}px`;
    }else { canvas.style.left = `${parseFloat(canvas.style.left)*0.7}px`; }
    resizePlatformsProperties();
}

/**
 * 
 * @function resizePlatformsProperties resizes the platforms depending on the the fullscreen-state of the game
 */
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

/**
 * 
 * @function resizeBackgroundsProperties resizes the background depending on the the fullscreen-state of the game
 */
function resizeBackgroundsProperties() {
    backgrounds.forEach((elem)=>{
        elem.width *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
        elem.height *= inFullscreen ? (1/ratioSmallBigScreenHeight) : ratioSmallBigScreenHeight;
    })
    resizeHitablesProperties();
}

/**
 * 
 * @function resizeCanvasProperties invokes the functions that resizes the hitables
 */
function resizeHitablesProperties() {
    resizeEnemies();
    resizeTraps();
    resizeFlyables();
    resizeCharProperties();
}

/**
 * 
 * @function resizeEnemies resizes the enemies depending on the the fullscreen-state of the game
 */
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

/**
 * 
 * @function resizeTraps resizes the traps depending on the the fullscreen-state of the game
 */
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

/**
 * 
 * @function resizeFlyables resizes the flyables depending on the the fullscreen-state of the game
 */
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

/**
 * 
 * @function resizeCharProperties resizes the char depending on the the fullscreen-state of the game
 */
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

/**
 * 
 * @function resizeItemsProperties invokes the functions that resize the items
 */
function resizeItemsProperties() {
    resizeLifeIncreaser();
    resizeSpecialAmmoParts();
}

/**
 * 
 * @function resizeLifeIncreaser resizes the heart-items depending on the the fullscreen-state of the game
 */
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

/**
 * 
 * @function resizeSpecialAmmoParts resizes the special-ammo-parts depending on the the fullscreen-state of the game
 */
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

/**
 * 
 * @function sizeMenuBarProperties resizes the menu-bar depending on the the fullscreen-state of the game
 */
function sizeMenuBarProperties() {
    document.querySelector('.canvas-cont .menu-bar').style.width = `${10*widthUnit}px`;
    document.querySelector('.canvas-cont .menu-bar').style.height = `${heightUnit}px`;
    document.querySelectorAll('.canvas-cont .menu-bar img').forEach((elem)=>{
        elem.style.height = `${0.7*heightUnit}px`;
    })
}

/**
 * 
 * @function pausePlayGameToggle sets the corresponding variables depending on and invokes the respective
 * @var {boolean} gamePaused
 */
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

/**
 * 
 * @function pauseGame pauses the game
 */
function pauseGame() {
    gamePaused = true;
    keysUnheld = true;
    pauseAllPlayers(); 
    unholdAllKeys();
}

/**
 * 
 * @function unpauseGame unpauses the game
 */
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

/**
 * 
 * @function shiftCanvasBack shifts the canvas back to the right.
 * That happens, when the char fell into the big hole.
 */
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

/**
 * 
 * @function whenCanvasIsShiftedBack sets the left-property of the canvas back to 
 */
function whenCanvasIsShiftedBack() {
    canvas.style.left = '0px';
    resetCharPosition();
    keysBlockedForShifting = false;
    char.stepLength = char.standardStepLength;
    unpauseGame();
    clearInterval(shiftingCanvasBackAnimationId);
}

/**
 * 
 * @function resetCharPosition places the char at the starting-point of the game
 */
function resetCharPosition() {
    char.x = widthUnit;
    char.y = 25*heightUnit;
    slowDownChar();
}

/**
 * 
 * @function resetGame clears the local-storage (except the value of @var {boolean} gameReloaded) and refreshes the page after it
 */
async function resetGame() {
    await clearLocalStorage().then(()=>{
        location.reload();
    }).catch((err)=>{ throw err; });
}

/**
 * 
 * @function resetChar resets the char-properties back to beginning-state
 */
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

/**
 * 
 * @function clearEnemies clears all enemies
 */
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

/**
 * 
 * @function unholdAllKeys sets the pressed-state of the left-, right-, jump- and run-key back to false
 */
function unholdAllKeys() {
    controller['left'].pressed = false;
    controller['right'].pressed = false;
    controller['jump'].pressed = false;
    controller['run'].pressed = false;
}

/**
 * 
 * @function startSavingChar invokes the @function saveCharProperties after the chars first movement.
 * To prevent double-execution of saveCharProperties the chars @var {boolean} hasDoneAnything is directly set to true.
 */
function startSavingChar() {
    if(char && !char.hasDoneAnything) {
        char.hasDoneAnything = true;
        saveCharProperties();
    }
}

/**
 * 
 * @function saveCharProperties saves every second the chars actual health-amount, the actual amounts of collected special-ammo-parts
 * and the actual coordinates of the char (when the game is in fullscreen, the x- and y-coordinates are scaled down by the amount of @var {number} ratioSmallBigScreenHeight)
 */
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
    if(char.hasDoneAnything && char.hasDoneAnything != "char is dead now!") { setTimeout(saveCharProperties, 1000); }
}

/**
 * 
 * @function saveNotCollectedItems saves the properties of the not yet collected Items
 */
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

/**
 * 
 * @function saveNotDefeatedEnemies saves the not defeated enemies to the local storage.
 */
function saveNotDefeatedEnemies() {
    let alive = []; /** @var {array} alive saves the alive state of each enemy */
    hitables.enemies.forEach((elem)=>{
        alive.push(elem.isAlive);
    });
    localStorage.setItem("enemies", JSON.stringify(alive));
    for(let i=0; i<hitables.enemies.length; i++) { hitables.enemies[i].isAlive = alive[i]; }
}

/**
 * 
 * @function allAmmoKitsCollected checks wether all special-ammo-parts are collected
 */
function allAmmoKitsCollected() {
    if(char.specialAmmoParts === 3) {
        char.shootingSound = './sounds/special-shooting-sound.png';
    }
}

/**
 * 
 * @function canContControlsToggle shows or hides the controls-bar for game volume, fullscreen and unpausing the game
 */
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

/**
 * 
 * @function showDescription shows the game-description
 */
function showDescription() {
    openDescription.classList.add('disNone');
    closeDescription.classList.remove('disNone');
    description.classList.remove('disNone');
    if(!controlsBar.classList.contains('disNone')) {
        canContControlsToggle();
        return;
    }else { pausePlayGameToggle(); }
}

/**
 * 
 * @function hideDescription hides the game-description
 */
function hideDescription() {
    openDescription.classList.remove('disNone');
    closeDescription.classList.add('disNone');
    description.classList.add('disNone');
    if(!controlsBar.classList.contains('disNone')) {
        return;
    }else { pausePlayGameToggle(); }
    localStorage.setItem('reloaded', JSON.stringify(true));
}