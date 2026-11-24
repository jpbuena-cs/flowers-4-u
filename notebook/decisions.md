# Decision log

| Decision | Current choice | Reason |
|---|---|---|
| Page content | ASCII artwork only | The artwork itself is the experience. |
| Visual style | Minimal, near-black, monochrome | Follows the requested clean ASCII-rest-like direction without adding decorative UI. |
| Source subject | The exact white/gray fabric glove in \`notebook/references/glove.png\` | Prevents the subject being reinterpreted as metal, armor, or a generic glove. |
| Source identity | Canonical repository reference is \`notebook/references/glove.png\`, a 256 × 256 PNG; its Git blob SHA is recorded in \`notebook/source-image.md\` | Gives future work a stable visual reference. |
| Character density | 95-glyph ramp sorted by average ink coverage across Liberation Mono and DejaVu Sans Mono; 144 desktop / 72 mobile target columns | Gives smoother, more predictable tonal steps while preserving fine fabric detail. |
| Source crop | x=60, y=10, width=136, height=226, resampled to 144 × 144 | Frames the entire glove with a small margin and matches the monospace cell aspect ratio. |
| Tonal mapping | Black 32, white 220, contrast 1.04, gamma 0.85 | Suppresses background haze while keeping dark seams, folds, and fabric shading. |
| Rendering element | HTML pre element | Preserves whitespace and character alignment. |
| Conversion | Precomputed gzip-compressed text map | Keeps the page centered on ASCII data, avoids image decoding at runtime, and reduces transfer size; decompression uses a native browser API. |
| Main movement | Entire ASCII hand enters from below the viewport | “Creep up” means the complete hand moves into the website view, not that the raised finger articulates. |
| Entrance timing | 1.8-second delay, then a 4.8-second ease with a tiny settle | Gives the blank page a brief pause before a deliberate, unhurried entrance. |
| Entrance easing | Gradual ease-in/ease-out, ending with a 2.5px lift and a 0.8px settle before exact center | Adds a natural sense of weight without a conspicuous bounce. |
| Living-image idle | Slow wrist-led weight shift, non-synchronized breathing/drift cycles, and soft local fabric movement around palm folds and cuff | Adds quiet presence while protecting the finger silhouette and avoiding a rigid, metronomic loop. |
| Idle scale and drift | Sub-character amplitudes; different cycle lengths for tilt, scale, and drift | Keeps movement barely noticeable and prevents the whole image from wobbling. |
| Local fabric movement | Overlapping Gaussian masks over palm and cuff; no hard segmentation or independent rigging | Suggests fabric settling while retaining the flattened-image approach. |
| Fabric light | Smooth back-and-forth cloth highlight continues during entrance and idle | Keeps the existing animation running alongside the entrance. |
| Motion accessibility | Static, centered frame for reduced-motion preference | Avoids movement when a user requests reduced motion. |
| Dependencies | Native HTML, CSS, JavaScript only | Small static project; no framework or library is needed. |
| Deployment | Repository is Pages-ready, but Pages is not enabled | Build and review locally before publication. |

## Changes that require discussion

Revisit the approved direction before changing the visible page to include explanatory copy, interface controls, color, audio, framework dependencies, or a different subject treatment.
