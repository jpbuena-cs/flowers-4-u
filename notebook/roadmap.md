# Project roadmap

## Current stage

The static ASCII rendering and first entrance animation are implemented. The project is in **Phase 1 — Polish the entrance**.

The page's core rule remains unchanged: the ASCII artwork is the entire website. There should be no visible copy, controls, menus, navigation, or sound.

## Priority order

### Phase 1 — Polish the entrance

**Status: implementation refined and browser-validated; user-device review pending**

The hand should feel as though it is making a calm entrance into the scene, not simply sliding into place.

Refinements implemented:

- The hand begins completely below the visible viewport.
- The initial pause remains 1.8 seconds.
- The entrance duration is now 4.8 seconds.
- The main movement uses a gentle ease-in/ease-out arc and finishes with a tiny, restrained settling adjustment.
- No conspicuous bounce or overshoot.
- Fabric lighting and subtle portrait motion run throughout the entrance.
- The exact centered resting position is committed after the entrance completes.
- The initial and final positions are designed to avoid clipping on desktop and mobile.

Remaining review:

- Check the entrance speed and settling feel on the user's own desktop and phone.
- Confirm the entire artwork starts outside the frame at different aspect ratios. Chromium checks passed at 1440 × 900 and 390 × 844.
- Tune duration or easing only in response to observed behavior. A viewport-height resize before entrance now recalculates the offscreen position even when the desktop/mobile character count stays the same.

**Completion criteria:** the whole hand emerges smoothly from below the frame, settles cleanly in the center, and does not feel rushed or mechanical.

### Phase 2 — Improve the living-portrait effect

**Priority: after Phase 1 approval**

Make the otherwise still hand feel quietly alive.

Planned refinements:

- Keep wrist-led movement extremely subtle.
- Tune fractional-character drift and breathing-like scale so they are perceptible only on a second look.
- Explore tiny localized shifts around glove folds and fabric areas only if they improve the image.
- Preserve the hand's recognizable silhouette and avoid making it look like a floating or wobbling sticker.
- Keep the existing fabric-light sweep as a separate continuous layer of motion.

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

Get the user's feedback on the refined Phase 1 entrance. Do not begin Phase 2 or regional segmentation until the entrance has been reviewed.
