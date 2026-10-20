/* Jageekystuff AR proof of concept — lazy-loaded AR libs and 3D Pokémon models. */
(function(){
  'use strict';
  const start = document.getElementById('start');
  const launch = document.getElementById('launch');
  const sceneHost = document.getElementById('scene-host');
  const status = document.getElementById('ar-status');
  const bootStatus = document.getElementById('boot-status');
  const choiceButtons = Array.from(document.querySelectorAll('[data-pokemon]'));
  const trainer = document.body.dataset.trainer;
  let current = trainer === 'surge' ? 'raichu' : 'magmar';
  let loading = false;
  let marker = null;

  const setStatus = label => { status.textContent = label; };
  const setBootStatus = label => { bootStatus.textContent = label; };

  function loadScript(url, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = url;
      el.async = true;
      let finished = false;
      const timer = setTimeout(() => finish(new Error('The library took too long to load.')), timeoutMs);
      function finish(error) {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        el.onload = null;
        el.onerror = null;
        if (error) { el.remove(); reject(error); }
        else resolve();
      }
      el.onload = () => finish();
      el.onerror = () => finish(new Error('Failed to download a library.'));
      document.head.appendChild(el);
    });
  }

  async function loadFirstAvailable(label, urls, alreadyLoaded) {
    if (alreadyLoaded()) return;
    let lastError;
    for (const url of urls) {
      try {
        await loadScript(url);
        if (!alreadyLoaded()) throw new Error('Library loaded but did not initialize.');
        return;
      } catch (error) {
        lastError = error;
      }
    }
    throw new Error(label + ': ' + (lastError?.message || 'could not be loaded'));
  }

  function pokemonMarkup(name) {
    const effects = {
      magmar: `
        <a-entity position="0 0 0" rotation="0 18 0" animation="property: position; to: 0 0.08 0; dir: alternate; loop: true; dur: 1600; easing: easeInOutSine">
          <a-gltf-model src="/assets/models/magmar.glb" scale="0.28 0.28 0.28"></a-gltf-model>
        </a-entity>
      `,
      arcanine: `
        <a-entity position="0 0.35 0" animation="property: rotation; to: 0 360 0; loop: true; dur: 4500; easing: linear">
          <a-icosahedron radius=".43" detail="1" color="#ffc48e"></a-icosahedron>
        </a-entity>
        <a-text value="Arcanine model soon" position="-0.6 -0.4 0" width="2.4" color="#fff7d1" align="center"></a-text>
      `,
      raichu: `
        <a-entity position="0 0 0" rotation="0 -16 0" animation="property: position; to: 0 0.08 0; dir: alternate; loop: true; dur: 1500; easing: easeInOutSine">
          <a-gltf-model src="/assets/models/raichu.glb" scale="0.42 0.42 0.42"></a-gltf-model>
        </a-entity>
      `
    };
    return effects[name] || effects.magmar;
  }

  function setEffect(name) {
    current = name;
    choiceButtons.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.pokemon === name)));
    const root = document.getElementById('effect');
    if (!root) return;
    root.innerHTML = pokemonMarkup(name);
  }

  function buildScene() {
    sceneHost.innerHTML = `<a-scene embedded vr-mode-ui="enabled: false" renderer="antialias: true; alpha: true; colorManagement: true" arjs="sourceType: webcam; debugUIEnabled: false; trackingMethod: best; detectionMode: mono;" loading-screen="enabled: false">
      <a-assets timeout="10000"></a-assets>
      <a-marker id="demo-marker" preset="hiro" emitevents="true" smooth="true" smoothCount="5" smoothTolerance="0.01" smoothThreshold="2">
        <a-entity id="effect" position="1.65 0.7 0" scale="1 1 1"></a-entity>
      </a-marker>
      <a-light type="ambient" color="#ffffff" intensity="1.4"></a-light>
      <a-light type="directional" color="#ffffff" intensity="1.0" position="1 2 1"></a-light>
      <a-entity camera></a-entity>
    </a-scene>`;
    marker = document.getElementById('demo-marker');
    marker.addEventListener('markerFound', () => setStatus('✓ Marker detected · AR active'));
    marker.addEventListener('markerLost', () => setStatus('Aim at the HIRO marker'));
    setEffect(current);
    setStatus('Starting camera… Aim at the HIRO marker');
  }

  choiceButtons.forEach(btn => btn.addEventListener('click', () => setEffect(btn.dataset.pokemon)));
  launch.addEventListener('click', async () => {
    if (loading) return;
    loading = true;
    launch.disabled = true;
    launch.textContent = 'Loading AR…';
    setBootStatus('Loading camera components. This can take a few seconds.');
    try {
      if (!window.isSecureContext) throw new Error('Open this site using HTTPS.');
      await loadFirstAvailable('A-Frame', [
        'https://aframe.io/releases/1.6.0/aframe.min.js',
        'https://cdn.jsdelivr.net/npm/aframe@1.6.0/dist/aframe-master.min.js'
      ], () => Boolean(window.AFRAME));
      setBootStatus('A-Frame loaded. Loading marker tracking…');
      await loadFirstAvailable('AR.js', [
        'https://raw.githack.com/AR-js-org/AR.js/3.4.8/aframe/build/aframe-ar.js',
        'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.8/aframe/build/aframe-ar.js'
      ], () => Boolean(window.AFRAME && (window.AFRAME.components?.arjs || window.AFRAME.systems?.arjs)));
      buildScene();
      start.classList.add('hidden');
    } catch (error) {
      setBootStatus('Could not start AR: ' + error.message + ' Check your connection and try again.');
      setStatus('AR unavailable');
      launch.textContent = 'Retry AR camera';
      launch.disabled = false;
    } finally {
      loading = false;
    }
  });
})();
