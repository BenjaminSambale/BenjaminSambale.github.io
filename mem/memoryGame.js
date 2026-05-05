"use strict";

let startTime, endTime, randomNumber, timerInterval;
let mode = "classic"; // "classic" or "timed"
const button = document.getElementById("actionButton");
const display = document.getElementById("display");
const userInput = document.getElementById("userInput");
const result = document.getElementById("result");
const digitsInput = document.getElementById("digits");
const timeLimitInput = document.getElementById("timeLimit");
const comparison = document.getElementById("comparison");
const highscoresDiv = document.getElementById("highscores");
const timerDiv = document.getElementById("timer");
const settingsClassic = document.getElementById("settingsClassic");
const settingsTimed = document.getElementById("settingsTimed");
const modeClassicBtn = document.getElementById("modeClassic");
const modeTimedBtn = document.getElementById("modeTimed");

modeClassicBtn.addEventListener("click", () => {
    mode = "classic";
    modeClassicBtn.classList.add("active");
    modeTimedBtn.classList.remove("active");
    settingsClassic.classList.remove("hidden");
    settingsTimed.classList.add("hidden");
    resetUI();
    renderHighscores();
    saveSettings();
});
modeTimedBtn.addEventListener("click", () => {
    mode = "timed";
    modeTimedBtn.classList.add("active");
    modeClassicBtn.classList.remove("active");
    settingsTimed.classList.remove("hidden");
    settingsClassic.classList.add("hidden");
    resetUI();
    renderHighscores();
    saveSettings();
});

function resetUI() {
    clearInterval(timerInterval);
    display.textContent = "";
    comparison.innerHTML = "";
    result.textContent = "";
    timerDiv.textContent = "";
    userInput.style.visibility = "hidden";
    userInput.value = "";
    userInput.style.height = "auto";
    button.textContent = "Start";
}

function displayGroupsPerRow() {
    return window.innerWidth <= 480 ? 4 : 5;
}

function formatNumber(num, groupsPerRow) {
    if (groupsPerRow === undefined) groupsPerRow = 5;
    // Split into groups of 5 digits, arrange in rows of groupsPerRow groups
    const groups = num.match(/.{1,5}/g) || [];
    const rows = [];
    for (let i = 0; i < groups.length; i += groupsPerRow) {
        rows.push(groups.slice(i, i + groupsPerRow).join("  "));
    }
    return rows.join("\n");
}

function updateDisplaySize(len) {
    const narrow = window.innerWidth <= 480;
    if (len <= 20) display.style.fontSize = narrow ? "1.6rem" : "2.4rem";
    else if (len <= 40) display.style.fontSize = narrow ? "1.2rem" : "1.8rem";
    else display.style.fontSize = narrow ? "0.95rem" : "1.3rem";
    display.style.whiteSpace = "pre-wrap";
    display.style.letterSpacing = narrow ? "1px" : "2px";
}

function generateRandomNumber(d) {
    return Array.from({ length: d }, () => Math.floor(Math.random() * 10)).join("");
}

function buildComparison(expected, entered) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < expected.length; i++) {
        if (i > 0 && i % 25 === 0) {
            fragment.appendChild(document.createElement("br"));
        } else if (i > 0 && i % 5 === 0) {
            fragment.appendChild(document.createTextNode("\u00a0\u00a0"));
        }
        const span = document.createElement("span");
        span.textContent = expected[i];
        if (i < entered.length && entered[i] === expected[i]) {
            span.className = "correct";
        } else {
            span.className = "wrong";
        }
        fragment.appendChild(span);
    }
    return fragment;
}

const HS_CLASSIC_KEY  = "memoryHighscores";
const HS_TIMED_KEY    = "memoryHighscoresTimed";
const SETTINGS_KEY    = "memorySettings";

function loadSettings() {
    try {
        const s = JSON.parse(localStorage.getItem(SETTINGS_KEY));
        if (!s) return;
        if (s.mode === "timed") {
            mode = "timed";
            modeTimedBtn.classList.add("active");
            modeClassicBtn.classList.remove("active");
            settingsTimed.classList.remove("hidden");
            settingsClassic.classList.add("hidden");
        }
        if (s.digits != null) digitsInput.value = s.digits;
        if (s.timeLimit != null) timeLimitInput.value = s.timeLimit;
    } catch { /* ignore */ }
}

function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
        mode,
        digits: digitsInput.value,
        timeLimit: timeLimitInput.value
    }));
}

function getHighscoreKey() {
    return mode === "timed" ? HS_TIMED_KEY : HS_CLASSIC_KEY;
}

function getHighscores(key) {
    try {
        return JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
        return [];
    }
}

function deleteHighscore(key, index) {
    const scores = getHighscores(key);
    scores.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(scores));
    renderHighscores();
}

function saveHighscore(digits, time) {
    const key = getHighscoreKey();
    const scores = getHighscores(key);
    const entry = {
        date: new Date().toLocaleDateString("de-DE"),
        digits: digits,
        time: parseFloat(time)
    };
    scores.push(entry);
    scores.sort((a, b) => b.digits - a.digits || a.time - b.time);
    localStorage.setItem(key, JSON.stringify(scores.slice(0, 20)));
    renderHighscores(entry);
}

