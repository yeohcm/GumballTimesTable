// ==========================================
// Gumball's Times Table Challenge - Game Logic
// ==========================================

// Game State
const gameState = {
    mode: null,
    selectedTables: [2, 5, 10],
    currentQuestion: 0,
    totalQuestions: 0,
    score: 0,
    streak: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    questions: [],
    currentAnswer: 0,
    timer: null,
    timeLeft: 0,
    answering: false
};

// ==========================================
// Audio System
// ==========================================

const sounds = {
    correct: [
        'assets/sounds/correct1.mp3',
        'assets/sounds/correct2.mp3',
        'assets/sounds/correct3.mp3'
    ],
    wrong: [
        'assets/sounds/wrong1.mp3',
        'assets/sounds/wrong2.mp3',
        'assets/sounds/wrong3.mp3'
    ],
    win: 'assets/sounds/win.mp3',
    lose: 'assets/sounds/lose.mp3'
};

function playSound(soundInput) {
    let soundPath;
    if (Array.isArray(soundInput)) {
        if (soundInput.length === 0) return;
        soundPath = soundInput[Math.floor(Math.random() * soundInput.length)];
    } else {
        soundPath = soundInput;
    }
    const audio = new Audio(soundPath);
    audio.volume = 0.7;
    audio.play().catch(e => console.log('Sound not available'));
}

// ==========================================
// Character Data & Messages
// ==========================================

const characters = {
    gumball: {
        emoji: '🐠',
        image: 'assets/gumball.png',
        name: 'Gumball',
        color: '#00a8e1'
    },
    darwin: {
        emoji: '🦎',
        image: 'assets/darwin.png',
        name: 'Darwin',
        color: '#ff8c42'
    },
    anais: {
        emoji: '🐰',
        image: 'assets/anais.png',
        name: 'Anais',
        color: '#ff69b4'
    },
    tinaRex: {
        emoji: '🦖',
        image: 'assets/tina-rex.svg',
        name: 'Tina Rex',
        color: '#9c27b0'
    }
};

function getRandomCharacter() {
    const charList = Object.values(characters);
    return charList[Math.floor(Math.random() * charList.length)];
}

function getCharacterByMode(mode) {
    const modeCharacters = {
        practice: characters.anais,
        race: characters.darwin,
        boss: characters.tinaRex
    };
    return modeCharacters[mode] || characters.gumball;
}

const characterMessages = {
    question: [
        "You can do this! 💪",
        "Think carefully! 🤔",
        "What's the answer? 🧠",
        "Show me what you got! ⭐",
        "Elmore needs you! 🏫",
        "Use your brain power! 🧩",
        "Math time! 📐",
        "Let's solve this together! 👥",
        "You've got this! ✨",
        "Focus and win! 🎯"
    ],
    correct: [
        "Awesome! Keep it up! 🎉",
        "You're on fire! 🔥",
        "Amazing work! 💫",
        "Spectacular! ⚡",
        "You're a math genius! 🧙",
        "Fantastic job! 🌟",
        "Outstanding! 🏆",
        "Super smart! 🤓",
        "Way to go! 🚀",
        "Perfect answer! ✨"
    ],
    result: {
        excellent: "You're a TRUE MATH CHAMPION! I knew I could count on you! 🏅",
        great: "You did an amazing job! I'm so proud of you! 🎉",
        good: "Great effort! You're getting better every time! 💪",
        tryAgain: "Don't give up! Every attempt makes you stronger! Keep going! 💪"
    }
};

function updateCharacterDisplay(character, message) {
    const avatar = document.getElementById('character-avatar');
    avatar.innerHTML = `<img src="${character.image}" alt="${character.name}">`;
    document.getElementById('character-name').textContent = character.name;
    document.getElementById('character-text').textContent = message;
}

// ==========================================
// Table Selection
// ==========================================

