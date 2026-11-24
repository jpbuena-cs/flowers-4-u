# Implementation plan

## Architecture

- index.html: minimal document shell and the single visible ASCII output element.
- styles.css: viewport centering, monochrome palette, monospace typography, and overflow control.
- src/main.js: text-map loading, responsive sampling, luminance mapping, procedural idle motion, entrance timing, and reduced-motion handling.
- assets/glove-map.txt.gz: gzip-compressed 144 × 144 character-density map generated from the exact source image documented in [source-image.md](./source-image.md), using the crop and tonal settings in [ascii-rendering.md](./ascii-rendering.md).
- notebook/references/glove.png: canonical visual reference for the source glove.
- notebook/: project intent, source reference, rendering methodology, settled choices, implementation notes, roadmap, and progress.

## Rendering pipeline

1. Load and decompress the local gzip character map with the browser-native DecompressionStream API.
2. Validate its dimensions and ensure every character belongs to the 95-glyph density-sorted ramp.
3. Convert the character map into a luminance array.
4. Keep the 144-column map on desktop; average source cells into a 72-column map on mobile.
5. Write complete rows into a pre element using the textContent property.
6. On resize, fit the font size to the available viewport and rebuild only if the target grid changes.

The source crop, resampling, character-ramp comparison, and tonal settings are documented in [ascii-rendering.md](./ascii-rendering.md).

## Motion pipeline

1. Render the complete ASCII hand below the viewport.
2. Wait 1.8 seconds after the map is ready.
3. Start the fabric-light sweep and subtle living-portrait idle movement.
4. At the same moment, move the complete hand upward into its centered resting position over 4.8 seconds.
5. Use a gradual ease-in/ease-out curve for the entrance, then a very small settle to exact center.
6. Continue the fabric-light sweep and living-portrait idle after the entrance.

### Living-portrait idle

- Use a slow wrist-led weight shift as the main pose movement.
- Give wrist tilt, horizontal drift, vertical drift, and breathing scale separate cycle lengths so the result does not feel metronomic.
- Keep global movement below one character cell.
- Add only a very small, feathered local fabric warp in the palm-fold and cuff areas. The masks have soft edges; no independent finger rig or hard segmentation is used.
- Keep the finger silhouette and overall pose stable.
- Scale local movement for the mobile grid.
- Disable all continuous motion when prefers-reduced-motion is enabled.
- Pause the animation when the document is hidden.

## Implementation constraints

- The entrance moves the complete ASCII artwork via the Web Animations API transform.
- The source is one flattened image; local palm/cuff motion is a subtle image-grid remap, not true layered parallax.
- The entrance offset is calculated from the viewport and rendered art height.
- If the page is hidden during the entrance, pause and resume the same entrance rather than restarting it.
- If grid dimensions or fitted font size change before the entrance completes, recalculate the offscreen position.
- Reduced-motion preference shows the complete image immediately in its final position.
- Keep the page artwork-only: no visible text, interface controls, menus, navigation, or sound.

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
- [ ] Review subtlety and fabric quality on the user's own devices.

### M5 — Phase 3 ASCII-rendering refinement

- [x] Compare the existing 94-glyph ramp, a classic 10-glyph ramp, and a density-sorted 95-glyph ramp.
- [x] Select a 95-glyph ramp ordered by average ink coverage across Liberation Mono and DejaVu Sans Mono.
- [x] Refine the crop to 136 × 226 pixels at x=60, y=10.
- [x] Tune black point, white point, contrast, and gamma against the canonical glove image.
- [x] Regenerate the 144 × 144 compressed character map from the source pixels.
- [x] Verify every mapped character is supported by the runtime ramp.
- [x] Verify 144 × 144 desktop and 72 × 72 mobile row widths.
- [ ] Review the new ASCII shading and details in the user's browser.

### M6 — Next refinements

See [roadmap.md](./roadmap.md) for the remaining phases:
1. Finish user review of Phase 3.
2. Check performance and compatibility.
3. Prepare the final presentation and release.

Optional regional motion is exploratory and should only be considered after the current motion has been reviewed on the user's devices.

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
- Entrance does not replay after completion or when a hidden tab becomes visible again.
- Reduced-motion preference produces an immediate static frame.
- Hidden tabs stop requesting animation frames.
- GitHub Pages remains disabled until explicit user approval.
