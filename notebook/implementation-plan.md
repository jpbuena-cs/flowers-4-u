# Implementation plan

## Architecture

- index.html: minimal document shell and the single visible ASCII output element.
- styles.css: viewport centering, monochrome palette, monospace typography, and overflow control.
- src/main.js: source-image loading, canvas sampling, luminance shaping, character mapping, responsive sizing, animation timing, and reduced-motion handling.
- assets/source-glove.jpg: cropped grayscale working image derived from the user-provided source and used to regenerate the ASCII grid.
- notebook/: project intent, settled choices, implementation notes, and progress.

## Rendering pipeline

1. Load the source image locally from assets/.
2. Crop around the glove to reduce unused black margins while keeping a little breathing room.
3. Sample the crop into a character-sized canvas based on the target column count and character-cell aspect ratio.
4. Convert sampled pixels to luminance, apply a gentle tonal curve, and map luminance to a broad character ramp.
5. Write complete rows into a pre element using the textContent property.
6. On resize, rebuild the grid for the new target width and fit the font size to the available viewport.

## Animation pipeline

1. Show a static, fully rendered frame.
2. Wait 1.8 seconds.
3. At a capped frame rate, adjust luminance with a broad moving highlight and very low-amplitude tonal variation.
4. Map the adjusted luminance through the same character ramp.
5. Loop while the document is visible and motion is allowed.

## Milestones

### M1 — Static rendering

- [x] Add a browser-side image-to-ASCII pipeline.
- [x] Preserve whitespace and center the text art.
- [ ] Visually inspect the rendered silhouette at several viewport sizes.
- [ ] Tune crop, tonal curve, and glyph order from that visual inspection.

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