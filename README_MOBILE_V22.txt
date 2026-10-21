JAGEEKYSTUFF INTERACTIVE V2.2 — MOBILE LAYOUT + PORTRAIT CAMERA

Changes from v2.1:
- Fixed mobile viewport for the HTML body, A-Frame scene host and UI controls.
- Calibration button/panel stay above the AR scene and inside mobile safe-area.
- AR.js camera requests 480x640 in portrait, 640x480 in landscape to reduce cropping.
- Does not stretch video/canvas separately, which could break AR marker alignment.
- Diagnostic overlay can be enabled with ?debug=1 on the AR page.

TO UPDATE GITHUB:
Replace these FOUR files in the existing public repository:
  assets/styles.css
  assets/ar-demo.js
  pokemon/blaine/index.html
  pokemon/surge/index.html
No need to re-upload the .glb models.

IMPORTANT: Not yet physically tested on user's Xiaomi. AR.js may still crop the camera if the hardware/browser camera source does not honor portrait hints. If you still see clipping, open /pokemon/blaine/?debug=1 and send a screenshot of the diagnostic overlay.
