# Implementation plan

## Architecture

- index.html: minimal document shell and the single visible ASCII output element.
- styles.css: viewport centering, monochrome palette, monospace typography, and overflow control.
- src/main.js: text-map loading, responsive sampling, luminance mapping, precomputed motion fields, output-buffer rendering, procedural idle motion, entrance timing, and reduced-motion handling.
- assets/glove-map.txt.gz: gzip-compressed 144 × 144 character-density map generated from the exact source image documented in source-image.md, using the crop and tonal settings in ascii-rendering.md.
- notebook/references/glove.png: canonical visual reference for the source glove.
- notebook/: project intent, source reference, rendering methodology, settled choices, implementation notes, roadmap, and progress.

## Rendering pipeline

1. Load and decompress the local gzip character map with the browser-native DecompressionStream API.
2. Validate its dimensions and ensure every character belongs to the 95-glyph density-sorted ramp.
3. Convert the character map into a luminance array.
4. Keep the 144-column map on desktop; average source cells into a 72-column map on mobile.
5. Build the grid's static movement coefficients once whenever the character-grid dimensions change.
6. Map brightness to a 256-entry character-code lookup table.
7. Write each frame into a reusable typed buffer, convert it to text in safe-size chunks, and update the same text node inside the pre element.
8. On resize, fit the font size to the available viewport and rebuild the grid/motion fields only when grid dimensions change.

The source crop, resampling, character-ramp comparison, and tonal settings are documented in ascii-rendering.md.

## Motion pipeline

1. Render the complete ASCII hand below the viewport.
2. Wait 1.8 seconds after the map is ready.
3. Start the fabric-light sweep and subtle living-portrait idle movement.
4. At the same moment, move the complete hand upward into its centered resting position over 4.8 seconds.
5. Use a gradual ease-in/ease-out curve for the entrance, then a very small settle to exact center.
6. Continue the fabric-light sweep and living-portrait idle after the entrance.
7. Target 24 character-grid updates per second. Carry fractional frame intervals forward and skip missed frames after a stall.

### Living-portrait idle

- Use a slow wrist-led weight shift as the main pose movement.
- Give wrist tilt, horizontal drift, vertical drift, and breathing scale separate cycle lengths so the result does not feel metronomic.
- Keep global movement below one character cell.
- Add only a very small, feathered local fabric warp in the palm-fold and cuff areas. The masks have soft edges; no independent finger rig or hard segmentation is used.
- Keep the finger silhouette and overall pose stable.
- Scale local movement for the mobile grid.
- Disable all continuous motion when prefers-reduced-motion is enabled.
- Pause the animation when the document is hidden.

## Performance and compatibility implementation

- Precompute spatial masks and sine/cosine coefficients for palm and cuff movement when the grid is built. These values do not change between frames.
- Compute frame-time sine/cosine terms once per frame and combine them with the precomputed coefficients.
- Compute fabric-light sweep weights once per column per frame.
- Use a 256-entry character-code lookup table.
- Reuse the typed output buffer and one text node, avoiding per-frame row-array and child-node replacement churn.
- Use a fractional frame accumulator for the 24 FPS target; do not reset the schedule to every display refresh.
- Skip missed render intervals after a stall rather than attempting catch-up work.
- Feature-detect ResizeObserver and fall back to the window resize event.
- Listen for both modern addEventListener and legacy addListener MediaQueryList change events.
- Keep the 144 × 144 desktop and 72 × 72 mobile targets.

## Implementation constraints

- The entrance moves the complete ASCII artwork via the Web Animations API transform.
- The source is one flattened image; local palm/cuff motion is a subtle image-grid remap, not true layered parallax.
- The entrance offset is calculated from the viewport and rendered art height.
- If the page is hidden during the entrance, pause and resume the same entrance rather than restarting it.
- If grid dimensions or fitted font size change before the entrance completes, recalculate the offscreen position.
- Reduced-motion preference shows the complete image immediately in its final position.
- Keep the page artwork-only: no visible text, interface controls, menus, navigation, or sound.
- No frameworks, external libraries, downloaded fonts, external assets, or network requests at runtime.

## Milestones

### M1 — Static rendering

- [x] Add a precomputed high-density character map.
- [x] Verify the character-map pipeline and responsive row widths.
- [x] Add the canonical source image and source description to the notebook.

