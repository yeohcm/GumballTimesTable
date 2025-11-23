# Gumball Times Table Challenge - Technical Specification

## Executive Summary

An educational web-based multiplication game for children aged 7-12, themed around Cartoon Network's "The Amazing World of Gumball." The game features three difficulty modes, customizable times tables, real-time scoring, and engaging animations.

***

## Game Design Document

### Core Concept
Players help Gumball, Darwin, and other characters from Elmore Junior High by solving multiplication problems. The game combines educational value with entertainment through colorful visuals, character integration, and progressive difficulty.

### Target Audience
- **Age Range**: 7-12 years old
- **Skill Level**: Elementary/Primary school students learning multiplication (times tables 1-12)
- **Platform**: Web browsers (desktop, tablet, mobile)

***

## Technical Architecture

### Technology Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Architecture**: Single-page application (SPA) with state management
- **No Dependencies**: Pure vanilla JavaScript - no frameworks or libraries required
- **Deployment**: Static hosting (works on any web server)

### File Structure
```
index.html (single-file application)
├── HTML Structure
├── CSS Styles (embedded in <style>)
└── JavaScript Logic (embedded in <script>)
```

***

## Game Modes

### 1. Practice Mode 📚
**Purpose**: Learning-focused, no time pressure

| Parameter | Value |
|-----------|-------|
| Total Questions | 10 |
| Timer | Disabled |
| Points per Correct | 10 |
| Streak Bonus | 5 points per consecutive correct (max +25) |
| Target Audience | Beginners, confidence building |

### 2. Speed Race ⚡
**Purpose**: Moderate challenge with time pressure

| Parameter | Value |
|-----------|-------|
| Total Questions | 15 |
| Timer | 10 seconds per question |
| Points per Correct | 15 |
| Streak Bonus | 5 points per consecutive correct (max +25) |
| Time Penalty | Question skipped if time expires |

### 3. Boss Battle 👾
**Purpose**: Advanced challenge (facing "Tina Rex")

| Parameter | Value |
|-----------|-------|
| Total Questions | 20 |
| Timer | 8 seconds per question |
| Points per Correct | 20 |
| Streak Bonus | 5 points per consecutive correct (max +25) |
| Difficulty | Fastest timing, most questions |

***

## State Management

### Game State Object
```javascript
gameState = {
    mode: string,              // 'practice' | 'race' | 'boss'
    selectedTables: array,     // [1-12] - user-selected multiplication tables
    currentQuestion: number,   // Current question index (0-based)
    totalQuestions: number,    // Total questions for mode
    score: number,             // Current score
    streak: number,            // Consecutive correct answers
    correctAnswers: number,    // Total correct
    wrongAnswers: number,      // Total incorrect
    questions: array,          // Generated question objects
    currentAnswer: number,     // Correct answer for current question
    timer: interval,           // Timer interval ID
    timeLeft: number           // Seconds remaining
}
```

### Question Object Structure
```javascript
{
    a: number,        // First multiplicand (from selected tables)
    b: number,        // Second multiplicand (1-12)
    answer: number    // Correct answer (a × b)
}
```

***

## Screen Flow

```
┌─────────────────┐
│  Start Screen   │
│  (Mode Select)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Table Selection │
│   (1-12 grid)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Game Screen   │
│  (Questions)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Results Screen  │
│ (Stats & Stars) │
└─────────────────┘
```

***

## User Interface Components

### 1. Header Section
**Components**:
- Title: "Gumball's Times Table Challenge!"
- Subtitle: "Help Gumball and Darwin save Elmore Junior High!"
- Animated bounce effect on title

**Stats Display** (always visible):
- Score counter
- Streak counter  
- Progress (current/total questions)

### 2. Start Screen
**Elements**:
- Character speech bubble (Gumball)
- 3 mode selection buttons:
  - Practice Mode (green gradient)
  - Speed Race (orange gradient)
  - Boss Battle (purple gradient)

**Button Behaviors**:
- Hover: lift effect (-5px) + scale (1.05)
- Click: proceeds to table selection

### 3. Table Selection Screen
**Elements**:
- Character speech bubble (Darwin)
- 4×3 grid of times table buttons (1-12)
- Start button
- Back button

**Default Selection**: 2×, 5×, 10× (pre-selected)

**Interaction**:
- Click to toggle selection (green background when selected)
- Must select at least 1 table to proceed
- Validation alert if none selected

