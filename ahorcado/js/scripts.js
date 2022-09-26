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
