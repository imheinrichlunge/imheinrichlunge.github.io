// DOM Nodes
const input = document.getElementById("input"),
    output = document.getElementById("output"),
    buttonEncrypt = document.getElementById("button-encrypt"),
    buttonDecrypt = document.getElementById("button-decrypt"),
    buttonCopy = document.getElementById("button-copy"),
    buttonPaste = document.getElementById("button-paste"),
    snackbar = document.getElementById("snackbar");

// Utilities
const vowels = ["a", "e", "i", "o", "u"],
    keys = ["ai", "enter", "imes", "ober", "ufat"],
    regex = /^[a-z\s]*$/;

const addSnackbar = (msg, nodeClass) => {
    snackbar.value = "";
    snackbar.innerText = msg;
    snackbar.classList.add(nodeClass);
    snackbar.setAttribute("aria-hidden", "false");

    visibility = setTimeout(() => {
        snackbar.classList.remove(nodeClass);
        snackbar.setAttribute("aria-hidden", "true");
    }, 6000);
};

const encrypt = () => {
    let inputValue = input.value,
        encryptedText = "";

    if (inputValue === "") {
        addSnackbar("Ningún mensaje fue encontrado", "snackbar--default");
    } else if (regex.test(inputValue)) {
        for (let i = 0; i < inputValue.length; i++) {
            switch (inputValue[i]) {
                case vowels[0]:
                    encryptedText = encryptedText + keys[0];
                    break;
                case vowels[1]:
                    encryptedText = encryptedText + keys[1];
                    break;
                case vowels[2]:
                    encryptedText = encryptedText + keys[2];
                    break;
                case vowels[3]:
                    encryptedText = encryptedText + keys[3];
                    break;
                case vowels[4]:
                    encryptedText = encryptedText + keys[4];
                    break;
                default:
                    encryptedText = encryptedText + inputValue[i];
                    break;
            }
        }
        output.value = encryptedText;
        input.value = "";
    } else {
        addSnackbar("Tu mensaje no cumple con los requisitos, corrígelo.", "snackbar--error");
    }
};

const decrypt = () => {
    let inputValue = input.value;

    if (inputValue === "") {
        addSnackbar("Ningún mensaje fue encontrado", "snackbar--default");
    } else if (regex.test(inputValue)) {
        for (let i = 0; i < vowels.length; i++) {
            inputValue = inputValue.replaceAll(keys[i], vowels[i]);
        }
        output.value = inputValue;
        input.value = "";
    } else {
        addSnackbar("Tu mensaje no cumple con los requisitos, corrígelo.", "snackbar--error");
    }
};

const copyToClipboard = () => {
    const clipboardPromise = navigator.clipboard.writeText(output.value);

    if (output.value !== "") {
        clipboardPromise.then(() => {
            addSnackbar("¡Copiado en el portapapeles!", "snackbar--success");
        });
        clipboardPromise.catch(() => {
            addSnackbar("Error al copiar al portapapeles", "snackbar--error");
        });
    } else {
        addSnackbar("No hay valores para copiar", "snackbar--default");
    }
};

const pasteFromClipboard = () => {
    // Set these properties to true in about:config on Firefox
    // dom.events.asyncClipboard.readText
    // dom.events.testing.asyncClipboard

    const clipboardPromise = navigator.clipboard.readText();

    clipboardPromise.then((clipText) => {
        input.value = clipText;
        input.focus();
    });
    clipboardPromise.catch(() => {
        addSnackbar("Error al copiar al portapapeles", "snackbar--error");
    });
};

buttonEncrypt.addEventListener("click", encrypt);
buttonDecrypt.addEventListener("click", decrypt);
buttonCopy.addEventListener("click", copyToClipboard);
buttonPaste.addEventListener("click", pasteFromClipboard);
document.addEventListener("DOMContentLoaded", () => {
    let uA = navigator.userAgent;
    if (uA.includes("Firefox")) {
        buttonPaste.style.display = "none";
    }
});
