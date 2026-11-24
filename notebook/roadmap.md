# Project roadmap

## Current stage

Phases 1–3 have been implemented and the user has approved the entrance and living-portrait motion. Phase 4 has its first performance and compatibility implementation pass; physical-device verification remains open.

The page remains a minimalist, artwork-first experience: the animated ASCII hand is central, with a small “Jaypee” maker's signature in the lower-left and one original entrance sound. The only temporary control is a centered monospace “click me” label on a transparent full-viewport button; no explanatory copy, menus, or navigation are shown.

## Priority order

### Phase 1 — Polish the entrance

**Status: implementation refined and browser-validated; user-device review pending**

The hand should feel as though it is making a calm entrance into the scene, not simply sliding into place.

Refinements implemented:

- The hand begins completely below the visible viewport.
- The initial pause remains 1.8 seconds.
- The entrance duration is 4.8 seconds.
- The main movement uses a gradual ease-in/ease-out arc and finishes with a tiny, restrained settling adjustment.
- No conspicuous bounce or overshoot.
- Fabric lighting and subtle portrait motion run throughout the entrance.
- The exact centered resting position is committed after the entrance completes.

The user has accepted the current movement. A final review on other device sizes remains useful but is not blocking the current performance pass.

**Completion criteria:** the whole hand emerges smoothly from below the frame, settles cleanly in the center, and does not feel rushed or mechanical.

### Phase 2 — Improve the living-portrait effect

**Status: first implementation pass complete; user approved the movement**

Make the otherwise still hand feel quietly alive without looking like a floating or wobbling sticker.

Refinements implemented:

- Tuned the wrist-led pivot into a slow, gentle weight shift.
- Gave horizontal drift, vertical drift, tilt, and breathing scale different cycle lengths so they do not repeat in lockstep.
- Kept all whole-hand movement below one character cell.
- Added a very small, feathered fabric warp around the palm folds and wrist cuff.
- Kept the raised finger and overall silhouette stable.
- Preserved the existing fabric-light sweep as a separate continuous effect.
- Scaled the localized movement for the smaller mobile character grid.
- Preserved reduced-motion behavior.

The user reviewed the movement and said it looked fine.

**Completion criteria:** the hand feels gently animated while the composition remains steady. The idle movement must never compete with the entrance or the artwork itself.

### Phase 3 — Refine the ASCII rendering

**Status: implementation complete; user confirmed the page works**

Improve the quality of the image represented by the characters.

Refinements implemented:

- Compared the existing 94-glyph ramp, a classic 10-glyph ramp, and a density-sorted 95-glyph ramp.
- Selected a 95-glyph ramp ordered by average measured ink coverage across Liberation Mono and DejaVu Sans Mono.
- Reframed the canonical source to a 136 × 226 crop.
- Tuned the black point, white point, contrast, and gamma to suppress background haze while preserving dark seams, folds, and fabric shading.
- Regenerated the 144 × 144 compressed map from the original source pixels.
- Verified the map dimensions, glyph membership, and 144-column desktop / 72-column mobile outputs.
- Repaired a damaged gzip upload and verified the replacement against its known-good Git blob SHA.
- Added console diagnostics for map-loading failures so future errors are not silently hidden.

**Completion criteria:** the glove remains immediately recognizable, retains its important fabric details, and reads cleanly at both target widths.

### Phase 4 — Performance and compatibility

**Status: first optimization pass implemented; real-device verification pending**

Make the animation dependable across common devices without changing its appearance or adding dependencies.

Refinements implemented:

- Precompute the soft palm/cuff masks and their spatial wave coefficients when the responsive grid is built, rather than recalculating Gaussian masks and spatial trigonometry for every character on every frame.
- Calculate time-dependent movement terms once per frame and apply them to the precomputed coefficients.
- Calculate the fabric-light sweep once per column rather than once per character.
- Add a 256-entry character-code lookup table.
- Reuse a typed character output buffer and the existing text node instead of allocating row arrays and replacing the pre contents every frame.
- Carry fractional frame intervals forward so the 24 FPS target is not reduced by a naïve timer reset on 60 Hz displays.
- Skip missed frame intervals rather than trying to render several catch-up frames after a stall.
- Feature-detect ResizeObserver and retain the window-resize fallback.
- Support both modern and legacy MediaQueryList change-event APIs.
- Preserve the entrance, living-portrait movement, fabric lighting, reduced-motion behavior, and hidden-tab pausing.
- Keep all work local, with no framework, external library, downloaded font, remote asset, or audio.

