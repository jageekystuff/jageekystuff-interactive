JAGEEKYSTUFF INTERACTIVE — 3D CALIBRATION TEST

1. Extract this ZIP and upload the INCLUDED FILES/FOLDERS (not ZIP itself) to your GitHub repo jageekystuff/jageekystuff-interactive, preserving paths. You can overwrite existing ones.
2. Commit on main. Cloudflare Pages deploys automatically after a successful build.
3. On the Xiaomi Chrome: open https://jageekystuff-interactive.pages.dev/pokemon/blaine/ and tap Start AR camera. Point it at a HIRO marker shown on your PC.
4. Magmar should appear with a roughly marker-sized body rather than giant geometry. Open "Adjust 3D" and move Turn / Tilt / Height controls until it faces the camera properly.
5. Tap Copy settings and send them in ChatGPT alongside a screenshot so we can save the final defaults in the code.
6. Repeat with /pokemon/surge/ for Raichu. Each Pokemon's temporary settings are stored separately on that device.
7. No change to HIRO marker yet. Do not print permanent QR codes until calibrated and tested with your printed cosplay card.

Technical note: Uploaded GLB meshes contain no intrinsic animations. The measurement runs in browser using a local bounding box around a clone of each model (THREE.Box3), so scaling is independent of original GLB units.

This is a prototype: test on the user's Xiaomi and another Android/iPhone before conventions. Official Pokemon models/assets are not bundled except the user's supplied GLB files. Ensure you are entitled to use these 3D models in a public fan site.
