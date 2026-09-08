const loader = document.getElementById('site-preloader');
if (loader && !loader.classList.contains('has-error')) startIntro(loader);

function startIntro(loader) {
  const button = loader.querySelector('.site-preloader__sphere');
  const image = loader.querySelector('.site-preloader__portal');
  const depth = loader.querySelector('.site-preloader__depth');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let disposed = false;
  let frame;
  let previous = performance.now();
  let x = 0, y = 0, targetX = 0, targetY = 0, turn = 0, targetTurn = 0;
  let fallback;
  // Start the viewing interval only after the artwork can actually be painted.
  Promise.race([
    Promise.allSettled([image.decode(), document.fonts.ready]),
    new Promise((resolve) => { fallback = setTimeout(resolve, 3000); }),
  ]).then(() => {
    clearTimeout(fallback);
    if (disposed || !loader.isConnected) return;
    requestAnimationFrame(() => {
      if (!disposed) document.dispatchEvent(new Event('debt:intro-visible'));
    });
  });
  const pointer = (event) => {
    const bounds = button.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)) * 9;
    targetY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1)) * 7;
  };
  const reset = () => { targetX = 0; targetY = 0; };
  const click = () => { targetTurn += 12; };
  const render = (now) => {
    if (disposed) return;
    if (!loader.isConnected) { dispose(); return; }
    const delta = Math.min(0.05, (now - previous) / 1000);
    previous = now;
    const ease = 1 - Math.exp(-delta * 3);
    x += (targetX - x) * ease;
    y += (targetY - y) * ease;
    turn += (targetTurn - turn) * ease;
    depth.style.transform = reduced.matches ? 'none' : `translate(${x}px, ${y}px) rotate(${turn}deg)`;
    frame = requestAnimationFrame(render);
  };
  function dispose() {
    disposed = true;
    clearTimeout(fallback);
    cancelAnimationFrame(frame);
    button.removeEventListener('pointermove', pointer);
    button.removeEventListener('pointerleave', reset);
    button.removeEventListener('click', click);
    document.removeEventListener('debt:preloader-closed', dispose);
    window.removeEventListener('pagehide', dispose);
  }
  button.addEventListener('pointermove', pointer);
  button.addEventListener('pointerleave', reset);
  button.addEventListener('click', click);
  document.addEventListener('debt:preloader-closed', dispose);
  window.addEventListener('pagehide', dispose);
  frame = requestAnimationFrame(render);
}
