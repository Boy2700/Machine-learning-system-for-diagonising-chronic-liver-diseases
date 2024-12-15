const questions = [
    {
        text: "Have you experienced persistent fatigue or weakness?",
        weight: 2
    },
    {
        text: "Have you noticed yellowing of your skin or eyes (jaundice)?",
        weight: 3
    },
    {
        text: "Do you have abdominal pain or swelling?",
        weight: 2
    },
    {
        text: "Have you experienced unexplained weight loss?",
        weight: 2
    },
    {
        text: "Do you have dark urine?",
        weight: 2
    },
    {
        text: "Have you noticed pale, bloody, or tar-colored stools?",
        weight: 3
    },
    {
        text: "Do you have chronic nausea or loss of appetite?",
        weight: 2
    },
    {
        text: "Have you been diagnosed with hepatitis B or C?",
        weight: 4
    },
    {
        text: "Do you consume alcohol regularly?",
        weight: 3
    },
    {
        text: "Are you overweight or obese?",
        weight: 2
    },
    {
        text: "Do you have a family history of liver disease?",
        weight: 2
    },
    {
        text: "Have you been exposed to toxic chemicals or substances?",
        weight: 2
    },
    {
        text: "Do you have diabetes?",
        weight: 2
    },
    {
        text: "Have you experienced itchy skin?",
        weight: 1
    },
    {
        text: "Do you have easy bruising or bleeding?",
        weight: 2
    },
    {
        text: "Have you noticed swelling in your legs and ankles?",
        weight: 2
    },
    {
        text: "Do you have confusion, drowsiness, or slurred speech?",
        weight: 3
    },
    {
        text: "Have you been diagnosed with an autoimmune disease?",
        weight: 2
    },
    {
        text: "Do you have a history of blood transfusions?",
        weight: 1
    },
    {
        text: "Have you traveled to areas with high rates of hepatitis?",
        weight: 1
    }
];

let currentQuestion = 0;
let userResponses = [];
let userName = '';

const landingSection = document.getElementById('landing');
const questionnaireSection = document.getElementById('questionnaire');
const resultsSection = document.getElementById('results');
const nameForm = document.getElementById('name-form');
const userNameInput = document.getElementById('user-name');
const quizForm = document.getElementById('quiz-form');
const questionText = document.getElementById('question-text');
const answerOptions = document.getElementById('answer-options');
const prevButton = document.getElementById('prev-question');
const nextButton = document.getElementById('next-question');
const questionNumber = document.getElementById('question-number');
const progressBar = document.querySelector('.progress');
const restartQuizButton = document.getElementById('restart-quiz');
const printResultsButton = document.getElementById('print-results');

nameForm.addEventListener('submit', startQuiz);
quizForm.addEventListener('submit', e => e.preventDefault());
prevButton.addEventListener('click', showPreviousQuestion);
nextButton.addEventListener('click', showNextQuestion);
restartQuizButton.addEventListener('click', restartQuiz);
printResultsButton.addEventListener('click', printResults);

function startQuiz(e) {
    e.preventDefault();
    userName = userNameInput.value.trim();
    if (!userName) {
        alert('Please enter your full name before starting the assessment.');
        return;
    }
    landingSection.classList.remove('active');
    landingSection.classList.add('hidden');
    questionnaireSection.classList.remove('hidden');
    questionnaireSection.classList.add('active');
    showQuestion();
    
    // Add liver icon to the header
    const header = document.querySelector('header h1');
    const liverIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    liverIcon.classList.add('icon');
    liverIcon.innerHTML = '<use xlink:href="#icon-liver"></use>';
    header.insertBefore(liverIcon, header.firstChild);
}

function showQuestion() {
    const question = questions[currentQuestion];
    questionText.textContent = question.text;
    questionNumber.textContent = currentQuestion + 1;
    answerOptions.innerHTML = '';

    const options = ['Yes', 'No', 'Not Sure'];
    options.forEach((option, index) => {
        const label = document.createElement('label');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'answer';
        radio.value = option;
        radio.id = `option${index}`;
        radio.required = true;

        if (userResponses[currentQuestion] === option) {
            radio.checked = true;
        }

        label.appendChild(radio);
        label.appendChild(document.createTextNode(option));
        answerOptions.appendChild(label);
        
        // Add animation to each option
        label.style.animation = `fadeIn 0.5s ease-out ${index * 0.1}s`;
    });

    updateNavigationButtons();
    updateProgressBar();
    
    // Animate the question text
    animateElement(questionText, 'fadeIn 0.5s ease-out');
}

function showNextQuestion() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (!selectedOption) {
        alert('Please select an answer before proceeding.');
        return;
    }

    userResponses[currentQuestion] = selectedOption.value;
    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showPreviousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

function updateNavigationButtons() {
    prevButton.classList.toggle('hidden', currentQuestion === 0);
    nextButton.textContent = currentQuestion === questions.length - 1 ? 'Finish' : 'Next';
}

