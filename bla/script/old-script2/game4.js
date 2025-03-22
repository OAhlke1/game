

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