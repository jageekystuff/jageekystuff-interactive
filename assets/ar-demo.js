/* Jageekystuff Interactive — AR model calibration prototype.
   Both uploaded GLB files stay unchanged; dimensions are normalized at runtime.
   AR.js marker tracking remains the previously validated HIRO setup. */
(function () {
  'use strict';

  const start = document.getElementById('start');
  const launch = document.getElementById('launch');
  const sceneHost = document.getElementById('scene-host');
  const status = document.getElementById('ar-status');
  const bootStatus = document.getElementById('boot-status');
  const choiceButtons = Array.from(document.querySelectorAll('[data-pokemon]'));
  const trainer = document.body.dataset.trainer;
  const toggle = document.getElementById('open-adjustments');
  const panel = document.getElementById('ar-adjustments');
  const close = document.getElementById('close-adjustments');
  const controls = Array.from(document.querySelectorAll('[data-adjust]'));
  const copyButton = document.getElementById('copy-adjustments');
  const resetButton = document.getElementById('reset-adjustments');
  const feedback = document.getElementById('adjust-feedback');
  const info = document.getElementById('model-info');

  // Portal UI: AR.js may attach fullscreen elements with an elevated stacking
  // context. Put controls as direct body descendants in a dedicated top layer.
  const uiLayer = document.getElementById('ar-ui-layer');
  if (uiLayer) {
    [document.querySelector('.ar-header'), document.querySelector('.ar-bottom'),
      toggle, panel, start].forEach(el => { if (el) uiLayer.appendChild(el); });
  }

  const models = {
    magmar: '/assets/models/magmar.glb',
    raichu: '/assets/models/raichu.glb'
  };
  // Height is the height of the character in units relative to the HIRO marker.
  // Initial rotations are intentionally conservative; tune from your phone.
  const defaults = {
    magmar: { height: 1.3, yaw: 0, pitch: 0, roll: 0, x: 1.55, y: 0.18, z: 0 },
    arcanine: { height: 1.3, yaw: 0, pitch: 0, roll: 0, x: 1.55, y: 0.18, z: 0 },
    raichu: { height: 1.05, yaw: 0, pitch: 0, roll: 0, x: 1.55, y: 0.18, z: 0 }
  };
  let current = trainer === 'surge' ? 'raichu' : 'magmar';
  let busy = false;
  let marker = null;
  let generation = 0;
  let realHeight = null;
  let sizeInfo = '';

  function getSettings(name) {
    const base = defaults[name] || defaults.magmar;
    try {
      const stored = JSON.parse(localStorage.getItem('jageekystuff-calibration-' + name) || '{}');
      return Object.fromEntries(Object.keys(base).map(key => [key,
        Number.isFinite(Number(stored[key])) ? Number(stored[key]) : base[key]
      ]));
    } catch { return { ...base }; }
  }
  const settings = { magmar: getSettings('magmar'), arcanine: getSettings('arcanine'), raichu: getSettings('raichu') };
  const setStatus = txt => { status.textContent = txt; };
  const setBootStatus = txt => { bootStatus.textContent = txt; };
  const degrees = d => d * Math.PI / 180;

  function loadScript(url, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      let done = false;
      const timeout = setTimeout(() => finish(new Error('Loading the library timed out.')), timeoutMs);
      function finish(error) {
        if (done) return;
        done = true;
        clearTimeout(timeout);
        script.onload = null;
        script.onerror = null;
        if (error) { script.remove(); reject(error); }
        else resolve();
      }
      script.onload = () => finish();
      script.onerror = () => finish(new Error('A library could not be downloaded.'));
      document.head.appendChild(script);
    });
  }

  async function loadFirstAvailable(label, urls, isLoaded) {
    if (isLoaded()) return;
    let previousError;
    for (const url of urls) {
      try {
        await loadScript(url);
        if (!isLoaded()) throw new Error('Library downloaded but failed to initialize.');
        return;
      } catch (error) { previousError = error; }
    }
    throw new Error(label + ': ' + (previousError?.message || 'unavailable'));
  }

  function storeCurrent() {
    try { localStorage.setItem('jageekystuff-calibration-' + current, JSON.stringify(settings[current])); }
    catch { /* Browsers blocking local storage can still use the sliders. */ }
  }

  function refreshControls() {
    const selected = settings[current] || defaults.magmar;
    controls.forEach(control => {
      const key = control.dataset.adjust;
      control.value = String(selected[key]);
      const output = document.querySelector('[data-out="' + key + '"]');
      if (output) output.textContent = selected[key].toFixed(key === 'height' || key === 'x' || key === 'y' || key === 'z' ? 2 : 0);
    });
    if (feedback) feedback.textContent = 'Adjustments are saved on this device for testing.';
  }

  function applyPlacement() {
    const settingsForModel = settings[current] || defaults.magmar;
    const placement = document.getElementById('model-placement');
    if (!placement) return;
    placement.object3D.position.set(settingsForModel.x, settingsForModel.y, settingsForModel.z);
    placement.object3D.rotation.set(degrees(settingsForModel.pitch), degrees(settingsForModel.yaw), degrees(settingsForModel.roll), 'YXZ');
    const object = document.getElementById('pokemon-object');
    if (object && Number.isFinite(realHeight) && realHeight > 0) {
      // Re-fit the model to its target height when the slider moves.
      const model = object.getObject3D('mesh');
      if (model) {
        const normalizedScale = settingsForModel.height / realHeight;
        model.scale.setScalar(normalizedScale);
        const bbox = object.__baseBoundingBox;
        if (bbox) {
          model.position.set(-bbox.centerX * normalizedScale,
            -bbox.minY * normalizedScale,
            -bbox.centerZ * normalizedScale);
        }
      }
    }
  }

  // Measure model in its own coordinates, not in marker/world coordinates.
  // Important: original Magmar model is about 188 units high; Raichu about 2.14.
  function measureLocalBounds(object3D) {
    const THREE = window.AFRAME.THREE;
    const temp = object3D.clone(true);
    temp.position.set(0, 0, 0);
    temp.rotation.set(0, 0, 0);
    temp.scale.set(1, 1, 1);
    temp.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(temp);
    if (bounds.isEmpty()) throw new Error('No geometry found in GLB.');
    const center = bounds.getCenter(new THREE.Vector3());
    return { height: bounds.max.y - bounds.min.y, centerX: center.x, minY: bounds.min.y, centerZ: center.z };
  }

  function loadModel(name) {
    const root = document.getElementById('model-placement');
    if (!root) return;
    generation += 1;
    const request = generation;
    realHeight = null;
    sizeInfo = '';
    root.innerHTML = '';
    if (!models[name]) {
      setStatus('Arcanine model not added yet');
      info.textContent = 'Arcanine is not available yet. Choose Magmar for the 3D test.';
      const placeholder = document.createElement('a-entity');
      placeholder.innerHTML = '<a-icosahedron radius="0.38" position="0 0.38 0" color="#ffbd77"></a-icosahedron>';
      root.appendChild(placeholder);
      applyPlacement();
      return;
    }
    info.textContent = 'Loading ' + name + ' model…';
    const el = document.createElement('a-entity');
    el.id = 'pokemon-object';
    el.setAttribute('gltf-model', 'url(' + models[name] + ')');
    el.addEventListener('model-loaded', (evt) => {
      if (request !== generation) return;
      try {
        const modelObject = evt.detail.model || el.getObject3D('mesh');
        const bounds = measureLocalBounds(modelObject);
        if (bounds.height < 0.00001 || !Number.isFinite(bounds.height)) {
          throw new Error('Model height is invalid.');
        }
        realHeight = bounds.height;
        el.__baseBoundingBox = bounds;
        const targetHeight = settings[name].height;
        const factor = targetHeight / realHeight;
        sizeInfo = name.charAt(0).toUpperCase() + name.slice(1) + ': ' + realHeight.toFixed(2) + ' → ' + targetHeight.toFixed(2) + ' marker units';
        info.textContent = sizeInfo;
        applyPlacement();
        setStatus(marker?.object3D?.visible ? '✓ Marker found · ' + name + ' ready' : name + ' loaded · Aim at HIRO');
      } catch (error) {
        info.textContent = 'Model fit failed: ' + error.message;
        setStatus('3D model adjustment failed');
      }
    });
    el.addEventListener('model-error', () => {
      if (request !== generation) return;
      info.textContent = 'Could not load ' + name + '.glb. Verify the file exists on Cloudflare.';
      setStatus('3D model could not be loaded');
    });
    root.appendChild(el);
    applyPlacement();
  }

  function selectPokemon(name) {
    current = name;
    choiceButtons.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.pokemon === name)));
    refreshControls();
    loadModel(name);
  }

  function buildScene() {
    sceneHost.innerHTML = `<a-scene embedded vr-mode-ui="enabled: false" renderer="antialias: true; alpha: true; colorManagement: true" arjs="sourceType: webcam; debugUIEnabled: false; trackingMethod: best; detectionMode: mono;" loading-screen="enabled: false">
      <a-marker id="demo-marker" preset="hiro" emitevents="true" smooth="true" smoothCount="5" smoothTolerance="0.01" smoothThreshold="2">
        <a-entity id="model-placement" position="1.55 0.18 0"></a-entity>
      </a-marker>
      <a-light type="ambient" color="#ffffff" intensity="1.5"></a-light>
      <a-light type="directional" color="#ffffff" intensity="1.2" position="-1 2 2"></a-light>
      <a-entity camera></a-entity>
    </a-scene>`;
    marker = document.getElementById('demo-marker');
    marker.addEventListener('markerFound', () => setStatus(realHeight ? '✓ Marker found · ' + current + ' ready' : '✓ Marker found · Loading model…'));
    marker.addEventListener('markerLost', () => setStatus('Aim at the HIRO marker'));
    setStatus('Starting camera… Aim at HIRO');
    selectPokemon(current);
  }

  choiceButtons.forEach(btn => btn.addEventListener('click', () => selectPokemon(btn.dataset.pokemon)));
  controls.forEach(control => control.addEventListener('input', () => {
    const key = control.dataset.adjust;
    settings[current][key] = Number(control.value);
    refreshControls();
    storeCurrent();
    applyPlacement();
    if (key === 'height' && realHeight) {
      info.textContent = current + ': ' + realHeight.toFixed(2) + ' → ' + settings[current].height.toFixed(2) + ' marker units';
    }
  }));
  toggle.addEventListener('click', () => {
    panel.classList.toggle('hidden');
    toggle.setAttribute('aria-expanded', String(!panel.classList.contains('hidden')));
  });
  close.addEventListener('click', () => {
    panel.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
  });
  resetButton.addEventListener('click', () => {
    settings[current] = { ...(defaults[current] || defaults.magmar) };
    storeCurrent();
    refreshControls();
    applyPlacement();
  });
  copyButton.addEventListener('click', async () => {
    const value = JSON.stringify({ pokemon: current, ...settings[current] }, null, 2);
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(value);
      feedback.textContent = 'Settings copied. Paste them into the chat with your screenshot.';
    } catch {
      feedback.textContent = 'Clipboard blocked. Take a screenshot of these values: ' + value.replace(/\s+/g, ' ');
    }
  });
  refreshControls();

  launch.addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    launch.disabled = true;
    launch.textContent = 'Loading AR…';
    setBootStatus('Loading camera components…');
    try {
      if (!window.isSecureContext) throw new Error('Please open this page through HTTPS.');
      await loadFirstAvailable('A-Frame', [
        'https://aframe.io/releases/1.6.0/aframe.min.js',
        'https://cdn.jsdelivr.net/npm/aframe@1.6.0/dist/aframe-master.min.js'
      ], () => Boolean(window.AFRAME));
      setBootStatus('A-Frame ready. Loading marker recognition…');
      await loadFirstAvailable('AR.js', [
        'https://raw.githack.com/AR-js-org/AR.js/3.4.8/aframe/build/aframe-ar.js',
        'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.8/aframe/build/aframe-ar.js'
      ], () => Boolean(window.AFRAME && (window.AFRAME.components?.arjs || window.AFRAME.systems?.arjs)));
      buildScene();
      start.classList.add('hidden');
    } catch (error) {
      setBootStatus('Could not start AR: ' + error.message + ' Try again with a stable connection.');
      setStatus('AR unavailable');
      launch.textContent = 'Retry AR camera';
      launch.disabled = false;
    } finally { busy = false; }
  });
})();
