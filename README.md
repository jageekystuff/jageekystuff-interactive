# Jageekystuff Interactive Experiences

**Current version:** `2.12` · **Status:** experimental / work in progress

Interactive, fan-made cosplay experiences created by **Johán Hernandez Molina and Aldo Palmieri (Jageekystuff)**. The site lets convention visitors open a mobile browser experience, point their camera at a physical marker and see a virtual Pokémon alongside a trainer cosplay.

This is an **unofficial, non-commercial fan project** and is not affiliated with or endorsed by Pokémon, Nintendo, Game Freak, Creatures, or The Pokémon Company.

## Live experiences

| Experience | Link | 3D models | Status |
| --- | --- | --- | --- |
| Blaine | [Open Blaine AR](https://jageekystuff-interactive.pages.dev/pokemon/blaine/) | Magmar, Arcanine | Approved and calibrated on Android with HIRO |
| Lt. Surge | [Open Lt. Surge AR](https://jageekystuff-interactive.pages.dev/pokemon/surge/) | Raichu, Electrode | Approved and calibrated on Android with HIRO |

**v2.12 cleanup:** Experimental Electabuzz and Rapidash models and their selectors were removed after phone testing. Only the four accepted `.glb` files remain in this snapshot. The earlier models and their credits are preserved in Git history, not deployed. This hotfix does not change the validated Android camera, marker-tracking or calibration implementation.

**Project website:** https://jageekystuff-interactive.pages.dev/  
**Creator and 3D asset credits:** https://jageekystuff-interactive.pages.dev/credits/

## How it works

1. The visitor scans the trainer card's **AR QR code**, which opens the trainer's page in a browser.
2. They grant camera access and point the camera at the **HIRO test marker** (for now).
3. AR.js tracks the marker; A-Frame renders a Pokémon `.glb` model at an offset from it.
4. The visitor can select the Pokémon and, during development, adjust its scale, orientation and position.

**Calibrated Raichu, Electrode and Arcanine HIRO preset:** `height: 1.05, yaw: 0, pitch: -85, roll: 0, x: 0.3, y: 0, z: 0.5`.

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

## Hotfix labels and clean deployments

After a published minor release, small follow-up fixes use `v2.12`,
`v2.11-hfx-2`, etc., without advancing to v2.12. This is a custom naming
convention rather than standard SemVer.

This release is a **complete site snapshot**. Its four model files are:
`magmar.glb`, `arcanine.glb`, `raichu.glb`, `electrode.glb`. Old Electabuzz
and Rapidash GLBs should be deleted from the local working tree and from
version control in this commit; they remain recoverable through Git history.

Keep the repository's `.git/` directory when refreshing the project locally.
Replacing the working files but preserving `.git/` lets Git detect deletions.

## Planned (not yet implemented)

- Create and validate QR + AR image targets integrated into the physical cosplay cards, replacing the temporary HIRO marker.
- Test the final-sized printed markers and Pokémon placement beside the cosplayers.
- Review mobile iOS/Safari appearance and marker orientation issues; see [`docs/KNOWN_ISSUES.md`](docs/KNOWN_ISSUES.md).
- Add photo capture and language selection (Italian default, English and Spanish) after the core interaction is stable.
- Consider better models for Electabuzz or Rapidash only if available without compromising stability; neither is currently offered.
- Consider subtle animations and effects as a later enhancement, not part of this hotfix.

## Credits, assets and intellectual property

**Project concept, cosplay design and physical production:** Johán Hernandez Molina & Aldo Palmieri — Jageekystuff.

**Interactive website, integration, mobile testing and AR calibration:** Jageekystuff, with technical direction led by Johán Hernandez Molina. The development workflow includes AI-assisted code generation and iterative human-led device testing.

The website lists current model-specific attributions on [Credits & Acknowledgements](https://jageekystuff-interactive.pages.dev/credits/), including **Electrode** by `nguyenlouis32` and **Arcanine** by `Chechorams16` under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Historical attribution for withdrawn Electabuzz/Rapidash assets is retained in the Git history and [CHANGELOG.md](CHANGELOG.md).

**Attribution for Magmar and Raichu still needs to be completed** once original asset links and licenses are confirmed. A model maker's license does not imply rights to the underlying Pokémon character. This repository does not provide a blanket license for its source code or third-party models.

## Custom QR-marker testing (v2.12)

The physical card QR and AR pattern marker are combined in one 19 cm marker containing a 15 cm QR. See [`docs/QR_AR_MARKER_V2.12.md`](docs/QR_AR_MARKER_V2.12.md) for exact positions, downloads and the HIRO fallback. This remains **experimental until verified on phones**.
