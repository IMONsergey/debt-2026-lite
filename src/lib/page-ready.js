/** Only the first screen participates in loading progress. Lower sections load on demand. */
export function prepareFirstScreen(hero) {
  const heroImage = matchMedia('(max-width: 1180px)').matches
    ? hero.backgroundImageAdaptive
    : hero.backgroundImage;
  const critical = [
    new Promise(resolve => {
      const image = new Image();
      image.decoding = 'async';
      image.fetchPriority = 'high';
      image.onload = () => image.decode().catch(() => {}).finally(resolve);
      image.onerror = resolve;
      image.src = heroImage;
    }),
    document.fonts.load('400 18px "IBM Plex Sans"'),
    document.fonts.load('600 18px "IBM Plex Sans"'),
  ];
  let completed = 0;
  const report = () => document.dispatchEvent(new CustomEvent('debt:progress', {
    detail: { completed: ++completed, total: critical.length },
  }));
  Promise.allSettled(critical.map(task => task.then(report, report)))
    .then(() => document.dispatchEvent(new Event('debt:ready')));
}
