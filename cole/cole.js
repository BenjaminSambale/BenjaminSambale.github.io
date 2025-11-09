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
}
const comboMessage = "Enter a move combination";
const defineButtonMessage = "Define the button first (see instructions)";
const alreadySolvedMessage = "already solved";
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

/* HTML elements */
const playArea = document.getElementById("playArea");
const groupSelect = document.getElementById("groupSelect");
const btnLeft = document.getElementById("btnLeft")
const btnRight = document.getElementById("btnRight")
const btnMiddle = document.getElementById("btnMiddle")
const btnScramble = document.getElementById("btnScramble")
const btnRestore = document.getElementById("btnRestore")
const btnSolve = document.getElementById("btnSolve")
const moveCounter = document.getElementById("moveCount");
const showSolution = document.getElementById("solution");
const comboInput = document.getElementById("comboInput");
const comboDialog = document.getElementById("comboDialog");
const submitCombo = document.getElementById("submitCombo");
const cancelComboSubmit = document.getElementById("cancelComboSubmit");
const customDialog = document.getElementById("customDialog");
const leftInput = document.getElementById("leftInput");
const rightInput = document.getElementById("rightInput");
const submitPerms = document.getElementById("submitPerms");
const cancelPermSubmit = document.getElementById("cancelPermSubmit");
const warningDialog = document.getElementById("warningDialog");
const warningMessage = document.getElementById("warningMessage");
const acc = document.getElementsByClassName("accordion");
const gtText = document.getElementById("gtText");
const squaresPattern = document.getElementById("squares");
const keypadPattern = document.getElementById("keypad");
const towerPattern = document.getElementById("tower");
const comboValidation = document.getElementById("comboValidation");
const leftValidation = document.getElementById("leftValidation");
const rightValidation = document.getElementById("rightValidation");

gtText.innerHTML = texts[group];
renderMathInElement(gtText);
renderGrid();

document.querySelectorAll('#groupSelect p').forEach(p => {
    p.addEventListener('click', () => {
        group = p.id;
        document.querySelectorAll('#groupSelect p').forEach(n => n.classList.remove('active'))
        p.classList.add('active');
        btnLeft.src = `buttons/b-${String(group * 2 + 1).padStart(2, '0')}.png`;
        btnRight.src = `buttons/b-${String(group * 2 + 2).padStart(2, '0')}.png`;
        btnMiddle.src = (group == groups.D8wrS9) ? `buttons/reflect.png` : `buttons/joker.png`;
        gtText.innerHTML = texts[group];
        renderMathInElement(gtText);
        btnSolve.disabled = (group >= groups.A9);
        btnSolve.style.cursor = (group >= groups.A9) ? 'auto' : 'pointer';
        const withRotations = [groups.C8S9, groups.C9S9, groups.D8wrS9].includes(Number(group));
        squaresPattern.disabled = withRotations;
        keypadPattern.disabled = withRotations;
        if (withRotations && (squaresPattern.checked || keypadPattern.checked)) {
            towerPattern.checked = true;
        }
        initialize();
        if (group == groups.random) { // define random buttons
            gens[group][0] = shuffle()
            gens[group][1] = shuffle()
        }
        if (group == groups.custom) { // define custom buttons
            customDialog.showModal();
        }
    });
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
    gens[group][0] = moveL.slice();
    gens[group][1] = moveR.slice();
    initialize();
});

btnScramble.addEventListener("click", () => {
    initialize();
    if (!gens[group][0]) { return; } // if custom mode was aborted
    if (group >= groups.A9) { // no explicit elements stored for large groups
        const noBtn = group == groups.D8wrS9 ? 3 : 2;
        for (const _ of Array(30)) { // perform 30 random button clicks           
            const move = gens[group][randInt(noBtn)];
            perm = move.slice(0, 9).map(i => perm[i]);
            if (move[9]) {
                if (move[9] < 0) {
                    reflections[4] = 1 - reflections[4]; // middle button for D8wrS9
                }
                else {
                    rotate(move);
                }
            }
            rotations = move.slice(0, 9).map(i => rotations[i]);
            reflections = move.slice(0, 9).map(i => reflections[i]);
        }
    }
    else {
        const r = randInt(orders[group])
        perm = elements[group][r][0]
    }
    console.log(rotations);
    gameStarted = true;
    renderGrid();
});

btnRestore.addEventListener("click", () => {
    initialize();
});

btnSolve.addEventListener("click", () => {
    solution = elements[group].find(s => s[0].every((x, i) => perm[x] == i))?.[1] ?? 'solved';
    gameStarted = false;
    renderGrid()
});

document.querySelectorAll('input[name="pattern"]').forEach(radio => {
    radio.addEventListener('change', () => {
        renderGrid();
    });
});

[btnLeft, btnRight].forEach((btn, index) => {
    btn.addEventListener("click", () => {
        const move = gens[group][index];
        if (!move) {
            customDialog.showModal();
            return;
        }
        perm = move.slice(0, 9).map(i => perm[i]);
        rotate(move);
        rotations = move.slice(0, 9).map(i => rotations[i]);
        reflections = move.slice(0, 9).map(i => reflections[i]);
        processStep()
    });
    btn.addEventListener("contextmenu", (event) => { // right button click
        event.preventDefault() // disable context menu
        rightClickButton(index);
    });
});

