# DeanPage

A static Three.js scene with a close-up vintage Macintosh, curved CRT glass,
procedural plastic and wood textures, studio lighting, and a wired mouse.

## Preview

Open `index.html` with the VS Code Live Server extension, or run `npm start`
and visit http://127.0.0.1:5173. JavaScript modules require an HTTP server;
opening the file directly does not work. Three.js, VT323, and the skill icons
are bundled locally; viewing the page does not require CDN access.

Power on zooms into the CRT and opens Dean's responsive, scrollable portfolio.
Project cards open their GitHub repositories in new tabs. Pizza and tennis
open accessible shell dialogs with 400 ms typing, Escape dismissal, and focus
restoration. Reduced motion skips the zoom, flicker, and typing animation.

## Verification

Install test dependencies with `npm install`, then `npx playwright install chromium`.
Start the HTTP server with `npm start` and run `npm test` in a second terminal.
To use an installed browser in PowerShell, set `$env:BROWSER_PATH` to its executable.
`PORT` changes the server port; `BASE_URL` changes the test target.

The suite uses the real Three.js scene at 1440×900, 1920×1080, 390×844,
360×800, and 768×1024. It checks keyboard activation, transitions, responsive
layout, exact copy, asset loading, all card click targets, popup streaming with
a controlled animation clock, focus behavior, scrolling, reduced motion, and
axe accessibility. Screenshots and results are saved under `evidence/`.
See `IMPLEMENTATION.md` for the acceptance-test audit and visual review.
