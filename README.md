# sumosobra-kana

A minimalist, single-purpose ASCII art page. The website renders a precomputed character map derived from the canonical white fabric-glove reference in notebook/references/glove.png. The page contains the animated ASCII illustration, a small Jaypee signature, and a temporary centered “click me” prompt; project notes and implementation decisions live separately in notebook/.

## Run locally

~~~bash
python -m http.server 8000
~~~

Then open http://localhost:8000.

## Project structure

~~~text
.
├── .gitignore
├── assets/
│   └── glove-map.txt.gz
├── notebook/
│   ├── phase-5-release.md
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
├── scripts/
│   └── build-site.mjs
├── src/
│   └── main.js
├── index.html
└── styles.css
~~~

## Prepare a release artifact

Requires Node.js 18 or newer. This copies only the runtime files into an ignored dist/ directory:

```bash
node scripts/build-site.mjs
python -m http.server 8000 --directory dist
```

Then open http://localhost:8000 to review the same files intended for hosting.

The build allow-list contains only index.html, styles.css, src/main.js, and assets/glove-map.txt.gz. It excludes notebook/, the original reference image, README files, and development scripts. It does not deploy or enable GitHub Pages.

## Current prototype

- Uses a 95-character brightness ramp ordered by measured glyph ink coverage.
- Stores the source artwork as a gzip-compressed 144 × 144 character map and decompresses it with the browser's native API.
- Uses 144 columns on desktop and averages the map down to 72 columns on mobile.
- Uses a controlled black point and tonal curve to suppress background haze while retaining fabric folds, seams, and cuff details.
- Waits for the centered “click me” prompt. After activation, the sound begins 260ms before the 1.8-second-delayed entrance; the subtle living-portrait movement and fabric-light animation continue afterward.
- Targets 24 character-grid updates per second.
- Precomputes static motion masks per grid size, reuses a typed output buffer, and updates a retained text node to reduce per-frame work.
- Shows a static rendering when reduced motion is enabled and pauses the animation while the document is hidden.
- Draws a small, muted handwritten-style “Jaypee” signature in the lower-left corner using explicitly sized, no-fill inline SVG strokes.
- Uses native browser APIs only. No framework, external font download, library, or third-party network request.

The compressed map uses the native DecompressionStream API. It is broadly supported in modern browsers; older browser versions may not support it. Rendering parameters and palette comparisons are documented in notebook/ascii-rendering.md.

GitHub Pages has not been configured or enabled. See notebook/phase-5-release.md before choosing a publishing source.
