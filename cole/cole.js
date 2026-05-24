const startPerm = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const initialArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
const groups = {
    start: 0,
    A9: 15,
    C8S9: 17,
    C9S9: 18,
    D8wrS9: 19,
    random: 20,
    custom: 21
};
const defineButtonMessage = 'Define the button first (see instructions)';
const alreadySolvedMessage = 'already solved';
const solvedSentinel = 'solved';
/**
 * Current permutation of the boxes
 */
let perm = startPerm.slice();
/**
 * Current rotations of the boxes. Each entry is in {0,1,2,3} representing multiples of 90 degrees.
 */
let rotations = initialArray.slice();
/**
 * Current reflections of the boxes. Each entry 0=no reflection, 1=reflected.
 */
let reflections = initialArray.slice();
/**
 * The puzzle can only be solved after a scramble with gameStarted=true. Revealing the solution or changing the configuration resets this flag to false.
 */
let gameStarted = false;
/**
 * The current number of executed moves. This is shown on the winning dialog.
 */
let moveCount = 0;
/**
 * The solution string to be displayed. Only available for groups smaller than A9.
 */
let solution = '';
/**
 * The default group loaded on start. 
 */
let group = groups.start;

/**
 * Stores a valid user inputs to avoid saving an invalid string in the dialog.
 */
let comboInputString = '';
let leftInputString = '';
let rightInputString = '';

/* HTML elements */
const playArea = document.getElementById('playArea');
const tiles = [];
const btnLeft = document.getElementById('btnLeft');
const btnRight = document.getElementById('btnRight');
const btnMiddle = document.getElementById('btnMiddle');
const btnScramble = document.getElementById('btnScramble');
const btnRestore = document.getElementById('btnRestore');
const btnSolve = document.getElementById('btnSolve');
const moveCounter = document.getElementById('moveCount');
const showSolution = document.getElementById('solution');
const comboInput = document.getElementById('comboInput');
const comboDialog = document.getElementById('comboDialog');
const submitCombo = document.getElementById('submitCombo');
const cancelComboSubmit = document.getElementById('cancelComboSubmit');
const customDialog = document.getElementById('customDialog');
const leftInput = document.getElementById('leftInput');
const rightInput = document.getElementById('rightInput');
const submitPerms = document.getElementById('submitPerms');
const cancelPermSubmit = document.getElementById('cancelPermSubmit');
const warningDialog = document.getElementById('warningDialog');
const warningMessage = document.getElementById('warningMessage');
const acc = document.getElementsByClassName('accordion');
const gtText = document.getElementById('gtText');
const squaresPattern = document.getElementById('squares');
const keypadPattern = document.getElementById('keypad');
const towerPattern = document.getElementById('tower');
const comboValidation = document.getElementById('comboValidation');
const leftValidation = document.getElementById('leftValidation');
const rightValidation = document.getElementById('rightValidation');

gtText.innerHTML = texts[group];
renderMathInElement(gtText);
createTiles();
renderGrid();

document.getElementById('groupSelect').addEventListener('click', e => {
    const p = e.target.closest('p');
    if (!p) return;
    group = Number(p.id);
    group !== groups.D8wrS9 && (gens[group][2] = undefined); // reset combo move
    document.querySelectorAll('#groupSelect p').forEach(n => n.classList.remove('active'));
    p.classList.add('active');
    btnLeft.src = `buttons/b-${String(group * 2 + 1).padStart(2, '0')}.png`;
    btnRight.src = `buttons/b-${String(group * 2 + 2).padStart(2, '0')}.png`;
    btnMiddle.src = (group === groups.D8wrS9) ? 'buttons/reflect.png' : 'buttons/joker.png';
    gtText.innerHTML = texts[group];
    renderMathInElement(gtText);
    btnSolve.disabled = (group >= groups.A9);
    const withRotations = [groups.C8S9, groups.C9S9, groups.D8wrS9].includes(group);
    squaresPattern.disabled = withRotations;
    keypadPattern.disabled = withRotations;
    if (withRotations && (squaresPattern.checked || keypadPattern.checked)) {
        towerPattern.checked = true;
    }
    initialize();
    if (group === groups.random) { // define random buttons
        gens[group][0] = shuffle();
        gens[group][1] = shuffle();
    }
    if (group === groups.custom) { // define custom buttons
        customDialog.showModal();
    }
});

leftInput.addEventListener('input', () => {
    leftValidation.style.display = 'none';
});

rightInput.addEventListener('input', () => {
    rightValidation.style.display = 'none';
});

submitPerms.addEventListener('click', () => {
    // convert input to zero-based indices
    const moveL = leftInput.value.split('').map(x => Number(x) - 1);
    const moveR = rightInput.value.split('').map(x => Number(x) - 1);
    // validate moves
    const validL = moveL.length === 9 && new Set(moveL).size === 9 && moveL.every(x => x >= 0 && x < 9);
    if (!validL) {
        leftValidation.style.display = 'block';
        return;
    }
    const validR = moveR.length === 9 && new Set(moveR).size === 9 && moveR.every(x => x >= 0 && x < 9);
    if (!validR) {
        rightValidation.style.display = 'block';
        return;
    }
    customDialog.close();
    leftInputString = leftInput.value;
    rightInputString = rightInput.value;
    gens[group][0] = moveL.slice();
    gens[group][1] = moveR.slice();
    initialize();
});

