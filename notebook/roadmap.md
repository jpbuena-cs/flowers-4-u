# Project roadmap

## Current stage

The entrance (Phase 1) and living-portrait animation (Phase 2) are implemented. The first ASCII-rendering refinement pass (Phase 3) is complete and awaiting the user's visual review.

The page's core rule remains unchanged: the ASCII artwork is the entire website. There should be no visible copy, controls, menus, navigation, or sound.

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
- Chromium checks passed at desktop and mobile viewport sizes.

Remaining review:

- Check the entrance speed and settling feel on the user's own desktop and phone.
- Confirm the entire artwork starts outside the frame at different aspect ratios.
- Tune duration or easing only in response to observed behavior.

**Completion criteria:** the whole hand emerges smoothly from below the frame, settles cleanly in the center, and does not feel rushed or mechanical.

### Phase 2 — Improve the living-portrait effect

**Status: first implementation pass complete; user-device review pending**

Make the otherwise still hand feel quietly alive without looking like a floating or wobbling sticker.

Refinements implemented:

- Tuned the wrist-led pivot into a slow, gentle weight shift.
- Gave horizontal drift, vertical drift, tilt, and breathing scale different cycle lengths so they do not repeat in lockstep.
- Kept all whole-hand movement below one character cell.
- Added a very small, feathered fabric warp around the palm folds and wrist cuff. It suggests cloth settling under its own weight, without introducing hard region borders or separately rigging the finger.
- Kept the raised finger and overall silhouette stable.
- Preserved the existing fabric-light sweep as a separate continuous effect.
- Scaled the localized movement for the smaller mobile character grid.
- Preserved reduced-motion behavior: the complete artwork remains static when requested.
- The user reviewed the movement and said it looked fine.

**Completion criteria:** the hand feels gently animated while the composition remains steady. The idle movement must never compete with the entrance or the artwork itself.

### Phase 3 — Refine the ASCII rendering

**Status: first implementation pass complete; user visual review pending**

Improve the quality of the image represented by the characters.

Refinements implemented:

- Compared the existing 94-glyph ramp, a classic 10-glyph ramp, and a density-sorted 95-glyph ramp.
- Selected a 95-glyph ramp ordered by average measured ink coverage across Liberation Mono and DejaVu Sans Mono.
- Reframed the canonical source to a 136 × 226 crop that preserves the whole glove and matches the monospace cell aspect ratio.
- Tuned the black point, white point, contrast, and gamma to suppress background haze while preserving dark seams, folds, and fabric shading.
- Regenerated the 144 × 144 compressed map from the original source pixels.
- Verified the map dimensions, glyph membership, and 144-column desktop / 72-column mobile outputs.
- Kept the image monochrome and left all animation behavior intact.

Remaining review:

- Inspect the new shading and glove details in the user's browser.
- Check whether the 95-glyph ramp looks cleaner than the previous ramp at both desktop and mobile sizes.
- Tune tonal values only in response to visible issues.

**Completion criteria:** the glove remains immediately recognizable, retains its important fabric details, and reads cleanly at both target widths.

### Phase 4 — Performance and compatibility

**Priority: after Phase 3 approval**

Make the animation dependable across common devices.

Planned refinements:

- Profile character-grid updates and animation frame time.
- Avoid unnecessary full-grid work where a smaller update is practical.
- Check lower-powered computers and mobile devices.
- Test a range of screen sizes, aspect ratios, and browser viewport changes.
- Verify reduced-motion behavior, hidden-tab pausing, and reload behavior.
- Keep the site free of frameworks, external libraries, third-party fonts, external assets, and audio.

**Completion criteria:** the page renders consistently, does not introduce horizontal scrolling or clipping, and remains responsive during the animation.

### Phase 5 — Final presentation and release preparation

**Priority: last**

Prepare the repository for publication only after the experience is approved.

Planned refinements:

- Test the complete sequence from a fresh page load.
- Confirm the initial delay, entrance, settling, lighting, and idle motion work together.
- Verify the website contains no unintended interface or text.
- Review desktop and physical mobile-device behavior.
- Check repository structure and GitHub Pages compatibility.
- Enable GitHub Pages only after explicit user approval.

**Completion criteria:** the finished page behaves as intended from first load through its continuous idle state and is ready for publication.

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

Get the user's feedback on the Phase 3 ASCII rendering at desktop and mobile sizes. Do not begin Phase 4 until the rendering has been reviewed.
