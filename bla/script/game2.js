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
 * @var {number} j is the index of each animation index (there are always 8 because there are 8 animation images)
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

/**
 * 
 * @function createSpecialAmmosAnimationImages stores the images for the rotating-animation of each special-ammo-part
 * to its respective @var {array} rotationImages
 * @var {number} i is the items index, @var {number} j is the index of the animation index (which is always 8 because there are 8 animation images)
 */
function createSpecialAmmosAnimationImages() {
    for(let i=0; i<items.specialAmmo.length; i++) {
        for(let j=0; j<7; j++) {
            let rotationImage = new Image();
            rotationImage.src = `./graphics/items/special-ammo/rotation-${j}.png`;
            items.specialAmmo[i].rotationImages.push(rotationImage);
        }
    }
}

/**
 * 
 * @function presetMenuBarProperties sets the saved life-amount of the char and the the saved amount of already collected special-amm-parts to the game-menu when the game is being loaded.
 */
function presetMenuBarProperties() {
    menuBar.querySelector('.special-ammo .items-collected').innerHTML = `${char.specialAmmoParts}/3`;
    menuBar.querySelector('.life-amount .life-amount-bar .life-amount-bar-inner').style.width = `${100*char.healthAmount/char.maxHealthAmount}%`;
}

/**
 * @function setMenuBarProperties actualizes the menu-bar.
 * @param {string} menuType the type of Element that has to be updated in the menu-bar
 */
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

/**
 * 
 * @function clearCanvas clears the canvas
 */
function clearCanvas() {
    ctx.clearRect(0, 0, 2*canCont.offsetWidth, canCont.offsetHeight);
    debugger;
}

/**
 * 
 * @function drawElements invokes the functions that draw the elements
 */
function drawElements() {
    drawBackgrounds();
    drawPlatforms();
    drawHitables();
    drawItems();
    drawChar();
    drawCharObjects();
    requestAnimationFrame(()=>{ drawElements(); });
    if(char.onMovingPlatform) { char.movingWithPlatform(); }
}

/**
 * 
 * @function drawBackgrounds draws the backgrounds to the canvas
 */
function drawBackgrounds() {
    backgrounds.forEach((elem) => {
        ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height);
    });
}

/**
 * 
 * @function drawMenuBar draws the menu-bar to the canvas
 */
function drawMenuBar() {
    menubarBackground.createMenubarBackground();
    menuBar.writeMenuTexts();
}

/**
 * 
 * @function drawPlatforms draws the menu-bar to the canvas
 */
function drawPlatforms() {
    platforms.forEach((elem) => {
        ctx.drawImage(elem.platformImage, elem.x, elem.y, elem.width, elem.height);
    });
}

/**
 * 
 * @function drawMenuBar draws the hitable elements (traps, enemies, and enemie-ammos) to the canvas
 */
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

/**
 * 
 * @function drawMenuBar draws the items to the canvas
 */
function drawItems() {
    items.lifeIncreasing.forEach((elem) => {
        if (!elem.collected) { ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height); }
    })
    items.specialAmmo.forEach((elem) => {
        if (!elem.collected) { ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height); }
    })
}

/**
 * 
 * @function drawMenuBar draws the char to the canvas
 */
function drawChar() {
    if (char.isAlive) { ctx.drawImage(char.figImage, char.x, char.y, char.width, char.height); }
}

function drawCharObjects() {
    charObjects.ammo.forEach((elem) => {
        if (!elem.leftCanvas) { ctx.drawImage(elem.image, elem.x, elem.y, elem.width, elem.height); }
    });
}

/**
 * 
 * @function dispatchKeypressLeft converts the touch-event on the go-left-button into a keydown-event on the left-arrow-key
 * @param {event} event is the touch-event given to the function
 */
function dispatchKeypressLeft(event) {
    const keyPressEvent = new KeyboardEvent('keydown', {
        key: event.target.closest('.touch-control').getAttribute('button-type'),
        code: event.target.closest('.touch-control').getAttribute('button-type'),
        keyCode: +event.target.closest('.touch-control').getAttribute('button-code'),
        bubbles: true
    });
    body.dispatchEvent(keyPressEvent);
}

/**
 * 
 * @function dispatchKeypressStopLeft converts the touchend-event on the go-left-button into a keyup-event on the left-arrow-key
 * @param {event} event is the touch-event given to the function
 */
