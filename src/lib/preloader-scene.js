import * as THREE from 'three';

const loader = document.getElementById('site-preloader');
if (loader && !loader.classList.contains('has-error')) {
  try { createCosmos(loader); } catch { /* The CSS sphere remains usable without WebGL. */ }
}

function createCosmos(loader) {
  const canvas = loader.querySelector('canvas');
  const button = loader.querySelector('.site-preloader__sphere');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2000);
  camera.position.z = 1000;
  const globe = new THREE.Group();
  const rotation = new THREE.Group();
  globe.add(rotation);
  scene.add(globe);
  scene.add(new THREE.AmbientLight(0x389ac4, 1.6));
  const light = new THREE.DirectionalLight(0x99f2ff, 3);
  light.position.set(-400, 500, 700);
  scene.add(light);

  const geometry = new THREE.SphereGeometry(1, 40, 24);
  const surface = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
    color: 0x031427, emissive: 0x010b19, shininess: 45, transparent: true, opacity: 0.95,
  }));
  rotation.add(surface);
  const grid = new THREE.Mesh(new THREE.SphereGeometry(1.012, 24, 16), new THREE.MeshBasicMaterial({
    color: 0x3ca6d2, wireframe: true, transparent: true, opacity: 0.15,
  }));
  rotation.add(grid);
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.025, 40, 24), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec3 vNormal; void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: 'varying vec3 vNormal; void main(){float rim=pow(1.0-abs(normalize(vNormal).z),3.0);gl_FragColor=vec4(0.12,0.65,1.0,rim*0.65);}',
  }));
  rotation.add(atmosphere);

  const ringGeometry = new THREE.BufferGeometry().setFromPoints(
    Array.from({ length: 241 }, (_, i) => new THREE.Vector3(Math.cos(i / 240 * Math.PI * 2), Math.sin(i / 240 * Math.PI * 2), 0)),
  );
  for (let i = 0; i < 3; i += 1) {
    const orbit = new THREE.Line(ringGeometry, new THREE.LineBasicMaterial({ color: i === 1 ? 0xa2e8ff : 0x267ed3, transparent: true, opacity: i === 1 ? 0.65 : 0.35 }));
    orbit.scale.setScalar(1.14 + i * 0.055);
    orbit.rotation.set(0.5 + i * 0.5, 0.25 + i * 0.6, i * 0.6);
    rotation.add(orbit);
  }
  const track = new THREE.Line(ringGeometry, new THREE.LineBasicMaterial({ color: 0x245b83, transparent: true, opacity: 0.5 }));
  track.scale.setScalar(1.25);
  globe.add(track);
  const arcGeometry = ringGeometry.clone();
  const arc = new THREE.Line(arcGeometry, new THREE.LineBasicMaterial({ color: 0x96f0ff }));
  arc.scale.setScalar(1.25);
  arc.rotation.z = Math.PI / 2;
  arc.scale.x *= -1;
  globe.add(arc);

  const starsGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(450 * 3);
  let seed = 2026;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] = random() - 0.5;
    positions[i + 1] = random() - 0.5;
    positions[i + 2] = -200 - random() * 300;
  }
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const stars = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0x8bc9ed, size: 1.2, sizeAttenuation: false, transparent: true, opacity: 0.55 }));
  scene.add(stars);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const target = { x: 0, y: 0 };
  let frame = 0;
  let previous = performance.now();
  let spin = 0;
  let angle = 0;
  let stopped = false;
  const resize = () => {
    const width = loader.clientWidth;
    const height = loader.clientHeight;
    renderer.setSize(width, height, false);
    camera.left = -width / 2; camera.right = width / 2;
    camera.top = height / 2; camera.bottom = -height / 2;
    camera.updateProjectionMatrix();
    const bounds = button.getBoundingClientRect();
    globe.position.set(bounds.left + bounds.width / 2 - width / 2, height / 2 - bounds.top - bounds.height / 2, 0);
    globe.scale.setScalar(bounds.width * 0.38);
    stars.scale.set(width * 1.1, height * 1.1, 1);
  };
  const pointer = (event) => {
    target.x = (event.clientY / loader.clientHeight - 0.5) * 0.4;
    target.y = (event.clientX / loader.clientWidth - 0.5) * 0.6;
  };
  const reset = () => { target.x = 0; target.y = 0; };
  const click = () => { if (!reduced.matches) spin += 0.9; };
  const render = (now) => {
    if (stopped) return;
    if (!loader.isConnected) { dispose(); return; }
    const delta = Math.min((now - previous) / 1000, 0.05);
    previous = now;
    if (!reduced.matches) {
      angle += delta * (0.085 + spin);
      spin *= Math.exp(-delta * 2);
      rotation.rotation.y = angle;
      rotation.rotation.x += (target.x - rotation.rotation.x) * (1 - Math.exp(-delta * 3));
      globe.rotation.y += (target.y - globe.rotation.y) * (1 - Math.exp(-delta * 3));
      stars.position.x += (-target.y * 14 - stars.position.x) * (1 - Math.exp(-delta * 2));
    }
    arcGeometry.setDrawRange(0, Math.max(0, Math.round(Number(loader.dataset.progress || 0) / 100 * 240) + 1));
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  };
  const observer = new ResizeObserver(resize);
  function dispose() {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    loader.removeEventListener('pointermove', pointer);
    loader.removeEventListener('pointerleave', reset);
    button.removeEventListener('click', click);
    document.removeEventListener('debt:preloader-closed', dispose);
    window.removeEventListener('pagehide', dispose);
    const geometries = new Set();
    const materials = new Set();
    scene.traverse((object) => { if (object.geometry) geometries.add(object.geometry); if (object.material) materials.add(object.material); });
    geometries.forEach((item) => item.dispose());
    materials.forEach((item) => item.dispose());
    renderer.dispose();
  }
  observer.observe(loader);
  observer.observe(button);
  loader.addEventListener('pointermove', pointer);
  loader.addEventListener('pointerleave', reset);
  button.addEventListener('click', click);
  document.addEventListener('debt:preloader-closed', dispose);
  window.addEventListener('pagehide', dispose);
  resize();
  render(performance.now());
  loader.classList.add('has-scene');
}
