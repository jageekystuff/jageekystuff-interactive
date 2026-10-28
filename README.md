# Jageekystuff Interactive Experiences

**Current platform release: `v3.0-hfx-3` · Status: experimental / in active testing**

A configurable, fan-made cosplay AR platform designed and produced by **Johán Hernandez Molina and Aldo Palmieri — Jageekystuff**. Both creators collaborate on the cosplay design and physical construction. Johán directs the technical integration and testing. Development includes AI-assisted implementation, human-led product decisions, deployment and device testing.

The new `v3.0` release introduces a **reusable AR Core** and a configurable experience layer. The platform is no longer architecturally tied to one particular experience, but **only the current Pokémon cosplay experience is implemented**. No additional experiences are included or implied by the repository structure.

This is an unofficial, non-commercial fan project, not affiliated with or endorsed by any franchise owners. See [creator and asset credits](/credits/) or the [public credits page](https://jageekystuff-interactive.pages.dev/credits/).

## Live URLs and migration from V2

| URL | Meaning | Printed QR compatibility |
| --- | --- | --- |
| [`/`](https://jageekystuff-interactive.pages.dev/) | **V3 unified AR** — choose trainer and Pokémon in the same camera scene | **New unified QR**, linked to this exact URL |
| [`/pokemon/v3/`](https://jageekystuff-interactive.pages.dev/pokemon/v3/) | V3 alias, redirects to `/` | No new QR required |
| [`/pokemon/v2/`](https://jageekystuff-interactive.pages.dev/pokemon/v2/) | V2 classic experience selection | Manual access |
| [`/pokemon/v2/blaine/`](https://jageekystuff-interactive.pages.dev/pokemon/v2/blaine/) | Original Blaine AR and calibrations | Old Blaine marker still works |
| [`/pokemon/v2/surge/`](https://jageekystuff-interactive.pages.dev/pokemon/v2/surge/) | Original Lt. Surge AR and calibrations | Old Surge marker still works |
| `/pokemon/blaine/` | Legacy link, redirects to V2 Blaine | Old Blaine QR still opens |
| `/pokemon/surge/` | Legacy link, redirects to V2 Surge | Old Surge QR still opens |

**Important:** The QR printed for the unified card contains precisely:

`https://jageekystuff-interactive.pages.dev/`

Its **19 × 19 cm** combined QR/AR artwork and **15 × 15 cm** internal QR are in `assets/markers/unified-qr-marker-19cm.svg`. The accompanying `assets/markers/unified.patt` is trained on exactly that artwork. The *URL* launches V3; the *.patt pattern* recognizes the printed artwork once the camera starts. There is no second AR destination URL.

Older QR codes still encode the original trainer URLs. Their small compatibility redirect pages preserve the query string and route visitors to the corresponding V2 page. Changing a link target through a redirect does **not** change its AR image recognition pattern; the existing V2 patterns are preserved independently.

## Why V3 is a major release

**V2** offered two trainer-specific pages, separate AR markers and application logic tied to each trainer. The approved Android tests and four GLBs are preserved in `/pokemon/v2/`.

**V3** was introduced because the physical cosplay may use **one shared card** instead of two, and because we needed a configurable platform foundation instead of duplicating AR code for each experience. It has one visitor entrypoint, a shared camera, a trainer selector and contextual model selector. AR initialization, model loading and calibration handling are separated from experience-specific labels and choices. It keeps V2 available for comparison and backward compatibility.

This redesign is a deliberate platform milestone and uses the project-specific `3.0` major label. Version numbers are discrete components, not decimals (`2.9 → 2.10 → 2.11`; hotfixes like `2.12-hfx-1`).

## Repository architecture

```text
index.html                                    V3 unified experience at /
pokemon/v3/index.html                        V3 alias, redirects to /
pokemon/v2/index.html                        V2 classic experience directory
pokemon/v2/blaine/index.html                 Original separate Blaine experience
pokemon/v2/surge/index.html                  Original separate Lt. Surge experience
pokemon/blaine/index.html                    Redirect for an old printed QR
pokemon/surge/index.html                     Redirect for an old printed QR
core/config.js                               Shared JSON configuration loader
core/ar-engine.js                            Marker tracking, camera, model loading, physical fit
experiences/pokemon/v3/experience.json       Trainer/model choices; no AR engine code
experiences/pokemon/v3/app.js                V3-specific UI and selection
assets/config/model-calibrations.json        Single committed source for model profiles
assets/legacy/v2-ar-demo.js                  Preserved V2 engine, reads shared model config
assets/models/*.glb                          Four approved, shared GLB models
assets/markers/unified.patt                  V3 QR-marker recognition template
assets/markers/unified-qr-marker-19cm.svg    Final-sized QR artwork for the unified card
assets/markers/{blaine,surge}.patt           Legacy V2 pattern files
assets/styles.css                            Shared mobile CSS
credits/index.html                           Creators and CC BY attributions
README.md, CHANGELOG.md, VERSION             Release documentation
```

We intentionally do not add a new project, generic plugin manager, back-end, database or framework in this release. The AR Core is configurable and can be reused by adding an independent experience definition in a future release **if needed**.

## Shared calibration profiles

All four models are registered in `assets/config/model-calibrations.json`. V2 and V3 **read this same file**, but select distinct profiles to avoid mixing the old marker-coordinate measurements with new physical-card calibrations:

- `v2-hiro`: originally approved values for the HIRO test marker.
- `v2-card`: values from original trainer QR-marker experiments, retained for compatibility.
- `v3-unified-card`: provisional height targets in **centimeters**, normalized **after rotation** to account for model depth and orientation, with an independent position relative to the unified 19 cm marker.

V3 converts centimeters to marker units using the marker width as a reference. Its physical dimensions remain **approximate until verified on the actual printed card**. Saved slider adjustments are browser-local for testing and **are not automatically committed to GitHub**. To make a value permanent for everyone, copy the calibration JSON from the panel and incorporate the approved values into `assets/config/model-calibrations.json` in a later release. In V2 the preserved panel still shows its original marker units.

Known v3 starting targets: Magmar 110 cm, Arcanine 150 cm, Raichu 70 cm, Electrode 90 cm. These are provisional presentation sizes, not verified physical measurements. Model positions also need final testing.

## Camera framing: V3.0-hfx-3 (CAM-01)

In V3, open **Ajustar 3D → CAM-01 · Matched camera framing** after starting the camera. These controls are for testing, not intended as the final visitor interface.

- **Aligned view (default):** displays the *entire* camera feed and draws 3D models into a renderer of the same visible width and height. On a portrait phone with a 4:3 feed, blank bands above and below the picture are normal; they are not missing camera pixels.
- **Legacy view (fallback):** restores the previous AR.js fullscreen layout for comparison and troubleshooting if the aligned view causes tracking or pose problems.
- **Copy camera diagnostics:** reports the actual source dimensions, viewport, camera/canvas rectangles, differences in CSS pixels, renderer buffer, and zoom reported by the browser (if available). `layersAligned: true` means the two rectangles coincide; it does *not* prove 3D marker pose accuracy.

The confusing **Request 1×** button from `v3.0-hfx-1` was removed: the Xiaomi already reported 1×. The browser may still use a physical camera different from the stock camera application. **This hotfix is not yet validated in live AR**, and does not modify the four model calibration presets or V2.

## How to test V3 on a phone

1. Open `https://jageekystuff-interactive.pages.dev/` by scanning the **new unified QR**; using the same phone is sufficient.
2. Tap **Start AR camera**, grant permission and aim at that **same printed QR-marker** on a matte, light-colored background.
3. Choose Blaine or Lt. Surge and then a model; the camera should remain open when you switch.
4. Use **Ajustar 3D** only for calibration testing. `Reset` reverts to the committed profile; `Copy settings` exports values to send for review.
5. First compare Aligned/Legacy view at 100 cm with the printed marker, then again at 200 cm. The QR must remain visible and the 3D model should follow it.
6. Use **Copy camera diagnostics** and check `videoBox`, `canvasBox`, and `layersAligned`. Keep 3D height calibration for a later test, after camera framing is verified.
7. For a fallback marker test, open `/?marker=hiro` and point at the HIRO test marker.

The camera, models and pattern recognition cannot be fully validated until this build is deployed and tested on actual Android and iOS devices. The earlier V2 physical-marker and iPhone limitations remain listed in `docs/KNOWN_ISSUES.md`.

## Styling, hosting and releases

- HTML, CSS and readable JavaScript; no frontend build system required.
- [A-Frame](https://aframe.io/) + [AR.js](https://ar-js-org.github.io/AR.js-Docs/), hosted by **Cloudflare Pages** from GitHub `main`.
- Cloudflare configuration: **Framework: None**, **Build command: `exit 0`**, **Output directory: `.`** and repository root as root directory.
- Prettier configuration in `.prettierrc.json`; `.editorconfig` for 2-space indent. Neither overrides your work projects.
- Update `VERSION`, `README.md` (when relevant) and `CHANGELOG.md` per release. Minor labels use increasing integers; `3.9` goes to `3.10`, never `4.0` just because of the numbering.
- Hotfix naming is `v3.0-hfx-3` for follow-up fixes to V3.0 without changing the next regular version.

## Deferred features — not in V3.0

- iOS/Safari rendering and tracking compatibility, final stable placement at photo distance.
- Built-in AR snapshot, Save/Share flow only **after** the camera and calibration are reliable.
- Language selection (Italian default, English, Spanish).
- Randomized model selection, optional future social-share integrations and animations.

## Models and credit notes

Models selected: Magmar, Arcanine, Raichu, Electrode. The Electabuzz/Rapidash candidates were rejected and removed in V2 hotfix history. Individual creator licenses for Electrode and Arcanine are described in `credits/index.html`. Original source/licensing metadata for Magmar and Raichu still needs verification; do not imply rights-owner endorsement.

### V3 controls and AR photograph (3.0-hfx-3)

- Compact selectors: choose trainer and Pokémon in one small overlay. Use the circular ◌/◉ control to hide or restore the selectors.
- ⚙ opens developer calibration and camera diagnostics; the public does not need to use this.
- 📷 attempts an AR photo capture in **Aligned view** while the physical QR marker is visible. The picture combines webcam video and WebGL models, not the HTML controls. Preview offers **Save photo**, **Share** (where supported), and **Retake**.
- Camera capture has not been verified on Android Chrome, iOS Safari, or Mac desktop; fall back to the phone screenshot if the experimental button fails. Captures are generated locally and are not uploaded to a server.
- The V3 Raichu values are a user-tested experimental baseline, **not a final official scale**; in `assets/config/model-calibrations.json`. Values stored previously in browser localStorage take precedence until cleared or reset. Use incognito or Reset to verify defaults.
- V2 routes, model assets, and the QR pattern are unchanged.
