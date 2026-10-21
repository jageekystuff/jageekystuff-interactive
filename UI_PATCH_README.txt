JAGEEKYSTUFF INTERACTIVE - v2.1 UI PATCH (Android Chrome)

This ZIP fixes the AR scene covering interface controls; it DOES NOT include model files.

Files to overwrite in your GitHub repo jageekystuff/jageekystuff-interactive:
- assets/styles.css
- assets/ar-demo.js
- pokemon/blaine/index.html
- pokemon/surge/index.html

How to apply:
1) Extract the ZIP.
2) GitHub repo -> Add file -> Upload files -> select/drag these four files, preserving folders.
3) Commit on main: Fix calibration overlay on Android.
4) Wait for Cloudflare Pages successful deployment.
5) Open Blaine in a new Chrome private tab. Start AR camera.
6) The yellow 'Ajustar 3D' button should be visible at the upper right.
7) If it is, open the panel. Try pitch/tilt = 180 degrees to right upside-down Magmar, then tune yaw and height. Send copied settings and screenshot.

Important: the uploaded GLB files remain in /assets/models/; do not remove them.
