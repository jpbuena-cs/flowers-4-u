# Progress

## Prototype baseline — 2026-11-24

### Implemented

- Minimal single-page shell with one HTML pre element.
- A gzip-compressed 144 × 144 character map derived from the user-provided glove image.
- A 94-character grayscale ramp, ordered by approximate glyph ink coverage.
- Separate target widths for desktop (144 columns) and mobile (72 columns).
- Mobile map reduction by averaging source cells.
- Automatic animation after an approximately 1.8-second pause.
- Smooth, back-and-forth moving cloth highlight and subtle tonal variation.
- Reduced-motion static mode and pause-on-hidden-tab behavior.
- No visible copy, controls, or external dependencies.

### Not yet verified

- Actual browser rendering quality at desktop and mobile sizes. A local character-grid preview was inspected, but a headless browser screenshot could not be completed in this environment.
- Whether the chosen glyph ramp produces the best fabric and seam detail in the user's browser font.
- Animation smoothness on lower-powered mobile devices.

### Next work

1. Open the page locally and inspect the actual ASCII rendering.
2. Adjust character density and animation based on the rendered result, not guesswork.
3. Check the resize and reduced-motion paths.
4. Ask for visual approval before enabling GitHub Pages.
