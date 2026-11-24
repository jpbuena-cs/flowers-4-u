# Design brief

## Core idea

The ASCII artwork is the entire website. It should feel like a small, carefully composed text-art experiment rather than a conventional landing page or a prank template.

## Subject

A monochrome illustration of a white cartoon glove making a playful middle-finger gesture. It is a soft, classic cartoon glove (the visual language associated with character gloves), not a metal, armored, or tactical glove.

## Visual direction

- Near-black background (#050505).
- Soft off-white characters (#e5e5e2).
- One monospace family, with no decorative typography.
- Art centered in the viewport with generous negative space.
- No visible text, headings, labels, buttons, menus, navigation, borders, cards, or loading indicators.
- No sound.
- No gradients or effects outside the character rendering itself.

## Character rendering

- Use a broad, 94-character brightness ramp, ordered from sparse to dense glyphs.
- Clamp low-level source noise to black so the background remains quiet.
- Preserve the glove silhouette, raised finger, fabric folds, seams, and cuff.
- Keep the image monochrome.
- Favor character-level detail over chunky low-resolution output.
- Use a tightly framed crop around the glove while retaining a small dark margin.

## Responsive behavior

- Desktop target: up to 144 columns.
- Mobile target: up to 72 columns.
- Calculate row count from the cropped image aspect ratio and monospace cell proportions.
- Fit the rendering inside the viewport; never wrap rows or stretch the image.
- Recalculate on viewport changes.

## Motion

- Render the complete ASCII hand below the visible viewport.
- Wait approximately 1.8 seconds after the character map is ready.
- Start the fabric-light sweep and subtle living-portrait idle movement as the hand begins entering.
- The entire hand rises from below the bottom edge into its centered resting position over approximately 3.6 seconds.
- The hand does not articulate or independently lift its finger during this entrance. The gesture is already present in the source image; the whole hand is what enters the frame.
- The fabric light moves smoothly back and forth with very subtle character-density changes.
- While the hand is in view, a tiny wrist-led sway, sub-character drift, and near-imperceptible breathing scale keep the illustration feeling alive.
- Keep the movement restrained. Avoid aggressive glitches, bouncing, or a metallic scanning effect.
- Loop the idle and fabric motion continuously after the entrance.
- Respect prefers-reduced-motion: show the artwork immediately in its final centered position as a static frame.
- Pause animation when the page is hidden.

## Technical note

The source is a single flattened image. The entry is a translation of the complete ASCII artwork, not an independent finger rig. The subtle idle movement is a small remapping of the ASCII brightness grid.

## Tone

Playful, dry, and understated. The joke comes from the subject, not from explanatory text or loud visual effects.