customDialog.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        submitPerms.click();
    }
});

btnScramble.addEventListener('click', () => {
    initialize();
    if (!gens[group][0]) { return; } // if custom mode was aborted
    if (group >= groups.A9) { // no explicit elements stored for large groups
        const noBtn = group === groups.D8wrS9 ? 3 : 2;
        for (let i = 0; i < 30; i++) { // perform 30 random button clicks
            const move = gens[group][randInt(noBtn)];
            [perm, rotations, reflections] = performMove(move);
        }
    }
    else {
        const r = randInt(elements[group].length);
        perm = elements[group][r][0];
    }
    gameStarted = true;
    renderGrid();
});

btnRestore.addEventListener('click', () => {
    initialize();
});

btnSolve.addEventListener('click', () => {
    solution = elements[group].find(s => s[0].every((x, i) => perm[x] === i))?.[1] ?? solvedSentinel;
    gameStarted = false;
    renderGrid();
});

document.querySelectorAll('input[name="pattern"]').forEach(radio => {
    radio.addEventListener('change', () => {
        renderGrid();
    });
});

[btnLeft, btnRight].forEach((btn, index) => {
    btn.addEventListener('click', () => {
        const move = gens[group][index];
        if (!move) {
            customDialog.showModal();
            return;
        }
        [perm, rotations, reflections] = performMove(move);
        processStep();
    });
    btn.addEventListener('contextmenu', (event) => { // right button click
        event.preventDefault(); // disable context menu
        rightClickButton(index);
    });
});

btnMiddle.addEventListener('click', () => {
    if (group === groups.D8wrS9) {
        reflections[4] = 1 - reflections[4];
    }
    else {
        const move = gens[group][2];
        if (!move) {
            warningMessage.textContent = defineButtonMessage;
            warningMessage.classList.remove('winning'); // remove green font with winning message was last
            warningDialog.showModal();
            return;
        }
        [perm, rotations, reflections] = performMove(move);
    }
    processStep();
});

btnMiddle.addEventListener('contextmenu', (event) => {
    event.preventDefault(); // disable context menu
    rightClickButton(2);
});

comboInput.addEventListener('input', () => {
    comboValidation.style.display = 'none';
});

submitCombo.addEventListener('click', () => {
    const moveM = comboInput.value;
    const matches = moveM.match(/L'|L|R'|R/g);
    // validate sequence
    if (!matches || matches.join('') !== moveM.replace(/["]/g, '')) {
        comboValidation.style.display = 'block';
        return;
    }
    comboDialog.close();
    comboInputString = comboInput.value;
    let newPerm = startPerm.slice();
    let newRot = initialArray.slice();
    matches.forEach(c => {
        switch (c) {
            case 'L':
                // reflections do not matter in this mode
                [newPerm, newRot] = performMove(gens[group][0], false, newPerm, newRot);
                break;
            case "L'":
                [newPerm, newRot] = performMove(gens[group][0], true, newPerm, newRot);
                break;
            case 'R':
                [newPerm, newRot] = performMove(gens[group][1], false, newPerm, newRot);
                break;
            case "R'":
                [newPerm, newRot] = performMove(gens[group][1], true, newPerm, newRot);
        }
    });
    // undo the final permutation on newRot
    newRot = startPerm.map(i => newRot[newPerm.indexOf(i)]);
    gens[group][2] = newPerm.concat(newRot);
});

comboDialog.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        submitCombo.click();
    }
});

cancelComboSubmit.addEventListener('click', () => {
    comboInput.value = comboInputString;
    comboValidation.style.display = 'none';
    comboDialog.close();
});

cancelPermSubmit.addEventListener('click', () => {
    leftInput.value = leftInputString;
    rightInput.value = rightInputString;
    leftValidation.style.display = 'none';
    rightValidation.style.display = 'none';
    customDialog.close();
});

document.addEventListener('keydown', (e) => {
    // prevent interfering with open dialogs
    if (customDialog.open || comboDialog.open || warningDialog.open) { return; }
    switch (e.key) {
        case 'ArrowLeft':
            e.ctrlKey ? rightClickButton(0) : btnLeft.click();
            break;
        case 'ArrowRight':
            e.ctrlKey ? rightClickButton(1) : btnRight.click();
            break;
        case 'ArrowUp':
            e.ctrlKey ? rightClickButton(2) : btnMiddle.click();
            break;
    }
});

const accArr = Array.from(acc);
accArr.forEach(item => {
    item.addEventListener('click', function () {
        accArr.forEach(other => {
            if (other !== this) {
                other.classList.remove('active');
                const otherPanel = other.nextElementSibling;
                otherPanel.classList.remove('open');
            }
        });
        this.classList.toggle('active');
        const panel = this.nextElementSibling;
        panel.classList.toggle('open');
    });
});

