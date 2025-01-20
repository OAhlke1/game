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

function pausePlayGameToggle() {
    if (gamePaused) {
        document.querySelector('.play-game').classList.add('disNone');
        document.querySelector('.pause-game').classList.remove('disNone');
        gamePaused = false;
        playAllPlayers();
    } else {
        document.querySelector('.play-game').classList.remove('disNone');
        document.querySelector('.pause-game').classList.add('disNone');
        gamePaused = true;
        pauseAllPlayers();
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
    if(!gamePaused) { pausePlayGameToggle(); }
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
        return;
    }else { pausePlayGameToggle(); }
}

function hideDescription() {
    openDescription.classList.remove('disNone');
    closeDescription.classList.add('disNone');
    description.classList.add('disNone');
    if(!controlsBar.classList.contains('disNone')) {
        return;
    }else { gamePaused = false; }
    localStorage.setItem('reloaded', JSON.stringify(true));
}