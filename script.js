// ==========================================
// Gumball's Times Table Challenge - Game Logic
// ==========================================

// Game State
const gameState = {
    playerName: 'Lucas',
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
    answering: false,
    opponentCharacter: null,
    playerHits: 0,
    opponentHits: 0
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
    explosion: [
        'assets/sounds/explosion1.wav',
        'assets/sounds/explosion2.wav',
        'assets/sounds/explosion3.wav'
    ],
    impact: 'assets/sounds/impact.wav',
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
    nicoleWatterson: {
        emoji: '🐱',
        image: 'assets/nicole-watterson.png',
        name: 'Nicole Watterson',
        color: '#ff1493'
    },
    bananaJoe: {
        emoji: '🍌',
        image: 'assets/banana-joe.png',
        name: 'Banana Joe',
        color: '#ffd700'
    },
    billy: {
        emoji: '🐑',
        image: 'assets/billy.png',
        name: 'Billy',
        color: '#d4a5a5'
    },
    dad: {
        emoji: '👨',
        image: 'assets/dad.png',
        name: 'Dad',
        color: '#8b4513'
    },
    penny: {
        emoji: '🦌',
        image: 'assets/penny.png',
        name: 'Penny',
        color: '#daa520'
    },
    bobert: {
        emoji: '🤖',
        image: 'assets/bobert.png',
        name: 'Bobert',
        color: '#f4eedfff'
    },    
    tobiasWilson: {
        emoji: '🦁',
        image: 'assets/tobias-wilson.png',
        name: 'Tobias Wilson',
        color: '#ff8c00'
    }
};

function getRandomCharacter() {
    const charList = Object.values(characters);
    return charList[Math.floor(Math.random() * charList.length)];
}

function getCharacterByMode(mode) {
    const modeCharacters = {
        practice: characters.bobert,
        race: characters.darwin,
        boss: characters.nicoleWatterson
    };
    return modeCharacters[mode] || characters.gumball;
}

const characterMessages = {
    question: [
        "You can do this, {playerName}! 💪",
        "Think carefully, {playerName}! 🤔",
        "What's your answer, {playerName}? 🧠",
        "Show me what you got, {playerName}! ⭐",
        "{playerName}, Elmore needs you! 🏫",
        "{playerName}, use your brain power! 🧩",
        "It's your time to shine, {playerName}! 📐",
        "Let's solve this together, {playerName}! 👥",
        "You've got this, {playerName}! ✨",
        "{playerName}, focus and win! 🎯"
    ],
    correct: [
        "{playerName}, awesome! Keep it up! 🎉",
        "{playerName}, you're on fire! 🔥",
        "{playerName}, amazing work! 💫",
        "{playerName}, spectacular! ⚡",
        "{playerName}, you're a math genius! 🧙",
        "{playerName}, fantastic job! 🌟",
        "{playerName}, outstanding! 🏆",
        "{playerName}, super smart! 🤓",
        "{playerName}, way to go! 🚀",
        "{playerName}, perfect answer! ✨"
    ],
    result: {
        excellent: "absolutely incredible! 🏅",
        great: "truly amazing! 🎉",
        good: "doing great! 💪",
        tryAgain: "you can do better next time! 💪"
    }
};

function personalizeMessage(message) {
    return message.replace('{playerName}', gameState.playerName);
}

function typeMessage(element, message, speed = 100) {
    element.textContent = '';
    const words = message.split(' ');
    let wordIndex = 0;

    function typeNextWord() {
        if (wordIndex < words.length) {
            if (wordIndex > 0) {
                element.textContent += ' ';
            }
            element.textContent += words[wordIndex];
            wordIndex++;
            setTimeout(typeNextWord, speed);
        }
    }

    typeNextWord();
}

function updateCharacterDisplay(character, message) {
    const avatar = document.getElementById('character-avatar');
    avatar.innerHTML = `<img src="${character.image}" alt="${character.name}">`;
    document.getElementById('character-name').textContent = character.name;

    // Animate text word by word
    const textElement = document.getElementById('character-text');
    typeMessage(textElement, message, 80);

    // Initialize with idle animation
    avatar.classList.add('idle');
}

