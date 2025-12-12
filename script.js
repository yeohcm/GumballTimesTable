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
    selectedCharacter: null,
    opponentCharacter: null,
    playerHits: 0,
    opponentHits: 0,
    muteTTS: false,
    // Ninja Mode specific
    ninjaLives: 3,
    ninjaCurrentQuestion: null,
    ninjaSpawnInterval: null,
    ninjaGameTimer: null,
    ninjaGameDuration: 60,
    ninjaFallingCharacters: []
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
// Text-to-Speech System (Practice Mode)
// ==========================================

function removeEmojis(text) {
    // Remove emojis and other Unicode symbols
    // This regex matches most emoji ranges
    return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]/gu, '').trim();
}

function speakText(text) {
    // Speak in all game modes (Practice, Speed Race, Boss Battle, and Ninja Mode)
    if (gameState.mode !== 'practice' && gameState.mode !== 'race' && gameState.mode !== 'boss' && gameState.mode !== 'ninja') {
        return;
    }

    // Check if text-to-speech is muted
    if (gameState.muteTTS) {
        return;
    }

    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
        return;
    }

    // Remove emojis from text before speaking
    const textWithoutEmojis = removeEmojis(text);
    
    // If text is empty after removing emojis, don't speak
    if (!textWithoutEmojis) {
        return;
    }

    // Cancel any ongoing speech to prevent overlap
    window.speechSynthesis.cancel();

    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(textWithoutEmojis);
    
    // Configure voice settings to sound like a kid
    utterance.rate = 1.15;   // Slightly faster (kids often speak faster)
    utterance.pitch = 1.6;    // Higher pitch (valid range 0-2, 1.6 sounds more child-like)
    utterance.volume = 0.85; // Comfortable volume for children

    // Function to set voice and speak
    const setVoiceAndSpeak = () => {
        // Try to use a child-friendly voice if available
        let voices = window.speechSynthesis.getVoices();
        
        // If no voices loaded yet, try loading them
        if (voices.length === 0) {
            // Trigger voice loading and try again
            window.speechSynthesis.getVoices();
            setTimeout(() => {
                voices = window.speechSynthesis.getVoices();
                selectAndSpeak(voices);
            }, 100);
            return;
        }
        
        selectAndSpeak(voices);
    };
    
    const selectAndSpeak = (voices) => {
        // Prioritize child voices with more comprehensive search
        const preferredVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('child') ||
            voice.name.toLowerCase().includes('kid') ||
            voice.name.toLowerCase().includes('young') ||
            voice.name.toLowerCase().includes('boy') ||
            voice.name.toLowerCase().includes('girl')
        ) || voices.find(voice => {
            const name = voice.name.toLowerCase();
            // Look for high-pitched female voices that might sound child-like
            return (name.includes('female') || name.includes('woman')) && 
                   (name.includes('young') || name.includes('teen') || 
                    name.includes('samantha') || name.includes('karen') ||
                    name.includes('susan') || name.includes('zira'));
        }) || voices.find(voice => {
            // Some system voices have higher natural pitch
            const name = voice.name.toLowerCase();
            return name.includes('samantha') || name.includes('karen') || 
                   name.includes('susan') || name.includes('zira') ||
                   name.includes('tessa') || name.includes('veena');
        });
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
            // If we found a child voice, we can use slightly lower pitch
            // Otherwise, keep the higher pitch to simulate child voice
            if (preferredVoice.name.toLowerCase().includes('child') || 
                preferredVoice.name.toLowerCase().includes('kid')) {
                utterance.pitch = 1.4; // Child voice already has high pitch
            }
        } else {
            // No child voice found, use higher pitch to simulate it
            utterance.pitch = 1.7;
        }

        // Speak the text
        window.speechSynthesis.speak(utterance);
    };
    
    setVoiceAndSpeak();
}

// Load voices when available (some browsers need this)
if ('speechSynthesis' in window) {
    // Chrome needs voices to be loaded
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
            // Voices loaded
        };
    }
}

// ==========================================
// Mute Toggle Function
// ==========================================

