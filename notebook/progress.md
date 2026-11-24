# Progress

## Motion pass — 2026-11-24

### Implemented

- Preserved the existing automatic fabric-light sweep.
- Added a one-way upward creep for the raised finger, starting 2.8 seconds after continuous animation begins and easing over 9.2 seconds.
- The finger motion is limited to a feathered region. Displacement is strongest near the fingertip and fades toward the knuckle so the finger stays visually attached to the palm.
- Added a subtle wrist-led idle motion: a very small pivot rotation, fractional-character drift, and near-imperceptible horizontal/vertical breathing scale.
- The hand's motion and the fabric-light movement run concurrently.
- The idle and fabric motions continue after the finger reaches its new pose.
- Reduced-motion mode still renders a static frame.

### Browser validation

- Chromium desktop viewport: rendered successfully; the character output changed during active animation; no page errors.
- Chromium mobile viewport (390 × 844): rendered 72 columns × 72 rows; no page errors.
- Reduced-motion preference: the rendered text remained unchanged during a 4-second check.
- This is a programmatic remapping of a flattened image, not a true multi-layer parallax rig.

### Next work

1. Review the finger's final height and the amount of hand drift on the user's desktop and phone.
2. Tune the finger mask if the transition at the knuckle looks stretched or detached.
3. Consider a more sophisticated regional rig only if the current image-grid warp is visibly limiting the result.
4. Ask for visual approval before enabling GitHub Pages.