// ==========================================
// Battle System
// ==========================================

function initializeBattle() {
    // Only show battle arena in Boss Battle mode
    const battleArena = document.querySelector('.battle-arena');
    if (gameState.mode === 'boss') {
        battleArena.classList.add('active');
        const opponentCharacter = document.getElementById('opponent-character');
        opponentCharacter.innerHTML = `<img src="${gameState.opponentCharacter.image}" alt="${gameState.opponentCharacter.name}">`;
        updateBattleStats();
    } else {
        battleArena.classList.remove('active');
    }
}

function updateBattleStats() {
    document.getElementById('player-hits').textContent = gameState.playerHits;
    document.getElementById('opponent-hits').textContent = gameState.opponentHits;
}

function shootProjectile(isPlayerShooting) {
    const container = document.querySelector('.battle-field');
    const projectile = document.createElement('div');
    projectile.className = 'energy-projectile ' + (isPlayerShooting ? 'from-left' : 'from-right');
    projectile.style.position = 'absolute';
    projectile.style.zIndex = '5';

    container.appendChild(projectile);

    // Trigger explosion on impact after projectile travels
    setTimeout(() => {
        createExplosion(isPlayerShooting);
        projectile.remove();
    }, 600);
}

function hitCharacter(isPlayerHit) {
    const character = isPlayerHit
        ? document.getElementById('player-character')
        : document.getElementById('opponent-character');

    character.classList.add('hit');

    // Screen shake effect
    screenShake();

    // Flash overlay
    createFlashOverlay();

    setTimeout(() => {
        character.classList.remove('hit');
    }, 500);
}

function createExplosion(isPlayerShooting) {
    // Use battle-field container to position across entire width
    const container = document.querySelector('.battle-field');

    // Get the actual character positions
    const targetCharacter = isPlayerShooting
        ? document.getElementById('opponent-character')
        : document.getElementById('player-character');

    const containerRect = container.getBoundingClientRect();
    const characterRect = targetCharacter.getBoundingClientRect();

    // Calculate center position of the character relative to container
    const characterCenterX = characterRect.left + characterRect.width / 2 - containerRect.left;
    const characterCenterY = characterRect.top + characterRect.height / 2 - containerRect.top;

    // Play explosion sound
    playSound(sounds.explosion);

    // Main burst
    const burst = document.createElement('div');
    burst.className = 'explosion-burst';
    burst.style.position = 'absolute';
    burst.style.left = characterCenterX + 'px';
    burst.style.top = characterCenterY + 'px';
    burst.style.transform = 'translate(-50%, -50%)';
    burst.style.zIndex = '10';
    container.appendChild(burst);

    // Explosion rings
    for (let i = 1; i <= 2; i++) {
        const ring = document.createElement('div');
        ring.className = `explosion-ring ring${i}`;
        ring.style.position = 'absolute';
        ring.style.width = (30 + i * 20) + 'px';
        ring.style.height = (30 + i * 20) + 'px';
        ring.style.left = characterCenterX + 'px';
        ring.style.top = characterCenterY + 'px';
        ring.style.transform = 'translate(-50%, -50%)';
        ring.style.zIndex = '10';
        container.appendChild(ring);
    }

    // Particles
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 80 + Math.random() * 60;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        const particle = document.createElement('div');
        particle.className = `explosion-particle ${Math.random() > 0.5 ? 'particle-fire' : 'particle-spark'}`;
        particle.style.position = 'absolute';
        particle.style.left = characterCenterX + 'px';
        particle.style.top = characterCenterY + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.transform = 'translate(-50%, -50%)';
        particle.style.zIndex = '10';
        container.appendChild(particle);
    }

    // Cleanup
    setTimeout(() => {
        burst.remove();
        container.querySelectorAll('.explosion-ring, .explosion-particle').forEach(el => el.remove());
    }, 800);
}

