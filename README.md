# Gumball Times Table

Gumball Times Table is an educational, browser-based multiplication game for children (roughly ages 7–12) inspired by Cartoon Network's "The Amazing World of Gumball". It's a lightweight single-file SPA (index.html) implemented with vanilla HTML, CSS and JavaScript and ready to be hosted anywhere that serves static files.
I created this for my son, Lucas who really likes Gumball.

Status: ✅ Complete and ready for deployment

Demo: https://yeohcm.github.io/GumballTimesTable/

---

## Table of Contents

- Project overview
- Features
- Technology
- Getting started
- Game flow
- Game modes & scoring
- Accessibility & design
- Testing
- Deployment
- Contributing
- License

---

## Project overview

This project is a compact, dependency-free multiplication practice game with three modes:
- Practice (no timer)
- Speed Race (timed)
- Boss Battle (harder timed mode)

All UI, styles, and game logic live in a single `index.html` file for simplicity and portability. The game includes friendly character interactions, animations, and a streak/bonus scoring mechanic to encourage learning.

---

## Features

- Three game modes with different question counts and timers
- Smart question and distractor generation
- Real-time scoring with streak multipliers (capped to avoid runaway scores)
- Timer with visual progress bar (green → yellow → red)
- Responsive layout for mobile and desktop
- Accessibility improvements: keyboard navigation, large touch targets, high contrast
- Smooth animations and visual feedback for answers
- Star rating at results based on performance

---

## Technology

- HTML5
- CSS3 (responsive, mobile-first)
- JavaScript (ES6+, vanilla)
- Dockerfile included for optional containerized static hosting
- Small helper Python scripts may exist in the repo for development or CI tasks

Language composition (approx.):
- JavaScript: ~43.5%
- CSS: ~33.7%
- HTML: ~13.6%
- Python: ~8.6%
- Dockerfile: ~0.6%

---

## Getting started (local)

No build step required — just serve the files with any static server or open `index.html` in a browser.

Quick options:

- Python 3
  ```bash
  python -m http.server 8000
  # then open http://localhost:8000/index.html
  ```

- Node (http-server)
  ```bash
  npx http-server
  # then open the printed URL
  ```

---

## Docker (optional)

A minimal Dockerfile is included to serve the app via Nginx in a container.

Build and run:
```bash
docker build -t gumball-times-table .
docker run -p 8080:80 gumball-times-table
# Visit http://localhost:8080
```

---

## Game flow

1. Start screen — choose a game mode
2. Table selection — pick which multiplication tables (1–12) to include
3. Game screen — answer generated questions
4. Results — score, streaks, stars and encouraging messages

State is managed in a central `gameState` object (current mode, selected tables, question index, score, streak, timer, etc.).

---

## Game modes & scoring

- Practice: 10 questions, no timer (learn at your own pace)
- Speed Race: 15 questions, 10 sec/question
- Boss Battle: 20 questions, 8 sec/question

Scoring includes base points plus streak multipliers (multiplier is capped; streak bonus is designed to be encouraging but bounded).

Wrong answers and timeouts are tracked separately; visual feedback and short messages are shown for correct/incorrect answers.

---

## Accessibility & design

- Large, high-contrast UI elements for children
- Minimum 16px font size, large touch targets (≥44×44px)
- Keyboard-accessible controls and clear focus indicators
- Fun, kid-friendly visuals, playful type and character messages

---

## Testing

A `game-specs.md` (or similar) in the repository contains manual test cases covering:
- Functional flows for each mode
- Edge cases (rapid input, timer boundaries)
- Responsiveness across screen sizes
- Accessibility checks

Manual testing is recommended in desktop and mobile browsers (Chrome, Firefox, Safari, Edge).

---

## Deployment

Because this is a static single-file SPA, you can deploy to:
- GitHub Pages
- Netlify / Vercel
- Any static hosting (S3, CDN, traditional web server)
- Docker container (see above)

For Docker/Nginx, the provided Dockerfile serves `index.html` from the container root.

---

## Contributing

Small repo and single-file app — contributions are welcome:

- Bug fixes or improvements to `index.html` (JS/CSS)
- Additions to accessibility, messages, or question-generation logic
- Polish animations or mobile layout tweaks

Please open an issue describing the change you'd like to make, or submit a PR with a brief description and screenshots where appropriate.

---

## License

Please add a LICENSE file for an explicit open-source license. If none is provided, assume the repository owner retains all rights.

---

## Contact

Maintainer: yeohcm (GitHub)

If you'd like, I can:
- Push this README into the repository on a branch and open a PR, or
- Update the README with screenshots, badges, or a deployed demo link — tell me which and I'll prepare it.
