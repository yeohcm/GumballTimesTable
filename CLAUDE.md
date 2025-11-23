# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Gumball Times Table** is an educational, browser-based multiplication game for children aged 7-12, featuring characters from Cartoon Network's "The Amazing World of Gumball." It's a single-file vanilla JavaScript SPA with three difficulty modes: Practice (10 questions, no timer), Speed Race (15 questions, 10 sec/question), and Boss Battle (20 questions, 8 sec/question).

**Status:** ✅ **Complete and Ready for Deployment**. The full game is implemented in a single `index.html` file combining HTML, CSS, and JavaScript with vibrant Gumball theme, smooth animations, and kid-friendly UI.

## Key Architecture

### Technology Stack
- **Pure HTML5, CSS3, JavaScript (ES6+)** - zero external dependencies
- **Static SPA** - all logic client-side, deployable to any web host
- **Single-file structure** - index.html contains embedded CSS and JS

### Game Flow
```
Start Screen (mode selection) → Table Selection (1-12) → Game Screen (answer questions) → Results (scoring)
```

### State Management
Centralized `gameState` object tracks:
- Current mode, selected multiplication tables, question index
- Score, streak counter, correct/wrong answer counts
- Timer state and remaining time

### Core Design Decisions
- **Vanilla JS**: Minimal overhead, instant load, no build process
- **Comic Sans font**: Child-friendly, matches Gumball theme aesthetic
- **Streak bonus**: Capped at 5x multiplier (max +25 pts) to prevent runaway scores
- **Distractors**: Wrong answers generated within ±10 range of correct answer (plausible but clearly wrong)
- **Mobile-responsive**: CSS breakpoints for screens <600px wide
- **Accessibility**: High contrast, large fonts (16px minimum), keyboard navigation support

## Implementation Highlights

### Features Implemented
✅ **Three Game Modes** with distinct difficulty levels and scoring
✅ **Smart Question Generation** with realistic distractor answers (±10 range)
✅ **Real-time Scoring System** with streak bonuses (multiplier up to 5x)
✅ **Timer System** with visual progress bar (color gradient: green → yellow → red)
✅ **Four Game Screens** with smooth fade/slide animations
✅ **Character Interactions** with 10+ random messages per category (questions, correct answers, results)
✅ **Responsive Design** optimized for mobile, tablet, and desktop
✅ **Accessibility Features** including keyboard navigation and focus indicators
✅ **Visual Feedback** with animations (pulse for correct, shake for incorrect)
✅ **Performance Optimized** single-file design, zero dependencies, <50KB unminified

### UI/UX Elements
- **Vibrant Gumball Theme**: Character colors (blue, orange, pink), playful Comic Sans font, colorful gradients
- **Kid-Friendly Design**: Large touch targets (44×44px minimum), high contrast, emoji indicators, encouraging messages
- **Smooth Animations**: Bounce title, fade-in screens, correct/incorrect feedback animations
- **Star Rating System**: Performance-based rewards (⭐⭐⭐ for 90%+, ⭐⭐ for 75%+, ⭐ for 50%+, ✨ for <50%)

## Common Commands

Since there are no build tools, development and deployment are straightforward:

### Development
```bash
# Open in browser (or use any local server)
# Using Python 3:
python -m http.server 8000

# Using Node.js:
npx http-server

# Then visit http://localhost:8000/index.html
```

### Manual Testing Checklist
The `game-specs.md` file includes 20+ test cases covering:
- Functional: All game modes, question generation, scoring, streak tracking
- Visual: Responsive design on mobile/tablet/desktop, theme consistency
- Cross-browser: Chrome, Firefox, Safari, Edge
- Edge cases: Invalid input, rapid clicking, timer edge cases, streak resets

### Deployment
The application is production-ready as a single file and will be hosted on Docker.

**Docker Setup:**
```bash
# Build the Docker image
docker build -t gumball-times-table .

# Run the container (serves on port 80)
docker run -p 8080:80 gumball-times-table

# Visit http://localhost:8080
```

The Dockerfile should serve `index.html` using a lightweight web server (Nginx recommended). A minimal Nginx configuration suffices for this static SPA.

**Alternative Static Hosting** (if not Docker):
- GitHub Pages, Netlify, Vercel, S3
- Traditional web servers (Nginx, Apache)
- CDN

No build step, no dependencies to install.

## Code Structure Overview

### State Management
The `gameState` object tracks all game data:
- Current mode (practice, race, boss)
- Selected times tables and questions
- Score, streak, and correctness counts
- Timer state and current answer

### Core Modules

**Screen Management** (`showScreen()`)
- Controls visibility of 4 screens (start, table-select, game, results)
- Smooth fade-in animations on transitions

