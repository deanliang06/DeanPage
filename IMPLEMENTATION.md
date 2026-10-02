# Implementation and verification — October 2, 2026

Power on runs one guarded Three.js camera zoom, then reveals a full-resolution,
scrollable green CRT portfolio. The desktop scene is hidden after the zoom.
The portfolio uses local VT323, responsive project and experience grids, whole-card
repository links, hover/focus illumination, and native modal shell dialogs.
Reduced motion skips zoom, flicker, and streaming. Popups type over 400 ms,
cancel pending animation work when closed, trap Tab, close with Escape, and restore focus.

## Sources and asset mapping

| Asset | Use |
| --- | --- |
| DeanPageScreen/CodingHarness.png | Agentic Coding Harness card |
| DeanPageScreen/demo-battle.png | Dynamic Pokémon card |
| DeanPageScreen/MantisPeople.jpeg | Mantis people photo, above the product screenshot |
| DeanPageScreen/Mantis.png | Mantis product screenshot |

The supplied people photo is JPEG, not the PNG name in PLAN.md. It was inspected
and used directly. No content assets are missing. The introduction retains the
exact requested wording, including "an NYU" and "infastructure".

Mantis product context was checked against https://home.withmantis.com/ on
October 2, 2026: its platform maps complex multimodal data and supports exploration
with AI while retaining evidence and context. No role, dates, achievements, or
employment details were invented. Project descriptions are deliberately limited
to the user-provided context and what the inspected screenshots demonstrate;
GitHub repository contents could not be fetched through the web tool.
Icon and font provenance and licenses are recorded in assets/SOURCES.md.

## Commands and results

Standard commands:

```powershell
npm install
npm start
# In a second terminal:
npx playwright install chromium
npm test
npm run test:supplemental
```

Default URL: http://127.0.0.1:5173. During verification, an older preview already
occupied port 5173, so a fresh server was started on port 5174 to pick up the SVG
and font MIME types. The existing preview process was left alone.

Actual test environment used the available Node runtime and installed Edge:

```powershell
$node = 'C:/Users/deanl/Documents/gamealishiss/.tools/node-v22.16.0-win-x64/node.exe'
$env:PORT = '5174'
& $node server.cjs
# In a second terminal:
$env:BASE_URL = 'http://127.0.0.1:5174'
$env:BROWSER_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
& $node tests/acceptance.cjs
& $node tests/supplemental.cjs
```

Dependency installation completed with zero audit vulnerabilities. Both suites
exited successfully. The acceptance suite passed at 1440×900, 1920×1080,
390×844, 360×800, and 768×1024, plus a reduced-motion scenario. Each viewport
reported zero application errors and zero failed local assets. Axe reported
zero violations on the portfolio and an open popup at every viewport.
The supplemental suite passed all five viewports, including hover restoration,
Space activation, logical keyboard order, touch scrolling and repository taps
on both mobile sizes, keyboard popup activation, and 200% equivalent reflow.
Typing was measured with Playwright's controlled animation clock; progressive
updates completed within 500 ms. No canvas or Three.js scene was mocked.

Machine-readable results: [main suite](evidence/results.json),
[supplemental suite](evidence/supplemental-results.json).

## Acceptance audit

