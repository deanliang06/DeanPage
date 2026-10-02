When the user clicks Power on, zoom into the Macintosh screen until only the screen is visible, then display the portfolio described below.

## Readability and scrolling

Use a retro pixel font and green CRT styling, with varying font sizes and weights. Render at modern resolution rather than enforcing the original Macintosh's low resolution, so text remains readable and project screenshots retain their detail. Keep any CRT effects subtle enough that they do not obscure the content.

After the zoom, allow the portfolio content to scroll inside the screen. Keep all sections accessible on desktop and mobile. Display the project cards side-by-side when there is enough space, and stack them on smaller screens to preserve readable text and useful image sizes.

## Introduction and projects

On the left, display the text: "My name is Dean an NYU student, a developer who builds out agentic systems, infastructure, and more!!"

Below the introduction, add a "Cool Projects" header and two project cards: one for my coding harness (https://github.com/deanliang06/AgenticCodingHarness) and one for the fake Pokemon game I created (https://github.com/deanliang06/DynamicPokemon). Both projects are on my GitHub. Each card should include its corresponding screenshot from DeanPageScreen and a very short description of each product. Make the images large enough for their details to be visible.

On hover, illuminate each card with a soft green glow that matches the CRT styling. Give keyboard focus the same visual treatment. Make the entire card a link to its corresponding GitHub repository, so clicking or activating it with the keyboard opens that project's repository. Use the actual repository URLs.

## Experience

Below the projects, add an "Experiences" section featuring my experience at Mantis AI. Place MantisPeople.png above Mantis.png in a left column, with a short text blurb to the right of the images saying essentially this (with added context of what the product is): "I had a wonderful time building out the agentic infrastructure which continues to be the most captivating part of this product". Company information can be found at https://home.withmantis.com/.

## Skills

Below the experience, add a "Skills" section featuring my skills. Make a list of skills which can have mulitplee skills on one row depending on screen width: which include exclusively icons which you will find from online, except for these two emojis which need to be the first two pizza and tennis. The rest of the skills include Docker, AWS, Git, GitHub, Linux, AI agents,CI/CD, Postgres, and then you have as a last item (and more...). If the users click on the pizza or the tennis, they open up panels. The pizza one will stream output text in a shell format: "My favorite pizza comes from Otto's in New York. And, no, I am not trying to be different." The tennis one will output in a streaming shell cursor format as well the following: "Top 10 player in my conference multiple years in a row and top 50 in New England. However, the glory days may be over now..." These will appear as popups which have a x button on the top right. This streaming will be very fast though so that it streams within 0.5 seconds.

## Acceptance tests and verification

These are tests to implement and run against the finished page, not claims that the current page passes. Treat the requirements above as authoritative. Use browser automation for behavior and manual screenshot review for appearance. Do not treat a successful build or an element's presence alone as proof of visual correctness.

### Test setup

- Serve the project over HTTP and test the real Three.js scene, not a mocked canvas. Document the start command and URL.
- Run the desktop suite at 1440×900 and 1920×1080, and the mobile suite at 390×844 and 360×800. Also check a tablet viewport at 768×1024.
- Start independent scenarios with a fresh page. Wait for the scene or portfolio to be ready rather than using arbitrary sleep delays. Use accessible roles and names for controls and links; add stable test IDs only where needed for the canvas and scroll container.
- Record browser console errors, failed asset requests, and unexpected page errors. An intentional external navigation must not be counted as a failed local asset.
- Inventory the files in DeanPageScreen before implementation. Verify which screenshots belong to which project and locate MantisPeople.png and Mantis.png. Do not substitute unrelated images or invent missing experience facts.

### Power-on transition and initial scene

| ID | Action or inspection | Passing result |
| --- | --- | --- |
| P01 | Load a fresh page at a desktop viewport. | The Macintosh, keyboard in front, mouse beside it, and wooden tabletop are visible. The light blue background remains simple. The monitor is the main focal point. |
| P02 | Inspect the initial CRT and power control. | A green Power on button is centered on the CRT, with a soft glow and a barely noticeable flicker. Portfolio content is not visible yet. |
| P03 | Click Power on. | The view moves into the CRT and settles with only the screen visible. The desk, mouse, keyboard, and housing no longer surround the portfolio. There is no blank frame, stuck loading state, or overlapping power control. |
| P04 | Activate Power on using Tab and Enter or Space. | The same transition and final portfolio appear as with a mouse click. Focus remains usable after the transition. |
| P05 | Click Power on rapidly several times during the transition. | Only one transition runs; content is not duplicated, and the final state is stable. |
| P06 | Resize the browser during the zoom and after it finishes. | The camera and portfolio adapt to the new viewport without stretching, clipping essential content, or returning unexpectedly to the desk. |

For P01–P03, capture before and after screenshots. Review the physical materials, glass reflections, shadows, camera framing, and absence of distracting background objects manually. No exact animation duration is prescribed for the zoom.

### Portfolio content and readability

| ID | Action or inspection | Passing result |
| --- | --- | --- |
| C01 | Read the portfolio after power-on. | Sections appear in this order: introduction, Cool Projects, Experiences, Skills. Each section appears once. |
| C02 | Compare the introduction with the quoted text above. | The introduction preserves the specified wording. Any copy correction must be explicitly documented rather than silently changing the expected text in a test. |
| C03 | Inspect text and screenshots at normal browser zoom. | Text uses green retro styling with readable sizes and hierarchy. The page renders sharply at modern resolution; screenshots are not intentionally reduced to vintage pixel dimensions. CRT effects do not obscure text or images. |
| C04 | Inspect both project cards. | Exactly two project cards appear: coding harness and Pokemon game. Each has the correct screenshot from DeanPageScreen and a short, accurate description of that product. Images are large enough to recognize meaningful details. |
| C05 | Inspect the experience section on desktop. | MantisPeople.png appears above Mantis.png in the left column. The experience blurb is to the right and conveys Dean's positive experience building agentic infrastructure, with accurate context about Mantis's product. |
| C06 | Verify the Mantis product description against the linked company website. | The description is supported by the source. It does not invent Dean's title, employment dates, responsibilities, or measurable achievements. Record the source used in implementation notes. |
| C07 | Inspect all content images and skill icons. | Assets load without broken-image markers or placeholders. Content images have meaningful alternative text. Decorative images do not produce redundant announcements. |

### Project card links and illumination

| ID | Action or inspection | Passing result |
| --- | --- | --- |
| L01 | Inspect the coding harness card's actual link destination. | Its href is exactly https://github.com/deanliang06/AgenticCodingHarness. |
| L02 | Inspect the Pokemon card's actual link destination. | Its href is exactly https://github.com/deanliang06/DynamicPokemon. |
| L03 | Hover each card, then move the pointer away. | A soft green glow appears on hover and returns to the resting style afterward. The card does not change size or shift nearby content. |
| L04 | Tab to each card. | Each card has one clear link focus target and displays the same illumination treatment plus a visible focus indication. |
| L05 | Activate each card by clicking its image, description, and otherwise empty card area in separate runs; also activate it with Enter. | Every activation opens the corresponding repository. The entire card is the link, rather than just its title. |
| L06 | Tap each card on mobile. | Navigation works without needing a hover state first. |

Same-tab or new-tab navigation is acceptable; verify the chosen behavior. If using a new tab, wait for the popup and assert its destination. If using the same tab, assert navigation on the current page. Tests may intercept external navigation after capturing the destination so they do not depend on GitHub uptime.

### Skills and shell popups

| ID | Action or inspection | Passing result |
| --- | --- | --- |
| S01 | Inspect the skill items in visual and DOM order. | Pizza and tennis are first, followed by Docker, AWS, Git, GitHub, Linux, AI agents, CI/CD, and Postgres. The final item is “and more...”. No listed skill is missing or duplicated. |
| S02 | Inspect skill presentation. | Pizza and tennis use their emojis. The eight technical skills use relevant icons sourced online, without visible text labels. “and more...” is the explicit text exception. Icon-only items still expose meaningful accessible names. |
| S03 | Resize from desktop to mobile. | Skills wrap into fewer columns according to available width, preserving item order and keeping every item visible. No fixed four-column requirement applies to the current plan. |
| S04 | Click or keyboard-activate pizza. | One popup opens with shell-style text and a streaming cursor. Its completed text exactly matches the pizza quote above. A visible × close button sits at its top right. |
| S05 | Click or keyboard-activate tennis. | One popup opens with the same shell styling and cursor behavior. Its completed text exactly matches the tennis quote above. |
| S06 | Measure each popup's typing sequence. | Text appears progressively and reaches the complete quote within 500 ms of typing starting. Measure from the first visible character to the final character, independently of popup-opening animation. Use a controlled animation clock where available to avoid timing flakiness. |
| S07 | Close each popup using ×. | The popup disappears, background controls become usable, and no cursor or text remains floating over the portfolio. |
| S08 | Close a popup while its text is streaming, then reopen it. | Pending typing work is cleaned up. Reopening starts one fresh output sequence with no duplicate characters, stale text, or updates to the closed popup. |
| S09 | Open pizza, close it, then open tennis; repeat in reverse order. | Each popup shows only its own correct text. Multiple dialogs do not overlap. |
| S10 | Use Tab, Shift+Tab, and Escape within an open popup. | Focus stays inside the popup, Escape closes it, and focus returns to the initiating pizza or tennis control. The close button has an accessible name, and the popup has dialog semantics. |

### Scrolling, responsive layout, and accessibility

| ID | Action or inspection | Passing result |
| --- | --- | --- |
| R01 | Scroll from introduction to the final skill item using a mouse wheel, touch, and keyboard. | Every section is reachable inside the CRT portfolio's scroll container. The outer desk scene does not scroll or reappear. |
| R02 | Inspect project layout at desktop and mobile sizes. | Cards appear side-by-side when space permits and stack on narrow screens. Text and image content remain inside their cards. |
| R03 | Inspect the experience section and open both popups at every test viewport. | Images, text, popup content, and close buttons remain accessible without horizontal overflow. The experience layout may stack on mobile to preserve readability. |
| R04 | Resize while scrolled to Skills. | The layout stays usable, the skills remain reachable, and no content disappears behind a fixed layer. |
| R05 | Increase browser zoom to 200% and navigate the portfolio. | Text remains readable and content remains reachable by scrolling; controls are not clipped or obscured. |
| R06 | Navigate the entire experience using only the keyboard. | Power on, both project links, pizza, tennis, and popup close controls are reachable in a logical order, with visible focus. There are no keyboard traps outside an open dialog. |
| R07 | Run an accessibility scan and manually inspect contrast. | Controls have accessible names, headings follow a sensible hierarchy, and normal text meets 4.5:1 contrast against its background; large text meets 3:1. Green glow is not the only focus indicator. |
| R08 | Observe the browser during load, transition, scrolling, and popup use. | There are no uncaught application errors or failed required local assets. The scene does not freeze during normal interactions. |

Recommended accessibility check: with prefers-reduced-motion enabled, disable flicker, use an immediate or minimal-motion screen transition, and display popup text immediately. If implemented, verify that all content and controls still work in this mode.

### Completion evidence

The implementing agent should report:

- The commands used to start the page and run automated checks, plus their results.
- Which acceptance-test IDs passed, failed, or were not verified. Never label a manual visual test passed without inspecting the rendered page.
- Desktop and mobile screenshots of the initial desk, the powered-on portfolio, the project cards, the experience and skills sections, and both open popups. Include one screenshot demonstrating hover or keyboard-focus illumination.
- The asset-to-project mapping and any unresolved missing assets or content facts.
- Any remaining limitations, including browser or hardware conditions that prevented verification.

### Implementation handoff for the tests

Implement the behavioral checks as browser end-to-end tests (for example, with Playwright). Group them into power-on, portfolio content, project links, skills popups, and responsive/accessibility suites. Keep the visual inspections as a separate checklist backed by screenshots; assertions about DOM text cannot verify realism, readable image detail, or correct camera framing.

Use these exact completed popup strings as the current test fixtures:

```text
Pizza: My favorite pizza comes from Otto's in New York. And, no, I am not trying to be different.
Tennis: Top 10 player in my conference multiple years in a row and top 50 in New England. However, the glory days may be over now...
```

The `Pizza:` and `Tennis:` prefixes identify the fixtures; they are not part of the required popup text. Compare against the full string, including punctuation, after streaming completes. During a controlled-clock test, also verify an intermediate nonempty prefix before completion so instantly displaying the final text does not accidentally pass the streaming requirement. Do not use the earlier tennis award wording.

For each automated test, report its acceptance-test ID in the test name. Keep tests independent: reload or reset the page between scenarios, power on before testing portfolio features, and close any popup before starting another unrelated check. Provide a single documented command that runs the automated suite. Missing images, unverifiable product descriptions, and unavailable browser rendering must be reported explicitly rather than replaced with passing mocks.
