# Progress

## Phase 2 — Living-portrait refinement — 2026-11-24

### Implemented

- Tuned the wrist-led pivot into a slow, gentle weight shift.
- Increased the wrist-led rotation slightly, while keeping the movement below one character cell.
- Tuned horizontal and vertical drift to remain sub-character and added a second, slower horizontal drift component.
- Changed breathing scale to its own slower cycle with an offset between horizontal and vertical scaling.
- The tilt, drift, and breathing cycles now have different periods, avoiding synchronized, mechanical movement.
- Added a very small, smooth local warp around the palm folds and wrist cuff using overlapping Gaussian masks.
- The local warp amplitude stays below a fraction of one character cell and is scaled for mobile.
- The raised finger remains outside the localized motion masks and retains its source silhouette.
- The original fabric-light sweep remains unchanged and runs concurrently.
- No separate hand segmentation or rigging was introduced.
- The user reviewed the movement and said it looked fine.

### Browser validation

Chromium checks using the actual 144 × 144 character map and local assets:

| Check | Desktop | Mobile |
|---|---:|---:|
| Viewport | 1440 × 900 | 390 × 844 |
| Character grid | 144 × 144 | 72 × 72 |
| Final art centered | Pass | Pass |
| Ragged ASCII rows | None | None |
| Horizontal overflow | None | None |
| JavaScript page errors | None | None |

Additional checks:

- The output continues changing during the idle state, while the outer art box remains centered.
- Chromium's animation frame loop remained responsive during the short observation window; the character-grid renderer updates at its existing capped cadence.
- Reduced-motion mode kept the ASCII output unchanged and centered.
- The existing entrance and fabric-light code paths remain in place.

## Phase 3 — ASCII-rendering refinement — 2026-11-24

### Rendering changes

- Replaced the previous custom 94-glyph ramp with a 95-glyph ramp sorted by average measured ink coverage across Liberation Mono and DejaVu Sans Mono.
- Compared it against both the previous ramp and a classic 10-glyph ramp. The 10-glyph version loses too many subtle tones for the fabric texture and seams.
- Regenerated the map from the canonical source image, \`notebook/references/glove.png\`, rather than remapping the old compressed map.
- Used a 136 × 226 crop at source coordinates x=60, y=10, then Lanczos-resampled it to a 144 × 144 grid.
- Applied a black point of 32, white point of 220, contrast of 1.04, and gamma of 0.85.
- Kept the dark background quiet while retaining the glove's stitched seams, palm folds, cuff bands, and highlights.
- Updated \`assets/glove-map.txt.gz\` and the runtime ramp in \`src/main.js\`.
- Kept the existing entrance, Phase 2 idle movement, fabric-light sweep, reduced-motion behavior, and hidden-tab handling unchanged.

### Validation

| Check | Result |
|---|---|
| Gzip map decompresses | Pass |
| Map dimensions | 144 × 144 |
| Unique ramp glyphs | 95 |
| Unmapped characters | 0 |
| Desktop grid | 144 × 144, uniform rows |
| Mobile grid | 72 × 72, uniform rows |
| Canonical source hash | Matches \`notebook/references/glove.png\` |

Desktop and mobile preview images were generated locally from the exact character grids. Chromium headless capture did not complete in this execution environment, so these are local rendering previews, not browser screenshots. The live page still needs user review in the user's browser.

### Pending user review

- Compare the new desktop rendering against the previous version.
- Check whether small fabric details remain readable on mobile.
- Confirm the black point removes background haze without erasing important glove shadows.

### Next work

1. Get user feedback on Phase 3.
2. Tune the ramp or tonal settings only if the preview reveals a specific issue.
3. Move to Phase 4 only after the rendering is accepted.
4. Keep GitHub Pages disabled until explicit approval.
