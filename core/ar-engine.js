/* Framework-neutral AR session controller.
 * This module does NOT contain trainer or franchise names.
 * It receives the marker URL, model URL and calibration from an experience.
 */
(function () {
  'use strict';

  const radians = (angle) => (angle * Math.PI) / 180;

  function scriptLoader(url, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = url;
      let done = false;
      const timer = setTimeout(() => finish(new Error('Library timeout')), timeoutMs);

      function finish(error) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        script.onload = null;
        script.onerror = null;
        if (error) {
          script.remove();
          reject(error);
        } else {
          resolve();
        }
      }

      script.onload = () => finish();
      script.onerror = () => finish(new Error('Library download failed'));
      document.head.appendChild(script);
    });
  }

  async function ensureLibrary(label, urls, check) {
    if (check()) return;
    let lastError;
    for (const url of urls) {
      try {
        await scriptLoader(url);
        if (check()) return;
        throw new Error(`${label} did not initialize`);
      } catch (error) {
        lastError = error;
      }
    }
    throw new Error(`${label}: ${lastError?.message || 'not available'}`);
  }

  function create(options) {
    const { host, onStatus, onInfo } = options;
    let marker;
    let placement;
    let asset;
    let selected = null;
    let sceneReady = false;
    let modelRequest = 0;
    let cachedModel;
    let currentSettings;
    let markerVisible = false;
    let framingMode = 'aligned';
    let cameraNote = 'Waiting for camera video';
    let diagnosticsTimer;
    const savedTransforms = new WeakMap();

    // CAM-01: video and renderer must occupy EXACTLY the same rectangle.
    // In portrait, AR.js can present a landscape camera with a fullscreen
    // cover crop while the renderer uses a different aspect ratio. Shrinking
    // both existing elements with CSS transforms does not correct that mismatch.
    // The aligned mode instead gives A-Frame a viewport with the SAME aspect
    // ratio as the real video track. That makes the full captured picture
    // visible, with letterboxing where the device screen is taller.
    let lastRendererSize = '';
    let lastViewportSize = '';
    let listenersAdded = false;

    function videoElement() {
      return document.getElementById('arjs-video') ||
        [...document.querySelectorAll('video')].find((v) => v.srcObject && v.videoWidth);
    }

    function sceneElement() {
      return host.querySelector('a-scene');
    }

    function sceneCanvas() {
      return host.querySelector('canvas.a-canvas');
    }

    function rectOf(element) {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return {
        x: Math.round(rect.left),
        y: Math.round(rect.top),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    }

    function viewport() {
      // Match CSS fixed-position viewport coordinates (not device pixel ratio).
      return { width: window.innerWidth, height: window.innerHeight };
    }

    function sourceSize() {
      const video = videoElement();
      const track = video?.srcObject?.getVideoTracks?.()[0];
      const settings = track?.getSettings?.() || {};
      if (video?.videoWidth > 0 && video.videoHeight > 0) {
        return { width: video.videoWidth, height: video.videoHeight };
      }
      if (settings.width > 0 && settings.height > 0) {
        return { width: settings.width, height: settings.height };
      }
      return null;
    }

    function resetFraming() {
      document.body.classList.remove('ar-camera-aligned');
      document.body.style.removeProperty('--ar-frame-width');
      document.body.style.removeProperty('--ar-frame-height');
      document.body.style.removeProperty('--ar-frame-x');
      document.body.style.removeProperty('--ar-frame-y');
      lastRendererSize = '';
      lastViewportSize = '';
      const scene = sceneElement();
      if (scene?.renderer) {
        // Restore the canvas dimensions expected by the previous full-screen mode.
        scene.renderer.setSize(window.innerWidth, window.innerHeight, false);
      }
    }

    function applyFraming() {
      if (framingMode !== 'aligned') {
        if (document.body.classList.contains('ar-camera-aligned')) resetFraming();
        return;
      }

      const video = videoElement();
      const scene = sceneElement();
      const source = sourceSize();
      if (!video || !scene || !source) return;

      video.classList.add('jg-ar-feed');
      const screen = viewport();
      if (!(screen.width > 0 && screen.height > 0)) return;
      const scale = Math.min(screen.width / source.width, screen.height / source.height);
      const width = Math.round(source.width * scale);
      const height = Math.round(source.height * scale);
      const left = Math.round((screen.width - width) / 2);
      const top = Math.round((screen.height - height) / 2);
      const key = `${width}x${height}@${left},${top}`;

      if (lastViewportSize !== key || !document.body.classList.contains('ar-camera-aligned')) {
        document.body.style.setProperty('--ar-frame-width', `${width}px`);
        document.body.style.setProperty('--ar-frame-height', `${height}px`);
        document.body.style.setProperty('--ar-frame-x', `${left}px`);
        document.body.style.setProperty('--ar-frame-y', `${top}px`);
        document.body.classList.add('ar-camera-aligned');
        lastViewportSize = key;
      }

      // CSS alone would stretch a 392x736 drawing buffer into a 392x294 box.
      // Resize the renderer buffer, too, keeping model projection undistorted.
      if (scene.renderer) {
        const rendererSize = `${width}x${height}`;
        const canvas = sceneCanvas();
        const currentWidth = canvas?.width || 0;
        const currentHeight = canvas?.height || 0;
        const pixelRatio = scene.renderer.getPixelRatio?.() || 1;
        if (rendererSize !== lastRendererSize ||
            Math.abs(currentWidth - width * pixelRatio) > 3 ||
            Math.abs(currentHeight - height * pixelRatio) > 3) {
          scene.renderer.setSize(width, height, false);
          lastRendererSize = rendererSize;
        }
      }
    }

    function getCameraDiagnostics() {
      const video = videoElement();
      const canvas = sceneCanvas();
      const track = video?.srcObject?.getVideoTracks?.()[0];
      const settings = track?.getSettings?.() || {};
      const capabilities = track?.getCapabilities?.() || {};
      const source = sourceSize();
      const videoBox = rectOf(video);
      const canvasBox = rectOf(canvas);
      const difference = videoBox && canvasBox ? {
        x: Math.abs(videoBox.x - canvasBox.x),
        y: Math.abs(videoBox.y - canvasBox.y),
        width: Math.abs(videoBox.width - canvasBox.width),
        height: Math.abs(videoBox.height - canvasBox.height),
      } : null;
      const aligned = difference && Object.values(difference).every((v) => v <= 2);
      return {
        release: '3.0-hfx-2',
        framing: framingMode,
        modeExplanation: framingMode === 'aligned' ?
          'Full source camera image; video and 3D renderer use the same 4:3 rectangle.' :
          'Legacy AR.js fullscreen layout (may crop the camera image).',
        viewport: viewport(),
        videoPixels: source,
        videoBox,
        canvasBox,
        alignmentDifferencePx: difference,
        layersAligned: aligned,
        rendererBufferPixels: canvas ? { width: canvas.width, height: canvas.height } : null,
        track: {
          width: settings.width ?? null,
          height: settings.height ?? null,
          facingMode: settings.facingMode ?? null,
          zoom: settings.zoom ?? null,
          zoomCapabilities: capabilities.zoom ? {
            min: capabilities.zoom.min,
            max: capabilities.zoom.max,
            step: capabilities.zoom.step,
          } : null,
        },
        note: source ? 'Camera frame available' : 'Waiting for camera video',
      };
    }

    function reportCamera() {
      options.onCameraInfo?.(getCameraDiagnostics());
    }

    function startDiagnostics() {
      if (diagnosticsTimer) return;
      // The source starts asynchronously; keep the rect updated as its actual
      // dimensions become available. Avoid mutating AR.js marker parameters.
      diagnosticsTimer = window.setInterval(() => {
        applyFraming();
        reportCamera();
      }, 1500);
      if (!listenersAdded) {
        listenersAdded = true;
        window.addEventListener('resize', () => {
          window.requestAnimationFrame(() => { applyFraming(); reportCamera(); });
        });
        window.addEventListener('arjs-video-loaded', () => {
          window.setTimeout(() => { applyFraming(); reportCamera(); }, 250);
        });
        sceneElement()?.addEventListener('renderstart', () => {
          applyFraming();
          reportCamera();
        });
      }
      applyFraming();
      reportCamera();
    }

    function status(message) {
      onStatus?.(message);
    }

    function info(message) {
      onInfo?.(message);
    }

    function measuredModelBounds(model, settings) {
      const THREE = window.AFRAME.THREE;
      const copy = model.clone(true);
      copy.position.set(0, 0, 0);
      copy.rotation.set(0, 0, 0);
      copy.scale.set(1, 1, 1);
      copy.updateMatrixWorld(true);

      const original = new THREE.Box3().setFromObject(copy);
      if (original.isEmpty()) throw new Error('3D model has no geometry');
      const center = original.getCenter(new THREE.Vector3());
      copy.position.sub(center);

      const pivot = new THREE.Group();
      pivot.rotation.set(
        radians(settings.pitch),
        radians(settings.yaw),
        radians(settings.roll),
        'YXZ',
      );
      pivot.add(copy);
      pivot.updateMatrixWorld(true);
      const rotated = new THREE.Box3().setFromObject(pivot);
      const height = rotated.max.y - rotated.min.y;
      if (!(height > 0) || !Number.isFinite(height)) {
        throw new Error('Cannot calculate oriented model height');
      }
      return { center, orientedHeight: height, orientedMinY: rotated.min.y };
    }

    function applySettings() {
      if (!placement || !currentSettings) return;
      const s = currentSettings;
      const safe = (key, fallback = 0) => Number.isFinite(s[key]) ? s[key] : fallback;
      const pitch = safe('pitch');
      const yaw = safe('yaw');
      const roll = safe('roll');
      placement.object3D.rotation.set(radians(pitch), radians(yaw), radians(roll), 'YXZ');
      placement.object3D.position.set(safe('x'), safe('y'), safe('z'));

      if (!cachedModel || !asset) return;
      const metrics = measuredModelBounds(cachedModel, s);
      // One AR.js marker unit corresponds to approximately one marker width.
      // The target is measured AFTER rotation, unlike the legacy V2 calibration.
      const desiredUnits = Math.max(10, safe('heightCm', 70)) / options.markerWidthCm;
      const scale = desiredUnits / metrics.orientedHeight;
      cachedModel.scale.setScalar(scale);
      cachedModel.position.set(
        -metrics.center.x * scale,
        -metrics.center.y * scale,
        -metrics.center.z * scale,
      );
      placement.object3D.position.y += -metrics.orientedMinY * scale;
      info(`Target height: ${s.heightCm} cm (provisional; verify against the real card)`);
    }

    function loadModel() {
      if (!sceneReady || !selected) return;
      const request = ++modelRequest;
      cachedModel = null;
      asset?.remove();
      asset = document.createElement('a-entity');
      asset.id = 'active-ar-model';
      asset.setAttribute('gltf-model', `url(${selected.url})`);
      asset.addEventListener('model-loaded', (event) => {
        if (request !== modelRequest) return;
        try {
          cachedModel = event.detail.model || asset.getObject3D('mesh');
          applySettings();
          status(markerVisible ? `${selected.label} ready · marker found` : `${selected.label} ready · aim at marker`);
        } catch (error) {
          info(`Model geometry error: ${error.message}`);
          status('Model calibration failed');
        }
      });
      asset.addEventListener('model-error', () => {
        if (request !== modelRequest) return;
        status('3D model could not load');
        info(`Cannot load ${selected.url}`);
      });
      placement.appendChild(asset);
      info(`Loading ${selected.label}…`);
      status(`Loading ${selected.label}…`);
    }

    async function start() {
      await ensureLibrary('A-Frame', [
        'https://aframe.io/releases/1.6.0/aframe.min.js',
        'https://cdn.jsdelivr.net/npm/aframe@1.6.0/dist/aframe-master.min.js',
      ], () => Boolean(window.AFRAME));
      await ensureLibrary('AR.js', [
        'https://raw.githack.com/AR-js-org/AR.js/3.4.8/aframe/build/aframe-ar.js',
        'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.8/aframe/build/aframe-ar.js',
      ], () => Boolean(window.AFRAME?.components?.arjs || window.AFRAME?.systems?.arjs));

      // Request a standard landscape frame for predictable intrinsics;
      // actual source size is discovered from the returned video track.
      const width = 640;
      const height = 480;
      const pattern = options.hiro
        ? 'preset="hiro"'
        : `type="pattern" url="${options.markerUrl}"`;
      const ratio = options.hiro ? 0.5 : options.patternRatio;

      host.innerHTML = `<a-scene embedded vr-mode-ui="enabled: false"
        renderer="antialias: true; alpha: true; colorManagement: true"
        arjs="sourceType: webcam; sourceWidth: ${width}; sourceHeight: ${height};
          displayWidth: ${width}; displayHeight: ${height}; debugUIEnabled: false;
          trackingMethod: best; detectionMode: mono; patternRatio: ${ratio};"
        loading-screen="enabled: false">
          <a-marker id="unified-ar-marker" ${pattern} emitevents="true"
            smooth="true" smoothCount="5" smoothTolerance="0.01" smoothThreshold="2">
            <a-entity id="unified-model-placement"></a-entity>
          </a-marker>
          <a-light type="ambient" color="#fff" intensity="1.5"></a-light>
          <a-light type="directional" color="#fff" intensity="1.2" position="-1 2 2"></a-light>
          <a-entity camera></a-entity>
        </a-scene>`;
      marker = host.querySelector('#unified-ar-marker');
      placement = host.querySelector('#unified-model-placement');
      marker.addEventListener('markerFound', () => {
        markerVisible = true;
        status(selected ? `✓ Marker found · ${selected.label}` : '✓ Marker found');
      });
      marker.addEventListener('markerLost', () => {
        markerVisible = false;
        status('Aim at the printed marker');
      });
      sceneReady = true;
      loadModel();
      startDiagnostics();
      status('Camera starting · aim at marker');
    }

    function select(url, label, settings) {
      if (!url) throw new Error('Model URL is required');
      const changed = selected?.url !== url;
      selected = { url, label };
      currentSettings = settings;
      if (changed) loadModel();
      else applySettings();
    }

    return {
      start,
      select,
      setFramingMode(mode) {
        framingMode = mode === 'legacy' ? 'legacy' : 'aligned';
        if (framingMode === 'legacy') resetFraming();
        applyFraming();
        reportCamera();
      },
      getCameraDiagnostics,
      updateSettings(settings) {
        currentSettings = settings;
        applySettings();
      },
    };
  }

  window.JageekystuffAR = { create };
})();
