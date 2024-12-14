// yetanotherwordlegame.js

document.addEventListener('DOMContentLoaded', () => {
  const wordleBoard = document.getElementById('wordleBoard');
  const wordleInput = document.getElementById('wordleInput');
  const wordleMessage = document.getElementById('wordleMessage');
  const startWordleButton = document.getElementById('startWordleButton');
  const powerUpButton = document.getElementById('powerUpButton');
  const wordleKeyboard = document.getElementById('wordleKeyboard');
  const themeDisplay = document.getElementById('themeLetters');
  const roundIndicator = document.getElementById('roundIndicator');
  const correctGuessMessage = document.getElementById('correctGuessMessage');
  const confettiContainer = document.getElementById('confetti');
  const progressBar = document.getElementById('progressBar');
  const resetButton = document.getElementById('resetButton');

  // Anagram puzzle solution
  const anagramSolution = "a tall cat will go racing".toLowerCase();

  // Get references to the puzzle elements
  const anagramPuzzle = document.getElementById('anagramPuzzle');
  const anagramInput = document.getElementById('anagramInput');
  const solveAnagramButton = document.getElementById('solveAnagramButton');
  const anagramMessage = document.getElementById('anagramMessage');

  // Disable Start Game button until puzzle solved
  startWordleButton.disabled = true;
  startWordleButton.classList.add('opacity-50', 'cursor-not-allowed');

  solveAnagramButton.addEventListener('click', () => {
    const userAnswer = anagramInput.value.trim().toLowerCase();
    if (userAnswer === anagramSolution) {
      anagramMessage.textContent = "Correct! You may now start the game.";
      anagramMessage.classList.remove('text-red-600');
      anagramMessage.classList.add('text-green-600');
      startWordleButton.disabled = false;
      startWordleButton.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
      anagramMessage.textContent = "Incorrect! Try again.";
      anagramMessage.classList.remove('text-green-600');
      anagramMessage.classList.add('text-red-600');
    }
  });

  // Static setup: single theme and single word
  const theme = "What is your surprise?";
  const secretWord = "chcgo";
  const wordLength = secretWord.length;
  let maxGuesses = 6;
  let guesses = [];
  let currentGuess = '';
  let gameOver = false;
  let usedPowerUp = false;
  const totalRounds = 3;
  let currentRound = 0;

  function initializeWordleGame() {
    usedPowerUp = false;
    gameOver = false;
    guesses = [];
    currentGuess = '';
    wordleMessage.textContent = `Theme: ${theme}`;
    themeDisplay.textContent = theme;
    createBoard();
    createKeyboard();
    wordleInput.disabled = false;
    wordleInput.value = '';
    wordleInput.focus();
    powerUpButton.disabled = false;
    powerUpButton.textContent = "Use Power-Up";
    updateKeyboard();
    showRoundIndicator();
    updateProgressBar();
  }

  function createBoard() {
    wordleBoard.innerHTML = '';
    for (let i = 0; i < maxGuesses; i++) {
      const row = document.createElement('div');
      row.classList.add('wordle-row');
      row.style.gridTemplateColumns = `repeat(${wordLength}, 50px)`;
      for (let j = 0; j < wordLength; j++) {
        const cell = document.createElement('div');
        cell.classList.add('wordle-cell');
        row.appendChild(cell);
      }
      wordleBoard.appendChild(row);
    }
  }

  function createKeyboard() {
    const keys = [
      'Q','W','E','R','T','Y','U','I','O','P',
      'A','S','D','F','G','H','J','K','L',
      'Ent','Z','X','C','V','B','N','M','BCK'
    ];
    wordleKeyboard.innerHTML = '';
    const firstRow = document.createElement('div');
    firstRow.classList.add('flex', 'justify-center', 'mb-2');
    keys.slice(0,10).forEach(key => {
      const keyButton = document.createElement('div');
      keyButton.classList.add('wordle-key');
      keyButton.textContent = key;
      keyButton.addEventListener('click', () => handleKeyPress(key));
      firstRow.appendChild(keyButton);
    });
    wordleKeyboard.appendChild(firstRow);

    const secondRow = document.createElement('div');
    secondRow.classList.add('flex', 'justify-center', 'mb-2');
    keys.slice(10,19).forEach(key => {
      const keyButton = document.createElement('div');
      keyButton.classList.add('wordle-key');
      keyButton.textContent = key;
      keyButton.addEventListener('click', () => handleKeyPress(key));
      secondRow.appendChild(keyButton);
    });
    wordleKeyboard.appendChild(secondRow);

    const thirdRow = document.createElement('div');
    thirdRow.classList.add('flex', 'justify-center');
    keys.slice(19).forEach(key => {
      const keyButton = document.createElement('div');
      keyButton.classList.add('wordle-key');
      keyButton.textContent = key;
      keyButton.addEventListener('click', () => handleKeyPress(key));
      thirdRow.appendChild(keyButton);
    });
    wordleKeyboard.appendChild(thirdRow);
  }

  function updateKeyboard() {
    guesses.forEach(guessObj => {
      const { guess, feedback } = guessObj;
      guess.split('').forEach((letter, index) => {
        const key = letter.toUpperCase();
        const keyButton = Array.from(wordleKeyboard.querySelectorAll('.wordle-key')).find(btn => btn.textContent === key);
        if (keyButton) {
          if (feedback[index] === 'correct') {
            keyButton.classList.remove('present','absent');
            keyButton.classList.add('correct','animate-press');
            setTimeout(() => keyButton.classList.remove('animate-press'), 600);
          } else if (feedback[index] === 'present') {
            if (!keyButton.classList.contains('correct')) {
              keyButton.classList.remove('absent');
              keyButton.classList.add('present','animate-press');
              setTimeout(() => keyButton.classList.remove('animate-press'), 600);
            }
          } else {
            if (!keyButton.classList.contains('correct') && !keyButton.classList.contains('present')) {
              keyButton.classList.add('absent','animate-press');
              setTimeout(() => keyButton.classList.remove('animate-press'), 600);
            }
          }
        }
      });
    });
  }

  wordleInput.addEventListener('keydown', (e) => {
    if (gameOver) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      submitGuess();
    } else if (e.key === 'Backspace') {
      currentGuess = currentGuess.slice(0, -1);
      updateBoardUI();
    } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < wordLength) {
      currentGuess += e.key.toUpperCase();
      updateBoardUI();
    }
  });

  function handleKeyPress(key) {
    if (gameOver) return;
    if (key === 'Ent') {
      submitGuess();
    } else if (key === 'BCK') {
      currentGuess = currentGuess.slice(0, -1);
      updateBoardUI();
    } else {
      if (currentGuess.length < wordLength) {
        currentGuess += key.toUpperCase();
        updateBoardUI();
      }
    }
  }

  function updateBoardUI() {
    const currentRow = wordleBoard.children[guesses.length];
    Array.from(currentRow.children).forEach((cell, index) => {
      cell.textContent = currentGuess[index] || '';
    });
  }

  function submitGuess() {
    if (gameOver) return;
    if (currentGuess.length !== wordLength) {
      wordleMessage.textContent = `Please enter a ${wordLength}-letter word.`;
      return;
    }

    const feedback = getFeedback(currentGuess.toLowerCase());
    guesses.push({ guess: currentGuess.toLowerCase(), feedback });
    updateBoardColors(feedback);
    updateKeyboard();
    currentGuess = '';
    updateBoardUI();
    wordleMessage.textContent = '';
    updateProgressBar();

    if (guesses[guesses.length - 1].guess === secretWord) {
      wordleMessage.textContent = "Congratulations! You've guessed the word!";
      wordleInput.disabled = true;
      powerUpButton.disabled = true;
      displayCorrectGuess();
      triggerConfetti();
      proceedToNextRound(true);
      saveGameState(true);
      return;
    }

    if (guesses.length === maxGuesses) {
      wordleMessage.textContent = `You've run out of guesses! The word was "${secretWord.toUpperCase()}".`;
      wordleInput.disabled = true;
      powerUpButton.disabled = true;
      proceedToNextRound(false);
      saveGameState(false);
      return;
    }
  }

  function getFeedback(guess) {
    const feedback = Array(wordLength).fill('absent');
    const secretArr = secretWord.split('');

    for (let i = 0; i < wordLength; i++) {
      if (guess[i] === secretArr[i]) {
        feedback[i] = 'correct';
        secretArr[i] = null;
      }
    }

    for (let i = 0; i < wordLength; i++) {
      if (feedback[i] === 'correct') continue;
      const index = secretArr.indexOf(guess[i]);
      if (index !== -1) {
        feedback[i] = 'present';
        secretArr[index] = null;
      }
    }

    return feedback;
  }

  function updateBoardColors(feedback) {
    const currentRow = wordleBoard.children[guesses.length - 1];
    Array.from(currentRow.children).forEach((cell, index) => {
      cell.classList.remove('animate-flip','bounce');
      void cell.offsetWidth;
      cell.classList.add(feedback[index],'animate-flip','bounce');
      setTimeout(() => cell.classList.remove('animate-flip','bounce'), 1000);
    });
  }

  powerUpButton.addEventListener('click', () => {
    if (usedPowerUp) {
      wordleMessage.textContent = "You have already used your power-up for this game.";
      return;
    }

    const powerUpChoice = prompt("Choose a Power-Up:\n1. Reveal a Letter\n2. Get an Extra Guess");
    if (powerUpChoice === '1') {
      revealLetterFunction();
      usedPowerUp = true;
    } else if (powerUpChoice === '2') {
      getExtraGuessFunction();
      usedPowerUp = true;
    } else {
      wordleMessage.textContent = "Invalid Power-Up choice.";
    }
  });

  function revealLetterFunction() {
    for (let i = 0; i < wordLength; i++) {
      const cell = wordleBoard.children[guesses.length].children[i];
      if (cell.textContent === '') {
        cell.classList.remove('correct','present','absent','animate-flip','bounce');
        void cell.offsetWidth;
        cell.textContent = secretWord[i].toUpperCase();
        cell.classList.add('correct','animate-flip','bounce');
        setTimeout(() => cell.classList.remove('animate-flip','bounce'), 1000);

        const key = secretWord[i].toUpperCase();
        const keyButton = Array.from(wordleKeyboard.querySelectorAll('.wordle-key')).find(btn => btn.textContent === key);
        if (keyButton) {
          keyButton.classList.remove('present','absent','animate-press');
          void keyButton.offsetWidth;
          keyButton.classList.add('correct','animate-press');
          setTimeout(() => keyButton.classList.remove('animate-press'), 600);
        }
        break;
      }
    }
  }

  function getExtraGuessFunction() {
    maxGuesses += 1;
    const row = document.createElement('div');
    row.classList.add('wordle-row');
    row.style.gridTemplateColumns = `repeat(${wordLength}, 50px)`;
    for (let j = 0; j < wordLength; j++) {
      const cell = document.createElement('div');
      cell.classList.add('wordle-cell');
      row.appendChild(cell);
    }
    wordleBoard.appendChild(row);
    wordleMessage.textContent = "An extra guess has been added!";
    updateProgressBar();
  }

  function proceedToNextRound(won) {
    // End game logic since static
    gameOver = true;
  }

  function saveGameState(won) {
    localStorage.setItem('wordle_last_played', 'static-game');
    localStorage.setItem('wordle_won', won);
  }

  function hasPlayedToday() {
    const lastPlayed = localStorage.getItem('wordle_last_played');
    return lastPlayed === 'static-game';
  }

  startWordleButton.addEventListener('click', () => {
    if (hasPlayedToday()) {
      wordleMessage.textContent = "You have already played today's game.";
      wordleInput.disabled = true;
      powerUpButton.disabled = true;
      return;
    }
    initializeWordleGame();
  });

  if (!hasPlayedToday()) {
    // Wait for user to click Start
  } else {
    wordleMessage.textContent = "You have already played today's game.";
    wordleInput.disabled = true;
    powerUpButton.disabled = true;
    themeDisplay.textContent = theme;
    updateProgressBar();
  }

  function showRoundIndicator() {
    const roundText = `Round ${currentRound + 1}`;
    roundIndicator.textContent = roundText;
    roundIndicator.classList.remove('animate-fade-out');
    roundIndicator.classList.add('animate-fade-in');
    setTimeout(() => {
      roundIndicator.classList.remove('animate-fade-in');
      roundIndicator.classList.add('animate-fade-out');
    }, 2500);
  }

  function displayCorrectGuess() {
    correctGuessMessage.textContent = "Correct Guess!";
    correctGuessMessage.style.display = 'flex';
    correctGuessMessage.classList.remove('hidden');
    correctGuessMessage.classList.add('animate-fade-in');
    setTimeout(() => {
      correctGuessMessage.classList.remove('animate-fade-in');
      correctGuessMessage.classList.add('animate-fade-out');
      setTimeout(() => {
        correctGuessMessage.classList.add('hidden');
        correctGuessMessage.classList.remove('animate-fade-out');
        correctGuessMessage.textContent = '';
      }, 1000);
    }, 3000);
  }

  function triggerConfetti() {
    startConfetti();
  }

  function updateProgressBar() {
    const progress = (guesses.length / maxGuesses) * 100;
    progressBar.style.width = `${progress}%`;
  }

  function createConfettiPiece() {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti-piece');
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = `hsl(${Math.random()*360},100%,50%)`;
    confetti.style.animationDuration = `${Math.random()*3+2}s`;
    confettiContainer.appendChild(confetti);
    confetti.addEventListener('animationend', () => {
      confetti.remove();
    });
  }

  function startConfetti() {
    const confettiInterval = setInterval(() => {
      createConfettiPiece();
      if (confettiContainer.children.length > 200) {
        clearInterval(confettiInterval);
      }
    }, 200);
  }

  resetButton.addEventListener('click', () => {
    initializeWordleGame();
    wordleMessage.textContent = "Game has been reset.";
  });
});