### 4. Game Screen
**Layout**:
```
┌─────────────────────────────────┐
│ [Timer Bar] (if race/boss mode) │
├─────────────────────────────────┤
│ [Progress Bar]                  │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Character Speech Bubble     │ │
│ │ "Let's do this!"            │ │
│ └─────────────────────────────┘ │
│                                 │
│    5 × 7 = ?                    │
│    (large, bold)                │
├─────────────────────────────────┤
│ [Feedback Area] (shows after)   │
├─────────────────────────────────┤
│ ┌────────┬────────┐             │
│ │  [35]  │  [32]  │             │
│ ├────────┼────────┤             │
│ │  [40]  │  [28]  │             │
│ └────────┴────────┘             │
├─────────────────────────────────┤
│ [Encouragement Text]            │
└─────────────────────────────────┘
```

**Question Display**:
- Large font (3em)
- Format: "a × b = ?"
- White text on gradient background

**Answer Grid**:
- 2×2 grid of buttons
- 4 answer options (1 correct, 3 distractors)
- Randomized positions each question

### 5. Results Screen
**Components**:
- Title (based on performance)
- Star rating (⭐⭐⭐ | ⭐⭐ | ⭐ | ✨)
- Character speech with feedback
- Statistics table:
  - Correct answers
  - Wrong answers
  - Accuracy percentage
  - Final score
- Action buttons (Play Again, Change Tables)

***

## Algorithms & Logic

### Question Generation
```javascript
// Pseudo-code
function generateQuestions():
    for i from 0 to totalQuestions:
        table = randomFrom(selectedTables)
        multiplier = random(1, 12)
        question = {
            a: table,
            b: multiplier,
            answer: table * multiplier
        }
        questions.push(question)
```

### Answer Generation
**Strategy**: Create 4 options (1 correct, 3 plausible distractors)

```javascript
function generateAnswers(correctAnswer):
    answers = [correctAnswer]
    
    while answers.length < 4:
        offset = random(-10, 10)
        wrongAnswer = correctAnswer + offset
        
        if wrongAnswer > 0 AND 
           wrongAnswer != correctAnswer AND 
           wrongAnswer not in answers:
            answers.push(wrongAnswer)
    
    return shuffle(answers)
```

**Distractor Rules**:
- Must be positive integers
- Within ±10 of correct answer (makes them plausible)
- No duplicates
- Positions randomized

### Scoring System

**Base Points**:
- Practice: 10 points/correct
- Race: 15 points/correct
- Boss: 20 points/correct

**Streak Bonus**:
```
bonusPoints = min(streak, 5) × 5
```
- Maximum bonus: +25 points (5 streak)
- Resets to 0 on incorrect answer

**Example Calculation**:
```
Mode: Boss (20 base points)
Streak: 3
Total = 20 + (3 × 5) = 35 points
```

### Timer Logic

**Timer Update Cycle**:
```javascript
// Executes every 1 second
function timerTick():
    timeLeft--
    updateTimerDisplay()
    
    if timeLeft <= 0:
        clearTimer()
        markIncorrect()
        showCorrectAnswer()
        nextQuestion()
```

**Visual Timer**:
- Progress bar fills from left to right
- Color gradient: green → yellow → red
- Displays seconds remaining as text overlay

### Performance Evaluation

**Star Rating Algorithm**:
```javascript
accuracy = (correctAnswers / totalQuestions) × 100

if accuracy >= 90: stars = ⭐⭐⭐, title = "LEGENDARY!"
if accuracy >= 75: stars = ⭐⭐, title = "SUPER!"
if accuracy >= 50: stars = ⭐, title = "GOOD JOB!"
if accuracy < 50:  stars = ✨, title = "KEEP TRYING!"
```

**Character Messages** (based on performance):
- 90%+: Gumball's enthusiastic praise
- 75%+: Darwin's encouragement
- 50%+: Anais's constructive feedback
- <50%: Motivational "don't give up" message

***

## Visual Design System

### Color Palette

**Character Colors**:
```css
--color-blue-gumball: #00a8e1;    /* Primary blue (Gumball) */
--color-orange-darwin: #ff8c42;   /* Orange (Darwin) */
--color-pink-anais: #ff69b4;      /* Pink (Anais) */
```

**Semantic Colors**:
```css
--color-green: #4caf50;    /* Correct answers, success */
--color-red: #f44336;      /* Incorrect answers, errors */
--color-yellow: #ffeb3b;   /* Warnings, timer */
--color-purple: #9c27b0;   /* Encouragement text */
```

**Gradients**:
```css
/* Background */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Question box */
background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);

/* Mode buttons - dynamically assigned */
```

### Typography

**Font Stack**:
```css
font-family: 'Comic Sans MS', 'Chalkboard SE', 
             'Arial Rounded MT Bold', cursive, sans-serif;
```
*Rationale*: Playful, child-friendly fonts matching cartoon aesthetic

