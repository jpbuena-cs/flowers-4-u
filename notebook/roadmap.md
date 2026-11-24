# Project roadmap

## Current stage

The static ASCII rendering and first entrance animation are implemented. The next phase is **motion and visual refinement**. Work should improve the existing experience before adding complexity.

The page's core rule remains unchanged: the ASCII artwork is the entire website. There should be no visible copy, controls, menus, navigation, or sound.

## Priority order

### Phase 1 — Polish the entrance

**Priority: next**

The hand should feel as though it is making a calm entrance into the scene, not simply sliding into place.

Planned refinements:

- Confirm the hand begins completely below the visible viewport.
- Review the 1.8-second pause before movement.
- Tune the 3.6-second entrance duration and ease-out curve.
- Make the hand settle naturally at the exact center without a conspicuous bounce.
- Keep fabric lighting and subtle portrait motion active during the entrance.
- Check the first and final frames for clipping at desktop and mobile aspect ratios.

**Completion criteria:** the whole hand emerges smoothly from below the frame, settles cleanly in the center, and does not feel rushed or mechanical.

### Phase 2 — Improve the living-portrait effect

**Priority: after entrance refinement**

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
- Do not introduce unnecessary complexity before reviewing the existing motion on the user's devices.

## Working method

1. Work in the order above unless a real technical blocker requires a change.
2. Make focused changes that can be reviewed independently.
3. Update this notebook when the intended direction or a technical decision changes.
4. Do not add visible interface elements or alter the minimalist art-only experience.
5. Keep GitHub Pages disabled until the user explicitly approves publication.

## Current next action

Refine **Phase 1 — Polish the entrance**. Do not begin regional segmentation or a major ASCII conversion rewrite yet.
