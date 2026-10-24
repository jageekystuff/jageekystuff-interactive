# Changelog — Jageekystuff Interactive Experiences

Project release history, newest first. Each newly delivered revision increments the **minor version component by one** (`2.8 → 2.9 → 2.10`), not as a decimal fraction; a major release is a separate, intentional decision. These are project release labels rather than one version per Git commit.

The early version descriptions below are reconstructed from the prototypes and the Git commit history shared during development. Git remains the definitive record of individual file changes.

## [2.11-hfx-1] — 2026-10-24

### Removed
- **Electabuzz** (original, raised-arms experiment, and V2) from Lt. Surge; removed their source GLBs from the release after comparison on Android. The poses did not meet the visual quality target.
- **Rapidash** (original and V2) from Blaine and from the shipped GLBs because the flame materials rendered incorrectly on-device.
- Removed all test variant buttons, model mappings, calibration defaults, outdated homepage listings and active asset credits for removed models.

### Retained
- **Blaine:** Magmar and Arcanine, both with previously approved calibration presets.
- **Lt. Surge:** Raichu and Electrode, both with previously approved calibration presets.
- Mobile camera layout, AR.js HIRO recognition, model fitting and calibration controls unchanged.
- Rejected source assets and creator credits remain available in Git history; `CHANGELOG.md` preserves the record of the earlier tests.

### Maintenance
- Updated homepage, experience text, active credits, README and known issues to show the four-model scope accurately.
- Distributed a complete, readable project snapshot for local folder replacement. Added `.gitignore` to prevent accidentally committing local ZIP archives.
- Hotfix label follows the project-specific `v2.11-hfx-1` convention; next planned minor remains **v2.12**.

## [2.11] — 2026-10-24

### Added
- Two separate, optional, **unmodified experimental GLB models**: `electabuzz_v2.glb` from Chechorams16 and `rapidash_v2.glb` from Nhiny Jinromon, both CC BY 4.0 with attribution on `/credits/`.
- **Electabuzz V2 (test)** button on Lt. Surge alongside the existing Electabuzz, Raichu and Electrode. The new Electabuzz model has a skeletal rig (70 joints) but **no baked animation**; its visible pose is not yet approved.
- **Rapidash V2 (test)** button on Blaine, retaining existing Magmar and Arcanine. This Rapidash is test-only because its white emissive flame materials may still look incorrect.
- Independent calibration presets and localStorage keys for each V2 variant, plus corresponding updates to the landing page.

### Unchanged
- All existing model files, calibration presets, camera settings and HIRO marker logic remain unchanged. This is a model A/B comparison release, **not an animation release**.
- Preserve previous versions in the project; test bugs may be addressed under the project-specific `v2.11-hfx-1` convention before the next minor version.

### Code formatting
- Reformatted HTML, CSS, and JavaScript into readable multiline source; added Prettier/EditorConfig formatting rules.

## [2.10] — 2026-10-24

### Changed
- Reposed **Electabuzz** into an experimental raised, bent-arms flex pose inspired by an anime reference. This is a **static geometry edit**, not rigging or animation. Hands remain open, and shoulder/elbow joins must be checked on a real device. The original model is still available for rollback.
- Confirmed **Arcanine** default on Android HIRO (`height=1.05`, `yaw=0`, `pitch=-85`, `roll=0`, `x=0.3`, `y=0`, `z=0.5`). The existing correct configuration is retained.
- **Removed Rapidash from Blaine’s selector** because its pale flames are not acceptable for the intended normal form. The current GLB is kept only as a legacy asset and is no longer loaded. A better model will be evaluated separately.
- Updated **homepage** to list the currently available five Pokémon and explain the temporary HIRO marker; removed outdated “Arcanine coming later” and Raichu-only descriptions.
- Updated Electabuzz modification notice and current state in model credits, README and VERSION.

### Deferred
- No animations, new camera behaviors, final QR markers, internationalization or iOS bug fixes are included in this release.

## [2.9] — 2026-10-23

