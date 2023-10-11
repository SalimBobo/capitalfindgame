const questionElement = document.getElementById('question');
const resultElement = document.getElementById('result');
const nextLevelButton = document.getElementById('next-level');

let countries = [];
let currentLevel = 0;
let score = 0;
let questions = [];

async function fetchCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        countries = data.filter(country => country.capital);
        createQuestionList();
    } catch (error) {
        console.error('Error fetching country data:', error);
    }
}

function createQuestionList() {
    questions = [];
    for (let i = 0; i < 10; i++) {
        const randomCountry = getRandomCountry();
        const options = getRandomOptions(randomCountry.capital[0]);
        questions.push({
            countryName: randomCountry.name.common,
            capital: randomCountry.capital[0],
            options: options
        });
    }
}

function getRandomCountry() {
    return countries[Math.floor(Math.random() * countries.length)];
}

function getRandomOptions(correctAnswer) {
    let options = [correctAnswer];
    while (options.length < 4) {
        const randomCountry = getRandomCountry();
        if (!options.includes(randomCountry.capital[0])) {
            options.push(randomCountry.capital[0]);
        }
    }
    return shuffleArray(options);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    // Show the option elements
    for (let i = 0; i < 4; i++) {
        const optionElement = document.getElementById(`option${i + 1}`);
        optionElement.style.display = 'block';
    }

    resultElement.style.textAlign = 'left';
    currentLevel = 0;
    score = 0;
    nextLevelButton.style.display = 'none';
    createQuestionList();
    loadNextLevel();
}

function loadNextLevel() {
    if (currentLevel < questions.length) {
        const question = questions[currentLevel];
        questionElement.textContent = `What is the capital of ${question.countryName}?`;
        resultElement.textContent = '';
        for (let i = 0; i < 4; i++) {
            const optionElement = document.getElementById(`option${i + 1}`);
            optionElement.textContent = question.options[i];
            optionElement.addEventListener('click', () => checkAnswer(question.options[i], question.capital));
        }
    } else {
        endQuiz();
    }
}

function checkAnswer(selectedAnswer, correctAnswer) {
    removeOptionEventListeners();
    
    if (selectedAnswer === correctAnswer) {
        score++;
        resultElement.textContent = 'Correct!';
    } else {
        resultElement.textContent = `Wrong! Correct answer: ${correctAnswer}`;
    }

    currentLevel++;
    
    if (currentLevel < questions.length) {
        // Add a delay before loading the next level
        setTimeout(loadNextLevel, 2000);
    } else {
        // Add a delay before ending the quiz
        setTimeout(endQuiz, 2000);
    }
}

function removeOptionEventListeners() {
    for (let i = 0; i < 4; i++) {
        const optionElement = document.getElementById(`option${i + 1}`);
        // Remove event listeners by cloning the element
        const newOptionElement = optionElement.cloneNode(true);
        optionElement.parentNode.replaceChild(newOptionElement, optionElement);
    }
}

function endQuiz() {
    // Hide the option elements
    for (let i = 0; i < 4; i++) {
        const optionElement = document.getElementById(`option${i + 1}`);
        optionElement.style.display = 'none';
    }

    // Show the final result in the center of the page
    questionElement.textContent = '';
    resultElement.style.textAlign = 'center';
    resultElement.textContent = `Quiz Complete! Your score is ${score}/10. You got ${score} correct answers and ${10 - score} incorrect answers.`;

    nextLevelButton.style.display = 'block';
    nextLevelButton.textContent = 'Restart Quiz';

    nextLevelButton.removeEventListener('click', loadNextLevel);
    nextLevelButton.addEventListener('click', startQuiz);
}


fetchCountries().then(startQuiz);


