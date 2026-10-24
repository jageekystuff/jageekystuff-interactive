# Jageekystuff Interactive Experiences

**Current version:** `2.11` · **Status:** experimental / work in progress

Interactive, fan-made cosplay experiences created by **Johán Hernandez Molina and Aldo Palmieri (Jageekystuff)**. The site lets convention visitors open a mobile browser experience, point their camera at a physical marker and see a virtual Pokémon alongside a trainer cosplay.

This is an **unofficial, non-commercial fan project** and is not affiliated with or endorsed by Pokémon, Nintendo, Game Freak, Creatures, or The Pokémon Company.

## Live experiences

| Experience | Link | 3D models | Status |
| --- | --- | --- | --- |
| Blaine | [Open Blaine AR](https://jageekystuff-interactive.pages.dev/pokemon/blaine/) | Magmar, Arcanine, **Rapidash V2 (test)** | First two calibrated; new Rapidash is experimental and may still show white flames |
| Lt. Surge | [Open Lt. Surge AR](https://jageekystuff-interactive.pages.dev/pokemon/surge/) | Raichu, Electrode, Electabuzz, **Electabuzz V2 (test)** | First three calibrated; alternative Electabuzz is uncalibrated and still needs a pose review |

**Five original roster slots are retained, plus two optional V2 test models**: Blaine's Magmar and Arcanine with a test-only Rapidash V2; Surge's Raichu, Electrode and the existing Electabuzz with a new Electabuzz V2 test. The prior Rapidash model stays archived; its appearance has not been approved. All existing calibrated models preserve their settings. Experimental models have their own calibration keys and are not considered stable until reviewed on phones.

**Project website:** https://jageekystuff-interactive.pages.dev/  
**Creator and 3D asset credits:** https://jageekystuff-interactive.pages.dev/credits/

## How it works

1. The visitor scans the trainer card's **AR QR code**, which opens the trainer's page in a browser.
2. They grant camera access and point the camera at the **HIRO test marker** (for now).
3. AR.js tracks the marker; A-Frame renders a Pokémon `.glb` model at an offset from it.
4. The visitor can select the Pokémon and, during development, adjust its scale, orientation and position.

**Calibrated Raichu, Electrode, Electabuzz and Arcanine HIRO preset:** `height: 1.05, yaw: 0, pitch: -85, roll: 0, x: 0.3, y: 0, z: 0.5`.

**Current limitation:** The actual cosplay cards do **not** yet have their own trained marker. The QR-to-AR-marker design still needs implementation and real-size testing. No final printed QR/marker artwork is included yet.

For the test marker, see [HIRO](https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png). Show or print it separately while testing with a phone.

## Technology and hosting

- Plain HTML, CSS and JavaScript, with [A-Frame](https://aframe.io/) and [AR.js](https://ar-js-org.github.io/AR.js-Docs/).
- Static hosting on **Cloudflare Pages**, connected to this GitHub repository.
- Models in glTF binary `.glb` format under `assets/models/`.
- Designed for modern mobile browsers with HTTPS and camera permission; Android Chrome has been used for on-device tests. Browser and device behavior can vary. **iOS visual and model-orientation discrepancies remain open for investigation** (see [`docs/KNOWN_ISSUES.md`](docs/KNOWN_ISSUES.md)).

### Repository structure

```text
index.html                     Homepage
pokemon/blaine/index.html      Blaine AR experience
pokemon/surge/index.html       Lt. Surge AR experience
assets/styles.css              Shared styling and mobile layout
assets/ar-demo.js              AR experience and model configuration
assets/models/*.glb            3D models
credits/index.html             Creator and asset attributions
README.md                      Project overview and instructions
CHANGELOG.md                   Version history
docs/KNOWN_ISSUES.md           Deferred compatibility bugs
VERSION                        Current project version
```

## Code formatting

Source files are written in **readable, multiline form** and follow the project's
`.prettierrc.json` and `.editorconfig` configuration. Use **Prettier** in VS Code
(`Format Document`) for HTML, CSS, and JavaScript. Keep 2-space indentation,
UTF-8 encoding, and LF line endings. Do not commit minified HTML/CSS/JS as
application source. Formatted source files are served directly by Cloudflare Pages;
no extra build step is required. The `.glb` models are binary and must not be formatted.

## Contributing an update / deployment

1. Modify the files in the repository, keeping the same folder structure.
2. Test on a real phone before calling a change stable. For AR, check camera access, marker detection, model orientation, and the mobile UI.
3. Commit to the production branch `main`. Cloudflare Pages then deploys the new version automatically.
4. For this static site, Cloudflare Pages uses: **Framework: None**, **Build command: `exit 0`**, **Output directory: `.`**, **Root directory: repository root**.
5. When making a project release, update `VERSION`, `README.md` where necessary, and `CHANGELOG.md` in the **same commit**.

### Versioning convention

The project currently uses **MAJOR.MINOR release labels**. Each delivered project revision increments the **MINOR integer by one**, even if it is a documentation or maintenance release: `2.5 → 2.6 → 2.7 → 2.8 → 2.9 → 2.10 → 2.11`. Version components are integers, **not decimal fractions**. The next release after `2.9` is `2.10`, **not** `3.0`.

A new **MAJOR** such as `3.0` is reserved for a deliberate major project milestone and/or an incompatible change requiring users or maintainers to migrate (for example, invalidating previously printed AR markers/QR links or replacing essential interaction flows without compatibility). New Pokémon, translations, UI fixes and documentation updates normally stay within the current major line.

This is a **simplified project convention inspired by [Semantic Versioning](https://semver.org/)**, not full SemVer: the formal SemVer scheme has three integer components `MAJOR.MINOR.PATCH` (e.g. `2.6.0`, `2.6.1`) and uses `PATCH` for backward-compatible bug fixes. We can adopt full SemVer later without confusing `2.10` with `2.1`. A Git commit does not automatically create a release; a release may contain several commits.

Update `VERSION` and [CHANGELOG.md](CHANGELOG.md) for each newly delivered release. Never reuse a published release label for different contents.

## Experimental model variants — v2.11

The currently validated models are **preserved without replacement**. Two additional GLBs have been added solely for testing:

- `assets/models/electabuzz_v2.glb` — alternative source model by Chechorams16 with a skeletal rig, but no embedded animation. Choose **Electabuzz V2 (test)** on the Surge page. It has a separate browser calibration key: `electabuzz_v2`.
- `assets/models/rapidash_v2.glb` — alternative source model by Nhiny Jinromon; contains strong white emissive flame materials that might still look incorrect in AR. Choose **Rapidash V2 (test)** on the Blaine page. Separate key: `rapidash_v2`.

The original `electabuzz.glb`, archived `electabuzz-original.glb`, and archived `rapidash.glb` are not overwritten. The V2 assets contain no new animations. **Do not treat V2 alternatives as approved production models until they pass on-device evaluation.**

### Test/hotfix release convention

Stable minor revisions proceed `2.10 → 2.11 → 2.12`. If a targeted fix is needed for release `2.11` before moving to `2.12`, use the project-specific label `v2.11-hfx-1` (then `v2.11-hfx-2`, if required). This is a project convention, not strict Semantic Versioning. Document the fix in `CHANGELOG.md` while preserving the planned minor-version sequence.

## Planned (not yet implemented)

- Compare Electabuzz V2 and Rapidash V2 on Android/iOS. Decide whether to adopt the new variants, refine a pose, or find a better normal-color Rapidash before making it a permanent option.
- Retest Electrode calibration on iOS; current HIRO preset is confirmed in on-device Android tests.
- Replace HIRO with **one QR code that also works with a recognizable AR target**, using the physical cosplay card; validate it at its real printed size.
- Keep the social media QR separate from the AR QR on the physical card.
- Add a language selector: **Italian by default**, with **English** and **Spanish** alternatives. Multilingual support comes **after the 3D models and AR markers are stable**.

## Credits, assets and intellectual property

**Project concept, cosplay design and physical production:** Johán Hernandez Molina & Aldo Palmieri — Jageekystuff.

**Interactive website, integration, mobile testing and AR calibration:** Jageekystuff, with technical direction led by Johán Hernandez Molina. The development workflow includes AI-assisted code generation and iterative human-led device testing.

The website lists model-specific attributions on [Credits & Acknowledgements](https://jageekystuff-interactive.pages.dev/credits/), including Electrode, original Electabuzz and archived Rapidash by `nguyenlouis32`, Arcanine and Electabuzz V2 by `Chechorams16`, and Rapidash V2 by `Nhiny Jinromon`, under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

**Attribution for Magmar and Raichu needs to be completed** once the original asset links and terms are confirmed. Do not interpret a model creator's license as a license to the underlying Pokémon character. This repository does not currently grant a blanket license for its code or third-party assets.