### M2 — Entrance and idle animation baseline

- [x] Position the complete hand below the viewport at initial load.
- [x] Add a short delay before the entrance starts.
- [x] Animate the complete hand upward into the center.
- [x] Run fabric lighting and tiny living-portrait idle motion concurrently with entrance.
- [x] Keep the idle and fabric motions running after the entrance.
- [x] Remove the previously misunderstood independent finger-lift deformation.
- [x] Keep reduced-motion output static and centered.

### M3 — Phase 1 entrance refinement

- [x] Increase the entrance duration to 4.8 seconds.
- [x] Replace the basic transition with a gradual ease-in/ease-out entrance.
- [x] Add a tiny, restrained settle into exact center without a noticeable bounce.
- [x] Preserve the concurrent fabric-light and living-portrait animations.
- [x] Pause/resume the same entrance if the tab becomes hidden.
- [x] Validate the responsive source grid.
- [ ] Review entrance speed and settling on the user's own devices.

### M4 — Phase 2 living-portrait refinement

- [x] Tune wrist-led weight shift.
- [x] Desynchronize the drift, tilt, and breathing cycles.
- [x] Add a soft local fabric warp around palm folds and cuff.
- [x] Keep the raised finger and overall silhouette stable.
- [x] Preserve the fabric-light sweep.
- [x] Verify the 144 × 144 and 72 × 72 output grids.
- [x] User reviewed the movement and approved it.

### M5 — Phase 3 ASCII-rendering refinement

- [x] Compare the existing 94-glyph ramp, a classic 10-glyph ramp, and a density-sorted 95-glyph ramp.
- [x] Select a 95-glyph ramp ordered by average ink coverage across Liberation Mono and DejaVu Sans Mono.
- [x] Refine the crop to 136 × 226 pixels at x=60, y=10.
- [x] Tune black point, white point, contrast, and gamma against the canonical glove image.
- [x] Regenerate the 144 × 144 compressed character map from the source pixels.
- [x] Verify every mapped character is supported by the runtime ramp.
- [x] Verify 144 × 144 desktop and 72 × 72 mobile row widths.
- [x] Repair and re-verify the gzip asset after a bad upload.
- [x] User confirmed the page renders and works correctly.

### M6 — Phase 4 performance and compatibility pass

- [x] Precompute palm/cuff motion masks and spatial coefficients per grid size.
- [x] Move time-dependent movement calculations out of the per-character loop.
- [x] Compute the fabric sweep once per column per frame.
- [x] Add a character-code lookup table.
- [x] Reuse a typed output buffer and stable text node.
- [x] Carry fractional frame intervals forward for the 24 FPS target.
- [x] Skip missed frame intervals after a stall.
- [x] Add ResizeObserver and MediaQueryList compatibility fallbacks.
- [x] Run static source-integrity checks on the updated implementation.
- [ ] Verify the optimized build in the user's browser at desktop and mobile sizes.
- [ ] Check a lower-powered physical device and a longer animation session.
- [ ] Confirm reload, reduced-motion, hidden-tab resume, and viewport/orientation changes on the user's devices.

### M7 — Next stage

See roadmap.md. Move to Phase 5 release preparation only after Phase 4 device review.

## Validation checklist

- The site makes no third-party requests and uses no third-party libraries.
- The output contains only ASCII characters and line breaks.
- No line wraps; no horizontal page scrolling.
- The 144 × 144 map decompresses correctly and every glyph belongs to the runtime ramp.
- Desktop and mobile outputs contain uniform 144- and 72-character rows.
- Entire hand begins below the visible viewport.
- Entrance moves upward into the centered final position.
- Entrance eases naturally and settles without a conspicuous bounce.
- Fabric light and subtle portrait motion are active during entrance.
- Whole-hand idle motion remains below one character cell.
- Palm/cuff micro-motion has soft boundaries and does not distort the finger silhouette.
- The render loop avoids per-character Gaussian mask construction and row-array allocation.
- The 24 FPS frame schedule carries fractional intervals forward and skips missed frames.
- Entrance does not replay after completion or when a hidden tab becomes visible again.
- Reduced-motion preference produces an immediate static frame.
- Hidden tabs stop requesting animation frames.
- ResizeObserver and legacy MediaQueryList fallbacks are feature-detected.
- GitHub Pages remains disabled until explicit user approval.