**Font Sizes**:
- Page title (h1): 2.5em (40px)
- Question text: 3em (48px)
- Answer buttons: 1.8em (29px)
- Body text: 1.2em (19px)

### Animations

**1. Bounce Animation** (Title)
```css
@keyframes bounce {
    0%, 100%: translateY(0)
    50%: translateY(-10px)
}
duration: 2s, infinite
```

**2. Correct Answer Pulse**
```css
@keyframes correctPulse {
    0%, 100%: scale(1)
    50%: scale(1.1)
}
duration: 0.5s
```

**3. Incorrect Answer Shake**
```css
@keyframes shake {
    0%, 100%: translateX(0)
    25%: translateX(-10px)
    75%: translateX(10px)
}
duration: 0.5s
```

**4. Screen Transitions**
```css
@keyframes fadeIn {
    from: opacity 0, scale(0.9)
    to: opacity 1, scale(1)
}
duration: 0.5s
```

**5. Button Hover**
```css
transform: translateY(-5px) scale(1.05)
transition: 0.3s
```

### Responsive Design

**Breakpoints**:
```css
@media (max-width: 600px) {
    /* Mobile adjustments */
    - Reduce font sizes (h1: 2em, question: 2em)
    - Smaller padding (20px)
    - Answer buttons: 1.4em, 20px padding
    - Table grid: 3 columns (instead of 4)
}
```

**Mobile Optimizations**:
- Viewport meta tag ensures proper scaling
- Touch-friendly button sizes (minimum 44×44px)
- Flexible grid layouts (auto-fit, minmax)
- No hover effects on touch devices (click-only)

***

## Content & Messaging

### Character Speech Bubbles

**Random Selection** (10 variations each):

**Encouragements** (after correct answer):
```javascript
[
    "Awesome! Keep it up!",
    "You're on fire! 🔥",
    "Darwin is proud of you!",
    "Amazing work!",
    "Spectacular!",
    "You're a math genius!",
    "Gumball says: NICE!",
    "Fantastic job!",
    "Anais would be impressed!",
    "Outstanding!"
]
```

**Character Messages** (during questions):
```javascript
[
    "You can do this!",
    "Think carefully!",
    "What's the answer?",
    "Show me what you got!",
    "Elmore needs you!",
    "Use your brain power!",
    "Math time!",
    "Let's solve this together!",
    "You've got this!",
    "Focus and win!"
]
```

### Feedback Messages

**Correct Answer**:
- Text: "✓ Correct! Amazing!"
- Color: Green background
- Duration: 2 seconds
- + Random encouragement below

**Incorrect Answer**:
- Text: "✗ Oops! The answer was [X]"
- Color: Red background
- Duration: 2 seconds
- Shows correct answer highlighted

***

## Accessibility Considerations

### Current Implementation
- **Keyboard Navigation**: Buttons are focusable via tab
- **Color Contrast**: High contrast text on backgrounds
- **Font Legibility**: Large, clear fonts (min 1.2em)
- **Touch Targets**: Buttons minimum 44×44px
- **Visual Feedback**: Multiple feedback channels (color + text + animation)

### Recommendations for Enhancement
1. **Add ARIA labels**: Screen reader descriptions for buttons/states
2. **Keyboard shortcuts**: Space/Enter to select answers
3. **Reduced motion**: Respect `prefers-reduced-motion` media query
4. **Focus indicators**: Clear visible focus rings
5. **Alternative text**: Image descriptions (if images added)

***

## Performance Optimization

### Current Optimizations
- **Single File**: No HTTP requests for assets
- **Vanilla JS**: No framework overhead (~0 KB dependencies)
- **CSS Animations**: Hardware-accelerated transforms
- **Event Delegation**: Efficient event handling

### Performance Metrics (Expected)
- **Load Time**: <100ms (single HTML file)
- **First Contentful Paint**: <200ms
- **Time to Interactive**: <300ms
- **File Size**: ~12 KB (minified)

### Browser Compatibility
- **Chrome**: 90+ ✅
- **Firefox**: 88+ ✅
- **Safari**: 14+ ✅
- **Edge**: 90+ ✅
- **Mobile Safari**: iOS 14+ ✅
- **Chrome Android**: 90+ ✅

***

## Extension Opportunities

### Phase 2 Features (Future)
1. **Sound Effects**: Correct/incorrect audio feedback
2. **Leaderboard**: Local storage high scores
3. **Achievements**: Badges for milestones
4. **Division Mode**: Inverse operation practice
5. **Multiplayer**: Two-player split screen
6. **Character Customization**: Choose favorite character
7. **Progress Tracking**: Save learning progress
8. **Adaptive Difficulty**: AI-adjusted question difficulty
9. **Parent Dashboard**: Track child's performance
10. **Print Worksheets**: Generate PDF practice sheets

