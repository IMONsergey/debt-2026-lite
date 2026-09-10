import { useEffect, useId, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import '../styles/space-navigation.css';

const destinations = [
  { id: 'about-forum', label: 'О конференции' },
  { id: 'venue', label: 'Место проведения' },
  { id: 'gallery', label: 'Кадры с DEBT TECH' },
  { id: 'tariffs', label: 'Тарифные планы' },
  { id: 'contacts', label: 'Контакты' },
];

const shipImageSrc = `${import.meta.env.BASE_URL}assets/menu-spaceship.png`;

export function SpaceNavigation({ mobile = false }) {
  const [active, setActive] = useState('about-forum');
  const [open, setOpen] = useState(false);
  const [routeHeight, setRouteHeight] = useState(0);
  const navRef = useRef(null);
  const shipRef = useRef(null);
  const toggleRef = useRef(null);
  const flightRef = useRef(null);
  const destinationRef = useRef(null);
  const initialized = useRef(false);
  const panelId = useId();
  const routeProgress = destinations.findIndex((item) => item.id === active) / (destinations.length - 1);

  useEffect(() => {
    const observer = new ResizeObserver(() => setRouteHeight(navRef.current.offsetHeight));
    observer.observe(navRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const pending = destinationRef.current;
      if (pending && performance.now() < pending.until) {
        const target = document.getElementById(pending.id);
        if (target && Math.abs(target.getBoundingClientRect().top - 24) > 30) return;
      }
      destinationRef.current = null;
      let current = 'about-forum';
      for (const item of destinations) {
        const section = document.getElementById(item.id);
        if (section && section.getBoundingClientRect().top <= innerHeight * 0.32) current = item.id;
      }
      if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) current = 'contacts';
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const interrupt = () => { destinationRef.current = null; schedule(); };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('wheel', interrupt, { passive: true });
    window.addEventListener('touchstart', interrupt, { passive: true });
    window.addEventListener('scrollend', interrupt);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('wheel', interrupt);
      window.removeEventListener('touchstart', interrupt);
      window.removeEventListener('scrollend', interrupt);
    };
  }, []);

  useEffect(() => {
    const ship = shipRef.current;
    const nav = navRef.current;
    if (!ship || !nav || (mobile && !open)) return;
    const row = nav.querySelector(`[href="#${active}"]`);
    if (!row) return;
    const y = row.offsetTop + row.offsetHeight / 2;
    const from = getComputedStyle(ship).transform;
    const currentY = from === 'none' ? y : new DOMMatrixReadOnly(from).m42;
    flightRef.current?.cancel();
    const target = `translate(11px, ${y}px) rotate(0deg)`;
    ship.style.transform = target;
    if (!initialized.current || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      initialized.current = true;
      return;
    }
    ship.classList.add('is-flying');
    const direction = y >= currentY ? 1 : -1;
    // Retarget from the rendered position so fast clicks never snap the ship back.
    const flight = ship.animate([
      { transform: from === 'none' ? target : from, offset: 0 },
      { transform: `translate(4px, ${currentY + (y - currentY) * 0.3}px) rotate(${direction * 72}deg)`, offset: 0.3 },
      { transform: `translate(4px, ${currentY + (y - currentY) * 0.76}px) rotate(${direction * 55}deg)`, offset: 0.7 },
      { transform: target, offset: 1 },
    ], { duration: 1050, easing: 'cubic-bezier(.4,0,.16,1)' });
    flightRef.current = flight;
    flight.onfinish = () => ship.classList.remove('is-flying');
  }, [active, mobile, open, routeHeight]);

  useEffect(() => () => flightRef.current?.cancel(), []);

  useEffect(() => {
    if (!mobile || !open) return;
    const close = (event) => {
      if (event.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); }
    };
    const outside = (event) => {
      if (!navRef.current?.parentElement.contains(event.target)) setOpen(false);
    };
    window.addEventListener('keydown', close);
    window.addEventListener('pointerdown', outside);
    return () => { window.removeEventListener('keydown', close); window.removeEventListener('pointerdown', outside); };
  }, [mobile, open]);

  const navigate = (event, id) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const section = document.getElementById(id);
    if (!section) return;
    event.preventDefault();
    destinationRef.current = { id, until: performance.now() + 2000 };
    setActive(id);
    history.replaceState(null, '', `#${id}`);
    window.scrollTo({ top: Math.max(0, section.getBoundingClientRect().top + scrollY - 24), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    if (mobile) { setOpen(false); toggleRef.current?.focus({ preventScroll: true }); }
  };

  return (
    <div className={`space-navigation${mobile ? ' space-navigation--mobile' : ''}${open ? ' is-open' : ''}`}>
      {mobile && <button ref={toggleRef} className="space-navigation__toggle" type="button" aria-label={open ? 'Закрыть меню' : 'Открыть меню'} title={open ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>{open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}</button>}
      <nav ref={navRef} id={panelId} className="space-route" style={{ '--route-progress': routeProgress }} aria-label="Разделы сайта" inert={mobile && !open ? true : undefined}>
        <div className="space-route__rail" aria-hidden="true"><span className="space-route__rail-light" /></div>
        {destinations.map((item, index) => <a key={item.id} href={`#${item.id}`} className={`space-route__stop${active === item.id ? ' is-active' : ''}`} aria-current={active === item.id ? 'location' : undefined} onClick={(event) => navigate(event, item.id)}>
          <span className="space-route__branch" aria-hidden="true" />
          <span className={`space-planet space-planet--${index}`} aria-hidden="true"><span className="space-planet__surface" /><span className="space-planet__orbit" /></span>
          <span className="space-route__label">{item.label}</span>
        </a>)}
        <span ref={shipRef} className="space-route__ship" aria-hidden="true">
          <img className="space-route__ship-image" src={shipImageSrc} alt="" width="42" height="42" loading="eager" decoding="sync" fetchPriority="high" />
        </span>
      </nav>
    </div>
  );
}
