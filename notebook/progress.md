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


## Signature rendering fix — 2026-11-24

### Browser discrepancy

- User reported that the normal browser rendered the new signature as a huge, solid-black shape, while the VS Code integrated browser displayed the page correctly.
- The screenshot is consistent with a stale cached stylesheet: the new inline SVG had loaded, but the newer .signature-mark CSS rule that sets its fixed size, lower-left position, no-fill stroke appearance, and pointer behavior had not.
- Without the stylesheet rule, an SVG without explicit dimensions can stretch as a grid item, and SVG paths default to a filled shape.

### Fix

- Added an explicit 108 × 38 SVG viewport size.
- Added SVG presentation attributes for fill="none", muted stroke, stroke width, and rounded stroke joins/caps. These stay effective even when the stylesheet is stale.
- Versioned the stylesheet URL as styles.css?v=signature-fix-2 to force a fresh stylesheet fetch in browsers with a cached previous file.
- Kept the responsive lower-left CSS placement and mobile safe-area offsets.
- Reduced the maximum signature width slightly to 108px.

### Validation

- Confirm the stylesheet URL is versioned and the SVG has explicit dimensions and presentation attributes.
- Confirm the existing page remains free of visible explanatory text or controls.
- Confirm the existing ASCII JavaScript, compressed map, and entrance sound are unchanged.
- User should reload the local page once normally; a hard refresh may be needed if the browser has cached the old HTML document itself.


## Centered click-me prompt and restored preferred sound — 2026-11-24

### Interaction change

- The ASCII hand no longer begins its entrance automatically when the character map finishes loading.
- A compact monospace “click me” prompt is shown at the exact center of the viewport. It uses a real HTML button for keyboard and assistive-technology support, but is styled as plain monospace text with no filled background or button border.
- The hand remains outside the viewport while the prompt is shown.
- Activating the prompt calls AudioContext.resume() directly inside the click gesture, then starts the existing 1.8-second entrance delay.
- The scrape still begins 260ms before the hand starts entering.
- The prompt fades away once activated. It is disabled to prevent double starts.
- Reduced-motion preference preserves the immediate static artwork behavior and skips the prompt and sound.
- Removing the old document-wide pointer/keyboard unlock means unrelated taps no longer start or unlock the audio.

### Sound redesign

- The rougher revision was not preferred and has been reverted to the earlier smoother heavy-object drag sound.
- Added upper-mid filtered grit with irregular short gain bursts to suggest the stone catching against rough edges.
- Kept a low, dull rumble and subtle sub-bass body for weight.
- Replaced the two evenly spaced smooth thuds with irregular triangle-wave contact knocks whose timing, pitch, and decay vary deterministically.
- The noise texture uses a seeded irregular grain envelope so each entrance is consistent but not mechanically smooth.
- No external sound file, library, or remote resource was added.

### Validation completed before commit

- The complete JavaScript module compiled successfully after substituting a test base URL for import.meta.url.
- No duplicate top-level declarations; the 95-character ramp and single TARGET_FPS declaration remain unchanged.
- Verified that loading the map alone does not create entrance or sound timers. The hand remains offscreen and the start prompt stays visible.
- In the normal mocked interaction path, clicking the prompt resumes the AudioContext, disables/fades the prompt, schedules the sound at 1,540ms, and schedules the entrance at 1,800ms. The 260ms lead remains intact.
- The sound synthesis runtime test created the noise source, three filtered texture bands, and irregular low-frequency impact oscillators.
- In the simulated AudioContext-resume failure path, the prompt still starts the entrance at 1,800ms, but no sound timer is scheduled.
- Reduced-motion test confirms the artwork appears statically at rest, with no prompt and no entrance or sound timer.
- CSS checks confirm transparent background, no border, compact monospace lettering, a 44px minimum touch target, and visible keyboard-focus styling.
- The 95-character ramp, source gzip map, entrance motion values, signature SVG, and existing render pipeline are preserved.
- These are syntax, CSS/source, and controlled-runtime checks. The sound has not been auditioned through the user's physical speakers in this environment, so its final loudness and roughness remain subject to user review.


## Centered click-me interaction, restored sound, and reload reliability — 2026-11-24

### Interaction

- The visible prompt is exactly \`click me\`, lowercase, in centered monospace text.
- The actual semantic button fills the stage with a transparent hit area. Tapping/clicking anywhere on the viewport activates it, not only the label.
- The label is visually small with no fill or border. The full-screen button remains keyboard-accessible and uses a subtle text underline for keyboard focus.
- The hand remains outside the frame until activation.
- A rapid second click does not create a second entrance.

### Sound restoration

- Restored \`playStoneDrag()\` byte-for-byte from the user's preferred earlier revision in commit \`2489683\`.
- Reverted the later irregular stone-on-stone grit pulses and clustered impacts.
- Kept the 260ms sound lead before the hand entrance.

### Audio behavior on refresh

- A full page reload creates a new JavaScript runtime. \`soundPlayed\` and \`soundPending\` are ordinary in-memory variables and are not persisted, so the sound is eligible to play again on each visit.
- The centered full-screen button's click handler creates the AudioContext and calls \`resume()\` directly during the user's click/tap gesture.
- Added a state-change listener to retry a still-pending sound if the browser suspends the AudioContext and later returns it to the running state during the entrance window.
- Updated stylesheet and module URLs to the \`click-me-2\` query version so cached resources do not keep the previous prompt or audio logic.
- Browser policy still prevents guaranteed sound before user activation. The supported behavior is: reload the page, then tap/click anywhere once.

### Validation

- Compiled the complete JavaScript module after substituting a test URL for \`import.meta.url\`; no duplicate top-level declarations were found.
- Verified that the restored sound function matches the preferred previous implementation exactly.
- Ran two isolated fresh-page simulations. Both created a new AudioContext, resumed it from the click handler, played the noise buffer, and scheduled sound 260ms before entrance.
- Verified the full-screen transparent button style (\`inset: 0\`, \`width: 100%\`, \`height: 100%\`) and centered label layout.
- Confirmed the 95-character ramp, compressed map, hand renderer, and Jaypee signature remain unchanged.
- Physical browser/speaker testing remains with the user; browser policies and system mute/volume settings can still affect actual playback.