function renderHighscores(highlight) {
    const key = getHighscoreKey();
    const scores = getHighscores(key);
    const title = mode === "timed" ? "\uD83C\uDFC6 Highscores \u2014 \u23F1 Timed" : "\uD83C\uDFC6 Highscores \u2014 \uD83D\uDCCB Classic";
    if (!scores.length) { highscoresDiv.textContent = ""; return; }

    const container = document.createDocumentFragment();

    const h3 = document.createElement("h3");
    h3.textContent = title;
    container.appendChild(h3);

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["#", "Date", "Digits", "Time (s)", ""].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    let highlighted = false;
    scores.forEach((s, i) => {
        const tr = document.createElement("tr");
        const isHL = highlight && !highlighted &&
            s.date === highlight.date &&
            s.digits === highlight.digits &&
            s.time === highlight.time;
        if (isHL) { tr.className = "highlight-row"; highlighted = true; }
        [i + 1, s.date, s.digits, s.time].forEach(val => {
            const td = document.createElement("td");
            td.textContent = val;
            tr.appendChild(td);
        });
        const tdDel = document.createElement("td");
        const delBtn = document.createElement("button");
        delBtn.textContent = "\u00d7";
        delBtn.className = "delete-score-btn";
        delBtn.addEventListener("click", () => deleteHighscore(key, i));
        tdDel.appendChild(delBtn);
        tr.appendChild(tdDel);
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.appendChild(table);

    highscoresDiv.textContent = "";
    highscoresDiv.appendChild(container);
}

loadSettings();
digitsInput.addEventListener("change", saveSettings);
timeLimitInput.addEventListener("change", saveSettings);
renderHighscores();

userInput.addEventListener("input", () => {
    const sel = userInput.selectionStart;
    // significant = digits or placeholders (non-space, non-newline)
    const sigBeforeCursor = userInput.value.slice(0, sel).replace(/[ \n]/g, "").length;
    const raw = userInput.value.replace(/[ \n]/g, "");
    const formatted = formatNumber(raw, displayGroupsPerRow());
    userInput.value = formatted;
    // restore cursor: skip past sigBeforeCursor significant chars
    let sig = 0, pos = formatted.length;
    for (let i = 0; i < formatted.length; i++) {
        if (sig === sigBeforeCursor) { pos = i; break; }
        if (formatted[i] !== " " && formatted[i] !== "\n") sig++;
    }
    userInput.setSelectionRange(pos, pos);
    userInput.style.height = "auto";
    userInput.style.height = userInput.scrollHeight + "px";
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target !== userInput) { e.preventDefault(); button.click(); }
});
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); button.click(); }
});

// Timed mode: show all digits at once, countdown timer
function startTimedMode() {
    const limit = parseInt(timeLimitInput.value) || 10;
    randomNumber = generateRandomNumber(100);
    updateDisplaySize(100);
    display.textContent = formatNumber(randomNumber, displayGroupsPerRow());
    startTime = Date.now();
    const endAt = startTime + limit * 1000;

    timerInterval = setInterval(() => {
        const remaining = Math.max(0, (endAt - Date.now()) / 1000);
        timerDiv.textContent = remaining.toFixed(1) + "s left";
        if (remaining <= 0) {
            clearInterval(timerInterval);
            endTime = Date.now();
            timerDiv.textContent = "Time's up! Recall as many as you can.";
            display.textContent = "";
            userInput.style.height = "auto";
            userInput.style.visibility = "visible";
            userInput.focus();
            button.textContent = "Check";
        }
    }, 100);
    button.textContent = "Stop";
}

button.addEventListener("click", () => {
    if (button.textContent === "Start") {
        result.textContent = "";
        comparison.textContent = "";
        timerDiv.textContent = "";
        userInput.style.visibility = "hidden";
        userInput.value = "";
        userInput.style.height = "auto";

        if (mode === "timed") {
            startTimedMode();
        } else {
            const d = parseInt(digitsInput.value) || 5;
            randomNumber = generateRandomNumber(d);
            updateDisplaySize(d);
            display.textContent = formatNumber(randomNumber, displayGroupsPerRow());
            startTime = Date.now();
            timerDiv.textContent = "0.0s";
            timerInterval = setInterval(() => {
                timerDiv.textContent = ((Date.now() - startTime) / 1000).toFixed(1) + "s";
            }, 100);
            button.textContent = "Stop";
        }
    } else if (button.textContent === "Stop") {
        clearInterval(timerInterval);
        endTime = Date.now();
        const elapsed = ((endTime - startTime) / 1000).toFixed(1);
        timerDiv.textContent = mode === "timed" ? elapsed + "s used" : elapsed + "s";
        display.textContent = "";
        userInput.style.height = "auto";
        userInput.style.visibility = "visible";
        userInput.focus();
        button.textContent = "Check";
    } else if (button.textContent === "Check") {
        const entered = userInput.value.replace(/[ \n]/g, "");
        const expected = mode === "timed" ? randomNumber.substring(0, entered.length) : randomNumber;
        comparison.textContent = "";
        comparison.appendChild(buildComparison(expected, entered));
        comparison.style.fontSize = expected.length > 40 ? "1.1rem" : expected.length > 20 ? "1.5rem" : "2rem";
        if (entered.length > 0 && entered === expected) {
            const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
            result.textContent = "\u2705 Correct! " + entered.length + " digits in " + timeTaken + "s";
            saveHighscore(entered.length, timeTaken);
        } else {
            result.textContent = "\u274C Incorrect. See differences above.";
        }
        button.textContent = "Start";
    }
});
