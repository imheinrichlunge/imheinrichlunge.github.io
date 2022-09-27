const words = ["sape"],
    usedWords = [],
    regex = /[A-zÑñ]/;

const canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    newGameButton = document.getElementById("new-game"),
    input = document.getElementById("key-listener");

let lineWidth = 25,
    gap = 12,
    randomNumber,
    xAxis = [],
    currentWord = "",
    usedKeys = [],
    usedKey = false,
    hitCounter = 0,
    errorCounter = 0;

const getRandomNumber = () => {
    let max = words.length - 1;
    return Math.floor(Math.random() * (max - 0) + 0);
};

const createLine = (moveToX, moveToY, lineToX, lineToY) => {
    ctx.beginPath();
    ctx.moveTo(moveToX, moveToY);
    ctx.lineTo(lineToX, lineToY);
    ctx.closePath();
    ctx.stroke();
};

const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createLine(69, 284, 213, 284);
};

const createKeyFields = () => {
    let initialXAxis = (312 - (lineWidth * currentWord.length + gap * (currentWord.length - 1))) / 2;

    for (let i = 0; i < currentWord.length; i++) {
        xAxis.push(initialXAxis);
        createLine(initialXAxis, 364, initialXAxis + lineWidth, 364);
        initialXAxis = initialXAxis + lineWidth + gap;
    }
};

const insertCorrectKeys = (position, key) => {
    let keyWidth = ctx.measureText(key.toUpperCase()).width,
        keyPosition = xAxis[position] + (lineWidth - keyWidth) / 2;
    ctx.fillText(key.toUpperCase(), keyPosition, 354);
};

const drawHangman = () => {
    const hangmanCoordinates = [];
};

const clearGame = () => {
    usedKeys = [];
    hitCounter = 0;
    errorCounter = 0;
    randomNumber = getRandomNumber();

    if (words.length !== 0) {
        currentWord = words[randomNumber];
        usedWords.push(words[randomNumber]);
        words.splice(randomNumber, 1);
    } else {
        words.push(...usedWords);
        usedWords.splice(0, words.length);
    }

    input.value = "";
    input.removeAttribute("disabled");
    input.setAttribute("autofocus", "");
    clearCanvas();
};

const hangman = (e) => {
    let pressedKey = e.target.value.slice(-1).toLowerCase();

    for (let i = 0; i < usedKeys.length; i++) {
        if (usedKeys[i] === pressedKey) {
            usedKey = true;
        }
    }
    if (regex.test(pressedKey)) {
        usedKeys.push(pressedKey);
        switch (true) {
            case usedKey:
                usedKey = false;
                break;
            case currentWord.includes(pressedKey):
                for (let i = 0; i < currentWord.length; i++) {
                    if (currentWord[i] === pressedKey) {
                        hitCounter++;
                        insertCorrectKeys(i, pressedKey);
                    }
                }
                if (hitCounter === currentWord.length) {
                    input.setAttribute("disabled", "");
                    alert("Ganó");
                }
                break;
            default:
                errorCounter++;
                alert("Falló");
                // paragraphs[1].innerText = `Errores: ${errorCounter} de 9`;
                // input[1].value = input[1].value + pressedKey;
                if (errorCounter === 9) {
                    // paragraphs[3].innerText = `La palabra era ${currentWord}`;
                    input.setAttribute("disabled", "");
                    alert("Perdió");
                }
                break;
        }
    }
};

ctx.lineWidth = 4;
ctx.lineCap = "round";
ctx.strokeStyle = "#763C09";
ctx.font = "28px serif";

document.addEventListener("DOMContentLoaded", () => {
    input.value = "";
});
newGameButton.addEventListener("click", () => {
    clearGame();
    createKeyFields();
});
document.addEventListener("click", () => {
    input.focus();
});

input.addEventListener("input", hangman);

/*
// Dom Nodes
const canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    newGameButton = document.getElementById("new-game");

// Variables
const words = ["knows", "quiet", "high", "fuckup", "queen", "doomed"],
    regex = /[a-zA-Zñ]/;

let lineWidth = 25,
    gap = 12,
    currentWord = "",
    usedKeys = [],
    used = false,
    xAxis = [],
    gameStarted = false,
    gameWon = false,
    gameLost = false,
    hitCounter = 0,
    errorCounter = 0;

const randomNumber = () => {
    let max = words.length - 1;
    return Math.floor(Math.random() * (max - 0) + 0);
};

const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createLine(69, 284, 213, 284);
};

const createLine = (moveToX, moveToY, lineToX, lineToY) => {
    ctx.beginPath();
    ctx.moveTo(moveToX, moveToY);
    ctx.lineTo(lineToX, lineToY);
    ctx.closePath();
    ctx.stroke();
};

const initialDrawing = () => {
    let initialXAxis = (312 - (lineWidth * currentWord.length + gap * (currentWord.length - 1))) / 2;

    clearCanvas();
    createLine(69, 284, 213, 284);
    for (let i = 0; i < wordLength; i++) {
        xAxis.push(initialXAxis);
        createLine(initialXAxis, 368, initialXAxis + lineWidth, 368);
        initialXAxis = initialXAxis + lineWidth + gap;
    }
};

ctx.lineWidth = 4;
ctx.lineCap = "round";
ctx.strokeStyle = "#763C09";

newGameButton.addEventListener("click", () => {
    currentWord = words[randomNumber()];
    usedKeys = [];
    xAxis = [];
    gameStarted = true;
    gameWon = false;
    gameLost = false;
    hitCounter = 0;
    errorCounter = 0;
    initialDrawing();
});
addEventListener("keydown", (e) => {
    switch (true) {
        case gameWon:
            alert("Ganó Siuuuuuuuuuuuuuu");
            break;
        case gameLost:
            alert("Perdió mi rey");
        default:
            used = false;

            if (regex.test(e.key) && e.key.length === 1 && gameStarted) {
                for (let i = 0; i < usedKeys.length; i++) {
                    if (usedKeys[i] === e.key) {
                        used = true;
                        break;
                    }
                }

                if (!used) {
                    if (currentWord.includes(e.key)) {
                        for (let i = 0; i < currentWord.length; i++) {
                            if (currentWord[i] === e.key) {
                                hitCounter++;
                                createLine(xAxis[i], 332, xAxis[i] + lineWidth, 332);
                            }
                        }

                        if (currentWord.length === hitCounter) {
                            gameWon = true;
                        }
                    } else {
                        errorCounter++;
                        alert("Falló");

                        if (9 === errorCounter) {
                            gameLost = true;
                        }
                    }
                } else {
                    alert("Letra usada");
                }

                usedKeys.push(e.key);
            }
            break;
    }
});
*/
