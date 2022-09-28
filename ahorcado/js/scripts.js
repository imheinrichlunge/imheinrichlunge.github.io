const // Containers
    homePage = document.getElementsByClassName("container--home")[0],
    addWordPage = document.getElementsByClassName("container--add-word")[0],
    gamePage = document.getElementsByClassName("container--game")[0],
    // Buttons
    startGameButton = document.getElementById("start-game"),
    addWordButton = document.getElementById("add-word"),
    newGameButton = document.getElementById("new-game"),
    surrenderButton = document.getElementById("surrender"),
    // Textfields
    newWordInput = document.getElementById("new-word"),
    input = document.getElementById("key-listener"),
    // Canvas
    canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

const words = [
        "abandono",
        "abarcado",
        "abarrote",
        "calibrar",
        "caliente",
        "califica",
        "calmante",
        "decidido",
        "declarar",
        "especial",
        "esquivar",
        "estanque",
        "feriados",
        "fermento",
        "filosofa",
        "filtrado",
        "finaliza",
        "financia",
        "golosina",
        "grandote",
        "gratuito",
        "jolgorio",
        "jornada",
        "jorobado",
        "jovial",
        "reclinar",
        "recluir",
        "recopilar",
        "temporal",
        "temprano",
    ],
    usedWords = [],
    regex = /[A-zÑñ]/;

let lineWidth = 25,
    gap = 12,
    randomNumber,
    xAxis = [],
    currentWord = "",
    usedKeys = [],
    usedKey = false,
    wrongKeys = "",
    hitCounter = 0,
    errorCounter = 0;

const loadFont = async () => {
    const font = new FontFace("Baloo", "url(https://fonts.gstatic.com/s/baloo2/v14/wXK0E3kTposypRydzVT08TS3JnAmtdiayppo_lc.woff2)");
    await font.load();
    document.fonts.add(font);
};

const addWordUI = () => {
    homePage.setAttribute("aria-hidden", "true");
    addWordPage.setAttribute("aria-hidden", "false");
};

const getRandomNumber = () => {
    let max = words.length - 1;
    return Math.floor(Math.random() * (max - 0) + 0);
};

const fillOriginalArray = () => {
    words.push(...usedWords);
    usedWords.splice(0, words.length);
};

const setCanvasStyles = () => {
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "#763c09";
    ctx.font = "800 28px Baloo";
};

const drawLine = (moveToX, moveToY, lineToX, lineToY) => {
    ctx.beginPath();
    ctx.moveTo(moveToX, moveToY);
    ctx.lineTo(lineToX, lineToY);
    ctx.closePath();
    ctx.stroke();
};

const drawCircle = (x, y, radius, startAngle) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
};

const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLine(69, 284, 213, 284);
};

const drawKeyFields = () => {
    let initialXAxis = (312 - (lineWidth * currentWord.length + gap * (currentWord.length - 1))) / 2;

    for (let i = 0; i < currentWord.length; i++) {
        xAxis.push(initialXAxis);
        drawLine(initialXAxis, 360, initialXAxis + lineWidth, 360);
        initialXAxis = initialXAxis + lineWidth + gap;
    }
};

const drawCorrectKeys = (position, key) => {
    let keyWidth = ctx.measureText(key.toUpperCase()).width,
        keyPosition = xAxis[position] + (lineWidth - keyWidth) / 2;
    ctx.fillText(key.toUpperCase(), keyPosition, 354);
};

const drawIncorrectKeys = (text) => {
    let keysWidth = (312 - ctx.measureText(text).width) / 2;

    ctx.clearRect(0, 367, canvas.width, 48);
    ctx.fillText(text.toUpperCase(), keysWidth, 403);
};

const drawHangman = (count) => {
    const x = [
        [],
        [96, 284, 96, 24],
        [96, 24, 213, 24],
        [213, 24, 213, 56],
        [213, 86, 30, 0],
        [213, 116, 213, 176],
        [213, 126, 188, 151],
        [213, 126, 238, 151],
        [213, 176, 188, 201],
        [213, 176, 238, 201],
    ];

    if (count === 4) {
        drawCircle(x[count][0], x[count][1], x[count][2], x[count][3]);
    } else {
        drawLine(x[count][0], x[count][1], x[count][2], x[count][3]);
    }
};

const clearGame = () => {
    usedKeys = [];
    wrongKeys = "";
    hitCounter = 0;
    errorCounter = 0;
    randomNumber = getRandomNumber();

    if (words.length !== 0) {
        currentWord = words[randomNumber];
        usedWords.push(words[randomNumber]);
        words.splice(randomNumber, 1);
    } else {
        fillOriginalArray();
    }

    input.value = "";
    if (input.hasAttribute("disabled")) {
        input.removeAttribute("disabled");
    }
    clearCanvas();
};

const surrender = () => {
    fillOriginalArray;
    gamePage.setAttribute("aria-hidden", "true");
    homePage.setAttribute("aria-hidden", "false");
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
                        drawCorrectKeys(i, pressedKey);
                    }
                }
                if (hitCounter === currentWord.length) {
                    input.setAttribute("disabled", "");
                    alert("Ganó");
                }
                break;
            default:
                errorCounter++;
                wrongKeys = wrongKeys + " " + pressedKey;
                drawHangman(errorCounter);
                drawIncorrectKeys(wrongKeys);

                if (errorCounter === 9) {
                    input.setAttribute("disabled", "");
                    alert("Perdió");
                }
                break;
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    loadFont();
    input.value = "";
});

document.addEventListener("click", () => {
    input.focus();
});
startGameButton.addEventListener("click", () => {
    homePage.setAttribute("aria-hidden", "true");
    gamePage.setAttribute("aria-hidden", "false");
    setCanvasStyles();
    clearGame();
    drawKeyFields();
});
addWordButton.addEventListener("click", addWordUI);
newGameButton.addEventListener("click", () => {
    setCanvasStyles();
    clearGame();
    drawKeyFields();
});
surrenderButton.addEventListener("click", surrender);

input.addEventListener("input", hangman);