### Added
- **Arcanine** and **Rapidash** to Blaine’s three-option Pokémon selector, with downloadable GLB assets and provisional calibration controls.
- Rapidash is explicitly **provisional**: its original white/gray flame materials have not been modified.
- An **experimental lowered-arms Electabuzz mesh**, geometrically re-posed without adding a rig or animations. The original model is retained as `assets/models/electabuzz-original.glb` for rollback if the AR result is unsatisfactory.
- Creator attributions: [Arcanine by Chechorams16](https://skfb.ly/pAXUy) and [Rapidash by nguyenlouis32](https://skfb.ly/ouEwL), both CC BY 4.0. Electabuzz’s geometry modification is disclosed in credits.

### Confirmed
- Electabuzz HIRO calibration from Android test: `height=1.05`, `yaw=0`, `pitch=-85`, `roll=0`, `x=0.3`, `y=0`, `z=0.5`. The new experimental arm pose still requires visual testing.
- No new animations, no change to camera or AR marker behavior. iOS bugs remain deferred.

## [2.8] — 2026-10-23

### Added
- **Electabuzz** GLB asset under `assets/models/electabuzz.glb` and a third Pokémon selection button for Lt. Surge alongside Raichu and Electrode.
- Initial **provisional** Electabuzz calibration controls and independent local settings: `height=1.05`, `yaw=0`, `pitch=-85`, `roll=0`, `x=0.3`, `y=0`, `z=0.5`. Values must be validated on a real phone and marker.
- Electabuzz model attribution: ["Electabuzz" by nguyenlouis32](https://skfb.ly/ouHEN), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

### Maintained
- Existing Magmar, Raichu and Electrode defaults and mobile-camera settings are unchanged.
- HIRO remains the test marker; QR-as-marker design, iOS compatibility issues and multilingüe remain on the backlog.

## [2.7] — 2026-10-23

### Confirmed
- Verified **Electrode** in the HIRO marker experience with `height=1.05`, `yaw=0`, `pitch=-85`, `roll=0`, `x=0.3`, `y=0`, `z=0.5`. These values were already the V2.5 default; this release confirms them and updates the source comment, with **no behavior change**.

### Updated
- Clarified that **Johán Hernandez Molina and Aldo Palmieri both participate in cosplay design and physical production**.
- Documented AI-assisted development transparently in the repository and public credits.
- Added `docs/KNOWN_ISSUES.md` for deferred iOS compatibility investigations (UI color/contrast, 3D orientation, sensor permissions, camera tracking comparisons).

### Unchanged
- No changes to camera framing, rendering logic, model assets, or final QR/AR marker implementation. HIRO remains the test marker.

## [2.6] — 2026-10-23

### Added
- Creator credits for **Johán Hernandez Molina and Aldo Palmieri (Jageekystuff)** on the public credits page.
- Root `README.md` describing the project, how to test/deploy it, contributor credits, and the roadmap.
- This `CHANGELOG.md` and a root `VERSION` file to track revisions consistently.
- Navigation from the Blaine experience to the public credits page.

### Unchanged
- No changes to AR engine code, mobile camera configuration, or `.glb` models.
- Magmar, Raichu and Electrode remain as in v2.5; Electrode still requires calibration.

## [2.5] — 2026-10-22

- Added the Electrode `.glb` model and a selection option under Lt. Surge.
- Added the original model creator's CC BY 4.0 attribution on `/credits/`.
- Kept Raichu as Lt. Surge's default; Electabuzz is still planned.
- Reference commit: [`c8a4e2e`](https://github.com/jageekystuff/jageekystuff-interactive/commit/c8a4e2e782f2766ddd7ba39c1b24613c846da6af).

## [2.4] — 2026-10-22

- Continued the default AR calibration work for Magmar and Raichu following on-device tests.
- Packaged both calibrated trainer presets for the existing HIRO marker demonstration.

## [2.3] — 2026-10-21

- Set Magmar's on-device-tested orientation, size, and position as its default AR configuration.
- Reference commit: [`14bf2ff`](https://github.com/jageekystuff/jageekystuff-interactive/commit/14bf2ff61a58df0d44ad77595e2cc5f8da2ff487).

## [2.2] — 2026-10-21

- Improved smartphone viewport behavior, button positioning, and vertical camera framing.
- Added diagnostic options for mobile video/rendering issues.
- Reference commit: [`e84dca0`](https://github.com/jageekystuff/jageekystuff-interactive/commit/e84dca0d147908f764abc843b50b98b2993b627d).

## [2.1] — 2026-10-21

- Fixed the 3D calibration overlay so its controls are visible above the mobile AR scene.
- Reference commit: [`05970a8`](https://github.com/jageekystuff/jageekystuff-interactive/commit/05970a87d6436fffdf4ca72f699623691ca12c63).

## [2.0] — 2026-10-20

- Added automatic 3D model scale normalization and live position/rotation calibration controls.
- Reference commit: [`0c1e2be`](https://github.com/jageekystuff/jageekystuff-interactive/commit/0c1e2be9cb0b3858c3c63005e71aff114fbdc597).

## Earlier prototypes — 2026-10-20

- Published the first website and AR.js/HIRO marker proof of concept on Cloudflare Pages.
- Fixed mobile loading so a failed AR library request would not leave a blank screen.
- Added Magmar and Raichu models to replace temporary 3D geometric placeholders.
- Reference commits: [`2c227f2`](https://github.com/jageekystuff/jageekystuff-interactive/commit/2c227f27ceb0968f9cc7a2ee83885f1db17eaccc), [`205ca92`](https://github.com/jageekystuff/jageekystuff-interactive/commit/205ca92ac4b24344d2beb1d35e1fdc8e46680a1d).