function initTableGrid() {
    const grid = document.getElementById('table-grid');
    grid.innerHTML = '';
    for (let i = 1; i <= 12; i++) {
        const btn = document.createElement('button');
        btn.className = `table-btn ${gameState.selectedTables.includes(i) ? 'selected' : ''}`;
        btn.textContent = `${i}×`;
        btn.onclick = () => toggleTable(i);
        grid.appendChild(btn);
    }
}

function toggleTable(num) {
    const idx = gameState.selectedTables.indexOf(num);
    if (idx > -1) {
        gameState.selectedTables.splice(idx, 1);
    } else {
        gameState.selectedTables.push(num);
    }
    initTableGrid();
}

function selectMode(mode) {
    gameState.mode = mode;
    const modes = {
        practice: 10,
        race: 15,
        boss: 20
    };
    gameState.totalQuestions = modes[mode];
    showScreen('table-select-screen');
}

// ==========================================
// Game Logic
// ==========================================

function startGame() {
    if (gameState.selectedTables.length === 0) {
        alert('Please select at least one times table!');
        return;
    }
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.streak = 0;
    gameState.correctAnswers = 0;
    gameState.wrongAnswers = 0;
    gameState.questions = generateQuestions();
    updateStats();
    showScreen('game-screen');
    showNextQuestion();
}

function generateQuestions() {
    const questions = [];
    for (let i = 0; i < gameState.totalQuestions; i++) {
        const table = gameState.selectedTables[Math.floor(Math.random() * gameState.selectedTables.length)];
        const multiplier = Math.floor(Math.random() * 12) + 1;
        questions.push({
            a: table,
            b: multiplier,
            answer: table * multiplier
        });
    }
    return questions;
}

function generateAnswers(correctAnswer) {
    const answers = [correctAnswer];
    while (answers.length < 4) {
        const offset = Math.floor(Math.random() * 21) - 10;
        const wrongAnswer = correctAnswer + offset;
        if (wrongAnswer > 0 && !answers.includes(wrongAnswer)) {
            answers.push(wrongAnswer);
        }
    }
    return shuffleArray(answers);
}

function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function showNextQuestion() {
    if (gameState.currentQuestion >= gameState.totalQuestions) {
        showResults();
        return;
    }

    gameState.answering = false;
    const q = gameState.questions[gameState.currentQuestion];
    gameState.currentAnswer = q.answer;

    document.getElementById('question').textContent = `${q.a} × ${q.b} = ?`;
    document.getElementById('feedback-area').textContent = '';
    document.getElementById('encouragement').textContent = '';

    // Show mode-specific character for questions
    const modeCharacter = getCharacterByMode(gameState.mode);
    const randomMessage = characterMessages.question[Math.floor(Math.random() * characterMessages.question.length)];
    updateCharacterDisplay(modeCharacter, randomMessage);

    const answers = generateAnswers(q.answer);
    const grid = document.getElementById('answer-grid');
    grid.innerHTML = '';

    answers.forEach(answer => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer;
        btn.onclick = () => checkAnswer(answer, btn);
        grid.appendChild(btn);
    });

    updateStats();
    startTimer();
}

function checkAnswer(answer, btn) {
    if (gameState.answering) return;
    gameState.answering = true;

    if (gameState.timer) clearInterval(gameState.timer);

    const isCorrect = answer === gameState.currentAnswer;
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(b => b.disabled = true);

    if (isCorrect) {
        if (btn) btn.classList.add('correct');
        gameState.streak++;
        gameState.correctAnswers++;
        const basePoints = { practice: 10, race: 15, boss: 20 }[gameState.mode];
        const bonus = Math.min(gameState.streak, 5) * 5;
        gameState.score += basePoints + bonus;

        if (gameState.mode === 'practice') playSound(sounds.correct);

        const feedback = document.getElementById('feedback-area');
        feedback.textContent = `✓ Correct! Amazing! +${basePoints + bonus} points`;
        feedback.className = 'feedback-area feedback-correct';

        const encouragement = characterMessages.correct[Math.floor(Math.random() * characterMessages.correct.length)];
        document.getElementById('encouragement').textContent = encouragement;
    } else {
        if (btn) btn.classList.add('incorrect');
        const correctBtn = Array.from(document.querySelectorAll('.answer-btn')).find(b => parseInt(b.textContent) === gameState.currentAnswer);
        if (correctBtn) {
            correctBtn.classList.add('correct');
        }
        gameState.streak = 0;
        gameState.wrongAnswers++;

        if (gameState.mode === 'practice') playSound(sounds.wrong);

        const feedback = document.getElementById('feedback-area');
        feedback.textContent = `✗ Oops! The answer was ${gameState.currentAnswer}`;
        feedback.className = 'feedback-area feedback-incorrect';
    }

    setTimeout(() => {
        gameState.currentQuestion++;
        showNextQuestion();
    }, 2000);
}