function updateMuteButtonState() {
    const muteBtn = document.getElementById('mute-tts-btn');
    if (muteBtn) {
        if (gameState.muteTTS) {
            muteBtn.textContent = '🔇 Unmute Voice';
            muteBtn.classList.add('muted');
        } else {
            muteBtn.textContent = '🔊 Mute Voice';
            muteBtn.classList.remove('muted');
        }
    }
}

function toggleMuteTTS() {
    gameState.muteTTS = !gameState.muteTTS;
    updateMuteButtonState();
    
    // Cancel any ongoing speech when muting
    if (gameState.muteTTS && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
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
    rachelwilson: {
        emoji: '🐱',
        image: 'assets/rachel-wilson.png',
        name: 'Rachel Wilson',
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
    carriekrueger: {
        emoji: '🤖',
        image: 'assets/carrie-krueger.png',
        name: 'Carrie Krueger',
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
        
        // Set player character (left side)
        const playerCharacter = document.getElementById('player-character');
        if (playerCharacter && gameState.selectedCharacter) {
            playerCharacter.innerHTML = `<img src="${gameState.selectedCharacter.image}" alt="${gameState.selectedCharacter.name}">`;
        }
        
        // Set opponent character (right side)
        const opponentCharacter = document.getElementById('opponent-character');
        if (opponentCharacter && gameState.opponentCharacter) {
            opponentCharacter.innerHTML = `<img src="${gameState.opponentCharacter.image}" alt="${gameState.opponentCharacter.name}">`;
        }
        
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

    // Trigger attack animation on the shooting character
    const character = isPlayerShooting
        ? document.getElementById('player-character')
        : document.getElementById('opponent-character');
    
    if (character) {
        character.classList.add('attacking');
        // Remove attacking class after animation completes (0.6s)
        setTimeout(() => {
            character.classList.remove('attacking');
        }, 600);
    }

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

    // Create bullet impact visual effect
    createBulletImpact(character);

    // Screen shake effect
    screenShake();

    // Flash overlay
    createFlashOverlay();

    setTimeout(() => {
        character.classList.remove('hit');
    }, 700);
}

function createBulletImpact(characterElement) {
    const impact = document.createElement('div');
    impact.className = 'bullet-impact';
    
    // Position the impact at a random spot on the character (center to upper area)
    const characterRect = characterElement.getBoundingClientRect();
    const containerRect = characterElement.closest('.battle-field').getBoundingClientRect();
    
    // Random position within character bounds (slightly offset for visual interest)
    const offsetX = (Math.random() - 0.5) * 30;
    const offsetY = (Math.random() - 0.5) * 30 - 10; // Slightly higher
    
    const centerX = characterRect.left + characterRect.width / 2 - containerRect.left + offsetX;
    const centerY = characterRect.top + characterRect.height / 2 - containerRect.top + offsetY;
    
    impact.style.left = centerX + 'px';
    impact.style.top = centerY + 'px';
    impact.style.transform = 'translate(-50%, -50%)';
    
    const container = document.querySelector('.battle-field');
    container.appendChild(impact);
    
    // Remove after animation completes
    setTimeout(() => {
        impact.remove();
    }, 400);
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
        boss: 20,
        ninja: 0 // Ninja mode uses time-based gameplay instead
    };
    gameState.totalQuestions = modes[mode];

    // For Ninja Mode, go directly to game without table selection
    if (mode === 'ninja') {
        startNinjaMode();
        return;
    }

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
// Character Selection (Boss Mode)
// ==========================================

function initCharacterSelection() {
    const grid = document.getElementById('character-grid');
    grid.innerHTML = '';
    
    // Reset selection
    gameState.selectedCharacter = null;
    const startBtn = document.getElementById('start-boss-battle-btn');
    if (startBtn) {
        startBtn.disabled = true;
    }
    
    // Create character cards for all available characters
    Object.keys(characters).forEach(charKey => {
        const char = characters[charKey];
        const card = document.createElement('div');
        card.className = 'character-card';
        card.onclick = () => selectCharacter(charKey);
        
        const img = document.createElement('img');
        img.src = char.image;
        img.alt = char.name;
        img.className = 'character-card-image';
        
        const name = document.createElement('div');
        name.className = 'character-card-name';
        name.textContent = char.name;
        
        card.appendChild(img);
        card.appendChild(name);
        grid.appendChild(card);
    });
    
    // Set random character for character selection screen
    const randomCharacter = getRandomCharacter();
    const charSelectAvatar = document.querySelector('#character-select-screen .character-avatar');
    const charSelectName = document.querySelector('#character-select-screen .character-name');
    const charSelectText = document.querySelector('#character-select-screen .character-bubble p');
    
    if (charSelectAvatar) {
        charSelectAvatar.innerHTML = `<img src="${randomCharacter.image}" alt="${randomCharacter.name}">`;
    }
    if (charSelectName) {
        charSelectName.textContent = randomCharacter.name;
    }
    if (charSelectText) {
        const message = `Choose your character for the Boss Battle! Who will you fight as?`;
        typeMessage(charSelectText, message, 80);
    }
}

function selectCharacter(characterKey) {
    // Remove previous selection
    document.querySelectorAll('.character-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Mark selected card
    const cards = document.querySelectorAll('.character-card');
    const charKeys = Object.keys(characters);
    const index = charKeys.indexOf(characterKey);
    if (index !== -1 && cards[index]) {
        cards[index].classList.add('selected');
    }
    
    // Store selection
    gameState.selectedCharacter = characters[characterKey];
    
    // Enable start button
    const startBtn = document.getElementById('start-boss-battle-btn');
    if (startBtn) {
        startBtn.disabled = false;
    }
}

function startBossBattle() {
    if (!gameState.selectedCharacter) {
        alert('Please select a character!');
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
    
    // Select opponent character (different from player's character)
    const availableCharacters = Object.values(characters).filter(
        char => char.name !== gameState.selectedCharacter.name
    );
    gameState.opponentCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
    
    updateStats();
    initializeBattle();
    showScreen('game-screen');
    updateMuteButtonState();
    showNextQuestion();
}

function goBackToTableSelect() {
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
    
    // For Boss Mode, show character selection screen first
    if (gameState.mode === 'boss') {
        initCharacterSelection();
        showScreen('character-select-screen');
        return;
    }
    
    // For other modes, start game directly
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.streak = 0;
    gameState.correctAnswers = 0;
    gameState.wrongAnswers = 0;
    gameState.playerHits = 0;
    gameState.opponentHits = 0;
    gameState.selectedCharacter = null; // Not used in non-boss modes
    gameState.questions = generateQuestions();
    gameState.opponentCharacter = getRandomCharacter();
    updateStats();
    initializeBattle();
    showScreen('game-screen');
    updateMuteButtonState();
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
    
    // Read out the question in all game modes (Practice, Speed Race, and Boss Battle)
    // Convert "5 × 7 = ?" to natural speech format
    // Use varied phrasing for more natural conversation
    const questionVariations = [
        `What is ${q.a} times ${q.b}?`,
        `${q.a} times ${q.b} equals what?`,
        `What does ${q.a} times ${q.b} equal?`
    ];
    const questionText = questionVariations[Math.floor(Math.random() * questionVariations.length)];
    
    // Small delay to ensure UI is ready
    setTimeout(() => {
        speakText(questionText);
    }, 500);

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
    gameState.selectedCharacter = null;
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

    // Clean up Ninja Mode if active
    if (gameState.mode === 'ninja') {
        if (gameState.ninjaSpawnInterval) {
            clearInterval(gameState.ninjaSpawnInterval);
            gameState.ninjaSpawnInterval = null;
        }
        if (gameState.ninjaGameTimer) {
            clearInterval(gameState.ninjaGameTimer);
            gameState.ninjaGameTimer = null;
        }
        gameState.ninjaFallingCharacters.forEach(char => {
            if (char.parentNode) char.remove();
        });
        gameState.ninjaFallingCharacters = [];
    }

    gameState.mode = null;
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.streak = 0;
    gameState.correctAnswers = 0;
    gameState.wrongAnswers = 0;
    gameState.playerHits = 0;
    gameState.opponentHits = 0;
    gameState.selectedCharacter = null;
    gameState.opponentCharacter = null;
    gameState.ninjaLives = 3;
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
// Ninja Mode
// ==========================================

function startNinjaMode() {
    // Reset ninja mode state
    gameState.score = 0;
    gameState.correctAnswers = 0;
    gameState.wrongAnswers = 0;
    gameState.ninjaLives = 3;
    gameState.ninjaFallingCharacters = [];
    gameState.timeLeft = gameState.ninjaGameDuration;

    // Clear any existing intervals
    if (gameState.ninjaSpawnInterval) clearInterval(gameState.ninjaSpawnInterval);
    if (gameState.ninjaGameTimer) clearInterval(gameState.ninjaGameTimer);

    updateStats();
    updateNinjaLives();
    showScreen('ninja-screen');
    updateMuteButtonState();

    // Start game countdown
    startNinjaTimer();

    // Generate first question
    generateNewNinjaQuestion();

    // Start spawning characters
    gameState.ninjaSpawnInterval = setInterval(() => {
        spawnFallingCharacter();
    }, 1800); // Spawn new character every 1.8 seconds
}

function startNinjaTimer() {
    updateNinjaTimerDisplay();

    gameState.ninjaGameTimer = setInterval(() => {
        gameState.timeLeft--;
        updateNinjaTimerDisplay();

        if (gameState.timeLeft <= 0) {
            endNinjaMode();
        }
    }, 1000);
}

function updateNinjaTimerDisplay() {
    const percentage = (gameState.timeLeft / gameState.ninjaGameDuration) * 100;
    document.getElementById('ninja-timer-fill').style.width = percentage + '%';
    document.getElementById('ninja-timer-text').textContent = gameState.timeLeft;
}

function updateNinjaLives() {
    const livesDisplay = document.getElementById('ninja-lives');
    const hearts = '❤️'.repeat(gameState.ninjaLives);
    const emptyHearts = '🖤'.repeat(3 - gameState.ninjaLives);
    livesDisplay.textContent = hearts + emptyHearts;
}

function generateNewNinjaQuestion() {
    const table = gameState.selectedTables[Math.floor(Math.random() * gameState.selectedTables.length)];
    const multiplier = Math.floor(Math.random() * 12) + 1;
    const correctAnswer = table * multiplier;

    gameState.ninjaCurrentQuestion = {
        a: table,
        b: multiplier,
        correctAnswer: correctAnswer,
        answers: generateAnswers(correctAnswer)
    };

    // Update question display
    document.getElementById('ninja-question').textContent = `${table} × ${multiplier} = ?`;

    // Speak the question
    const questionVariations = [
        `What is ${table} times ${multiplier}?`,
        `${table} times ${multiplier} equals what?`,
        `What does ${table} times ${multiplier} equal?`
    ];
    const questionText = questionVariations[Math.floor(Math.random() * questionVariations.length)];
    setTimeout(() => speakText(questionText), 300);
}

function spawnFallingCharacter() {
    if (!gameState.ninjaCurrentQuestion || gameState.ninjaLives <= 0) return;

    // Pick a random answer from current question
    const answers = gameState.ninjaCurrentQuestion.answers;
    const answer = answers[Math.floor(Math.random() * answers.length)];
    const isCorrect = answer === gameState.ninjaCurrentQuestion.correctAnswer;

    // Pick random character
    const characterKeys = Object.keys(characters);
    const randomCharKey = characterKeys[Math.floor(Math.random() * characterKeys.length)];
    const character = characters[randomCharKey];

    // Create falling character element
    const container = document.getElementById('falling-characters-container');
    const fallingChar = document.createElement('div');
    fallingChar.className = 'falling-character';

    // Random horizontal position
    const leftPosition = Math.random() * 80 + 10; // 10% to 90%
    fallingChar.style.left = leftPosition + '%';

    // Add character image
    const img = document.createElement('img');
    img.src = character.image;
    img.alt = character.name;
    img.className = 'falling-character-img';

    // Add answer text
    const answerDiv = document.createElement('div');
    answerDiv.className = 'falling-character-answer';
    answerDiv.textContent = answer;

    fallingChar.appendChild(img);
    fallingChar.appendChild(answerDiv);

    // Random fall duration (3-5 seconds)
    const fallDuration = 3 + Math.random() * 2;
    fallingChar.style.animation = `fallStraight ${fallDuration}s linear`;

    // Store data
    fallingChar.dataset.answer = answer;
    fallingChar.dataset.isCorrect = isCorrect;

    // Add click handler
    fallingChar.onclick = (e) => handleCharacterClick(e, fallingChar, answer, isCorrect);

    container.appendChild(fallingChar);
    gameState.ninjaFallingCharacters.push(fallingChar);

    // Remove character when it reaches bottom
    setTimeout(() => {
        if (fallingChar.parentNode) {
            // Character wasn't clicked - lose a life only if it was the correct answer
            if (isCorrect && gameState.ninjaLives > 0) {
                loseLife();
            }
            fallingChar.remove();
            const index = gameState.ninjaFallingCharacters.indexOf(fallingChar);
            if (index > -1) {
                gameState.ninjaFallingCharacters.splice(index, 1);
            }
        }
    }, fallDuration * 1000);
}

function handleCharacterClick(event, fallingChar, answer, isCorrect) {
    // Prevent multiple clicks
    if (!fallingChar.onclick) return;
    fallingChar.onclick = null;

    const rect = fallingChar.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Create slice effect
    createSliceEffect(x, y);

    if (isCorrect) {
        // Correct answer!
        gameState.correctAnswers++;
        gameState.streak++;
        const basePoints = 15;
        const bonus = Math.min(gameState.streak, 5) * 5;
        const points = basePoints + bonus;
        gameState.score += points;

        playSound(sounds.correct);
        showScorePopup(x, y, `+${points}`);

        // Remove character
        fallingChar.style.animation = 'none';
        fallingChar.style.opacity = '0';
        setTimeout(() => {
            if (fallingChar.parentNode) fallingChar.remove();
        }, 100);

        // Generate new question
        generateNewNinjaQuestion();

        updateStats();
    } else {
        // Wrong answer - lose a life
        gameState.wrongAnswers++;
        gameState.streak = 0;

        playSound(sounds.wrong);
        showScorePopup(x, y, '✗', '#f44336');

        // Remove character
        fallingChar.style.animation = 'none';
        fallingChar.style.opacity = '0';
        setTimeout(() => {
            if (fallingChar.parentNode) fallingChar.remove();
        }, 100);

        loseLife();
        updateStats();
    }

    // Remove from array
    const index = gameState.ninjaFallingCharacters.indexOf(fallingChar);
    if (index > -1) {
        gameState.ninjaFallingCharacters.splice(index, 1);
    }
}

function createSliceEffect(x, y) {
    const container = document.getElementById('slice-effects-container');

    // Create slash line
    const slash = document.createElement('div');
    slash.className = 'slice-effect';
    slash.style.left = x + 'px';
    slash.style.top = y + 'px';
    slash.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
    container.appendChild(slash);

    setTimeout(() => slash.remove(), 400);

    // Create particles
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 40 + Math.random() * 30;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        const particle = document.createElement('div');
        particle.className = 'slice-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        container.appendChild(particle);

        setTimeout(() => particle.remove(), 600);
    }
}

function showScorePopup(x, y, text, color = '#4caf50') {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = text;
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    popup.style.color = color;
    popup.style.transform = 'translate(-50%, -50%)';

    document.getElementById('slice-effects-container').appendChild(popup);

    setTimeout(() => popup.remove(), 1000);
}

function loseLife() {
    gameState.ninjaLives--;
    updateNinjaLives();

    if (gameState.ninjaLives <= 0) {
        endNinjaMode();
    }
}

function endNinjaMode() {
    // Clear intervals
    if (gameState.ninjaSpawnInterval) {
        clearInterval(gameState.ninjaSpawnInterval);
        gameState.ninjaSpawnInterval = null;
    }
    if (gameState.ninjaGameTimer) {
        clearInterval(gameState.ninjaGameTimer);
        gameState.ninjaGameTimer = null;
    }

    // Clear falling characters
    gameState.ninjaFallingCharacters.forEach(char => {
        if (char.parentNode) char.remove();
    });
    gameState.ninjaFallingCharacters = [];

    // Clear containers
    document.getElementById('falling-characters-container').innerHTML = '';
    document.getElementById('slice-effects-container').innerHTML = '';

    // Set total questions for results calculation
    gameState.totalQuestions = gameState.correctAnswers + gameState.wrongAnswers;
    gameState.currentQuestion = gameState.totalQuestions;

    // Show results
    showResults();
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
