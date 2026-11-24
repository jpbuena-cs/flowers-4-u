# sumosobra-kana

A minimalist, single-purpose ASCII art page. The page itself contains only the animated character rendering; project notes and implementation decisions live separately in [`notebook/`](./notebook/).

## Run locally

From the repository root:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Project structure

```text
.
├── assets/
│   └── source-glove.png
├── notebook/
│   ├── README.md
│   ├── design-brief.md
│   ├── decisions.md
│   ├── implementation-plan.md
│   └── progress.md
├── src/
│   └── main.js
├── index.html
└── styles.css
```

## Current prototype

- Converts the supplied monochrome cartoon-glove image into a dense character grid in the browser.
- Uses a 95-character ramp for tonal detail, with a black-level threshold to suppress background noise.
- Chooses a different character-grid width for mobile and desktop, then fits the art without wrapping or stretching it.
- Waits briefly before starting a restrained, continuous fabric-light animation.
- Shows a static rendering when reduced motion is enabled.
- Uses native browser APIs only. No framework, external font, library, network request, audio, or visible interface controls.

GitHub Pages has not been configured or enabled as part of this prototype.
