# Project roadmap

## Current stage

Phase 1's entrance has been refined and browser-validated. The project has moved into **Phase 2 — Improve the living-portrait effect**. Phase 1's final review on the user's own devices remains open, but the explicit request to proceed with Phase 2 has been followed.

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

Remaining review:

- Check whether the idle motion is noticeable only on a second look on the user's own devices.
- Confirm the palm and cuff movement feels like soft fabric, not rippling or distortion.
- Adjust or remove localized movement if it weakens the recognizable glove folds.

**Completion criteria:** the hand feels gently animated while the composition remains steady. The idle movement must never compete with the entrance or the artwork itself.

### Phase 3 — Refine the ASCII rendering

**Priority: after the motion reads well**

Improve the quality of the image represented by the characters.

Planned refinements:

- Compare alternative character ramps using the same source image.
- Fine-tune brightness mapping and shadow separation.
- Preserve small visual details such as glove seams, creases, and folds.
- Review the image at desktop and mobile character densities.
- Keep the image monochrome and avoid compromising the minimalist appearance.

**Completion criteria:** the glove remains immediately recognizable, retains its important fabric details, and reads cleanly at both target widths.

### Phase 4 — Performance and compatibility

**Priority: before release**

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

Get the user's feedback on the Phase 2 living-portrait motion, especially the subtle weight shift and localized palm/cuff movement. Do not begin Phase 3 until this motion has been reviewed.
