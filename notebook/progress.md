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

### Browser validation

Chromium checks using the actual 144 × 144 character map and local assets:

| Check | Desktop | Mobile |
|---|---:|---:|
| Viewport | 1440 × 900 | 390 × 844 |
| Character grid | 144 × 144 | 72 × 72 |
| Final art centered | Pass | Pass |
| Ragged ASCII rows | None | None |
| Horizontal overflow | None | None |
| JavaScript page errors | None | None |

Additional checks:

- The output continues changing during the idle state, while the outer art box remains centered.
- Chromium's animation frame loop remained responsive during the short observation window; the character-grid renderer updates at its existing capped cadence.
- Reduced-motion mode kept the ASCII output unchanged and centered.
- The existing entrance and fabric-light code paths remain in place.

### Pending user review

- Confirm whether the living movement is subtle enough.
- Confirm that the palm and cuff feel like soft fabric rather than a ripple effect.
- Confirm whether the overall hand feels more alive without becoming distracting.

### Next work

1. Get user feedback on Phase 2.
2. Adjust or remove the localized warp if it makes the fabric look unstable.
3. Move to Phase 3 only after the motion direction is accepted.
4. Keep GitHub Pages disabled until explicit approval.
