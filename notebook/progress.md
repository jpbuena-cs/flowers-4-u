# Progress

## Prototype baseline — 2026-11-24

### Implemented

- Minimal single-page shell with one HTML pre element.
- Cropped grayscale working image derived from the user-provided source retained in assets/source-glove.jpg.
- Browser-side crop and canvas sampling.
- A 94-character grayscale ramp, ordered by approximate glyph ink coverage.
- A black-level threshold to suppress image noise in the dark background.
- Separate target widths for desktop (144 columns) and mobile (72 columns).
- Character-cell-aware row sizing to preserve the portrait glove proportions.
- Automatic animation after an approximately 1.8-second pause.
- Soft moving cloth highlight and subtle tonal variation.
- Reduced-motion static mode and pause-on-hidden-tab behavior.
- No visible copy, controls, or external dependencies.

### Not yet verified

- Actual browser rendering quality at desktop and mobile sizes. A local character-grid preview was inspected, but a headless browser screenshot could not be completed in this environment.
- Whether the chosen glyph ramp produces the best fabric and seam detail in the user's browser font.
- Animation smoothness on lower-powered mobile devices.

### Next work

1. Open the page locally and inspect the actual ASCII rendering.
2. Adjust crop and character ramp based on the rendered result, not guesswork.
3. Check the resize and reduced-motion paths.
4. Ask for visual approval before enabling GitHub Pages.