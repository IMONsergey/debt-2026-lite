/* Independent boot guard: must also work when the application bundle fails. */
(() => {
  const loader = document.getElementById('site-preloader');
  const root = document.getElementById('root');
  const progress = loader.querySelector('[role="progressbar"]');
  const percent = loader.querySelector('.site-preloader__percent');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const started = performance.now();
  let closing = false, frame, timer, target = 1, displayed = 1, last = started;
  let presentedAt = null, pendingFinish = null;
  const presented = () => {
    if (presentedAt !== null) return;
    presentedAt = performance.now();
    loader.classList.add('is-presented');
    if (pendingFinish) finish(pendingFinish);
  };
  root.inert = true;
  document.documentElement.classList.add('is-site-loading');
  const paint = (now) => {
    const delta = Math.min(50, now - last);
    last = now;
    const elapsed = Math.min(1, Math.max(0, (now - (presentedAt ?? now)) / 2000));
    const animatedProgress = 1 + 99 * (1 - Math.pow(1 - elapsed, 2));
    displayed = Math.max(displayed, Math.min(target, animatedProgress, displayed + delta * 0.12));
    const value = Math.floor(displayed);
    if (Number(loader.dataset.progress) !== displayed) {
      loader.dataset.progress = String(displayed);
      loader.style.setProperty('--load-progress', displayed / 100);
    }
    if (progress.getAttribute('aria-valuenow') !== String(value)) {
      progress.setAttribute('aria-valuenow', String(value));
      percent.textContent = value + '%';
    }
    frame = requestAnimationFrame(paint);
  };
  const update = (event) => {
    const { completed, total } = event.detail;
    if (total > 0) target = Math.max(target, Math.min(99, completed / total * 100));
  };
  const finish = (event) => {
    if (closing) return;
    if (presentedAt === null) { pendingFinish = event || { type: 'timeout' }; return; }
    closing = true;
    clearTimeout(timer);
    document.removeEventListener('debt:ready', finish);
    document.removeEventListener('debt:progress', update);
    if (event?.type === 'debt:ready') {
      target = 100;
      loader.querySelector('.site-preloader__progress-meta > span').textContent = 'Загрузка завершена';
    }
    else loader.querySelector('.site-preloader__progress-meta > span').textContent = 'Открываем сайт';
    const remaining = Math.max((target - displayed) / 0.12, 2000 - (performance.now() - presentedAt));
    setTimeout(() => {
      let removed = false;
      let exitTimer;
      const removeLoader = () => {
        if (removed) return;
        removed = true;
        clearTimeout(exitTimer);
        loader.removeEventListener('transitionend', onExit);
        cancelAnimationFrame(frame);
        document.dispatchEvent(new Event('debt:preloader-closed'));
        root.inert = false;
        document.documentElement.classList.remove('is-site-loading');
        loader.remove();
      };
      const onExit = (event) => {
        if (event.target === loader && event.propertyName === 'opacity') removeLoader();
      };
      loader.addEventListener('transitionend', onExit);
      // Keep the overlay mounted until the fade really ends, even on slow frames.
      exitTimer = setTimeout(removeLoader, reduced ? 750 : 1500);
      loader.classList.add('is-leaving');
    }, remaining);
  };
  frame = requestAnimationFrame(paint);
  document.addEventListener('debt:progress', update);
  document.addEventListener('debt:ready', finish);
  requestAnimationFrame(presented);
  timer = setTimeout(() => {
    if (root.childElementCount) { presented(); finish(); }
    else {
      loader.classList.add('has-error');
      loader.querySelector('.site-preloader__fallback').hidden = false;
      loader.setAttribute('aria-label', 'Не удалось загрузить сайт');
      cancelAnimationFrame(frame);
      document.dispatchEvent(new Event('debt:preloader-closed'));
    }
  }, 5500);
})();
