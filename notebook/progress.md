# Progress

## Source-reference alignment and Phase 1 — 2026-11-24

### Canonical source image

- Confirmed the repository's canonical reference is [references/glove.png](./references/glove.png).
- Inspected the actual image: a 256 × 256 monochrome fabric glove against a near-black background, with its middle finger raised, other fingers folded, stitched seams, palm folds, and a broad cuff.
- Updated [source-image.md](./source-image.md) to describe and point to \`glove.png\`.
- Updated implementation and decision notes so they no longer point to the obsolete \`source-glove.png\` filename.
- The existing compressed ASCII map remains associated with this same glove artwork.

### Phase 1 — Entrance polish

Implemented:

- Increased entrance duration from 3.6 seconds to 4.8 seconds.
- Replaced the basic CSS transition with a paced Web Animations API sequence.
- The hand starts completely below the visible viewport, with its top edge 36px beyond the bottom of the frame.
- After the existing 1.8-second delay, the whole hand rises into view.
- Changed the main movement from a fast-starting ease-out to a gradual ease-in/ease-out curve. The hand begins by peeking into view, gains speed through the middle, and slows as it approaches its resting position.
- Added a barely perceptible 2.5px settle past center, followed by a 0.8px return and a final exact-center rest. This is intended to feel weighted, not bouncy.
- Fabric lighting and subtle portrait-style idle movement begin at the same time as the entrance and continue afterward.
- If a tab is hidden mid-entrance, the browser animation pauses and resumes from its existing position rather than replaying from below.
- If the grid dimensions or fitted font size change before entrance completes, the starting position is recalculated for the new viewport.
- Reduced-motion mode immediately displays the final centered still image.

### Phase 1 browser validation

Chromium checks using the actual character map and local page assets:

| Check | Desktop | Mobile |
|---|---:|---:|
| Viewport | 1440 × 900 | 390 × 844 |
| Character grid | 144 × 144 | 72 × 72 |
| Initial top edge | 936.38px | 880.25px |
| Fully below viewport initially | Pass | Pass |
| Final center offset | 0px | 0px |
| Horizontal overflow | None | None |
| JavaScript page errors | None | None |

Additional checks:

- At approximately 0.65 seconds into the entrance, only a narrow top portion has emerged: about 20px on desktop and 4px on mobile. This confirms the beginning is deliberately gradual rather than a fast slide.
- A viewport-height change from 1440 × 900 to 900 × 600 before entrance recalculated the starting position correctly. The artwork remained fully below the new viewport.
- Reduced-motion mode displayed the artwork immediately in the centered position and remained static during the test.

### Pending user review

- Confirm whether the 4.8-second pace feels right on desktop.
- Confirm the slow initial reveal is the desired effect on mobile.
- Confirm the tiny settle is subtle enough and does not read as a bounce.
- Tune timing only in response to observed feedback.

### Next work

1. Get user feedback on the refined entrance.
2. Make any final Phase 1 timing or easing adjustments.
3. Move to Phase 2 only after the entrance is approved.
4. Keep GitHub Pages disabled until explicit approval.
