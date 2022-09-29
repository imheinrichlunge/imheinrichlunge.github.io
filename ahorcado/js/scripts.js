const // Containers
    homePage = document.getElementsByClassName("container--home")[0],
    wordsPage = document.getElementsByClassName("container--add-word")[0],
    gamePage = document.getElementsByClassName("container--game")[0],
    // Buttons
    startGameButton = document.getElementById("start-game"),
    wordsPageButton = document.getElementById("add-word"),
    saveWordsButton = document.getElementById("save-word"),
    cancelButton = document.getElementById("cancel"),
    newGameButton = document.getElementById("new-game"),
    surrenderButton = document.getElementById("surrender"),
    snackbar = document.getElementById("snackbar"),
    // Textfields
    newWordsInput = document.getElementById("new-word"),
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
        "temporal",
        "temprano",
    ],
    usedWords = [],
    wordRegex = /^[A-zÑñ]*$/,
    hangmanRegex = /^[A-z]$/;

let lineWidth = 25,
    gap = 12,
    randomNumber,
    xAxis = [],
    currentWord = "",
    usedKeys = [],
    usedKey = false,
    wrongKeys = "",
    hitCounter = 0,
    errorCounter = 0,
    userWords = [],
    visibility;

const loadFont = async () => {
    const font = new FontFace("Baloo", "url(https://fonts.gstatic.com/s/baloo2/v14/wXK0E3kTposypRydzVT08TS3JnAmtdiayppo_lc.woff2)");
    await font.load();
    document.fonts.add(font);
};

const showSnackbar = (msg) => {
    clearTimeout(visibility);
    snackbar.value = "";
    snackbar.innerText = msg;
    snackbar.setAttribute("aria-hidden", "false");

    visibility = setTimeout(() => {
        snackbar.setAttribute("aria-hidden", "true");
    }, 3000);
};

const addUserWords = (e) => {
    if (e.key === "Enter") {
        if (e.target.value.length < 3) {
            showSnackbar("Tienes menos de 3 caracteres");
        } else if (e.target.value.length > 8) {
            showSnackbar("Tienes más de 8 caracteres");
        } else if (!wordRegex.test(e.target.value)) {
            showSnackbar("Tienes caracteres invalidos");
        } else {
            userWords.push(e.target.value.toLowerCase());
            e.target.value = "";

            showSnackbar("Palabra añadida a la lista");
        }
    }
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
    xAxis = [];
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
        showSnackbar("Ya no hay más palabras, la lista se reiniciará");
        fillOriginalArray();
    }

    input.value = "";
    if (input.hasAttribute("disabled")) {
        input.removeAttribute("disabled");
    }
    input.focus();
    clearCanvas();
};

const hangman = (e) => {
    let pressedKey = e.target.value.slice(-1).toLowerCase();

    for (let i = 0; i < usedKeys.length; i++) {
        if (usedKeys[i] === pressedKey) {
            usedKey = true;
        }
    }
    if (hangmanRegex.test(pressedKey)) {
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

                    showSnackbar("Ganó");
                }
                break;
            default:
                errorCounter++;
                wrongKeys = wrongKeys + " " + pressedKey;
                drawHangman(errorCounter);
                drawIncorrectKeys(wrongKeys);

                if (errorCounter === 9) {
                    input.setAttribute("disabled", "");
                    showSnackbar(`Perdió, la palabra era ${currentWord.toUpperCase()}`);
                }
                break;
        }
    }
};

// Load events
document.addEventListener("DOMContentLoaded", () => {
    loadFont();
    input.value = "";
});

// Click events
document.addEventListener("click", () => {
    input.focus();
});
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    input.focus();
});
wordsPageButton.addEventListener("click", () => {
    newWordsInput.value = "";
    homePage.setAttribute("aria-hidden", "true");
    wordsPage.setAttribute("aria-hidden", "false");
    newWordsInput.focus();
});
saveWordsButton.addEventListener("click", () => {
    wordsPage.setAttribute("aria-hidden", "true");
    homePage.setAttribute("aria-hidden", "false");
    if (userWords.length === 0) {
        showSnackbar("No se encontraron palabras");
    } else {
        words.push(...userWords);
        userWords = [];
        showSnackbar("Palabras guardadas y listas para usar");
    }
});
cancelButton.addEventListener("click", () => {
    userWords = [];
    wordsPage.setAttribute("aria-hidden", "true");
    homePage.setAttribute("aria-hidden", "false");

    showSnackbar("No se agregaron palabras");
});
startGameButton.addEventListener("click", () => {
    homePage.setAttribute("aria-hidden", "true");
    gamePage.setAttribute("aria-hidden", "false");
    setCanvasStyles();
    clearGame();
    drawKeyFields();
    // input.focus();
});
newGameButton.addEventListener("click", () => {
    gamePage.setAttribute("aria-hidden", "false");
    setCanvasStyles();
    clearGame();
    drawKeyFields();
    // input.focus();
});
surrenderButton.addEventListener("click", () => {
    fillOriginalArray();
    gamePage.setAttribute("aria-hidden", "true");
    homePage.setAttribute("aria-hidden", "false");
});

// Keyboard events
document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
        e.preventDefault();
    }
});
input.addEventListener("input", hangman);
newWordsInput.addEventListener("keydown", addUserWords);
