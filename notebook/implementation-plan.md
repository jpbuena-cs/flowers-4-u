# Implementation plan

## Architecture

- index.html: minimal document shell and the single visible ASCII output element.
- styles.css: viewport centering, monochrome palette, monospace typography, and overflow control.
- src/main.js: text-map loading, responsive sampling, luminance mapping, procedural motion, animation timing, and reduced-motion handling.
- assets/glove-map.txt.gz: gzip-compressed 144 × 144 character-density map generated from the user-provided glove image.
- notebook/: project intent, settled choices, implementation notes, and progress.

## Rendering pipeline

1. Load and decompress the local gzip character map with the browser-native DecompressionStream API.
2. Validate its dimensions and ensure every character belongs to the project ramp.
3. Convert the character map into a luminance array.
4. Keep the 144-column map on desktop; average source cells into a 72-column map on mobile.
5. Write complete rows into a pre element using the textContent property.
6. On resize, fit the font size to the available viewport and rebuild only if the target grid changes.

## Motion pipeline

1. Show a static, fully rendered frame.
2. Wait 1.8 seconds, then start the existing fabric-light sweep and the hand's idle movement.
3. 2.8 seconds after that, begin a one-way finger lift. Use a feathered spatial mask that tapers toward the knuckle, with the strongest displacement at the fingertip.
4. Ease the lift over approximately 9.2 seconds, then hold the new pose.
5. While the finger moves, give the hand a very small wrist-pivot sway, fractional-cell drift, and near-imperceptible scale breathing.
6. Apply the fabric highlight on top of the remapped image values so all motions run together.
7. Loop the idle and light animations while the document is visible and motion is allowed.

## Implementation constraints

- The source is one flattened image, so local movement is an image-grid warp, not true layered parallax.
- Keep the finger mask soft enough to avoid a visible seam where it meets the palm.
- Keep global movement below one character cell so the drawing remains steady.
- Mobile movement scales with the smaller character grid.
- The reduced-motion preference disables the finger and idle motion as well as the fabric animation.

## Milestones

### M1 — Static rendering

- [x] Add a precomputed high-density character map.
- [x] Inspect generated desktop and mobile character-grid previews.
- [x] Verify browser rendering and viewport fit at desktop and mobile sizes.
- [x] Tune crop, tonal curve, and glyph order from that visual inspection.

### M2 — Animation

- [x] Add delayed automatic start.
- [x] Add restrained luminance animation.
- [x] Add the slow, one-way finger lift.
- [x] Add wrist-pivot idle motion and breathing drift.
- [x] Add reduced-motion behavior.
- [x] Confirm animation changes the frame without browser console errors.
- [x] Confirm reduced-motion mode remains static.
- [ ] Review the gesture pace and finger mask on the user's own devices.

### M3 — Delivery

- [x] Keep the public page free of visible interface copy.
- [x] Keep project documentation in notebook/.
- [x] Test at desktop and mobile viewport sizes in Chromium.
- [ ] Review on a physical mobile device.
- [ ] Enable GitHub Pages only after the user approves publication.

## Validation checklist

- The site makes no third-party requests and uses no third-party libraries.
- The output contains only ASCII characters and line breaks.
- No line wraps; no horizontal page scrolling.
- The hand remains proportionate and centered after resizing.
- Finger lift starts only after the fabric/idle animation has begun.
- Idle movement remains subtle and the finger base stays connected to the palm.
- Reduced-motion preference produces a complete static frame.
- Hidden tabs stop requesting animation frames.
