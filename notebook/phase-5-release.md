# Phase 5 — Release readiness

**Repository:** `dash011905-cs/sumosobra-kana`  
**Branch checked:** `main`  
**Review date:** 2026-11-24  
**Status:** release build and user-device review complete; hosting choice and publication approval pending

## 1. Release scope

The public-facing page remains intentionally minimal:

- ASCII-rendered fabric glove.
- The small inline-SVG Jaypee signature.
- A centered `click me` prompt before the entrance.
- The original preferred heavy-object drag sound, unlocked by the user's click/tap.
- No explanatory copy, menus, navigation, or visible developer notes.

The page's root files remain the development source of truth. A separate build output is used for release preparation.

## 2. Startup and animation review

The current source implements this sequence:

1. Load and validate the local gzip character map.
2. Render a static pre-entrance frame and position the artwork below the viewport.
3. Reveal the full-screen transparent button with the centered `click me` label.
4. On activation, call `AudioContext.resume()` inside the click handler and start the entrance sequence.
5. Schedule the sound 260ms before the entrance begins.
6. Wait 1.8 seconds from the click before starting the entrance.
7. Move the complete hand into position over 4.8 seconds using a gradual ease and restrained settling keyframes.
8. Commit the exact centered resting transform when the entrance animation finishes.
9. Keep the 24 FPS character renderer running so the subtle living-portrait movement and fabric-light sweep continue after the entrance.

Reduced-motion preference keeps the static centered artwork and skips the prompt and entrance sound. The animation loop pauses when the document is hidden.

Source review confirms these states and timings. The recent click/audio flow was exercised in two isolated fresh-page simulations. A separate controlled desktop-renderer smoke test also produced 12 distinct frames, applied the 4.8-second entrance keyframes, committed the exact resting transform, and continued rendering after the settle. The user has since tested the release build on their actual devices and reports that everything works correctly.

## 3. Page-content audit

The root HTML contains:

- One ASCII artwork `pre` element.
- One inline SVG signature.
- One semantic start button whose visible text is `click me`.

No external scripts, stylesheets, images, fonts, analytics, or runtime network dependencies are referenced. The only runtime asset is the local gzip character map.

The page itself does not include README or notebook content.

## 4. Release build

Run from the repository root:

~~~bash
node scripts/build-site.mjs
~~~

The script creates `dist/` from this allow-list:

| Output path | Purpose |
|---|---|
| `index.html` | Page shell and click-to-start prompt |
| `styles.css` | Responsive, minimal presentation |
| `src/main.js` | Rendering, animation, and audio |
| `assets/glove-map.txt.gz` | Precomputed ASCII character map |

The following are intentionally excluded:

- `notebook/`
- `notebook/references/glove.png`
- `README.md`
- `scripts/`
- Git metadata and other development files

To preview the exact release output locally:

~~~bash
python -m http.server 8000 --directory dist
~~~

Then open `http://localhost:8000`.

Generated `dist/` is ignored by Git and is not committed.

The build helper passed `node --check` and a temporary fixture test. The fixture produced exactly the four allow-listed files and excluded a sample notebook and README. The user reports running and reviewing the real release build locally, with all requested checks passing.

## 5. GitHub Pages compatibility and visibility

Repository inspection on 2026-11-24 found:

- Default branch: `main`.
- Repository visibility: **private**.
- GitHub repository metadata: `has_pages = false`.
- No existing `.github/workflows/` directory or Pages deployment workflow.
- Root `index.html` is present.
- The page uses project-relative resource paths. The module's map URL resolves relative to `src/main.js`, so the same directory structure is preserved under a project-site path such as `/<repository-name>/`.

GitHub's current documentation says Pages is available for public repositories on GitHub Free, and for public or private repositories on GitHub Pro, Team, and Enterprise. A standard published Pages site is publicly accessible on the internet, even when the source repository is private. This project has not been configured for private site access.

Official references:

- [What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

Do not change the repository's visibility, configure a custom domain, create a deployment workflow, enable Pages, or deploy without explicit user approval.

## 6. Final acceptance checklist

### Verified from repository/source

- [x] JavaScript module syntax compiles.
- [x] No duplicate top-level declarations.
- [x] 95-character ramp and one `TARGET_FPS` declaration remain intact.
- [x] Character-map asset SHA matches the previously verified map.
- [x] Local HTML, CSS, module, and map paths are consistent.
- [x] Page shell contains no unintended visible copy or controls.
- [x] Reduced-motion path is present.
- [x] Hidden-tab pause/resume path is present.
- [x] Responsive desktop/mobile grid logic is present.
- [x] Release artifact uses an explicit allow-list and excludes project notes.
- [x] Build helper passes Node syntax validation and a temporary fixture test.
- [x] GitHub Pages is not enabled.

### User-side review — complete

- [x] User ran the build and inspected `dist/` on desktop.
- [x] User tested a fresh load, click/touch start, sound, and entrance.
- [x] User tested the release build on a physical phone.
- [x] User checked the requested mobile layout and interaction scenarios.
- [x] User reports that all tested scenarios work correctly.

### Publication decision — pending

- [ ] Confirm that the website may be publicly accessible.
- [ ] Confirm the GitHub plan and the route that preserves the desired source-repository visibility.
- [ ] Explicitly approve publication before Pages is configured.

## 7. Release decision

**Not published.** The release build and user-side tests are complete. GitHub Pages remains disabled until the user confirms public visibility and explicitly approves publication.


## Code cleanup and repository naming

### Code comments and README

- Removed all standalone line comments from `src/main.js` and `scripts/build-site.mjs`.
- Checked `index.html` and `styles.css`; no HTML or CSS comments were present.
- Replaced the root `README.md` with the project directory tree only.

### Possible repository rename

The user is considering renaming `sumosobra-kana` to `flowers-4-u`. No rename has been performed.

The current runtime uses relative resource paths and the build helper resolves files relative to its own location, so the project files do not depend on the repository slug. The standard project Pages path will, however, use the new repository name.

GitHub redirects the old repository URL and ordinary Git operations to the renamed repository, but it does not redirect the project's published Pages URL. Existing local clones should update their `origin` remote after a rename.

Because Pages is currently disabled, the least disruptive order is to settle the final repository name before enabling Pages.

Official guidance:

- [Renaming a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository)
- [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