// ==========================================
// Timer & Display Updates
// ==========================================

function startTimer() {
    const timerConfig = {
        practice: 0,
        race: 10,
        boss: 8
    };

    const seconds = timerConfig[gameState.mode];
    if (seconds === 0) return;

    const timerContainer = document.getElementById('timer-container');
    timerContainer.style.display = 'block';

    gameState.timeLeft = seconds;
    updateTimerDisplay();

    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();

        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            if (!gameState.answering) {
                checkAnswer(null, null);
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const totalSeconds = { practice: 0, race: 10, boss: 8 }[gameState.mode];
    const percentage = (gameState.timeLeft / totalSeconds) * 100;

    document.getElementById('timer-fill').style.width = percentage + '%';
    document.getElementById('timer-text').textContent = gameState.timeLeft;
}

function updateStats() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('streak').textContent = gameState.streak;
    document.getElementById('progress').textContent = `${gameState.currentQuestion}/${gameState.totalQuestions}`;

    const progressPercent = (gameState.currentQuestion / gameState.totalQuestions) * 100;
    document.getElementById('progress-fill').style.width = progressPercent + '%';
}

// ==========================================
// Results & Navigation
// ==========================================

function showResults() {
    const accuracy = Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100);

    let title, stars, message, resultCharacter;

    if (accuracy >= 90) {
        title = '🌟 LEGENDARY! 🌟';
        stars = '⭐⭐⭐';
        message = characterMessages.result.excellent;
        resultCharacter = characters.gumball;
    } else if (accuracy >= 75) {
        title = '⭐ SUPER! ⭐';
        stars = '⭐⭐';
        message = characterMessages.result.great;
        resultCharacter = characters.darwin;
    } else if (accuracy >= 50) {
        title = '👍 GOOD JOB! 👍';
        stars = '⭐';
        message = characterMessages.result.good;
        resultCharacter = characters.anais;
    } else {
        title = '✨ KEEP TRYING! ✨';
        stars = '✨';
        message = characterMessages.result.tryAgain;
        resultCharacter = characters.tinaRex;
    }

    document.getElementById('result-title').textContent = title;
    document.getElementById('stars').textContent = stars;
    const resultAvatar = document.getElementById('result-avatar');
    resultAvatar.innerHTML = `<img src="${resultCharacter.image}" alt="${resultCharacter.name}">`;
    document.getElementById('result-character').textContent = resultCharacter.name;
    document.getElementById('result-text').textContent = message;
    document.getElementById('result-correct').textContent = gameState.correctAnswers;
    document.getElementById('result-wrong').textContent = gameState.wrongAnswers;
    document.getElementById('result-accuracy').textContent = accuracy + '%';
    document.getElementById('result-score').textContent = gameState.score;

    if (accuracy >= 75) {
        playSound(sounds.win);
    } else {
        playSound(sounds.lose);
    }

    showScreen('results-screen');
}

function playAgain() {
    startGame();
}

function changeTables() {
    showScreen('table-select-screen');
}

function goBackToStart() {
    showScreen('start-screen');
}

function exitGame() {
    if (gameState.timer) clearInterval(gameState.timer);
    gameState.mode = null;
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.streak = 0;
    gameState.correctAnswers = 0;
    gameState.wrongAnswers = 0;
    updateStats();
    showScreen('start-screen');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// ==========================================
// Initialize Game
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initTableGrid();
});
