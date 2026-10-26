/* Pokémon-specific presentation only. Tracking, loading and calibration belong to core/. */
(async function () {
  'use strict';

  const uiLayer = document.getElementById('ar-ui-layer');
  const status = document.getElementById('ar-status');
  const info = document.getElementById('model-info');
  const bootStatus = document.getElementById('boot-status');
  const startScreen = document.getElementById('start');
  const launchButton = document.getElementById('launch');
  const trainerButtons = document.getElementById('trainer-options');
  const modelButtons = document.getElementById('model-options');
  const toggleAdjustments = document.getElementById('open-adjustments');
  const adjustmentPanel = document.getElementById('ar-adjustments');
  const inputs = [...document.querySelectorAll('[data-adjust]')];
  const adjustmentsFeedback = document.getElementById('adjust-feedback');
  const cameraDiagnostics = document.getElementById('camera-diagnostics');
  const cameraFeedback = document.getElementById('camera-feedback');
  const normalCameraButton = document.getElementById('camera-normal');
  const wideCameraButton = document.getElementById('camera-wide');
  const params = new URLSearchParams(window.location.search);
  const useHiro = params.get('marker') === 'hiro';

  // AR.js creates fullscreen camera elements with their own stacking contexts.
  // Keep all interactive controls together in a separate topmost mobile layer.
  [document.querySelector('.ar-header'), document.querySelector('.ar-bottom'),
    toggleAdjustments, adjustmentPanel, startScreen].forEach((element) => {
    if (element) uiLayer.appendChild(element);
  });

  function setStatus(message) {
    status.textContent = message;
  }

  function setInfo(message) {
    info.textContent = message;
  }

  try {
    const [shared, experience] = await Promise.all([
      window.JageekystuffConfig.load(),
      fetch('/experiences/pokemon/v3/experience.json?v=3.0', { cache: 'no-store' })
        .then((response) => {
          if (!response.ok) throw new Error('Experience configuration unavailable');
          return response.json();
        }),
    ]);
    if (!shared) throw new Error('Shared calibration configuration unavailable');

    let activeTrainer = experience.defaultTrainer;
    let activeModel = experience.trainers[activeTrainer].pokemon[0];
    let busy = false;
    const activeModelByTrainer = {};
    const storagePrefix = 'jageekystuff-v3-unified-card-';
    const settingsByModel = {};
    const settingKeys = ['heightCm', 'yaw', 'pitch', 'roll', 'x', 'y', 'z'];

    function profileFor(modelId) {
      const entry = shared.models[modelId];
      const initial = entry.profiles[experience.markerProfile];
      const fallback = { ...initial };
      try {
        const local = JSON.parse(localStorage.getItem(storagePrefix + modelId) || '{}');
        for (const key of settingKeys) {
          if (Number.isFinite(Number(local[key])) && local[key] !== null) {
            fallback[key] = Number(local[key]);
          }
        }
      } catch {
        // Storage is optional; the committed JSON is the authoritative fallback.
      }
      return fallback;
    }

    for (const modelId of Object.keys(shared.models)) {
      settingsByModel[modelId] = profileFor(modelId);
    }

    const engine = window.JageekystuffAR.create({
      host: document.getElementById('scene-host'),
      onStatus: setStatus,
      onInfo: setInfo,
      onCameraInfo: (details) => {
        cameraDiagnostics.textContent = JSON.stringify(details, null, 2);
      },
      hiro: useHiro,
      markerUrl: shared.referenceMarker.pattern,
      markerWidthCm: useHiro ? 19 : shared.referenceMarker.widthCm,
      patternRatio: shared.referenceMarker.patternRatio,
    });

    function refreshAdjustments() {
      const settings = settingsByModel[activeModel];
      for (const input of inputs) {
        const key = input.dataset.adjust;
        input.value = String(settings[key]);
        const output = document.querySelector(`[data-out="${key}"]`);
        if (output) output.textContent = Number(settings[key]).toFixed(
          ['heightCm', 'yaw', 'pitch', 'roll'].includes(key) ? 0 : 2,
        );
      }
      adjustmentsFeedback.textContent = 'Testing values stay on this device. Copy them to approve a calibration.';
    }

    function renderButtons() {
      trainerButtons.replaceChildren();
      for (const [id, trainer] of Object.entries(experience.trainers)) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = trainer.label;
        button.dataset.trainer = id;
        button.setAttribute('aria-pressed', String(activeTrainer === id));
        button.addEventListener('click', () => {
          if (activeTrainer === id) return;
          activeModelByTrainer[activeTrainer] = activeModel;
          activeTrainer = id;
          activeModel = activeModelByTrainer[id] || trainer.pokemon[0];
          renderButtons();
          showCurrentModel();
        });
        trainerButtons.appendChild(button);
      }

      modelButtons.replaceChildren();
      for (const id of experience.trainers[activeTrainer].pokemon) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = shared.models[id].label;
        button.dataset.model = id;
        button.setAttribute('aria-pressed', String(activeModel === id));
        button.addEventListener('click', () => {
          if (activeModel === id) return;
          activeModel = id;
          activeModelByTrainer[activeTrainer] = id;
          renderButtons();
          showCurrentModel();
        });
        modelButtons.appendChild(button);
      }
    }

    function showCurrentModel() {
      const model = shared.models[activeModel];
      refreshAdjustments();
      document.getElementById('current-selection').textContent =
        `${experience.trainers[activeTrainer].label} · ${model.label}`;
      engine.select(model.file, model.label, settingsByModel[activeModel]);
    }

    renderButtons();
    showCurrentModel();

    function changeFraming(mode) {
      engine.setFramingMode(mode);
      normalCameraButton.setAttribute('aria-pressed', String(mode === 'normal'));
      wideCameraButton.setAttribute('aria-pressed', String(mode === 'wide'));
      cameraFeedback.textContent = mode === 'wide' ?
        'Experimental wide view enabled. Check that the Pokémon stays attached to the QR.' :
        'Normal AR.js framing restored.';
    }

    normalCameraButton.addEventListener('click', () => changeFraming('normal'));
    wideCameraButton.addEventListener('click', () => changeFraming('wide'));
    document.getElementById('camera-one-x').addEventListener('click', async () => {
      const applied = await engine.requestOneX();
      cameraFeedback.textContent = applied ?
        '1× requested; compare with the camera app. Check the zoom value below.' :
        'Zoom controls are not exposed by this browser.';
    });
    document.getElementById('copy-camera-diagnostics').addEventListener('click', async () => {
      const text = JSON.stringify(engine.getCameraDiagnostics(), null, 2);
      try {
        await navigator.clipboard.writeText(text);
        cameraFeedback.textContent = 'Camera diagnostics copied.';
      } catch {
        cameraFeedback.textContent = 'Clipboard blocked. The values are visible above.';
      }
    });

    for (const input of inputs) {
      input.addEventListener('input', () => {
        const key = input.dataset.adjust;
        settingsByModel[activeModel][key] = Number(input.value);
        refreshAdjustments();
        try {
          localStorage.setItem(storagePrefix + activeModel,
            JSON.stringify(settingsByModel[activeModel]));
        } catch {
          // Preview works even if storage is disabled.
        }
        engine.updateSettings(settingsByModel[activeModel]);
      });
    }

    toggleAdjustments.addEventListener('click', () => {
      adjustmentPanel.classList.toggle('hidden');
      toggleAdjustments.setAttribute('aria-expanded',
        String(!adjustmentPanel.classList.contains('hidden')));
    });
    document.getElementById('close-adjustments').addEventListener('click', () => {
      adjustmentPanel.classList.add('hidden');
      toggleAdjustments.setAttribute('aria-expanded', 'false');
    });
    document.getElementById('reset-adjustments').addEventListener('click', () => {
      settingsByModel[activeModel] = {
        ...shared.models[activeModel].profiles[experience.markerProfile],
      };
      try { localStorage.removeItem(storagePrefix + activeModel); } catch { /* optional */ }
      refreshAdjustments();
      engine.updateSettings(settingsByModel[activeModel]);
    });
    document.getElementById('copy-adjustments').addEventListener('click', async () => {
      const data = JSON.stringify({
        model: activeModel,
        profile: experience.markerProfile,
        ...settingsByModel[activeModel],
      }, null, 2);
      try {
        await navigator.clipboard.writeText(data);
        adjustmentsFeedback.textContent = 'Calibration copied; send the JSON after your AR test.';
      } catch {
        adjustmentsFeedback.textContent = 'Copy blocked. Use these values: ' + data.replace(/\s+/g, ' ');
      }
    });

    launchButton.addEventListener('click', async () => {
      if (busy) return;
      busy = true;
      launchButton.disabled = true;
      launchButton.textContent = 'Starting camera…';
      bootStatus.textContent = 'Loading the AR engine and camera…';
      try {
        if (!window.isSecureContext) throw new Error('Please use HTTPS');
        await engine.start();
        startScreen.classList.add('hidden');
      } catch (error) {
        bootStatus.textContent = `Unable to start AR: ${error.message}. Check permissions and connection.`;
        setStatus('AR unavailable');
        launchButton.textContent = 'Retry camera';
        launchButton.disabled = false;
      } finally {
        busy = false;
      }
    });
  } catch (error) {
    bootStatus.textContent = `Configuration could not load: ${error.message}`;
    launchButton.disabled = true;
    setStatus('Configuration unavailable');
  }
})();
