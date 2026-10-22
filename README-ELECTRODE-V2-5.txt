JAGEEKYSTUFF INTERACTIVE — V2.5 ELECTRODE TEST
=============================================

THIS IS AN INCREMENTAL PATCH. Do not delete the other files already on GitHub.

Upload the contents of this ZIP to the ROOT of the existing GitHub repository
jageekystuff/jageekystuff-interactive (Add file > Upload files).
This adds or replaces only:

  assets/ar-demo.js                    (updates model list, leaves Magmar/Raichu calibration unchanged)
  assets/models/electrode.glb          (new 3D model; original file unchanged)
  pokemon/surge/index.html            (adds Electrode button and credit link)
  pokemon/blaine/index.html           (cache-busting JS reference only)
  credits/index.html                  (creator attribution and license)

DO NOT upload the ZIP itself. Extract it and upload the contained file tree.
Do not remove magmar.glb, raichu.glb or assets/styles.css from the repository.

Suggested commit: Add Electrode model and creator attribution

Once Cloudflare deploys, use:
  https://jageekystuff-interactive.pages.dev/pokemon/surge/

Test on Xiaomi with the SAME HIRO marker. Choose Electrode and use Ajustar 3D.
The default orientation for Electrode is only an initial guess, NOT calibrated.
Use Copy settings to share the adjusted JSON plus a screenshot for the next patch.
Raichu remains the default. Electabuzz is listed as coming soon, without a model.
No final QR marker is included: the app still uses HIRO for tests.

Attribution from Sketchfab:
"Electrode" (https://skfb.ly/ouFTG) by nguyenlouis32 is licensed under
Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).

License attribution is for this creator's 3D contribution; it does not
constitute a license from the Pokémon rights holders.
