let selectedWord = {};
let guessedLetters = [];
let incorrectGuesses = 0;
const maxGuesses = 7;

const wordDisplay = document.getElementById("wordDisplay");
const hintDisplay = document.getElementById("hintDisplay");
const incorrectDisplay = document.getElementById("incorrectDisplay");
const hangmanImage = document.getElementById("hangmanImage");
const keyboard = document.getElementById("keyboard");
const winMessage = document.getElementById("winMessage");
const loseMessage = document.getElementById("loseMessage");
const correctWordMessage = document.getElementById("correctWordMessage");

async function fetchWords() {
    const response = await fetch("../data/words.json");
    return response.json();
}

async function startGame() {
    const words = await fetchWords();
    guessedLetters = [];
    incorrectGuesses = 0;
    selectedWord = words[Math.floor(Math.random() * words.length)];

    wordDisplay.textContent = "_ ".repeat(selectedWord.word.length).trim();
    hintDisplay.textContent = `Hint: ${selectedWord.hint}`;
    incorrectDisplay.textContent = `Incorrect guesses: 0/${maxGuesses}`;
    hangmanImage.src = "../images/hangman1.jpeg";

    keyboard.innerHTML = "";
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(letter => {
        const button = document.createElement("button");
        button.textContent = letter;
        button.addEventListener("click", () => handleGuess(letter));
        keyboard.appendChild(button);
    });

    winMessage.style.display = "none";
    loseMessage.style.display = "none";
}

function handleGuess(letter) {
    guessedLetters.push(letter);
    const buttons = Array.from(keyboard.children);
    buttons.find(btn => btn.textContent === letter).disabled = true;

    if (selectedWord.word.toUpperCase().includes(letter)) {
        const updatedWord = selectedWord.word
            .split("")
            .map(char => (guessedLetters.includes(char.toUpperCase()) ? char : "_"))
            .join(" ");
        wordDisplay.textContent = updatedWord;

        if (!updatedWord.includes("_")) {
            endGame("win");
        }
    } else {
        incorrectGuesses++;
        incorrectDisplay.textContent = `Incorrect guesses: ${incorrectGuesses}/${maxGuesses}`;
        hangmanImage.src = incorrectGuesses <= 4
            ? `../images/hangman${incorrectGuesses + 2}.jpg`
            : "../images/hangman6.jpg";

        const wrongGuessAudio = document.getElementById("wrongGuessAudio");
        wrongGuessAudio.currentTime = 0;
        wrongGuessAudio.play();

        if (incorrectGuesses >= maxGuesses) {
            endGame("lose");
        }
    }
}

function endGame(result) {
    if (result === "win") {
        const winAudio = document.getElementById("winAudio");
        winAudio.currentTime = 0;
        winAudio.play();

        winMessage.style.display = "block";
        correctWordMessage.textContent = `Word was '${selectedWord.word}'.`;
    } else {
        loseMessage.style.display = "block";
        document.getElementById("revealWordMessage").textContent = `Word was '${selectedWord.word}'.`;
    }
}

document.getElementById("playAgainWinButton").addEventListener("click", startGame);
document.getElementById("playAgainLoseButton").addEventListener("click", startGame);
startGame();
