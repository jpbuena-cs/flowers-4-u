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

## Phase 3 — ASCII-rendering refinement — 2026-11-24

### Rendering changes

- Replaced the previous custom 94-glyph ramp with a 95-glyph ramp sorted by average measured ink coverage across Liberation Mono and DejaVu Sans Mono.
- Compared it against both the previous ramp and a classic 10-glyph ramp. The 10-glyph version loses too many subtle tones for the fabric texture and seams.
- Regenerated the map from the canonical source image, notebook/references/glove.png, rather than remapping the old compressed map.
- Used a 136 × 226 crop at source coordinates x=60, y=10, then Lanczos-resampled it to a 144 × 144 grid.
- Applied a black point of 32, white point of 220, contrast of 1.04, and gamma of 0.85.
- Kept the dark background quiet while retaining the glove's stitched seams, palm folds, cuff bands, and highlights.
- Updated assets/glove-map.txt.gz and the runtime ramp in src/main.js.
- Kept the existing entrance, Phase 2 idle movement, fabric-light sweep, reduced-motion behavior, and hidden-tab handling unchanged.

### Validation and repair

- The map dimensions, ramp membership, and desktop/mobile grid dimensions were checked during the rendering pass.
- The user initially encountered a blank page because an uploaded gzip map failed its CRC check. The map was replaced with a verified copy and the user later confirmed that the page renders and works correctly.
- The repaired map's Git blob SHA is e09dbf1198eacc24f6a7b28501ab83143ac9ab11.

## Phase 4 — Performance and compatibility — 2026-11-24

### Implemented

- Precomputed the Gaussian palm/cuff masks and spatial sine/cosine coefficients once when the responsive grid is built. The per-frame character loop no longer constructs these masks or evaluates their spatial phases.
- Moved temporal sine/cosine calculations outside the per-character loop and combines them with the precomputed coefficients.
- Moved the fabric-light sweep calculation to a per-column pass. It now calculates 72 or 144 sweep weights per frame rather than repeating that exponential per character.
- Added a 256-entry character-code lookup table.
- Reused one typed output buffer for the complete ASCII frame.
- Converted the output buffer into text in 8,192-character chunks and updated one retained text node, avoiding fresh row arrays and repeated child replacement each frame.
- Corrected the frame limiter to carry fractional frame intervals forward toward the 24 FPS target. The previous implementation reset its clock to each render timestamp, which can undershoot the intended rate on 60 Hz displays.
- The scheduler skips missed frame intervals after a pause or stall rather than attempting to catch up with multiple expensive frames.
- Reset the frame clock when resuming after tab visibility changes.
- Added feature detection for ResizeObserver with the existing window resize event as fallback.
- Added support for both modern MediaQueryList addEventListener and legacy addListener change events.
- Kept the existing entrance duration, entrance transform, living-portrait cycle values, fabric-light strength, 95-character ramp, 144/72 grid sizes, source map, reduced-motion behavior, and hidden-tab pause behavior.
- No new package, library, font, network resource, audio, or visible page UI was added.

### Integrity and source-level checks

- The source patch was checked for required renderer components and expected compatibility branches.
- The updated per-frame renderer contains no palm/cuff Gaussian-mask construction, no per-frame row-array allocation, and no per-character spatial exponential. The only exponential left in the frame renderer is the 72/144-value column-level fabric sweep.
- The repository map SHA remains e09dbf1198eacc24f6a7b28501ab83143ac9ab11, the previously verified working gzip asset.
- index.html and styles.css were left unchanged.
- These checks are source-level checks, not a substitute for measuring frame time on the user's physical hardware.

### Pending device review

- Confirm the optimized build still renders correctly after a fresh reload.
- Check the 4.8-second entrance and continuous idle on desktop and mobile.
- Check a lower-powered phone or computer if available.
- Observe whether the page stays smooth during a longer session.
- Check resizing/orientation changes, reduced-motion mode, and hide/show behavior.
- The project uses the native DecompressionStream API. MDN classifies it as widely available across modern browsers since May 2023; older browser versions may not support the compressed-map loader.