function screenShake() {
    // Play impact sound
    playSound(sounds.impact);

    const gameScreen = document.getElementById('game-screen');
    gameScreen.style.animation = 'none';

    // Trigger reflow to restart animation
    void gameScreen.offsetWidth;

    gameScreen.style.animation = 'screenShake 0.5s ease-out';

    setTimeout(() => {
        gameScreen.style.animation = 'none';
    }, 500);
}

function createFlashOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'flash-overlay';
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.remove();
    }, 300);
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

    // Set random character for table selection screen
    const randomCharacter = getRandomCharacter();
    const tableScreenAvatar = document.querySelector('#table-select-screen .character-avatar');
    const tableScreenName = document.querySelector('#table-select-screen .character-name');
    const tableScreenText = document.querySelector('#table-select-screen .character-bubble p');

    tableScreenAvatar.innerHTML = `<img src="${randomCharacter.image}" alt="${randomCharacter.name}">`;
    tableScreenName.textContent = randomCharacter.name;
    const message = `Hey! It's me, ${randomCharacter.name}! Which times tables do you want to practice? You can pick as many as you like!`;
    typeMessage(tableScreenText, message, 80);

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
    gameState.playerHits = 0;
    gameState.opponentHits = 0;
    gameState.questions = generateQuestions();
    gameState.opponentCharacter = getRandomCharacter();
    updateStats();
    initializeBattle();
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
    const feedbackArea = document.getElementById('feedback-area');
    feedbackArea.textContent = '';
    feedbackArea.className = 'feedback-area';
    document.getElementById('encouragement').textContent = '';

    // Show mode-specific character for questions
    const modeCharacter = getCharacterByMode(gameState.mode);
    const randomMessage = characterMessages.question[Math.floor(Math.random() * characterMessages.question.length)];
    const personalizedMessage = personalizeMessage(randomMessage);
    updateCharacterDisplay(modeCharacter, personalizedMessage);

    // Animate character - thinking animation
    const avatar = document.getElementById('character-avatar');
    avatar.classList.remove('celebrating', 'sad-reaction');
    avatar.classList.add('thinking');
    setTimeout(() => {
        avatar.classList.remove('thinking');
        avatar.classList.add('idle');
    }, 1500);

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

        if (gameState.mode === 'practice' || gameState.mode === 'race') playSound(sounds.correct);

        // Character celebration animation
        const avatar = document.getElementById('character-avatar');
        avatar.classList.remove('thinking', 'sad-reaction', 'idle');
        avatar.classList.add('celebrating');
        // Return to idle after celebration animation
        setTimeout(() => {
            avatar.classList.remove('celebrating');
            avatar.classList.add('idle');
        }, 600);

        // Battle effects only in Boss Battle mode
        if (gameState.mode === 'boss') {
            gameState.playerHits++;
            shootProjectile(true);
            hitCharacter(false);
            updateBattleStats();
            const feedback = document.getElementById('feedback-area');
            feedback.textContent = `✓ Correct! You hit! +${basePoints + bonus} points`;
            feedback.className = 'feedback-area feedback-correct';
        } else {
            const feedback = document.getElementById('feedback-area');
            feedback.textContent = `✓ Correct! Amazing! +${basePoints + bonus} points`;
            feedback.className = 'feedback-area feedback-correct';
        }

        const encouragement = characterMessages.correct[Math.floor(Math.random() * characterMessages.correct.length)];
        const personalizedEncouragement = personalizeMessage(encouragement);
        document.getElementById('encouragement').textContent = personalizedEncouragement;
    } else {
        if (btn) btn.classList.add('incorrect');
        const correctBtn = Array.from(document.querySelectorAll('.answer-btn')).find(b => parseInt(b.textContent) === gameState.currentAnswer);
        if (correctBtn) {
            correctBtn.classList.add('correct');
        }
        gameState.streak = 0;
        gameState.wrongAnswers++;

        if (gameState.mode === 'practice' || gameState.mode === 'race') playSound(sounds.wrong);

        // Character sad reaction animation
        const avatar = document.getElementById('character-avatar');
        avatar.classList.remove('thinking', 'celebrating', 'idle');
        avatar.classList.add('sad-reaction');
        // Return to idle after sad reaction animation
        setTimeout(() => {
            avatar.classList.remove('sad-reaction');
            avatar.classList.add('idle');
        }, 600);

        // Battle effects only in Boss Battle mode
        if (gameState.mode === 'boss') {
            gameState.opponentHits++;
            shootProjectile(false);
            hitCharacter(true);
            updateBattleStats();
            const feedback = document.getElementById('feedback-area');
            feedback.textContent = `✗ Oops! You got hit! The answer was ${gameState.currentAnswer}`;
            feedback.className = 'feedback-area feedback-incorrect';
        } else {
            const feedback = document.getElementById('feedback-area');
            feedback.textContent = `✗ Oops! The answer was ${gameState.currentAnswer}`;
            feedback.className = 'feedback-area feedback-incorrect';
        }
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
    const timerContainer = document.getElementById('timer-container');

    if (seconds === 0) {
        timerContainer.style.display = 'none';
        return;
    }

    // Clear any existing timer to prevent multiple timers running simultaneously
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }

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
    gameState.currentQuestion = gameState.totalQuestions;
    updateStats();
    const accuracy = Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100);

    let title, stars, message, resultCharacter;

    if (accuracy >= 90) {
        title = '🌟 LEGENDARY! 🌟';
        stars = '⭐⭐⭐';
        message = `${gameState.playerName}, you were ${characterMessages.result.excellent}`;
        resultCharacter = characters.gumball;
    } else if (accuracy >= 75) {
        title = '⭐ SUPER! ⭐';
        stars = '⭐⭐';
        message = `${gameState.playerName}, you were ${characterMessages.result.great}`;
        resultCharacter = characters.darwin;
    } else if (accuracy >= 50) {
        title = '👍 GOOD JOB! 👍';
        stars = '⭐';
        message = `${gameState.playerName}, you did ${characterMessages.result.good}`;
        resultCharacter = characters.anais;
    } else {
        title = '✨ KEEP TRYING! ✨';
        stars = '✨';
        message = `${gameState.playerName}, ${characterMessages.result.tryAgain}`;
        resultCharacter = characters.nicoleWatterson;
    }

    document.getElementById('result-title').textContent = title;
    document.getElementById('stars').textContent = stars;
    const resultAvatar = document.getElementById('result-avatar');
    resultAvatar.innerHTML = `<img src="${resultCharacter.image}" alt="${resultCharacter.name}">`;
    document.getElementById('result-character').textContent = resultCharacter.name;
    typeMessage(document.getElementById('result-text'), message, 80);
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
    // Set random character for table selection screen
    const randomCharacter = getRandomCharacter();
    const tableScreenAvatar = document.querySelector('#table-select-screen .character-avatar');
    const tableScreenName = document.querySelector('#table-select-screen .character-name');
    const tableScreenText = document.querySelector('#table-select-screen .character-bubble p');

    tableScreenAvatar.innerHTML = `<img src="${randomCharacter.image}" alt="${randomCharacter.name}">`;
    tableScreenName.textContent = randomCharacter.name;
    const message = `Hey! It's me, ${randomCharacter.name}! Which times tables do you want to practice? You can pick as many as you like!`;
    typeMessage(tableScreenText, message, 80);

    showScreen('table-select-screen');
}