function dispatchKeypressStopLeft(event) {
    const keyUpEvent = new KeyboardEvent('keyup', {
        key: event.target.closest('.touch-control').getAttribute('button-type'),
        code: event.target.closest('.touch-control').getAttribute('button-type'),
        keyCode: +event.target.closest('.touch-control').getAttribute('button-code'),
        bubbles: true
    });
    body.dispatchEvent(keyUpEvent);
}

/**
 * 
 * @function dispatchKeypressRight converts the touch-event on the go-left-button into a keydown-event on the right-arrow-key
 * @param {event} es the touch-event given to the function
 */
function dispatchKeypressRight(event) {
    const keyPressEvent = new KeyboardEvent('keydown', {
        key: event.target.closest('.touch-control').getAttribute('button-type'),
        code: event.target.closest('.touch-control').getAttribute('button-type'),
        keyCode: +event.target.closest('.touch-control').getAttribute('button-code'),
        bubbles: true
    });
    body.dispatchEvent(keyPressEvent);
}

/**
 * 
 * @function dispatchKeypressStopRight converts the touchend-event on the go-left-button into a keyup-event on the right-arrow-key
 * @param {event} event is the touch-event given to the function
 */
function dispatchKeypressStopRight(event) {
    const keyUpEvent = new KeyboardEvent('keyup', {
        key: event.target.closest('.touch-control').getAttribute('button-type'),
        code: event.target.closest('.touch-control').getAttribute('button-type'),
        keyCode: +event.target.closest('.touch-control').getAttribute('button-code'),
        bubbles: true
    });
    body.dispatchEvent(keyUpEvent);
}

/**
 * 
 * @function dispatchKeypressJump converts the touch-event on the jump-button into a keydown-event on the left-arrow-key
 * @param {event} event is the touch-event given to the function
 */
function dispatchKeypressJump(event) {
    const keyPressEvent = new KeyboardEvent('keydown', {
        key: event.target.closest('.touch-control').getAttribute('button-type'),
        code: event.target.closest('.touch-control').getAttribute('button-type'),
        keyCode: +event.target.closest('.touch-control').getAttribute('button-code'),
        bubbles: true
    });
    body.dispatchEvent(keyPressEvent);
}

/**
 * 
 * @function dispatchKeypressStopJump converts the touchend-event on the jump-button into a keyup-event on the right-arrow-key
 * @param {event} event is the touch-event given to the function
 */
function dispatchKeypressStopJump(event) {
    const keyUpEvent = new KeyboardEvent('keyup', {
        key: event.target.closest('.touch-control').getAttribute('button-type'),
        code: event.target.closest('.touch-control').getAttribute('button-type'),
        keyCode: +event.target.closest('.touch-control').getAttribute('button-code'),
        bubbles: true
    });
    body.dispatchEvent(keyUpEvent);
}

/**
 * 
 * @function dispatchKeypressShoot converts the touch-event on the shoot-button into a keydown-event on the left-arrow-key
 * @param {event} event is the touch-event given to the function
 */
function dispatchKeypressShoot(event) {
    const keyPressEvent = new KeyboardEvent('keydown', {
        key: event.target.closest('.touch-control').getAttribute('button-type'),
        code: event.target.closest('.touch-control').getAttribute('button-type'),
        keyCode: +event.target.closest('.touch-control').getAttribute('button-code'),
        bubbles: true
    });
    body.dispatchEvent(keyPressEvent);
}

/**
 * 
 * @function dispatchKeypressStopShoot converts the touchend-event on the shoot-button into a keyup-event on the right-arrow-key
 * @param {event} event is the touch-event given to the function
 */
function dispatchKeypressStopShoot(event) {
    const keyUpEvent = new KeyboardEvent('keyup', {
        key: event.target.closest('.touch-control').getAttribute('button-type'),
        code: event.target.closest('.touch-control').getAttribute('button-type'),
        keyCode: +event.target.closest('.touch-control').getAttribute('button-code'),
        bubbles: true
    });
    body.dispatchEvent(keyUpEvent);
}

/**
 * 
 * @function addKeypressMovingCommands invokes the functions belonging to the key commands
 */
function addKeypressMovingCommands() {
    setController();
    setKeyDownEvents();
    setKeyUpEvents();
}

/**
 * 
 * @function setKeyDownEvents adds the keydown-events to the @var body
 */
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