### Next work

1. Let the user review the optimized build on their devices.
2. Fix only issues that are actually observed.
3. Close Phase 4 after the physical-device checks.
4. Proceed to Phase 5 only after Phase 4 review.
5. Keep GitHub Pages disabled until explicit approval.


## Phase 4 syntax repair — 2026-11-24

- A post-commit review found that src/main.js line 7 had been corrupted during the source-blob assembly step: the opening of the character-ramp declaration had been inserted into itself, and the tail of the ramp was duplicated into an otherwise stray line.
- The stray line also contained a second malformed TARGET_FPS declaration fragment. The valid TARGET_FPS declaration was retained; the malformed fragment was removed.
- Rebuilt the 95-character ramp declaration from the verified intended ramp and confirmed that it contains 95 unique characters.
- Compiled the complete corrected JavaScript module after substituting a test base URL for import.meta.url.
- Checked for duplicate top-level declarations.
- Ran renderer smoke tests at 144 × 144 desktop, 72 × 72 mobile, and the legacy compatibility path without ResizeObserver and without MediaQueryList.addEventListener. All produced complete, uniform ASCII rows and changing animation frames without runtime errors.
- Confirmed the gzip asset's Git blob SHA remains e09dbf1198eacc24f6a7b28501ab83143ac9ab11.


## Entrance sound and Jaypee signature — 2026-11-24

### Requested additions

- Add a one-shot, original heavy stone-drag sound beginning 260ms before the hand's entrance.
- Add a subdued handwritten-style signature reading “Jaypee” in the lower-left corner.

### Implementation

- Build the scrape procedurally with Web Audio API nodes: seeded broadband noise, a filtered grit layer, low rumble, two low startup/weight thuds, and a pair of quiet low oscillators.
- No audio file, remote asset, library, or external font is required.
- Attempt autoplay at the scheduled sound time. If the browser blocks it, keep the sound pending and unlock Web Audio on the first normal pointer or keyboard gesture, provided the entrance window is still relevant.
- The sound is not played in reduced-motion mode. Pending sound is cancelled on reduced-motion changes, and active sound is faded when the page becomes hidden.
- Draw the signature as inline SVG strokes so it reads consistently across devices and does not depend on a script font.
- Position the signature subtly at the lower-left, respecting mobile safe-area insets. It does not intercept pointer events.

### Browser-policy note

Modern browsers commonly block audible autoplay without prior user activation. An automatic attempt is made at the requested moment, but guaranteed audio without any user gesture is not possible on all browsers. The page remains free of audio buttons and explanatory copy; the first click, tap, or key press unlocks the audio path.

### Validation completed before commit

- The complete JavaScript module compiled successfully after substituting a test base URL for import.meta.url.
- No duplicate top-level declarations; the existing 95-character ramp and single TARGET_FPS declaration are intact.
- Mocked desktop and mobile renderer tests produced complete 144 × 144 and 72 × 72 ASCII grids with uniform rows and animated frame changes.
- The audio scheduler placed the sound at 1,540ms and the entrance at 1,800ms, preserving the intended 260ms lead.
- A mocked browser autoplay restriction kept audio pending until a pointer gesture resumed the AudioContext; the synthesized sound then created its buffer and expected audio nodes.
- Reduced-motion runtime tests produced a static centered frame and scheduled no entrance sound.
- Signature SVG was raster-previewed and visually checked; it reads as “Jaypee”. CSS uses lower-left placement, muted opacity, mobile sizing, and safe-area insets.
- Verified the HTML contains no buttons, menus, or explanatory page copy; the requested signature is the only added visual.
- The gzip map and 95-character ramp are unchanged. No downloaded sound file, remote font, or third-party request was added.
- These are syntax and controlled-runtime checks, not tests on the user's physical browser or speakers. Browser autoplay may still require a first user gesture.
