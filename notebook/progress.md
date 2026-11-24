# Progress

## Entrance correction — 2026-11-24

### User clarification

“Slow moving upwards creep” means the entire hand starts outside the visible page, below the viewport, then moves upward into the website's view. It does not mean that the raised finger independently lifts or articulates.

### Implemented

- Removed the independent finger-lift deformation and all finger-specific timing/masking.
- The complete ASCII hand is initially placed below the viewport using a calculated CSS transform.
- After an approximately 1.8-second pause, the fabric-light animation and subtle living-portrait idle movement start.
- At the same time, the whole hand enters upward over approximately 3.6 seconds with a slow ease-out.
- After entering, the hand remains centered while the fabric light and tiny wrist-led idle motion continue.
- The entrance is only played once; it does not replay after resizing or returning to a visible tab.
- Reduced-motion mode displays the complete image immediately in its final centered position.

### Technical notes

- Entrance is a CSS transform of the complete ASCII art element.
- The source image remains a single flattened artwork. No independent finger rig or 2.5D depth layers are claimed.
- The character grid continues to use the existing low-amplitude wrist pivot and drift effect for the living-image feel.

### Not yet verified

- The revised entrance has not yet been checked on a physical phone.
- The entrance should be visually reviewed at several aspect ratios to confirm the full character map starts completely outside the visible frame.

### Next work

1. Check whether the 3.6-second entrance is the right pace.
2. Tune the start offset or duration if the first characters appear too early or the movement feels too slow.
3. Ask for visual approval before enabling GitHub Pages.
