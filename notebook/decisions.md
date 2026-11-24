# Decision log

| Decision | Current choice | Reason |
|---|---|---|
| Page content | ASCII artwork only | The artwork itself is the experience. |
| Visual style | Minimal, near-black, monochrome | Follows the requested clean ASCII-rest-like direction without adding decorative UI. |
| Subject interpretation | White cartoon glove | The source is a classic cartoon-style glove, not metal armor. |
| Character density | Broad glyph ramp; 144 desktop / 72 mobile target columns | Increase definition while keeping small screens legible. |
| Rendering element | HTML pre element | Preserves whitespace and character alignment. |
| Conversion | Precomputed gzip-compressed text map | Keeps the page centered on ASCII data, avoids image decoding at runtime, and reduces transfer size; decompression uses a native browser API. |
| Animation | Smooth back-and-forth cloth-light sweep plus subtle tonal variation | Adds life without making the hand wobble or look metallic. |
| Start timing | 1.8-second pause after initial render | Gives the still image a moment before motion begins. |
| Motion accessibility | Static frame for reduced-motion preference | Avoids continuous movement when a user requests reduced motion. |
| Dependencies | Native HTML, CSS, JavaScript only | Small static project; no framework or library is needed. |
| Deployment | Repository is Pages-ready, but Pages is not enabled | Build and review locally before publication. |

## Changes that require discussion

Revisit the approved direction before changing the visible page to include explanatory copy, interface controls, color, audio, framework dependencies, or a different subject treatment.
