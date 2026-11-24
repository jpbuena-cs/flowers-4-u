# Decision log

| Decision | Current choice | Reason |
|---|---|---|
| Page content | ASCII artwork with a small, discreet handwritten “Jaypee” signature | The artwork remains the focus; the signature acts as a quiet maker's mark. |
| Visual style | Minimal, near-black, monochrome | Follows the requested clean ASCII-rest-like direction without adding decorative UI. |
| Source subject | The exact white/gray fabric glove in notebook/references/glove.png | Prevents the subject being reinterpreted as metal, armor, or a generic glove. |
| Source identity | Canonical repository reference is notebook/references/glove.png, a 256 × 256 PNG; its Git blob SHA is recorded in notebook/source-image.md | Gives future work a stable visual reference. |
| Character density | 95-glyph ramp sorted by average ink coverage across Liberation Mono and DejaVu Sans Mono; 144 desktop / 72 mobile target columns | Gives smoother, more predictable tonal steps while preserving fine fabric detail. |
| Source crop | x=60, y=10, width=136, height=226, resampled to 144 × 144 | Frames the entire glove with a small margin and matches the monospace cell aspect ratio. |
| Tonal mapping | Black 32, white 220, contrast 1.04, gamma 0.85 | Suppresses background haze while keeping dark seams, folds, and fabric shading. |
| Rendering element | HTML pre element with one retained text node | Preserves whitespace and character alignment while avoiding repeated child-node replacement. |
| Character mapping | 256-entry character-code lookup table | Avoids repeated ramp-index calculation and per-frame character-string creation. |
| Motion-field setup | Precompute palm/cuff masks and spatial sine/cosine coefficients once when the grid changes | Removes repeated Gaussian mask construction and spatial trigonometry from the per-character frame loop. |
| Output buffering | Reuse a typed character buffer and convert it to text in safe-size chunks | Reduces per-frame row-array and intermediate-string allocation. |
| Frame pacing | 24 FPS target with fractional interval accumulation and skipped missed frames | Avoids a naïve 24 FPS gate dropping to approximately 20 FPS on 60 Hz displays and prevents catch-up bursts after stalls. |
| Responsive behavior | 144 columns desktop / 72 columns mobile; ResizeObserver with window resize fallback | Preserves current detail while supporting browsers without ResizeObserver. |
| Motion preference events | Support addEventListener and legacy addListener MediaQueryList APIs | Improves compatibility with older browser engines. |
| Conversion | Precomputed gzip-compressed text map | Keeps the page centered on ASCII data, avoids image decoding at runtime, and reduces transfer size; decompression uses a native browser API. |
| Main movement | Entire ASCII hand enters from below the viewport | “Creep up” means the complete hand moves into the website view, not that the raised finger articulates. |
| Entrance timing | 1.8-second delay, then a 4.8-second ease with a tiny settle | Gives the blank page a brief pause before a deliberate, unhurried entrance. |
| Entrance easing | Gradual ease-in/ease-out, ending with a 2.5px lift and a 0.8px settle before exact center | Adds a natural sense of weight without a conspicuous bounce. |
| Living-image idle | Slow wrist-led weight shift, non-synchronized breathing/drift cycles, and soft local fabric movement around palm folds and cuff | Adds quiet presence while protecting the finger silhouette and avoiding a rigid, metronomic loop. |
| Fabric light | Smooth back-and-forth cloth highlight continues during entrance and idle | Keeps the existing animation running alongside the entrance. |
| Entrance sound | Restore the previous synthesized heavy-object drag sound, with continuous grit and a low rumble, beginning 260ms before the entrance | The user preferred the previous sound over the more irregular, crude version. |
| Start interaction | A centered monospace “click me” label is the visible face of a transparent full-viewport button | Any tap/click anywhere on the page explicitly unlocks Web Audio and starts the entrance without a conventional button surface. |
| Signature rendering | Inline SVG strokes, muted opacity, fixed lower-left placement | Keeps the signature consistent across systems without downloading a cursive font. |
| Motion accessibility | Static, centered frame for reduced-motion preference; pause the loop while the document is hidden | Avoids continuous motion when requested and reduces background work. |
| Dependencies | Native HTML, CSS, JavaScript and Web Audio API only | Small static project; no framework, library, or external audio file is needed. |
| Deployment | Repository is Pages-ready, but Pages is not enabled | Build and review locally before publication. |

## Changes that require discussion

Revisit the approved direction before changing the visible page to include explanatory copy, interface controls, color, audio, framework dependencies, or a different subject treatment.


| Signature resilience | Explicit SVG dimensions and presentation attributes plus a versioned stylesheet URL | Prevents stale browser CSS from stretching the mark or rendering the paths with the default solid fill. |