function changeMode() {
    // Reset game state
    gameState.mode = null;
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.streak = 0;
    gameState.correctAnswers = 0;
    gameState.wrongAnswers = 0;
    gameState.playerHits = 0;
    gameState.opponentHits = 0;
    gameState.opponentCharacter = null;
    updateStats();

    // Set random character for start screen
    const randomCharacter = getRandomCharacter();
    const startScreenAvatar = document.querySelector('#start-screen .character-avatar');
    const startScreenName = document.querySelector('#start-screen .character-name');
    const welcomeMessage = document.getElementById('welcome-message');

    startScreenAvatar.innerHTML = `<img src="${randomCharacter.image}" alt="${randomCharacter.name}">`;
    startScreenName.textContent = randomCharacter.name;

    // Animate welcome message with new character
    const message = `Hey ${gameState.playerName}! I'm ${randomCharacter.name}! Ready for another challenge? Pick your game mode!`;
    typeMessage(welcomeMessage, message, 80);

    showScreen('start-screen');
}

function goBackToStart() {
    // Set random character for start screen when going back
    const randomCharacter = getRandomCharacter();
    const startScreenAvatar = document.querySelector('#start-screen .character-avatar');
    const startScreenName = document.querySelector('#start-screen .character-name');
    const welcomeMessage = document.getElementById('welcome-message');

    startScreenAvatar.innerHTML = `<img src="${randomCharacter.image}" alt="${randomCharacter.name}">`;
    startScreenName.textContent = randomCharacter.name;

    // Animate welcome message with new character
    const message = `Hey ${gameState.playerName}! I'm ${randomCharacter.name}! Help me save Elmore by solving multiplication problems!`;
    typeMessage(welcomeMessage, message, 80);

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
    gameState.playerHits = 0;
    gameState.opponentHits = 0;
    gameState.opponentCharacter = null;
    updateStats();

    // Set random character for start screen when exiting
    const randomCharacter = getRandomCharacter();
    const startScreenAvatar = document.querySelector('#start-screen .character-avatar');
    const startScreenName = document.querySelector('#start-screen .character-name');
    const welcomeMessage = document.getElementById('welcome-message');

    startScreenAvatar.innerHTML = `<img src="${randomCharacter.image}" alt="${randomCharacter.name}">`;
    startScreenName.textContent = randomCharacter.name;

    // Animate welcome message with new character
    const message = `Hey ${gameState.playerName}! I'm ${randomCharacter.name}! Help me save Elmore by solving multiplication problems!`;
    typeMessage(welcomeMessage, message, 80);

    showScreen('start-screen');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function startWithName() {
    const nameInput = document.getElementById('player-name-input');
    const playerName = nameInput.value.trim();

    // Use input name or default to 'Lucas'
    gameState.playerName = playerName || 'Lucas';

    // Show start screen
    showScreen('start-screen');

    // Set random character for start screen
    const randomCharacter = getRandomCharacter();
    const startScreenAvatar = document.querySelector('#start-screen .character-avatar');
    const startScreenName = document.querySelector('#start-screen .character-name');

    startScreenAvatar.innerHTML = `<img src="${randomCharacter.image}" alt="${randomCharacter.name}">`;
    startScreenName.textContent = randomCharacter.name;

    // Animate welcome message with player's name
    const welcomeMessage = `Hey ${gameState.playerName}! I'm ${randomCharacter.name}! Help me save Elmore by solving multiplication problems!`;
    typeMessage(document.getElementById('welcome-message'), welcomeMessage, 80);

    // Clear input for next time
    nameInput.value = '';

    // Focus on the first mode button after a brief delay
    setTimeout(() => {
        document.querySelector('.mode-btn').focus();
    }, 200);
}

// ==========================================
// Initialize Game
// ==========================================

function initializeNameScreen() {
    // Set random character for name input screen
    const randomCharacter = getRandomCharacter();
    const nameScreenAvatar = document.querySelector('#name-screen .character-avatar');
    const nameScreenName = document.querySelector('#name-screen .character-name');
    const nameScreenText = document.querySelector('#name-screen .character-bubble p');

    nameScreenAvatar.innerHTML = `<img src="${randomCharacter.image}" alt="${randomCharacter.name}">`;
    nameScreenName.textContent = randomCharacter.name;

    // Animate text with typing effect
    const message = `Hey there, friend! What's your name? I'm ${randomCharacter.name}! ${randomCharacter.emoji}`;
    typeMessage(nameScreenText, message, 80);
}

document.addEventListener('DOMContentLoaded', () => {
    initTableGrid();
    initializeNameScreen();
});
