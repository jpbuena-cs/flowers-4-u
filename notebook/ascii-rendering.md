# ASCII rendering

## Source

The rendering is generated from the canonical [glove.png](./references/glove.png) image. The source is 256 × 256 pixels and contains a near-black background with a softly lit fabric glove.

## Crop and grid

- Source crop: x = 60, y = 10, width = 136, height = 226 pixels.
- The crop leaves a small margin around the full glove and keeps its extended finger, folded fingers, palm, and cuff.
- Crop aspect ratio: 136 / 226 ≈ 0.602. This is close to the horizontal-to-vertical cell ratio of the monospace rendering, so a 144 × 144 character grid preserves the source proportions.
- Resampling: high-quality Lanczos.
- Desktop character grid: 144 × 144.
- Mobile character grid: 72 × 72, created by averaging each corresponding 2 × 2 block of the 144-grid luminance values before mapping to glyphs.

## Character-ramp comparison

Three directions were compared against the same source/map:

1. **Existing custom 94-glyph ramp.** It provided good detail, but the measured ink coverage of its characters was less consistently ordered in the browser's likely monospace fallbacks.
2. **Classic 10-glyph ramp** (\` .:-=+*#%@\`). It is simple and familiar, but collapses too many subtle fabric and shadow tones.
3. **Density-sorted 95-glyph ramp.** Selected. All 95 printable ASCII characters are ordered by average measured glyph ink coverage across Liberation Mono and DejaVu Sans Mono. This gives a smoother tonal progression while retaining the character density needed for seams, wrinkles, and cloth shading.

The ramp is stored in \`src/main.js\`. The compressed map uses characters from that same ramp, so the runtime can convert each glyph back to a luminance value and apply the same mapping during animation.

## Tonal mapping

The map was regenerated from the source pixels rather than merely relabeling the previous map.

- Black point: 32. Values at or below this point become the background character.
- White point: 220.
- Midpoint contrast: 1.04.
- Gamma: 0.85.
- Output: 144 × 144 characters, compressed as gzip text.

The black point suppresses low-level background haze while retaining the darker fabric folds and seam boundaries. The white point preserves the glove highlights without forcing most of the fabric into the brightest glyphs. The gamma curve gently opens the midtones.

## Runtime behavior

- The browser loads and decompresses \`assets/glove-map.txt.gz\` using the native \`DecompressionStream\` API.
- The existing renderer maps glyph indices to luminance, averages the map for mobile, and remaps those values through the selected 95-character ramp.
- The entrance, living-portrait motion, fabric-light sweep, hidden-tab pause, and reduced-motion behavior remain unchanged by this rendering pass.
- No source image is fetched at runtime; the visible artwork remains text characters.

## Validation and limits

- The compressed map decompresses to exactly 144 rows of 144 characters.
- Every map character is present in the 95-character ramp.
- The responsive mapping produces 144 × 144 and 72 × 72 grids with uniform row lengths.
- Desktop and mobile preview images were rendered locally from the exact character maps.
- A Chromium headless capture could not be completed in this execution environment, so these previews are not claimed as browser screenshots. The live page should still be reviewed in the user's browser.
- Glyph density can vary slightly between operating systems and monospace fonts. Averaging the density order across two common monospace families reduces, but does not eliminate, that difference.
