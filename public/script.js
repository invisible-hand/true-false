const factElement = document.getElementById('fact');
const trueButton = document.getElementById('trueButton');
const falseButton = document.getElementById('falseButton');
const resultElement = document.getElementById('result');
const explanationElement = document.getElementById('explanation');
const correctCountElement = document.getElementById('correctCount');
const incorrectCountElement = document.getElementById('incorrectCount');
const livesCountElement = document.getElementById('livesCount');
const resultPopup = document.getElementById('resultPopup');

let currentFact = '';
let currentFactIsTrue = false;
let currentFactExplanation = '';
let correctCount = 0;
let incorrectCount = 0;
let lives = 5;

async function fetchFact() {
  try {
    const response = await fetch('/api/fact');
    const data = await response.json();
    currentFact = data.fact;
    currentFactIsTrue = data.isTrue;
    currentFactExplanation = data.explain;
    factElement.innerText = currentFact;
    resultElement.innerText = '';
    explanationElement.innerText = '';
  } catch (error) {
    console.error('Error fetching fact:', error);
  }
}

function checkAnswer(answer) {
  if (answer === currentFactIsTrue) {
    resultElement.innerHTML = '<p class="text-4xl text-green-500 font-bold">Correct answer!</p>';
    correctCount++;
    correctCountElement.innerText = correctCount;
  } else {
    resultElement.innerHTML = '<p class="text-4xl text-red-500 font-bold">Wrong answer.</p>';
    incorrectCount++;
    incorrectCountElement.innerText = incorrectCount;
    lives--;
    livesCountElement.innerText = lives;
    if (lives === 0) {
      resultElement.innerHTML += '<p class="text-2xl text-red-500 font-bold">Game Over!</p>';
      trueButton.disabled = true;
      falseButton.disabled = true;
    }
  }
  explanationElement.innerText = currentFactExplanation;
  resultPopup.classList.add('show');
}

trueButton.addEventListener('click', () => {
  checkAnswer(true);
});

falseButton.addEventListener('click', () => {
  checkAnswer(false);
});

document.getElementById('newFact').addEventListener('click', () => {
  resultPopup.classList.remove('show');
  fetchFact();
});

fetchFact();