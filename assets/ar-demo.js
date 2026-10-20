/* Jageekystuff AR proof of concept — geometric placeholders only. */
(function(){
  'use strict';
  const start=document.getElementById('start');
  const launch=document.getElementById('launch');
  const sceneHost=document.getElementById('scene-host');
  const status=document.getElementById('ar-status');
  const choiceButtons=Array.from(document.querySelectorAll('[data-pokemon]'));
  const trainer=document.body.dataset.trainer;
  let current=trainer==='surge'?'raichu':'magmar';
  let marker=null;
  const setStatus=(label)=>{status.textContent=label;};
  function buildScene(){
    sceneHost.innerHTML = `<a-scene embedded vr-mode-ui="enabled: false" renderer="antialias: true; alpha: true" arjs="sourceType: webcam; debugUIEnabled: false; trackingMethod: best; detectionMode: mono;" loading-screen="enabled: false">
      <a-marker id="demo-marker" preset="hiro" emitevents="true" smooth="true" smoothCount="5" smoothTolerance="0.01" smoothThreshold="2">
        <a-entity id="effect" position="1.65 0.7 0" scale="1 1 1"></a-entity>
      </a-marker>
      <a-entity camera></a-entity>
    </a-scene>`;
    marker=document.getElementById('demo-marker');
    marker.addEventListener('markerFound',()=>setStatus('✓ Marker detected · AR active'));
    marker.addEventListener('markerLost',()=>setStatus('Aim at the HIRO marker'));
    setEffect(current);
  }
  function setEffect(name){
    current=name;
    choiceButtons.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.pokemon===name)));
    const root=document.getElementById('effect');
    if(!root)return;
    const effects={
      magmar:`<a-sphere radius=".36" color="#ff7245" material="metalness:.16;roughness:.5" animation="property: position;to:0 .18 0;dir:alternate;loop:true;dur:1100"></a-sphere><a-cone position="0 .56 0" radius-bottom=".29" radius-top="0" height=".73" color="#ffd060" animation="property: rotation;to:0 360 0;loop:true;dur:2900;easing:linear"></a-cone>`,
      arcanine:`<a-icosahedron radius=".43" detail="1" color="#ffc48e" animation="property: rotation;to:0 360 0;loop:true;dur:5400;easing:linear"></a-icosahedron><a-torus radius=".64" radius-tubular=".025" color="#f18b44" rotation="90 0 0" animation="property: rotation;to:90 360 0;loop:true;dur:3500;easing:linear"></a-torus>`,
      raichu:`<a-sphere radius=".36" color="#ffd961" animation="property: rotation;to:0 360 0;loop:true;dur:4500;easing:linear"></a-sphere><a-octahedron position="0 .53 0" radius=".27" color="#fff5ab" animation="property: rotation;to:0 360 0;loop:true;dur:1800;easing:linear"></a-octahedron>`
    };
    root.innerHTML=effects[name]||effects.magmar;
  }
  choiceButtons.forEach(btn=>btn.addEventListener('click',()=>setEffect(btn.dataset.pokemon)));
  launch.addEventListener('click',()=>{
    if(!window.AFRAME){setStatus('Libraries unavailable. Check internet.');alert('The AR libraries could not load. Check your internet connection and try again.');return;}
    start.classList.add('hidden');
    buildScene();
  });
})();