function updateProgressBar() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function calculateRiskScore() {
    let score = 0;
    let maxScore = 0;

    questions.forEach((question, index) => {
        maxScore += question.weight;
        if (userResponses[index] === 'Yes') {
            score += question.weight;
        }
    });

    const normalizedScore = (score / maxScore) * 100;
    return normalizedScore;
}

function getRiskLevel(score) {
    if (score < 30) return 'Low';
    if (score < 60) return 'Moderate';
    return 'High';
}

function getConfidenceScore() {
    const answeredQuestions = userResponses.filter(response => response !== 'Not Sure').length;
    return (answeredQuestions / questions.length) * 100;
}

function showResults() {
    questionnaireSection.classList.remove('active');
    questionnaireSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    resultsSection.classList.add('active');

    const riskScore = calculateRiskScore();
    const riskLevel = getRiskLevel(riskScore);
    const confidenceScore = getConfidenceScore();

    const userGreeting = document.getElementById('user-greeting');
    userGreeting.textContent = `Hello, ${userName}! Here are your results:`;
    animateElement(userGreeting, 'fadeIn 0.5s ease-out');

    const riskLevelElement = document.getElementById('risk-level');
    riskLevelElement.textContent = `Risk Level: ${riskLevel}`;
    updateRiskLevelStyle(riskLevel);
    animateElement(riskLevelElement, 'fadeIn 0.5s ease-out 0.2s');

    const confidenceScoreElement = document.getElementById('confidence-score');
    confidenceScoreElement.textContent = `Confidence Score: ${confidenceScore.toFixed(2)}%`;
    animateElement(confidenceScoreElement, 'fadeIn 0.5s ease-out 0.4s');

    const keySymptoms = questions
        .filter((_, index) => userResponses[index] === 'Yes')
        .map(question => question.text);

    const keySymptomsList = document.createElement('ul');
    keySymptoms.forEach((symptom, index) => {
        const li = document.createElement('li');
        li.textContent = symptom;
        li.style.animation = `fadeIn 0.5s ease-out ${0.6 + index * 0.1}s`;
        keySymptomsList.appendChild(li);
    });

    const keySymptomssection = document.getElementById('key-symptoms');
    keySymptomssection.innerHTML = '<h3>Key Symptoms:</h3>';
    keySymptomssection.appendChild(keySymptomsList);
    animateElement(keySymptomssection, 'fadeIn 0.5s ease-out 0.6s');

    const recommendationsSection = document.getElementById('recommendations');
    recommendationsSection.innerHTML = '<h3>Recommendations:</h3>';
    const recommendations = getRecommendations(riskLevel, confidenceScore);
    const recommendationsList = document.createElement('ul');
    recommendations.forEach((recommendation, index) => {
        const li = document.createElement('li');
        li.textContent = recommendation;
        li.style.animation = `fadeIn 0.5s ease-out ${0.8 + index * 0.1}s`;
        recommendationsList.appendChild(li);
    });
    recommendationsSection.appendChild(recommendationsList);
    animateElement(recommendationsSection, 'fadeIn 0.5s ease-out 0.8s');
}

function getRecommendations(riskLevel, confidenceScore) {
    const recommendations = [
        'Consult with a healthcare provider for a comprehensive liver health assessment.',
        'Consider getting liver function tests to evaluate your liver health.',
        'Maintain a balanced diet and exercise regularly to support liver health.',
        'Limit alcohol consumption to reduce stress on your liver.',
        'Stay hydrated by drinking plenty of water throughout the day.',
    ];

    if (riskLevel === 'Moderate' || riskLevel === 'High') {
        recommendations.push('Discuss the possibility of hepatitis screening with your doctor.');
        recommendations.push('Consider an ultrasound or other imaging tests to evaluate your liver.');
    }

    if (riskLevel === 'High') {
        recommendations.push('Seek immediate medical attention to address potential liver issues.');
        recommendations.push('Follow up with a hepatologist or liver specialist for further evaluation.');
    }

    if (confidenceScore < 70) {
        recommendations.push('Consider retaking the assessment or discussing uncertain symptoms with a healthcare provider for a more accurate evaluation.');
    }

    return recommendations;
}

function restartQuiz() {
    currentQuestion = 0;
    userResponses = [];
    userName = '';
    resultsSection.classList.remove('active');
    resultsSection.classList.add('hidden');
    landingSection.classList.remove('hidden');
    landingSection.classList.add('active');
    userNameInput.value = '';
}

function printResults() {
    window.print();
}

function animateElement(element, animation) {
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = animation;
}

function updateRiskLevelStyle(riskLevel) {
    const riskLevelElement = document.getElementById('risk-level');
    riskLevelElement.classList.remove('low', 'moderate', 'high');
    riskLevelElement.classList.add(riskLevel.toLowerCase());
}

