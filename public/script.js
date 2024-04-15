const factElement = document.getElementById('fact');
const trueButton = document.getElementById('trueButton');
const falseButton = document.getElementById('falseButton');
const resultElement = document.getElementById('gameResult');
const correctCountElement = document.getElementById('correctCount');
const incorrectCountElement = document.getElementById('incorrectCount');
const livesCountElement = document.getElementById('livesCount');
const gameOverMessage = document.getElementById('gameOverMessage');
const newFactButton = document.createElement('button'); // Creating a new button for fetching new fact.
const panelElement = document.querySelector('.panel');  // To replace content on game over


let currentFact = '';
let currentFactIsTrue = false;
let currentFactExplanation = '';
let correctCount = 0;
let incorrectCount = 0;
let lives = 3;

async function fetchFact() {
  trueButton.disabled = false;
  falseButton.disabled = false;
  trueButton.style.display = ''; // Show the True and False buttons
  falseButton.style.display = '';

  factElement.innerText = '';
  resultElement.innerHTML = '';

  try {
    const response = await fetch('/api/fact');
    const data = await response.json();
    currentFact = data.fact;
    currentFactIsTrue = data.isTrue;
    currentFactExplanation = data.explain;
    factElement.innerText = currentFact;
    resultElement.innerHTML = ''; // Clear the result element until a new answer is submitted
  } catch (error) {
    console.error('Error fetching fact:', error);
  }
}

function checkAnswer(answer) {
  let correctness = currentFactIsTrue ? 'True' : 'False';
  let resultText = '';
  if (answer === currentFactIsTrue) {
    resultText = `<p class="text-2xl text-green-500 font-bold">Correct! The statement is ${correctness}.</p><p>&nbsp;</p>`;
    correctCount++;
  } else {
    incorrectCount++;
    lives--;

    if (lives === 0) {
      panelElement.innerHTML = `
        <div class="game-over-container">
          <h2>Game Over!</h2>
          <p>Your final score:</p>
          <p><strong>${correctCount} Correct</strong> | <strong>${incorrectCount} Incorrect</strong></p>
          <a href="#" onclick="shareToTwitter()" class="share-button">Share to Twitter</a>
        </div>`;
      return;
    } else {
      resultText = `<p class="text-2xl text-red-500 font-bold">Incorrect! The statement is ${correctness}.</p><p>&nbsp;</p>`;
    }
  }

  // Append both result text and explanation
  resultElement.innerHTML = resultText + `<p>${currentFactExplanation}</p>`;
  correctCountElement.innerText = correctCount;
  incorrectCountElement.innerText = incorrectCount;
  livesCountElement.innerText = lives;
  trueButton.style.display = 'none';
  falseButton.style.display = 'none';

  // Show new fact button
  newFactButton.innerText = 'New Fact';
  newFactButton.classList.add('bg-blue-500', 'hover:bg-blue-600', 'text-white', 'text-lg', 'px-6', 'py-2', 'rounded-lg', 'mt-8', 'w-full', 'transition', 'duration-200');
  newFactButton.onclick = fetchFact;
  resultElement.appendChild(newFactButton);
}

trueButton.addEventListener('click', () => {
  checkAnswer(true);
});

falseButton.addEventListener('click', () => {
  checkAnswer(false);
});

function shareToTwitter() {
  const tweet = `I scored ${correctCount} correct and ${incorrectCount} incorrect in the True or False game!`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
  window.open(url, '_blank');
}


document.getElementById('newGameButton').addEventListener('click', () => {
  correctCount = 0;
  incorrectCount = 0;
  lives = 3;
  correctCountElement.innerText = correctCount;
  incorrectCountElement.innerText = incorrectCount;
  livesCountElement.innerText = lives;
  gameOverMessage.classList.add('hidden');
  fetchFact(); // Start a new game immediately
});

fetchFact(); // Initial fetch
