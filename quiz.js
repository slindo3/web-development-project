//code for quiz interactivity

//questions
const questions = [
    {
        question: "How many links are on the “About” page",
        options: ["a. 5", "b. 8", "c. 7", "d. 10"],
        correct: "d. 10"
    },
    {
        type: "text", //fill in the blank question
        question: "Fill in the blank: What website does the link at the bottom of the “Home” page take you to? (Type the full URL)",
        correct: "google.com"
    },
    {
        question: "Why was this webpage created?",
        options: ["a. For an interview", "b. As a class project", "c. Paid for by a client", "d. As a personal project"],
        correct: "b. As a class project"
    },
    {
        question: "What color do the links turn when the mouse hovers over them?",
        options: ["a. Pink", "b. Red", "c. Blue", "d. Purple"],
        correct: "c. Blue"
    },
    {
        type: "checkbox", //multiple answer question
        question: "Which source website was used to help create this webpage? (Select multiple)",
        options: ["a. Intro to Javascript", "b. CSS", "c. HTML", "d. Python", "e. HTML Tutorial"],
        correct: ["a. Intro to Javascript", "b. CSS", "c. HTML", "e. HTML Tutorial"]
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
showQuestion(); // show first question on load
