# Implementation plan

## Architecture

- index.html: minimal document shell and the single visible ASCII output element.
- styles.css: viewport centering, monochrome palette, monospace typography, and overflow control.
- src/main.js: text-map loading, responsive sampling, luminance mapping, animation timing, and reduced-motion handling.
- assets/glove-map.txt.gz: gzip-compressed 144 × 144 character-density map generated from the user-provided glove image.
- notebook/: project intent, settled choices, implementation notes, and progress.

## Rendering pipeline

1. Load and decompress the local gzip character map with the browser-native DecompressionStream API.
2. Validate its dimensions and ensure every character belongs to the project ramp.
3. Convert the character map into a luminance array.
4. Keep the 144-column map on desktop; average source cells into a 72-column map on mobile.
5. Write complete rows into a pre element using the textContent property.
6. On resize, fit the font size to the available viewport and rebuild only if the target grid changes.

## Animation pipeline

1. Show a static, fully rendered frame.
2. Wait 1.8 seconds.
3. At a capped frame rate, adjust luminance with a broad moving highlight and very low-amplitude tonal variation.
4. Map the adjusted luminance through the same character ramp.
5. Loop while the document is visible and motion is allowed.

## Milestones

### M1 — Static rendering

- [x] Add a precomputed high-density character map.
- [x] Inspect generated desktop and mobile character-grid previews.
- [ ] Verify browser rendering and viewport fit at several sizes.
- [ ] Tune crop, tonal curve, and glyph order from browser-level inspection.

### M2 — Animation

- [x] Add delayed automatic start.
- [x] Add restrained luminance animation.
- [x] Add reduced-motion behavior.
- [ ] Review whether the animation reads as soft fabric rather than a scan effect.
- [ ] Verify long-running frame stability on desktop and mobile.

### M3 — Delivery

- [x] Keep the public page free of visible interface copy.
- [x] Keep project documentation in notebook/.
- [ ] Test in at least one desktop and one mobile-sized browser viewport.
- [ ] Enable GitHub Pages only after the user approves publication.

## Validation checklist

- The site makes no external requests and uses no third-party libraries.
- The output contains only ASCII characters and line breaks.
- No line wraps; no horizontal page scrolling.
- The hand remains proportionate and centered after resizing.
- Animation starts automatically after the delay and loops.
- Reduced-motion preference produces a complete static frame.
- Hidden tabs stop requesting animation frames.
