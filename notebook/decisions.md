# Decision log

| Decision | Current choice | Reason |
|---|---|---|
| Page content | ASCII artwork only | The artwork itself is the experience. |
| Visual style | Minimal, near-black, monochrome | Follows the requested clean ASCII-rest-like direction without adding decorative UI. |
| Subject interpretation | White cartoon glove | The source is a classic cartoon-style glove, not metal armor. |
| Character density | Broad glyph ramp; 144 desktop / 72 mobile target columns | Increase definition while keeping small screens legible. |
| Rendering element | HTML pre element | Preserves whitespace and character alignment. |
| Conversion | Precomputed gzip-compressed text map | Keeps the page centered on ASCII data, avoids image decoding at runtime, and reduces transfer size; decompression uses a native browser API. |
| Animation style | Living-illustration / breathing-image motion | Use small independent movements, slow easing, and one clear gesture instead of moving the whole image aggressively. |
| Finger action | One-way lift after the idle motion begins; 9.2-second ease into a held pose | Gives the gesture a slow, deliberate reveal rather than a sudden jump or repetitive wag. |
| Hand idle | Tiny wrist-led rotation, fractional-cell drift, and subtle scale breathing | Adds life while preserving the still-image composition. |
| Fabric light | Smooth back-and-forth cloth highlight continues during the finger and hand movement | Keeps the existing animation as a background layer. |
| Start timing | Still frame 1.8 seconds; finger begins 2.8 seconds after the continuous motion starts | Allows the viewer to register the initial pose before the gesture develops. |
| Motion accessibility | Static frame for reduced-motion preference | Avoids continuous movement when a user requests reduced motion. |
| Dependencies | Native HTML, CSS, JavaScript only | Small static project; no framework or library is needed. |
| Deployment | Repository is Pages-ready, but Pages is not enabled | Build and review locally before publication. |

## Changes that require discussion

Revisit the approved direction before changing the visible page to include explanatory copy, interface controls, color, audio, framework dependencies, or a different subject treatment.
