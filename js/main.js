const EVENT_DATE = new Date('2026-11-13T00:00:00+03:00');

function updateCountdown() {
  const remaining = Math.max(0, EVENT_DATE.getTime() - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);

  const values = {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };

  Object.entries(values).forEach(([key, value]) => {
    const node = document.querySelector(`[data-countdown="${key}"]`);
    if (node) node.textContent = String(value).padStart(2, '0');
  });
}

function initGallery() {
  const viewport = document.getElementById('galleryViewport');
  const previous = document.getElementById('galleryPrev');
  const next = document.getElementById('galleryNext');
  const slides = Array.from(document.querySelectorAll('.gallery__slide'));

  if (!viewport || slides.length === 0) return;

  const move = (direction) => {
    const firstSlide = slides[0];
    const gap = parseFloat(getComputedStyle(firstSlide.parentElement).gap) || 0;
    viewport.scrollBy({ left: direction * (firstSlide.offsetWidth + gap), behavior: 'smooth' });
  };

  previous?.addEventListener('click', () => move(-1));
  next?.addEventListener('click', () => move(1));

  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
  });

  initLightbox(slides);
}

function initLightbox(slides) {
  const lightbox = document.getElementById('lightbox');
  const image = document.getElementById('lightboxImage');
  const counter = document.getElementById('lightboxCounter');
  const close = document.getElementById('lightboxClose');
  const previous = document.getElementById('lightboxPrev');
  const next = document.getElementById('lightboxNext');

  if (!lightbox || !image || !counter) return;

  let activeIndex = 0;

  const show = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    const slide = slides[activeIndex];
    const slideImage = slide.querySelector('img');

    image.src = slide.dataset.image || slideImage?.src || '';
    image.alt = slideImage?.alt || '';
    counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };

  const open = (index) => {
    show(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    close?.focus();
  };

  const hide = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  slides.forEach((slide, index) => slide.addEventListener('click', () => open(index)));
  close?.addEventListener('click', hide);
  previous?.addEventListener('click', () => show(activeIndex - 1));
  next?.addEventListener('click', () => show(activeIndex + 1));

  lightbox.addEventListener('mousedown', (event) => {
    if (event.target === lightbox) hide();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;

    if (event.key === 'Escape') hide();
    if (event.key === 'ArrowLeft') show(activeIndex - 1);
    if (event.key === 'ArrowRight') show(activeIndex + 1);
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);
initGallery();
