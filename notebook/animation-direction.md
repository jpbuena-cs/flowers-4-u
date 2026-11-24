# Animation direction

## Reference study

The visual language is a living illustration or breathing image: a mostly still composition with a few restrained movements that give it a sense of presence.

Useful references:

- [xoio — Animated Stills / Breathing Images](https://xoio.de/en/animated-stills-looped-images-in-motion/): restrained, naturally repeating movement around a static image.
- [Renderforest — How to Add Motion to Still Images](https://www.renderforest.com/blog/how-to-add-motion-to-still-images): one controlled movement, protected details, and smooth easing.
- [Behance — Animated Portrait GIFs](https://www.behance.net/gallery/59801155/ANIMATED-PORTRAIT-GIFs-2017): restrained movement applied to otherwise static character portraits.

These are visual direction references, not assets copied into the project.

## Final motion interpretation

The user's “slow moving upwards creep” means an entrance of the complete hand into the page, not an animation of the raised finger itself.

### Motion layers

1. **Entrance:** The whole ASCII hand starts below the viewport. After a short pause, it rises upward into the center of the website.
2. **Fabric light:** The existing broad highlight moves back and forth while the hand enters and continues after it settles.
3. **Living-portrait idle:** A tiny wrist-led pivot, sub-character drift, and nearly imperceptible breathing scale give the hand a sense of life once visible.

## Timing

- Initial position: entire text-art image below the bottom edge of the viewport.
- Initial pause: approximately 1.8 seconds after the character map loads.
- Entrance: 4.8-second gradual ease-in/ease-out upward movement with a tiny final settle.
- Fabric and idle animation: begin at the same time as the entrance.
- After the entrance: hand remains centered; fabric-light and portrait idle continue indefinitely.

## Technical limitation

The complete entrance is a CSS transform applied to the ASCII art container. The source remains a single flattened image. The much smaller portrait-style idle is approximated by remapping the ASCII brightness grid; there are no separately rigged finger or hand layers.

## Motion quality rule

The movement should feel like the character is calmly entering the frame. Avoid a sudden pop, fast slide, bounce, or overshoot. The viewer should see the hand emerge from below, rise into place, and then quietly remain alive.