**Question/Answer Generation**
- `generateQuestions()` - Creates array of multiplication problems
- `generateAnswers()` - Generates 4 options with ±10 distractors
- `shuffleArray()` - Randomizes answer positions

**Game Flow**
- `selectMode()` → `startGame()` → `showNextQuestion()` → `checkAnswer()` → `showResults()`

**Scoring & Feedback**
- Base points per mode (10/15/20) + streak multiplier (1-5x)
- `updateStats()` - Updates real-time display
- `showResults()` - Calculates final score and star rating

**Timer System**
- `startTimer()` - Begins countdown (10s for race, 8s for boss)
- `updateTimerDisplay()` - Updates visual bar and text
- Auto-fails if time expires without answer

### Character Messages (Data-Driven)
10 variations each for:
- Question prompts
- Correct answer encouragement
- Performance-based results

## Important Implementation Guidelines

### Code Style
- **Variables/Functions**: `camelCase` (e.g., `generateQuestion`, `updateScore`)
- **CSS Classes/IDs**: `kebab-case` (e.g., `.answer-btn`, `#game-screen`)
- **Comments**: Focus on "why," not "what" — code should be self-documenting

### Key Functions (Already Implemented)
From `game-specs.md`:

1. **`generateQuestions(mode, tables)`** - Creates array of multiplication questions
   - Adds ±10 distractor answers (implausible-but-close wrong options)
   - Shuffles questions to vary difficulty

2. **`shuffleArray(array)`** - Randomizes array order

3. **`calculateScore(mode, correct, streak)`** - Points: base (10/15/20) × streak multiplier (1–5×)

4. **`updateStreak(isCorrect)`** - Increments on correct; resets on wrong; maxed at 5

5. **`startTimer(seconds, callback)`** - Countdown timer with visual feedback

6. **`startScreen()`, `selectTableScreen()`, `gameScreen()`, `resultsScreen()`** - Screen transitions

### Performance Targets
- Load time: <100ms
- First Contentful Paint: <200ms
- Time to Interactive: <300ms
- Minified file size: ~9 KB

### Testing Priority
1. **Core mechanics**: Question generation (randomness, distractor range), scoring algorithm, streak logic
2. **Game flow**: Mode selection, table selection, timer accuracy, results calculation
3. **UI/UX**: Mobile responsiveness, keyboard navigation, button responsiveness
4. **Cross-browser**: Chrome, Firefox, Safari, Edge on desktop and mobile

## File Structure

Current implementation:
```
D:\Projects\GumballTimesTable\
├── index.html             # ✅ HTML markup only (~5KB)
├── styles.css             # ✅ All CSS styling (~12KB)
├── script.js              # ✅ All JavaScript logic (~15KB)
├── Dockerfile             # ✅ Docker deployment config
├── game-specs.md          # Technical specification & reference (712 lines)
└── CLAUDE.md              # This file - guidance for future development
```

### File Details

**`index.html`** (~5KB)
- Clean HTML structure: 4 responsive screens (Start → Table Selection → Game → Results)
- References external `styles.css` and `script.js`
- All game elements: character bubbles, buttons, progress bars, timers
- No embedded CSS or JavaScript - fully separated for maintainability

**`styles.css`** (~12KB)
- Complete styling system with CSS variables for easy customization
- Color palette, animations (bounce, pulse, shake), responsive breakpoints
- Mobile-first design with breakpoint at <600px
- Accessibility features: focus indicators, reduced-motion support

**`script.js`** (~15KB)
- All game logic organized into logical sections:
  - Game state management
  - Character data & messages
  - Table selection
  - Game mechanics (timer, scoring, streak)
  - Results & navigation
- Well-commented with clear function organization
- Character system with Gumball, Darwin, Anais, Tina Rex

**`Dockerfile`**
- Based on `nginx:alpine` (~10MB)
- Copies `index.html`, `styles.css`, `script.js` to web root
- Serves on port 80
- Includes health check
- Ready for Docker Hub, Kubernetes, or any container registry

**`game-specs.md`**
- Complete technical specification and reference
- Feature requirements, algorithms, visual design system
- 20+ manual test cases
- Phase 2 roadmap for future enhancements

## Future Expansion (Phase 2)

If the project grows beyond the current scope, consider modularizing into separate files (HTML/CSS/JS) and potentially adding:
- Persistent progress storage (localStorage, optional backend)
- Sound effects and additional animations
- Leaderboards and achievement system
- Division mode, multiplayer features
- Adaptive difficulty based on performance
- Parent dashboard for tracking progress

Current single-file architecture is sufficient for Phase 1; modularization would be prudent before Phase 2 expansion.