| IDs | Status | Evidence / scope |
| --- | --- | --- |
| P01 | Passed | Initial desk screenshots manually reviewed at desktop, mobile, and tablet sizes; housing, keyboard, mouse, wood, shadows, and glass reflection visible. |
| P02 | Partially verified | Centered green control, glow, and hidden portfolio reviewed; subtle flicker defined in CSS but not measured or reviewed as video. Mobile control remains at least 44 px high. |
| P03 | Partially verified | Final screen-only portfolio and hidden power/desk verified; continuous zoom motion and absence of every possible blank intermediate frame were not independently reviewed frame by frame. |
| P04–P06 | Passed | Enter and Space activation, focus after transition, repeated activation, resize during zoom and after reaching Skills. |
| C01–C07 | Passed | Exact order/copy, inspected source images, descriptions, source-grounded Mantis context, desktop/mobile visual review, alt text, asset decoding. |
| L01–L06 | Passed | Exact hrefs, hover and focus style, no card size changes, image/copy/card-edge/Enter activation, new-tab destination interception, mobile taps. |
| S01–S10 | Passed | Exact ordered skill inventory, loaded online-sourced local icons, responsive wrapping, exact popup text, progressive timing, close/reopen cleanup, alternating outputs, focus containment and restoration. |
| R01–R04 | Passed | Inner keyboard/wheel scrolling, emulated touch swipe, responsive cards and experience, accessible popups, resize at Skills, no horizontal overflow. |
| R05 | Partially verified | 720×450 reflow equivalent to a 1440×900 browser at 200% passed and was visually reviewed. Actual browser UI zoom at 200% was not exercised. |
| R06–R08 | Passed | Logical Tab order, keyboard activation, focus indicators, popup Escape/Tab behavior, axe scans, manual contrast/readability review, and error/request monitoring. |
| Reduced motion | Passed | Screen and text appear immediately; content and dismissal remain usable. |

No final automated failures remain. The explicitly partial checks above should
not be interpreted as fully verified. Testing used headless Edge with software
WebGL; physical touch hardware, other browser engines, assistive technology,
native browser zoom, and GPU-specific performance were not tested.

## Screenshot evidence

Screenshots were manually reviewed for initial framing, readable green pixel
typography, full-resolution images, stacking, experience image order, skills,
popup bounds, and focus illumination. Normal viewport screenshots show the
real fixed scroll container. The `*-full.png` section exports temporarily expose
overflow to capture the complete section; they supplement the real viewport
captures rather than prove scrolling behavior.

| Viewport | Desk | Portfolio | Projects | Experience | Skills | Pizza | Tennis |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1440×900 | [image](evidence/1440x900-initial.png) | [image](evidence/1440x900-portfolio.png) | [image](evidence/1440x900-projects-full.png) | [image](evidence/1440x900-experience-full.png) | [image](evidence/1440x900-skills.png) | [image](evidence/1440x900-pizza.png) | [image](evidence/1440x900-tennis.png) |
| 1920×1080 | [image](evidence/1920x1080-initial.png) | [image](evidence/1920x1080-portfolio.png) | [image](evidence/1920x1080-projects-full.png) | [image](evidence/1920x1080-experience-full.png) | [image](evidence/1920x1080-skills.png) | [image](evidence/1920x1080-pizza.png) | [image](evidence/1920x1080-tennis.png) |
| 390×844 | [image](evidence/390x844-initial.png) | [image](evidence/390x844-portfolio.png) | [image](evidence/390x844-projects-full.png) | [image](evidence/390x844-experience-full.png) | [image](evidence/390x844-skills.png) | [image](evidence/390x844-pizza.png) | [image](evidence/390x844-tennis.png) |
| 360×800 | [image](evidence/360x800-initial.png) | [image](evidence/360x800-portfolio.png) | [image](evidence/360x800-projects-full.png) | [image](evidence/360x800-experience-full.png) | [image](evidence/360x800-skills.png) | [image](evidence/360x800-pizza.png) | [image](evidence/360x800-tennis.png) |
| 768×1024 | [image](evidence/768x1024-initial.png) | [image](evidence/768x1024-portfolio.png) | [image](evidence/768x1024-projects-full.png) | [image](evidence/768x1024-experience-full.png) | [image](evidence/768x1024-skills.png) | [image](evidence/768x1024-pizza.png) | [image](evidence/768x1024-tennis.png) |

[Keyboard-focus illumination](evidence/1440x900-focus.png).
[200% equivalent reflow](evidence/zoom-reflow-equivalent.png).