### Technical Debt
- Consider refactoring to modular JS (if expanding features)
- Add unit tests for score calculation
- Implement state persistence (localStorage)
- Create build process for optimization

***

## Testing Checklist

### Functional Testing
- [ ] All three modes start correctly
- [ ] Timer counts down accurately (race/boss)
- [ ] Timer expires triggers incorrect answer
- [ ] Score calculation correct (base + streak bonus)
- [ ] Streak resets on wrong answer
- [ ] Streak caps at 5 for bonus
- [ ] Progress bar updates each question
- [ ] All 12 times tables can be selected
- [ ] Must select at least 1 table (validation)
- [ ] Correct answer always in random position
- [ ] No duplicate answer options
- [ ] Feedback displays for 2 seconds
- [ ] Results screen shows correct stats
- [ ] Star rating matches accuracy thresholds
- [ ] Play Again resets all state
- [ ] Change Tables preserves selections

### Visual Testing
- [ ] Animations play smoothly (60fps)
- [ ] Text readable on all backgrounds
- [ ] Buttons respond to hover/click
- [ ] Layout adapts on mobile (<600px)
- [ ] No horizontal scroll on mobile
- [ ] Speech bubbles display correctly
- [ ] Timer bar fills correctly
- [ ] Color gradients render properly

### Cross-Browser Testing
- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Edge (desktop)
- [ ] Safari iOS (mobile)
- [ ] Chrome Android (mobile)

### Edge Cases
- [ ] Selecting/deselecting all tables
- [ ] Rapid button clicking (debounce check)
- [ ] Timer at 0 seconds
- [ ] Score overflow (999,999+)
- [ ] 100% accuracy
- [ ] 0% accuracy
- [ ] Switching modes mid-game

***

## Development Guidelines

### Code Style
```javascript
// Use ES6+ features
const gameState = { ... };

// Descriptive function names
function generateQuestions() { }

// Clear variable names
let currentQuestion = 0;

// Comments for complex logic
// Generate 3 plausible wrong answers
```

### Naming Conventions
- **Variables**: camelCase (`gameState`, `currentQuestion`)
- **Functions**: camelCase verbs (`startGame`, `checkAnswer`)
- **CSS Classes**: kebab-case (`.answer-btn`, `.stat-box`)
- **IDs**: kebab-case (`#game-screen`, `#timer-fill`)

### Git Workflow (if implementing)
```
main (production)
  └── develop (integration)
       ├── feature/sound-effects
       ├── feature/leaderboard
       └── bugfix/timer-accuracy
```

***

## Deployment Instructions

### Static Hosting (Recommended)
1. **Netlify**: Drag & drop `index.html`
2. **Vercel**: Import from Git repository
3. **GitHub Pages**: Push to `gh-pages` branch
4. **AWS S3**: Upload to bucket with static hosting enabled

### No Build Process Required
- File is production-ready as-is
- Optional: Minify HTML/CSS/JS for ~3 KB savings

### Testing URL Structure
```
https://your-domain.com/index.html
https://your-domain.com/  (if server defaults to index.html)
```

***

## Support & Maintenance

### Known Limitations
1. **No persistence**: Progress lost on refresh
2. **No offline mode**: Requires initial load
3. **No backend**: All logic client-side
4. **No analytics**: Can't track usage patterns

### Browser Console Errors (None Expected)
- Clean console on all major browsers
- No security warnings (no external resources)

### User Feedback Channels
- In-game: Results screen messaging
- External: GitHub issues / support email

***

## Educational Value Assessment

### Learning Objectives Met
✅ **Memorization**: Repetitive practice of multiplication facts  
✅ **Speed**: Timed modes build automaticity  
✅ **Confidence**: Immediate feedback and encouragement  
✅ **Engagement**: Character theme maintains motivation  
✅ **Progression**: Multiple difficulty levels  
✅ **Customization**: Focus on specific times tables  

### Alignment with Curricula
- **Common Core** (US): 3.OA.C.7 (fluency with multiplication)
- **UK National Curriculum**: Year 3-4 times tables
- **Australian Curriculum**: Year 3-4 number facts

***

## License & Credits

### Game Content
- **Theme**: "The Amazing World of Gumball" (Cartoon Network)
- **Characters**: Gumball, Darwin, Anais, Tina Rex
- **Educational Purpose**: Fair use for learning

### Code License
- Open source (suggest MIT License if distributing)

***

**Document Version**: 1.0  
**Last Updated**: November 23, 2025  
**Status**: Production Ready