# Implementation plan

## Architecture

- index.html: minimal document shell and the single visible ASCII output element.
- styles.css: viewport centering, monochrome palette, monospace typography, and overflow control.
- src/main.js: text-map loading, responsive sampling, luminance mapping, procedural idle motion, entrance timing, and reduced-motion handling.
- assets/glove-map.txt.gz: gzip-compressed 144 × 144 character-density map generated from the user-provided glove image.
- notebook/: project intent, settled choices, implementation notes, roadmap, and progress.

## Rendering pipeline

1. Load and decompress the local gzip character map with the browser-native DecompressionStream API.
2. Validate its dimensions and ensure every character belongs to the project ramp.
3. Convert the character map into a luminance array.
4. Keep the 144-column map on desktop; average source cells into a 72-column map on mobile.
5. Write complete rows into a pre element using the textContent property.
6. On resize, fit the font size to the available viewport and rebuild only if the target grid changes.

## Motion pipeline

1. Render the complete ASCII hand while positioning its text container below the viewport, outside the visible frame.
2. Wait 1.8 seconds after the character map is ready.
3. Start the fabric-light sweep and subtle living-portrait idle movement.
4. At the same moment, transition the complete hand upward from below the bottom edge into its centered resting position over 3.6 seconds.
5. Keep the fabric light and quiet hand idle looping after the entrance has completed.
6. Pause motion while the document is hidden and honor prefers-reduced-motion.

## Implementation constraints

- The entrance moves the complete ASCII artwork via a GPU-friendly CSS transform. It does not reshape or separately animate the raised finger.
- The source is one flattened image; the tiny idle movement remains a restrained image-grid remap, not true layered parallax.
- The entrance offset is calculated from the viewport and rendered art height, so the complete text image begins below the frame on desktop and mobile.
- On resize before the first entrance, recalculate the offscreen offset. Once the entrance has happened, do not replay it.
- Reduced-motion preference shows the complete image immediately in its final position.
- Keep the page artwork-only: no visible text, interface controls, menus, navigation, or sound.

## Milestones

### M1 — Static rendering

- [x] Add a precomputed high-density character map.
- [x] Verify browser rendering and viewport fit at desktop and mobile sizes.

### M2 — Entrance and idle animation baseline

- [x] Position the complete hand below the viewport at initial load.
- [x] Add a short delay before the entrance starts.
- [x] Animate the complete hand upward into the center.
- [x] Run fabric lighting and tiny living-portrait idle motion concurrently with entrance.
- [x] Keep the idle and fabric motions running after the entrance.
- [x] Remove the previously misunderstood independent finger-lift deformation.
- [x] Keep reduced-motion output static and centered.

### M3 — Refinement roadmap

See [roadmap.md](./roadmap.md) for the ordered next phases:
1. Polish the entrance.
2. Improve the living-portrait effect.
3. Refine the ASCII rendering.
4. Check performance and compatibility.
5. Prepare the final presentation and release.

Optional regional motion is exploratory and should only be considered after the current motion has been reviewed on the user's devices.

## Validation checklist

- The site makes no third-party requests and uses no third-party libraries.
- The output contains only ASCII characters and line breaks.
- No line wraps; no horizontal page scrolling.
- Entire hand begins below the visible viewport.
- Entrance moves upward into the centered final position.
- Fabric light and subtle portrait motion are active during entrance.
- Entrance does not repeat when returning to a visible tab after completion.
- Reduced-motion preference produces an immediate static frame.
- Hidden tabs stop requesting animation frames.
- GitHub Pages remains disabled until explicit user approval.
