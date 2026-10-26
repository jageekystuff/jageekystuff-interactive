/* Shared configuration service for every Jageekystuff AR experience.
 * The same JSON file contains model metadata and version-specific profiles.
 */
(function () {
  'use strict';

  let currentRequest;

  async function load() {
    if (!currentRequest) {
      currentRequest = fetch('/assets/config/model-calibrations.json?v=3.0', {
        cache: 'no-store',
      })
        .then((response) => {
          if (!response.ok) throw new Error(`Calibration configuration: HTTP ${response.status}`);
          return response.json();
        })
        .then((data) => {
          if (!data.models || !data.referenceMarker) {
            throw new Error('Invalid model calibration configuration');
          }
          return data;
        })
        .catch((error) => {
          console.warn('Shared calibration unavailable:', error);
          currentRequest = null;
          return null;
        });
    }
    return currentRequest;
  }

  window.JageekystuffConfig = { load };
})();
