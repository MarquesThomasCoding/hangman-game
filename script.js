// Mot à deviner
let currentWord = "";

// Lettres correctement devinées
let guessedLetters = [];

// Lettres incorrectes
let wrongLetters = [];

// Nombre maximum d'essais infructueux
const maxWrongAttempts = 10;

// Nombre d'essais infructueux
let wrongAttempts = 0;

// Fonction pour lancer le jeu
function startGame() {

    // Récupérer les mots à deviner grâce à l'API random-word-api
    fetch("https://random-word-api.herokuapp.com/word")
        .then(response => response.json())
        .then(data => {
            currentWord = data[0];
            // Afficher le mot à deviner
            displayWord();
        })
    .catch(error => console.log(error));

    // Réinitialiser les lettres devinées et incorrectes
    guessedLetters = [];
    wrongLetters = [];
    wrongAttempts = 0;

    // Afficher le clavier
    displayKeyboard();
}

// Afficher le mot à deviner
function displayWord() {
  const wordDisplay = document.getElementById("word-display");
  wordDisplay.innerHTML = currentWord
    .split("")
    .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");
}

// Afficher le clavier
function displayKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.classList.remove("hidden");
  keyboard.innerHTML = "";

  // Ajouter les boutons du clavier
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i).toLowerCase();
    const button = document.createElement("div");
    button.className = "button";
    button.textContent = letter;
    button.addEventListener("click", () => guessLetter(letter, button));
    keyboard.appendChild(button);
  }
}

// Vérifier si la lettre est correcte
function guessLetter(letter, button) {
    if (!guessedLetters.includes(letter)) {
      guessedLetters.push(letter);
      displayWord();
  
      if (!currentWord.includes(letter)) {
        button.classList.add("wrong");
        wrongLetters.push(letter);
        wrongAttempts++;
  
        // Vérifier le nombre d'essais infructueux
        if (wrongAttempts === maxWrongAttempts) {
            const message = document.querySelector(".message");
            message.innerHTML = "You lose !\n The word was <b>" + currentWord + "</b>.";
            message.classList.remove("win");
            message.classList.add("lose");
            startGame();
            return;
        }
      }
      else {
        button.classList.add("correct");
      }
  
      checkGameStatus();
  
      // Désactiver le bouton
      button.removeEventListener("click", () => guessLetter(letter, button));
      button.style.pointerEvents = "none";
    }
  }

// Vérifier si le jeu est gagné ou perdu
function checkGameStatus() {
    const uniqueWordLetters = new Set(currentWord.split(""));
    const correctlyGuessedSet = new Set(guessedLetters);
  
    if (Array.from(uniqueWordLetters).every(letter => correctlyGuessedSet.has(letter))) {
      const message = document.querySelector(".message");
      message.innerHTML = "You won ! The word was <b>" + currentWord + "</b>. ";
      message.classList.remove("lose");
      message.classList.add("win");
      startGame();
    }
  }