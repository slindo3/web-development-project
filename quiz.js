//code for quiz interactivity

//questions
const questions = [
  {
    question: "What is Web 1.0 mostly known for?",
    options: [
      "a. Reading static websites",
      "b. Writing blogs",
      "c. Watching videos",
      "d. Playing games with friends"
    ],
    correct: "a. Reading static websites"
  },
  {
    question: "What makes Web 2.0 different from Web 1.0?",
    options: [
      "a. It uses only black and white pages",
      "b. It doesn't work on phones",
      "c. It allows people to interact and post content",
      "d. It runs without the internet"
    ],
    correct: "c. It allows people to interact and post content"
  },
  {
    question: "Which one is a goal of Web 3.0?",
    options: [
      "a. Make websites slower",
      "b. Let users control their own data",
      "c. Implement AI features",
      "d. Creating gifs"
    ],
    correct: "b. Let users control their own data"
  },
  {
    type: "text",
    question: "Fill in the blank: Who is known as the inventor of the World Wide Web?",
    correct: "Tim Berners-Lee"
  },
  {
    type: "checkbox",
    question: "Which sources were used to help create this website? (Select all that apply)",
    options: [
      "a. W3Schools HTML Tutorial",
      "b. MDN Web Docs",
      "c. YouTube Web Evolution Video",
      "d. TikTok",
      "e. GitHub"
    ],
    correct: [
      "a. W3Schools HTML Tutorial",
      "b. MDN Web Docs",
      "c. YouTube Web Evolution Video"
    ]
  }
];

//interactive javascript options
const quizContainer = document.querySelector(".quiz-container");
const questionElement = document.querySelector(".question");
const optionsContainer = document.querySelector(".options");
const submitBtn = document.querySelector(".submit-btn");

let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

function showQuestion() { //shows each question dynamically
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    optionsContainer.innerHTML = "";

    if (currentQuestion.type === "text") {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "text-input";
        optionsContainer.appendChild(input);
    } else if (currentQuestion.type === "checkbox") {
        currentQuestion.options.forEach(option => {
            const label = document.createElement("label");
            label.style.display = "block";
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = option;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(option));
            optionsContainer.appendChild(label);
        });
    } else {
        currentQuestion.options.forEach(option => {
            const label = document.createElement("label");
            label.style.display = "block";
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "quizOption";
            radio.value = option;
            label.appendChild(radio);
            label.appendChild(document.createTextNode(option));
            optionsContainer.appendChild(label);
        });
    }
}

//code for fill in the blank question and how to validate answer from user
function getUserAnswer() { //retrieves the user's answer based on input type
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.type === "text") {
        const input = document.querySelector(".text-input");
        return input ? input.value.trim() : "";
    } else if (currentQuestion.type === "checkbox") {
        const checkedBoxes = document.querySelectorAll("input[type=checkbox]:checked");
        return Array.from(checkedBoxes).map(cb => cb.value);
    } else {
        const checkedRadio = document.querySelector("input[name=quizOption]:checked");
        return checkedRadio ? checkedRadio.value : "";
    }
}

//validating each checked answer corresponds to the correct answer
function checkAnswer(userAnswer) { //checks if the answer is correct and increments score
    const currentQuestion = questions[currentQuestionIndex];
    let isCorrect = false;

    if (currentQuestion.type === "text") {
        if (userAnswer.toLowerCase() === currentQuestion.correct.toLowerCase()) {
            isCorrect = true;
        }
    } else if (currentQuestion.type === "checkbox") {
        if (Array.isArray(userAnswer) && userAnswer.length === currentQuestion.correct.length && userAnswer.every(ans => currentQuestion.correct.includes(ans))) {
            isCorrect = true;
        }
    } else {
        if (userAnswer === currentQuestion.correct) {
            isCorrect = true;
        }
    }

    if (isCorrect) {
        score++;
    }
}

function handleNextQuestion() { //progresses to the next question and stores user answers
    const userAnswer = getUserAnswer();
    userAnswers.push(userAnswer);
    checkAnswer(userAnswer);
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

//code for how to display correct answers and score overall
function showResults() { //shows results with correct answers and user's answers with score
    let resultHTML = `<h2>You scored ${score} out of ${questions.length}</h2>`;
    resultHTML += "<h3>Review:</h3><ul>";

    questions.forEach((q, idx) => {
        const userAnswer = userAnswers[idx];
        const correctAnswer = Array.isArray(q.correct) ? q.correct.join(", ") : q.correct;
        const userAnswerText = Array.isArray(userAnswer) ? userAnswer.join(", ") : userAnswer;

        let isCorrect = false;
        if (Array.isArray(q.correct)) {
            isCorrect = Array.isArray(userAnswer) && userAnswer.length === q.correct.length && userAnswer.every(ans => q.correct.includes(ans));
        } else {
            isCorrect = userAnswer === q.correct;
        }

        resultHTML += `<li>
            <strong>Q${idx + 1}:</strong> ${q.question}<br>
            <span style="color: green;">Correct Answer:</span> ${correctAnswer}<br>
            <span style="color: ${isCorrect ? 'green' : 'red'};">Your Answer:</span> ${userAnswerText || 'No Answer'}
        </li><br>`;
    });

    resultHTML += "</ul><button onclick=\"location.reload()\" class=\"submit-btn\">Restart Quiz</button>";
    quizContainer.innerHTML = resultHTML;
}

submitBtn.addEventListener("click", handleNextQuestion); //triggers next question or shows results
showQuestion(); //show first question on load
