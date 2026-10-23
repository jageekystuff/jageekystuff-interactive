# Changelog — Jageekystuff Interactive Experiences

Project release history, newest first. Each newly delivered revision increments the **minor version component by one** (`2.8 → 2.9 → 2.10`), not as a decimal fraction; a major release is a separate, intentional decision. These are project release labels rather than one version per Git commit.

The early version descriptions below are reconstructed from the prototypes and the Git commit history shared during development. Git remains the definitive record of individual file changes.

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
