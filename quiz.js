const questions = [
  {
    question: "1. What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tabular Markup Language", "None of these"],
    answer: "Hyper Text Markup Language"
  },
  {
    question: "2. Which HTML tag is used to link an external CSS file?",
    options: ["<style>", "<css>", "<link>", "<script>"],
    answer: "<link>"
  },
  {
    question: "3. Which CSS property is used to change the text color?",
    options: ["text-color", "color", "font-color", "background-color"],
    answer: "color"
  },
  {
    question: "4. Inside which HTML element do we put the JavaScript code?",
    options: ["<js>", "<javascript>", "<script>", "<code>"],
    answer: "<script>"
  },
  {
    question: "5. How do you select an element with id 'demo' in JavaScript?",
    options: ["document.getElement('demo')", "document.getElementById('demo')", "document.query('#demo')", "getElementById('demo')"],
    answer: "document.getElementById('demo')"
  },
  {
    question: "6. Which symbol is used for single-line comments in JavaScript?",
    options: ["<!-- -->", "//", "/* */", "#"],
    answer: "//"
  },
  {
    question: "7. Which HTML5 tag is used for the main navigation links?",
    options: ["<navigation>", "<navbar>", "<nav>", "<header>"],
    answer: "<nav>"
  },
  {
    question: "8. Which CSS layout mode arranges items in rows or columns easily?",
    options: ["Float", "Flexbox", "Inline", "Block"],
    answer: "Flexbox"
  },
  {
    question: "9. Which object in the browser allows saving data even after refreshing?",
    options: ["localStorage", "sessionData", "cookieStorage", "browserSave"],
    answer: "localStorage"
  },
  {
    question: "10. Which array property returns the total number of items in an array?",
    options: [".size", ".count", ".index", ".length"],
    answer: ".length"
  }
];

console.log("Loaded Questions:", questions);

let currentIndex = 0;
let score = 0;
let userAnswers = [];
let timer;
let timeLeft = 15;

const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const bestScoreText = document.getElementById("bestScoreText");
const questionCounter = document.getElementById("questionCounter");
const timerText = document.getElementById("timerText");
const progressBar = document.getElementById("progressBar");
const questionText = document.getElementById("questionText");
const optionsBox = document.getElementById("optionsBox");
const feedbackText = document.getElementById("feedbackText");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const themeBtn = document.getElementById("themeBtn");

window.onload = function () {
  const savedTheme = localStorage.getItem("quizTheme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.innerText = "Light Mode";
  }

  const savedBest = localStorage.getItem("bestQuizScore");
  if (savedBest !== null) {
    bestScoreText.innerText = savedBest;
  }
};

function calculatePercentage(userScore, totalQuestions) {
  const percent = (userScore / totalQuestions) * 100;
  return Math.round(percent);
}

const getResultMessage = (percent) => {
  if (percent >= 80) {
    return "Excellent job! You know your Web Dev basics well!";
  } else if (percent >= 50) {
    return "Good effort! Keep practising.";
  } else {
    return "Try again! Review the notes and give it another shot.";
  }
};

function startQuiz() {
  currentIndex = 0;
  score = 0;
  userAnswers = [];

  startScreen.classList.add("hide");
  resultScreen.classList.add("hide");
  quizScreen.classList.remove("hide");

  showQuestion();
}

function showQuestion() {
  optionsBox.innerHTML = "";
  feedbackText.innerText = "";
  nextBtn.disabled = true;

  const currentQ = questions[currentIndex];
  questionText.innerText = currentQ.question;
  questionCounter.innerText = "Question " + (currentIndex + 1) + " of " + questions.length;

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  progressBar.style.width = progressPercent + "%";

  for (let i = 0; i < currentQ.options.length; i++) {
    const optionBtn = document.createElement("button");
    optionBtn.innerText = currentQ.options[i];
    optionBtn.className = "option-btn";

    optionBtn.addEventListener("click", function () {
      checkAnswer(currentQ.options[i], optionBtn);
    });

    optionsBox.appendChild(optionBtn);
  }

  startTimer();
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 15;
  timerText.innerText = "Time Left: " + timeLeft + "s";

  timer = setInterval(function () {
    timeLeft--;
    timerText.innerText = "Time Left: " + timeLeft + "s";

    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeOut();
    }
  }, 1000);
}

function handleTimeOut() {
  const currentQ = questions[currentIndex];
  feedbackText.innerText = "Time's up! Correct answer: " + currentQ.answer;
  feedbackText.style.color = "#ef4444";

  userAnswers.push("No Answer (Timed Out)");
  disableAllOptions(currentQ.answer);
  nextBtn.disabled = false;
}

function checkAnswer(selectedOption, clickedButton) {
  clearInterval(timer);

  const currentQ = questions[currentIndex];
  userAnswers.push(selectedOption);

  if (selectedOption === currentQ.answer) {
    score++;
    clickedButton.classList.add("correct");
    feedbackText.innerText = "Correct Answer!";
    feedbackText.style.color = "#22c55e";
  } else {
    clickedButton.classList.add("wrong");
    feedbackText.innerText = "Wrong! The correct answer is " + currentQ.answer;
    feedbackText.style.color = "#ef4444";
  }

  disableAllOptions(currentQ.answer);
  nextBtn.disabled = false;
}

function disableAllOptions(correctAnswer) {
  const allButtons = optionsBox.querySelectorAll(".option-btn");
  for (let i = 0; i < allButtons.length; i++) {
    allButtons[i].disabled = true;
    if (allButtons[i].innerText === correctAnswer) {
      allButtons[i].classList.add("correct");
    }
  }
}

function showResult() {
  quizScreen.classList.add("hide");
  resultScreen.classList.remove("hide");

  const percent = calculatePercentage(score, questions.length);
  document.getElementById("finalScoreText").innerText = "Your Score: " + score + " out of " + questions.length;
  document.getElementById("percentageText").innerText = "Percentage: " + percent + "%";
  document.getElementById("messageText").innerText = getResultMessage(percent);

  const savedBest = localStorage.getItem("bestQuizScore") || 0;
  if (score > Number(savedBest)) {
    localStorage.setItem("bestQuizScore", score);
    bestScoreText.innerText = score;
  }

  const reviewBox = document.getElementById("reviewBox");
  reviewBox.innerHTML = "";

  for (let i = 0; i < questions.length; i++) {
    const itemDiv = document.createElement("div");
    itemDiv.className = "review-item";

    const qPara = document.createElement("p");
    qPara.innerHTML = "<strong>" + questions[i].question + "</strong>";

    const userPara = document.createElement("p");
    userPara.innerText = "Your Answer: " + userAnswers[i];
    if (userAnswers[i] === questions[i].answer) {
      userPara.style.color = "#22c55e";
    } else {
      userPara.style.color = "#ef4444";
    }

    const correctPara = document.createElement("p");
    correctPara.innerText = "Correct Answer: " + questions[i].answer;

    itemDiv.appendChild(qPara);
    itemDiv.appendChild(userPara);
    itemDiv.appendChild(correctPara);
    reviewBox.appendChild(itemDiv);
  }
}

startBtn.addEventListener("click", startQuiz);

nextBtn.addEventListener("click", function () {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

restartBtn.addEventListener("click", startQuiz);

themeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("quizTheme", "dark");
    themeBtn.innerText = "Light Mode";
  } else {
    localStorage.setItem("quizTheme", "light");
    themeBtn.innerText = "Dark Mode";
  }
});
