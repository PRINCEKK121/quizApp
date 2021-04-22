const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const category = document.querySelector('#categoryType');
const progressBarFull = document.querySelector('#progressBarFull');
const loader = document.querySelector('#loader');
const game = document.querySelector('#game');

let currentQuestion = {};
const categoryScores = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

// Getting the data passed from index.html
const { numOfQuestions, category: categoryIndex } = JSON.parse(
  localStorage.getItem('data')
);

let questions = [];

// CONSTANTS
const CORRECT_BONUS = 10;
const MIN_QUESTIONS = numOfQuestions < 3 ? 3 : numOfQuestions;

const displayCategory = (index) => {
  console.log(category);
  switch (index) {
    case 9:
      category.innerText += 'General Knowledge';
      break;
    case 18:
      category.innerText += 'Computer Science';
      break;
    case 21:
      category.innerText += 'Sports';
      break;
  }
};

fetch(
  `https://opentdb.com/api.php?amount=${MIN_QUESTIONS}&category=${categoryIndex}&difficulty=easy&type=multiple`
)
  .then((res) => res.json())
  .then((loadedQuestions) => {
    questions = loadedQuestions.results.map(
      ({ question, incorrect_answers, correct_answer }) => {
        const formattedQuestion = {
          question,
        };

        const answerChoices = [...incorrect_answers];

        formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
        answerChoices.splice(formattedQuestion.answer - 1, 0, correct_answer);
        answerChoices.forEach((choice, index) => {
          formattedQuestion[`choice${index + 1}`] = choice;
        });

        return formattedQuestion;
      }
    );

    displayCategory(categoryIndex);
    startGame();
  });

const startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();

  game.classList.remove('hidden');
  loader.classList.add('hidden');
};

const getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MIN_QUESTIONS) {
    
    const highScoresData = {
      generalKnowledge: [],
      computerScience: [],
      sports: [],
    };
    
    localStorage.setItem('categoryScores', JSON.stringify(highScoresData));
    localStorage.setItem('mostRecentScore', score);
    return window.location.assign('/end.html');
  }

  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MIN_QUESTIONS}`;

  // update the progress bar
  progressBarFull.style.width = `${(questionCounter / MIN_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerHTML = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset['number'];
    choice.innerHTML = currentQuestion[`choice${number}`];
  });

  availableQuestions.splice(questionIndex, 1);

  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener('click', (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset['number'];

    const classToApply =
      Number(selectedAnswer) === currentQuestion.answer
        ? 'correct'
        : 'incorrect';

    if (classToApply === 'correct') {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

const incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
