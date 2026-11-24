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

- Render a complete still image first.
- Wait approximately 1.8 seconds after the map is ready.
- Start the fabric-light sweep and subtle idle movement together.
- The fabric light moves smoothly back and forth, with very subtle changes in character density.
- After another 2.8 seconds, the raised finger begins to creep upward.
- The finger lift uses a feathered region so movement is strongest toward the fingertip and fades toward the knuckle. The lift takes approximately 9.2 seconds, then holds its new pose.
- While this happens, the hand has a very small wrist-led sway, sub-character drift, and near-imperceptible breathing scale. The wrist/cuff acts as the pivot so the hand feels like a living illustration rather than a sticker being shaken.
- Keep all movement restrained. Avoid aggressive glitches, bouncing, or a metallic scanning effect.
- Loop the idle and fabric motion continuously.
- Respect prefers-reduced-motion: show a complete static frame and do not run continuous animation.
- Pause animation when the page is hidden.

## Technical note

The source is a single flattened image, not a layered illustration. The hand movement is therefore simulated by smoothly remapping the ASCII brightness grid. This gives a restrained living-image effect without claiming true depth-based parallax or independently rigged anatomy.

## Tone

Playful, dry, and understated. The joke comes from the subject, not from explanatory text or loud visual effects.
