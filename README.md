# sumosobra-kana

A minimalist, single-purpose ASCII art page. The website renders a precomputed character map derived from the canonical white fabric-glove reference in notebook/references/glove.png. The page itself contains only the animated character rendering; project notes and implementation decisions live separately in notebook/.

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
│   ├── references/
│   │   └── glove.png
│   ├── README.md
│   ├── ascii-rendering.md
│   ├── design-brief.md
│   ├── source-image.md
│   ├── animation-direction.md
│   ├── roadmap.md
│   ├── decisions.md
│   ├── implementation-plan.md
│   └── progress.md
├── src/
│   └── main.js
├── index.html
└── styles.css
~~~

## Current prototype

- Uses a 95-character brightness ramp ordered by measured glyph ink coverage.
- Stores the source artwork as a gzip-compressed 144 × 144 character map and decompresses it with the browser's native API.
- Uses 144 columns on desktop and averages the map down to 72 columns on mobile.
- Uses a controlled black point and tonal curve to suppress background haze while retaining fabric folds, seams, and cuff details.
- Waits briefly before starting the entrance, subtle living-portrait movement, and continuous fabric-light animation.
- Targets 24 character-grid updates per second.
- Precomputes static motion masks per grid size, reuses a typed output buffer, and updates a retained text node to reduce per-frame work.
- Shows a static rendering when reduced motion is enabled and pauses the animation while the document is hidden.
- Waits for a small monospace [ click to begin ] prompt. Tapping it unlocks audio and starts the entrance; a crude, irregular stone-on-stone drag begins just before the hand moves.
- Draws a small, muted handwritten-style “Jaypee” signature in the lower-left corner using explicitly sized, no-fill inline SVG strokes.
- Uses native browser APIs only. No framework, external font download, library, or third-party network request.

The compressed map uses the native DecompressionStream API. It is broadly supported in modern browsers; older browser versions may not support it. Rendering parameters and palette comparisons are documented in notebook/ascii-rendering.md.

GitHub Pages has not been configured or enabled as part of this prototype.
