# Decision log

| Decision | Current choice | Reason |
|---|---|---|
| Page content | ASCII artwork only | The artwork itself is the experience. |
| Visual style | Minimal, near-black, monochrome | Follows the requested clean ASCII-rest-like direction without adding decorative UI. |
| Source subject | The exact white/gray fabric glove in \`notebook/references/source-glove.png\` | Prevents the subject being reinterpreted as metal, armor, or a generic glove. |
| Source identity | Original is a 256 × 256 indexed PNG; SHA-256 is recorded in \`notebook/source-image.md\` | Gives future work a stable reference and confirms the re-upload matches the original source. |
| Character density | Broad glyph ramp; 144 desktop / 72 mobile target columns | Increase definition while keeping small screens legible. |
| Rendering element | HTML pre element | Preserves whitespace and character alignment. |
| Conversion | Precomputed gzip-compressed text map | Keeps the page centered on ASCII data, avoids image decoding at runtime, and reduces transfer size; decompression uses a native browser API. |
| Main movement | Entire ASCII hand enters from below the viewport | “Creep up” means the complete hand moves into the website view, not that the raised finger articulates. |
| Entrance timing | 1.8-second delay, then a 4.6-second ease with a tiny settle | Gives the blank page a brief pause before a deliberate, unhurried entrance. |
| Entrance easing | Smooth ease-out, ending with a 2.5px lift and a 0.8px settle before exact center | Adds a natural sense of weight without a conspicuous bounce. |
| Living-image idle | Tiny wrist-led rotation, fractional-cell drift, and subtle breathing scale | Adds life during and after entrance without shaking the whole image. |
| Fabric light | Smooth back-and-forth cloth highlight continues during entrance and idle | Keeps the existing animation running alongside the entrance. |
| Motion accessibility | Static, centered frame for reduced-motion preference | Avoids movement when a user requests reduced motion. |
| Dependencies | Native HTML, CSS, JavaScript only | Small static project; no framework or library is needed. |
| Deployment | Repository is Pages-ready, but Pages is not enabled | Build and review locally before publication. |

## Changes that require discussion

Revisit the approved direction before changing the visible page to include explanatory copy, interface controls, color, audio, framework dependencies, or a different subject treatment.
