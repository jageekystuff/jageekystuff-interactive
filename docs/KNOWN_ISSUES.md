# Known Issues — Jageekystuff Interactive

Open testing notes. **Not yet fixed.** No iOS issue below is confirmed as a Safari/WebKit defect; perspective, lighting, sensor permission and rendering differences must be distinguished by reproducing under controlled conditions.

## iOS compatibility — deferred until core models are complete

| ID | Observation | Follow-up test |
| --- | --- | --- |
| IOS-01 | iPhone UI colors and contrast reportedly differ from Android; the motion-sensor permission overlay may have low text contrast. | Compare with identical URL, iOS and Safari versions, and light/dark settings. Inspect CSS/computed colors. |
| IOS-02 | Magmar/Raichu may face different directions on iPhone when viewing a marker displayed on another phone. | Match camera and marker pose across devices, check whether the issue is perspective or model transform/tracking. |
| IOS-03 | Browser prompts for device motion/orientation permissions. | Confirm which sensors are required for the current marker-tracked AR mode and whether the prompt can be avoided safely. |
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