/* Functions */
/**
 * Initializes a new game.
 */
function initialize() {
    moveCount = 0;
    solution = '';
    perm = startPerm.slice();
    rotations = initialArray.slice();
    reflections = initialArray.slice();
    gameStarted = false;
    renderGrid();
}

/**
 * Creates the 9 tile elements once and appends them to the play area.
 */
function createTiles() {
    playArea.innerHTML = "";
    tiles.length = 0;
    for (let i = 0; i < 9; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        playArea.appendChild(tile);
        tiles.push(tile);
    }
}

/**
 * Renders the grid based on the current states of perm, rotation, and reflections.
 */
function renderGrid() {
    const pattern = document.querySelector('input[name="pattern"]:checked').value;
    perm.forEach((p, i) => {
        const x = (p % 3) * 50;
        const y = Math.floor(p / 3) * 50;
        tiles[i].style.backgroundImage = `url(${pattern})`;
        tiles[i].style.backgroundPosition = `${x}% ${y}%`;
        tiles[i].style.transform = `rotate(${rotations[i] * 90}deg)`;
        tiles[i].style.transform += reflections[i] ? ' scaleX(-1)' : '';
    });
    moveCounter.textContent = `${moveCount}`;
    showSolution.textContent = solution === solvedSentinel ? alreadySolvedMessage : `\\(${solution}\\)`;
    renderMathInElement(showSolution);
}

/**
 * Apply a move or its inverse to a given permutation, rotation and reflection map.
 * @param {Array<number>} move The move to perform.
 * @param {boolean} inverse Whether to apply the inverse of the move.
 * @param {Array<number>} basePerm The base permutation map. Defaults to the current perm.
 * @param {Array<number>} baseRot The base rotation map. Defaults to the current rotations.
 * @param {Array<number>} baseRef The base reflection map. Defaults to the current reflections.
 * @returns {Array<Array<number>>} The new permutation, rotation and reflection maps.
 */
function performMove(move, inverse = false, basePerm = perm, baseRot = rotations, baseRef = reflections) {
    let newPerm = basePerm.slice();
    let newRot = baseRot.slice();
    let newRef = baseRef.slice();
    if (!inverse) {
        if (move[9] === -1) {
            newRef[4] = 1 - baseRef[4];
        }
        else {
            for (let i = 0; i < move.length - 9; i++) {
                newRot[i] = (newRot[i] + move[i + 9]) % 4;
            }
        }
        newPerm = move.slice(0, 9).map(i => newPerm[i]);
        newRot = move.slice(0, 9).map(i => newRot[i]);
        newRef = move.slice(0, 9).map(i => newRef[i]);
    }
    else {
        const inv = startPerm.map(i => move.indexOf(i));
        newPerm = startPerm.map(i => newPerm[inv[i]]);
        newRot = startPerm.map(i => newRot[inv[i]]);
        newRef = startPerm.map(i => newRef[inv[i]]);
        if (move[9] === -1) {
            newRef[4] = 1 - newRef[4];
        }
        else {
            for (let i = 0; i < move.length - 9; i++) {
                newRot[i] = (4 + newRot[i] - move[i + 9]) % 4; // add 4 to avoid negative numbers
            }
        }
    }
    return [newPerm, newRot, newRef];
}

/**
 * Handles right-click button actions for the specified index: 0=left, 1=right, 2=middle.
 * @param {number} index 
 */
function rightClickButton(index) {
    if (index === 2) {
        if (group !== groups.D8wrS9) {
            if (!gens[group][0]) { // custom mode aborted
                customDialog.showModal();
            }
            else {
                comboDialog.showModal();
            }
        }
        else {
            reflections[4] = 1 - reflections[4];
            processStep();
        }
        return;
    }
    const move = gens[group][index];
    if (!move) {
        customDialog.showModal();
        return;
    }
    [perm, rotations, reflections] = performMove(move, true);
    processStep();
}

/**
 * Processes a step after a move has been made, updating the move count and checking for a win.
 */
function processStep() {
    moveCount++;
    renderGrid();
    if (gameStarted && perm.every((v, i) => v === startPerm[i]) && rotations.every(v => v === 0) && reflections.every(v => v === 0)) {
        warningMessage.textContent = moveCount === 1 ? `Solved in ${moveCount} move!` : `Solved in ${moveCount} moves!`;
        warningMessage.classList.add('winning');
        warningDialog.showModal();
        gameStarted = false;
    }
}

/**
 * Generates a random permutation of startPerm using the Fisher-Yates algorithm.
 * @returns {Array<number>} A new random permutation of startPerm.
 */
function shuffle() {
    let newPerm = startPerm.slice();
    let i = startPerm.length, j, temp;
    while (--i > 0) {
        j = randInt(i + 1);
        temp = newPerm[j];
        newPerm[j] = newPerm[i];
        newPerm[i] = temp;
    }
    return newPerm;
}

/**
 * Generates a random integer in the range [0, max - 1].
 * @param {number} max upper bound (exclusive)
 * @returns {number} A random integer between 0 and max - 1.
 */
function randInt(max) {
    return Math.floor(Math.random() * max);
}