Remaining review:

- Test a fresh load and the complete entrance on the user's desktop and phone.
- Check whether animation remains smooth on a lower-powered device.
- Inspect frame pacing and memory use during a longer session.
- Verify the output remains centered and unclipped at several viewport sizes and orientations.
- Verify reduced-motion and tab hide/show behavior on the user's actual browsers.

**Compatibility note:** the gzip loader uses the native DecompressionStream API, which is widely available in modern browsers. Legacy browser versions from before broad support may not render the page. No fallback decompressor or additional library is included.

**Completion criteria:** the page renders consistently, does not introduce horizontal scrolling or clipping, and remains responsive during the animation. Do not mark Phase 4 fully closed until physical-device checks have been done.

### Current polish — Entrance sound and signature

**Status: implementation pass complete; user review pending**

- Restore the previous smoother heavy-object drag sound, with its low rumble and continuous gritty scrape, beginning 260ms before the hand enters.
- Synthesize the sound with native Web Audio nodes; do not add a downloaded audio file, framework, or library.
- Use a centered monospace “click me” label on a transparent full-viewport button as the explicit audio-unlock gesture and entrance trigger. Any tap/click anywhere on the screen activates it.
- Add a quiet handwritten-style Jaypee signature at the lower-left using inline SVG paths.
- Respect reduced-motion preference and pause/fade audio when the document is hidden.

**Review criteria:** sound feels heavy and comedic without being harsh; the signature reads as Jaypee without competing with the ASCII hand.

### Phase 5 — Final presentation and release preparation

**Status: release-build path prepared; actual dist/ preview, physical-device review, and publishing approval remain open**

Prepare the repository for publication without exposing development notes or enabling hosting prematurely.

Completed in this pass:

- Audited the complete startup sequence: map load, centered click prompt, gesture-based audio unlock, sound lead-in, entrance delay, 4.8-second entrance, final settle, and continuous idle rendering.
- Checked the page shell for unintended visible text or controls. The only intentional text is “click me”; the Jaypee mark is inline SVG and the hand remains character-rendered.
- Confirmed the root index, local stylesheet, module script, and compressed map use project-relative paths suitable for a project site under /<repository-name>/.
- Added a dependency-free build script that assembles an explicit four-file public-site allow-list into dist/ and excludes notebook/, the canonical source image, README files, and development scripts.
- Added /dist/ to .gitignore so generated output is not accidentally committed.
- Confirmed the repository is currently private and GitHub reports Pages as not enabled.

Remaining sign-off:

- Review the built dist/ site on the user's actual desktop browser.
- Review on a physical phone, including orientation/resizing, touch-to-start, entrance, and sound.
- Review on a lower-powered device if available.
- Confirm the user's GitHub plan and hosting visibility choice before configuring Pages.
- Obtain explicit approval before any publishing setup or deployment.

**Hosting note:** GitHub Pages is available for public repositories on GitHub Free, and for private repositories on qualifying paid plans. A published Pages site is publicly accessible on the internet, even when its source repository is private. Do not change repository visibility or enable Pages in this phase.

**Completion criteria:** the selected release artifact passes local desktop and physical mobile review, the hosting/visibility choice is understood, and the user explicitly approves publication.

## Optional exploration — regional motion

A more advanced route would separate the hand into conceptual regions, such as the raised finger, palm/fingers, and wrist/cuff. Independently moving these regions could create a more convincing living-illustration effect.

This is an experiment, not an approved requirement.

Constraints and risks:

- The current source is one flattened image, not a layered illustration.
- Segmentation would require carefully reconstructing hidden areas and soft transitions.
- Gaps, seams, or stretching could make the ASCII artwork look worse.
- A regional rig should only be attempted if the current restrained motion is not convincing enough.
- Do not introduce unnecessary complexity before reviewing the existing motion.

## Working method

1. Work in the order above unless a real technical blocker requires a change.
2. Make focused changes that can be reviewed independently.
3. Update this notebook when the intended direction or a technical decision changes.
4. Do not add visible interface elements or alter the minimalist art-only experience.
5. Keep GitHub Pages disabled until the user explicitly approves publication.

## Current next action

Run node scripts/build-site.mjs, serve dist/ locally, and review the exact release artifact on desktop and a physical phone. Then decide how the private repository should be hosted. Keep GitHub Pages disabled until the user explicitly approves publication.
