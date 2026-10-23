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

- Add and calibrate Electabuzz for Lt. Surge; Arcanine for Blaine.
- Create, test and print final combined QR/AR markers at physical card size.
- Add Italian (default), English and Spanish after core AR is reliable.
