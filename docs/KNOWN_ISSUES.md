# Known Issues — Jageekystuff Interactive

Open testing notes. **Not yet fixed.** No iOS issue below is confirmed as a Safari/WebKit defect; perspective, lighting, sensor permission and rendering differences must be distinguished by reproducing under controlled conditions.

## iOS compatibility — deferred until core models are complete

| ID | Observation | Follow-up test |
| --- | --- | --- |
| IOS-01 | Confirmed: A-Frame motion-sensor permission popup was white-on-white on iPhone Chrome. V3.0-hfx-6 disables this optional popup for marker tracking. | **Needs device verification** on iPhone after deployment; camera permission must still work. |
| IOS-02 | Observed: Magmar appears upside-down in AR/photo when iPhone views the QR marker from a laptop/monitor. | **Deferred** for event. Printed card is the target; do not alter Pokémon default rotations to compensate for a screen-mounted, rotated marker. |
| IOS-03 | A-Frame requested an extra device-motion/orientation permission in iOS marker AR. | V3.0-hfx-6 disables the redundant A-Frame dialog. Verify marker tracking on printed card; do not disable native camera permission. |
| IOS-04 | Marker tracking and camera framing may differ between Android Chrome and iOS Safari. | Test on printed marker at fixed distance/angle under constant lighting. Record device/browser version and screenshots. |

These are **backlog items**, not verified diagnoses. Do not change working Android behavior merely to address an unconfirmed iOS hypothesis.

## Remaining core tasks

- The **four approved models** (Magmar, Arcanine, Raichu, Electrode) remain usable on Android with the temporary HIRO marker.
- Electabuzz and Rapidash did not meet the visual standard; they are removed from the active web app, not scheduled as blockers for launch.
- Create and validate combined QR/AR markers at physical cosplay-card size.
- Test camera and marker layout on iOS/Safari, then prepare usable public photo flow.
- Add Italian (default), English and Spanish after the core AR interaction is reliable.

## V3.0 validation tasks

- Confirm unified QR printed at 19 x 19 cm remains detectable at 100–200 cm against a light matte background.
- Verify post-rotation model centering, physical dimensions, depth and offsets on the actual 80 x 120 cm card.
- Confirm trainer/model switching does not restart or freeze the camera.
- Re-test iPhone Safari camera framing, sensor permissions, colors and model orientation.
- No integrated photo capture yet; it remains deferred until tracking is reliable.

## CAM-01 — Mobile camera appears more zoomed than native 1× (V3)

- Status: **under test** in `3.0-hfx-2` (after v3.0-hfx-1 exposed mismatched video/canvas rectangles).
- Android screen recordings vs native 1× photos suggest a narrower field of view. Root causes may include video `cover` cropping, video-track zoom or different device camera selection; not yet isolated.
- v3.0-hfx-2 uses a common aspect-matched video/WebGL stage; legacy fullscreen is the fallback. Verify that diagnostics report `layersAligned: true` on Xiaomi and that the Pokémon stays attached to the printed marker.
- Test at 100 and 200 cm, verify marker alignment in aligned mode, and copy the diagnostic JSON. Oversized Pokémon are a separate calibration issue.
- Keep 3D physical-size calibration separate; the model sizes are still provisional.
