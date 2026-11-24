# Progress

## Source-image alignment and Phase 1 refinement — 2026-11-24

### Canonical source image

- Added [source-image.md](./source-image.md) and [references/source-glove.png](./references/source-glove.png).
- The newly re-uploaded source is pixel-identical to the first image supplied for this project.
- Original source details and SHA-256 are recorded in source-image.md.
- The existing compressed ASCII map remains based on that same image.

### Phase 1 — Entrance polish

Implemented:

- Increased entrance duration from 3.6 to 4.6 seconds.
- Replaced the basic CSS transition with a paced Web Animations API sequence.
- The hand starts completely below the visible viewport.
- After the existing 1.8-second delay, the whole hand rises into view.
- The main part of the entrance uses a smooth ease-out.
- Added a barely perceptible 2.5px settle past center, followed by a 0.8px return and a final exact-center rest. This is intended to feel weighted, not bouncy.
- Fabric lighting and subtle portrait-style idle movement begin at the same time as the entrance and continue afterward.
- If a tab is hidden mid-entrance, the browser animation pauses and resumes from its existing position rather than replaying from below.
- If a responsive grid change occurs while entering, the starting position is recalculated for the new dimensions.
- Reduced-motion mode immediately displays the final centered still image.

### Pending user review

- Confirm whether the 4.6-second pace feels right on desktop.
- Confirm the starting position is fully outside the viewport on mobile.
- Confirm the tiny settle is subtle enough and does not read as a bounce.
- Tune the timing only in response to observed feedback.

### Next work

1. Get user feedback on the refined entrance.
2. Make any final Phase 1 timing or easing adjustments.
3. Move to Phase 2 only after the entrance is approved.
4. Keep GitHub Pages disabled until explicit approval.
