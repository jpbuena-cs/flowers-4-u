# Animation direction

## Reference study

The requested visual language is close to a living illustration or breathing image: a mostly still composition with a few restrained movements that give it a sense of presence.

Useful references:

- [xoio — Animated Stills / Breathing Images](https://xoio.de/en/animated-stills-looped-images-in-motion/): describes the goal as “stillness in motion” and uses small, naturally repeating movement to create atmosphere.
- [Renderforest — How to Add Motion to Still Images](https://www.renderforest.com/blog/how-to-add-motion-to-still-images): recommends choosing one controlled movement, protecting important details, using easing, and keeping motion slower than expected.
- [Behance — Animated Portrait GIFs](https://www.behance.net/gallery/59801155/ANIMATED-PORTRAIT-GIFs-2017): reference for restrained motion applied to an otherwise static character portrait.

These are visual direction references, not assets copied into the project.

## Applied to the glove

The glove is the focal point, so the motion should come from inside the pose rather than from a moving camera or a bouncing whole-image effect.

### Motion layers

1. **Cloth light:** The existing broad highlight continues moving back and forth across the glove.
2. **Idle hand:** A very small wrist-led pivot, sub-character drift, and subtle scale breathing make the hand feel held by a living character.
3. **Gesture:** After the light and idle movement are underway, the raised finger slowly creeps upward. The lift is feathered so the tip moves most and the knuckle stays anchored. It reaches its new pose once and holds it.

## Timing

- Initial still: approximately 1.8 seconds after the character map loads.
- Fabric and idle animation start together.
- Finger movement begins 2.8 seconds after those animations start.
- Finger movement eases over approximately 9.2 seconds.
- The idle hand and fabric light continue indefinitely after the finger settles.

## Technical limitation

There is only one flattened source image. The project cannot move actual separated hand/finger layers without creating additional artwork or a segmented source. The current version approximates layered motion by remapping the ASCII brightness grid with a soft local deformation mask. This keeps the file small and the presentation text-only, but the movement should stay modest to avoid visible stretching around the finger's base.

## Motion quality rule

The page should feel quietly alive on a second look. If the viewer notices the hand wobbling before noticing the slow finger gesture, the idle movement is too strong.