btnMiddle.addEventListener("click", () => {
    if (group == groups.D8wrS9) {
        reflections[4] = 1 - reflections[4];
    }
    else {
        const move = gens[group][2];
        if (!move) {
            warningMessage.textContent = defineButtonMessage;
            warningDialog.classList.remove('winning');
            warningDialog.showModal();
            return;
        }
        perm = move.slice(0, 9).map(i => perm[i]);
        rotate(move);
        rotations = move.slice(0, 9).map(i => rotations[i]);
        reflections = move.slice(0, 9).map(i => reflections[i]);
    }
    processStep();
});

btnMiddle.addEventListener("contextmenu", (event) => {
    event.preventDefault() // disable context menu
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
    newMove = startPerm.slice();
    moveM.match(/L'|L|R'|R/g)?.forEach(c => {
        let move;
        switch (c) {
            case 'L':
                move = gens[group][0];
                newMove = move.slice(0, 9).map(i => newMove[i]);
                rotate(move); // reflections do not matter in this mode
                break;
            case "L'":
                move = gens[group][0];
                rotate(move);
                newMove = startPerm.map(i => newMove[move.indexOf(i)]);
                break;
            case 'R':
                move = gens[group][1];
                newMove = move.slice(0, 9).map(i => newMove[i]);
                rotate(move);
                break;
            case "R'":
                move = gens[group][1];
                rotate(move);
                newMove = startPerm.map(i => newMove[move.indexOf(i)]);
        }
    });
    gens[group][2] = newMove;
});

cancelComboSubmit.addEventListener('click', () => {
    comboDialog.close();
});

cancelPermSubmit.addEventListener('click', () => {
    customDialog.close();
});

document.addEventListener('keydown', (e) => {
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

Array.from(acc).forEach(item => {
    item.addEventListener("click", function () {
        Array.from(acc).forEach(other => {
            if (other !== this) {
                other.classList.remove("active");
                let otherPanel = other.nextElementSibling;
                otherPanel.classList.remove("open");
            }
        });
        this.classList.toggle("active");
        let panel = this.nextElementSibling;
        panel.classList.toggle("open");
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
    group != groups.D8wrS9 && (gens[group][2] = undefined); // reset combo move
    gameStarted = false;
    renderGrid();
}

/**
 * Renders the grid based on the current states of perm, rotation, and reflections.
 */
function renderGrid() {
    const pattern = document.querySelector('input[name="pattern"]:checked').value;
    playArea.innerHTML = "";
    for (const i of perm) {
        const x = (i % 3) * 50;
        const y = Math.floor(i / 3) * 50;
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.style.backgroundImage = `url(${pattern})`;
        tile.style.backgroundPosition = `${x}% ${y}%`;
        tile.style.transform = `rotate(${rotations[perm.indexOf(i)] * 90}deg)`;
        tile.style.transform += reflections[perm.indexOf(i)] ? ' scaleX(-1)' : '';
        playArea.appendChild(tile);
    }
    moveCounter.textContent = `${moveCount}`
    showSolution.textContent = solution === "solved" ? alreadySolvedMessage : `\\(${solution}\\)`;
    renderMathInElement(showSolution);
}

/**
 * Performs the rotation updates for a given move.
 * @param {Array<number>} move 
 */
function rotate(move) {
    for (let i = 0; i < move.length - 9; i++) {
        rotations[i] = (rotations[i] + move[i + 9]) % 4;
    }
}

/**
 * Handles right-click button actions for the specified index: 0=left, 1=right, 2=middle.
 * @param {number} index 
 */
function rightClickButton(index) {
    if (index == 2) {
        if (group != groups.D8wrS9) {
            if (!gens[group][0]) { // custom mode aborted
                customDialog.showModal();
            }
            else {
                comboDialog.showModal();
            }
        }
        else {
            reflections[4] = 1 - reflections[4];
        }
        return;
    }
    const move = gens[group][index];
    if (!move) {
        customDialog.showModal();
        return;
    }
    perm = startPerm.map(i => perm[move.indexOf(i)]); // inverse permutation
    rotations = startPerm.map(i => rotations[move.indexOf(i)]);
    reflections = startPerm.map(i => reflections[move.indexOf(i)]);
    rotate(move.map(x => -x));
    processStep();
};

/**
 * Processes a step after a move has been made, updating the move count and checking for a win.
 */
function processStep() {
    moveCount++;
    renderGrid();
    if (gameStarted && perm.every((v, i) => v === startPerm[i]) && rotations.every(v => v === 0) && reflections.every(v => v === 0)) {
        warningMessage.textContent = moveCount == 1 ? `Solved in ${moveCount} move!` : `Solved in ${moveCount} moves!`;
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
 * @param {number} max 
 * @returns {number}
 */
function randInt(max) { 
    return Math.floor(Math.random() * max);
}
