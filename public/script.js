const factElement = document.getElementById('fact');
const trueButton = document.getElementById('trueButton');
const falseButton = document.getElementById('falseButton');
const resultElement = document.getElementById('result');
const explanationElement = document.getElementById('explanation');
const correctCountElement = document.getElementById('correctCount');
const incorrectCountElement = document.getElementById('incorrectCount');
const livesCountElement = document.getElementById('livesCount');
const resultPopup = document.getElementById('resultPopup');
const gameOverPopup = document.getElementById('gameOverPopup');

let currentFact = '';
let currentFactIsTrue = false;
let currentFactExplanation = '';
let correctCount = 0;
let incorrectCount = 0;
let lives = 3;

async function fetchFact() {
  try {
    const response = await fetch('/api/fact');
    const data = await response.json();
    currentFact = data.fact;
    currentFactIsTrue = data.isTrue;
    currentFactExplanation = data.explain;
    factElement.innerText = currentFact;
  } catch (error) {
    console.error('Error fetching fact:', error);
  }
}

function checkAnswer(answer) {
  let resultText = '';
  if (answer === currentFactIsTrue) {
    resultText = '<p class="text-4xl text-green-500 font-bold">Correct answer!</p>';
    correctCount++;
    correctCountElement.innerText = correctCount;
  } else {
    resultText = '<p class="text-4xl text-red-500 font-bold">Wrong answer.</p>';
    incorrectCount++;
    incorrectCountElement.innerText = incorrectCount;
    lives--;
    livesCountElement.innerText = lives;
    if (lives === 0) {
      document.getElementById('finalCorrectCount').innerText = correctCount;
      document.getElementById('finalIncorrectCount').innerText = incorrectCount;
      gameOverPopup.classList.add('show');
      trueButton.disabled = true;
      falseButton.disabled = true;
    }
  }
  resultElement.innerHTML = resultText;
  explanationElement.innerText = currentFactExplanation;
  resultPopup.classList.add('show');
  fetchFact();
}

trueButton.addEventListener('click', () => {
  checkAnswer(true);
});

falseButton.addEventListener('click', () => {
  checkAnswer(false);
});

document.getElementById('newFact').addEventListener('click', () => {
  resultPopup.classList.remove('show');
});

document.getElementById('shareButton').addEventListener('click', () => {
  const shareText = `I scored ${correctCount} correct and ${incorrectCount} incorrect in the True or False game!`;
  // Replace this alert with the actual sharing logic for your chosen social network
  alert(`Sharing: ${shareText}`);
});

document.getElementById('newGameButton').addEventListener('click', () => {
  correctCount = 0;
  incorrectCount = 0;
  lives = 3;
  correctCountElement.innerText = correctCount;
  incorrectCountElement.innerText = incorrectCount;
  livesCountElement.innerText = lives;
  gameOverPopup.classList.remove('show');
  trueButton.disabled = false;
  falseButton.disabled = false;
  fetchFact();
});

fetchFact();