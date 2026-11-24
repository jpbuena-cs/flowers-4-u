# sumosobra-kana

A minimalist, single-purpose ASCII art page. The website renders a precomputed character map derived from the user-provided white cartoon glove image. The page itself contains only the animated character rendering; project notes and implementation decisions live separately in notebook/.

## Run locally

~~~bash
python -m http.server 8000
~~~

Then open http://localhost:8000.

## Project structure

~~~text
.
├── assets/
│   └── glove-map.txt.gz
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
~~~

## Current prototype

- Uses a 94-character brightness ramp for tonal detail.
- Stores the source artwork as a gzip-compressed 144 × 144 character map and decompresses it with the browser’s native API.
- Uses 144 columns on desktop and averages the map down to 72 columns on mobile.
- Waits briefly before starting a restrained, continuous fabric-light animation.
- Shows a static rendering when reduced motion is enabled.
- Uses native browser APIs only. No framework, third-party font, library, third-party network request, audio, or visible interface controls.

GitHub Pages has not been configured or enabled as part of this prototype.
