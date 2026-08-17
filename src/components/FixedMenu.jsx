import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { typograf } from '../lib/typography.js';

export function FixedMenu({ site, menu }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const menuGroups = menu.groups ?? [];
  const menuItems = menuGroups.flatMap((group) => group.items ?? []);
  const hasMenuItems = menuItems.length > 0;

  return (
    <>
      <aside className="fixed-menu" aria-label="Основное меню">
        <a className="fixed-menu__brand" href="#top" aria-label={site.title}>
          <img src={site.logo} alt={site.title} />
        </a>

        {hasMenuItems ? (
          <nav className="fixed-menu__nav" aria-label="Разделы сайта">
            {menuGroups.map((group) => (
              <div className="fixed-menu__group" key={group.title}>
                <span className="fixed-menu__group-title">{group.title}</span>
                <ul>
                  {(group.items ?? []).map((item) => (
                    <li key={`${item.label}-${item.href}`}>
                      <a className={item.active ? 'is-active' : undefined} href={item.href}>
                        {typograf(item.label)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        ) : null}

        <SidebarInfo className="fixed-menu__info" menu={menu} />
      </aside>

      {hasMenuItems ? (
        <div className={`mobile-menu ${isMobileOpen ? 'is-open' : ''}`}>
          <button
            className="mobile-menu__button"
            type="button"
            aria-label={isMobileOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen((value) => !value)}
          >
            <span />
            <span />
          </button>

          <nav className="mobile-menu__panel" aria-label="Мобильное меню">
            <a className="mobile-menu__brand" href="#top" onClick={() => setIsMobileOpen(false)}>
              <img src={site.logo} alt={site.title} />
            </a>
            <ul>
              {menuItems.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <a
                    className={item.active ? 'is-active' : undefined}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {typograf(item.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </>
  );
}

export function SidebarInfo({ className = 'sidebar-info', menu }) {
  const sidebar = menu.sidebar ?? {};
  const routeIsExternal = /^https?:\/\//.test(sidebar.routeHref ?? '');
  const [activeModal, setActiveModal] = useState(null);

  return (
    <div className={className}>
      <article className="venue-card">
        <div className="venue-card__copy">
          <span>{typograf(sidebar.venueTitle)}</span>
          <strong>{typograf(sidebar.venueAddress)}</strong>
        </div>
        <img src={sidebar.venueImage} alt="Пространство проведения DEBT TECH 2026" />
      </article>

      <a
        className="route-link"
        href={sidebar.routeHref}
        target={routeIsExternal ? '_blank' : undefined}
        rel={routeIsExternal ? 'noreferrer' : undefined}
      >
        <span>{typograf(sidebar.routeLabel)}</span>
        <img className="route-link__icon" src="assets/route-pin.svg" alt="" aria-hidden="true" />
      </a>

      <a className="contact-link" href={`mailto:${sidebar.contactEmail}`}>
        <span>{typograf(sidebar.contactLabel)}</span>
        <strong>{sidebar.contactEmail}</strong>
        <img className="contact-link__arrow" src="assets/arrow-up.svg" alt="" aria-hidden="true" />
      </a>

      <div className="organizers-mark">
        <span>{typograf(sidebar.organizersLabel)}</span>
        <img src={sidebar.organizersImage} alt={sidebar.organizersLabel} />
      </div>

      <SidebarCta cta={menu.cta} onOpenModal={setActiveModal} />

      {menu.secondaryCta ? (
        <SidebarCta cta={menu.secondaryCta} secondary onOpenModal={setActiveModal} />
      ) : null}

      {activeModal ? (
        <ApplicationModal kind={activeModal} onClose={() => setActiveModal(null)} />
      ) : null}
    </div>
  );
}

function SidebarCta({ cta, secondary = false, onOpenModal }) {
  const className = `fixed-menu__cta${secondary ? ' fixed-menu__cta--secondary' : ''}`;
  const content = (
    <>
      <span>{typograf(cta.label)}</span>
      <img className="fixed-menu__cta-icon" src="assets/arrow-up.svg" alt="" aria-hidden="true" />
    </>
  );

  if (cta.modal) {
    return (
      <button className={className} type="button" onClick={() => onOpenModal(cta.modal)}>
        {content}
      </button>
    );
  }

  const isExternal = /^https?:\/\//.test(cta.href ?? '');
  return (
    <a
      className={className}
      href={cta.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
    >
      {content}
    </a>
  );
}

function ApplicationModal({ kind, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const isStand = kind === 'stand';
  const title = isStand ? 'Забронировать стенд' : 'Ранняя регистрация';

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="application-modal"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="application-modal__dialog" role="dialog" aria-modal="true" aria-labelledby={`application-modal-${kind}`}>
        <button className="application-modal__close" type="button" onClick={onClose} aria-label="Закрыть окно">×</button>
        <div className="application-modal__heading">
          <h2 id={`application-modal-${kind}`}>{title}</h2>
          <p>{isStand ? 'Оставьте контакты и базовую информацию о компании. Детали стенда согласуем отдельно.' : 'Оставьте контакты — это тестовая версия формы ранней регистрации.'}</p>
        </div>

        {submitted ? (
          <div className="application-modal__success">
            <strong>Форма заполнена</strong>
            <p>Сейчас это тестовая форма: отправка данных ещё не подключена.</p>
            <button type="button" onClick={onClose}>Закрыть</button>
          </div>
        ) : (
          <form className="application-modal__form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
            <label>
              <span>Имя и фамилия</span>
              <input name="name" type="text" autoComplete="name" required />
            </label>
            <label>
              <span>Компания</span>
              <input name="company" type="text" autoComplete="organization" required />
            </label>
            {!isStand ? (
              <label>
                <span>Должность</span>
                <input name="position" type="text" autoComplete="organization-title" />
              </label>
            ) : null}
            <label>
              <span>Телефон</span>
              <input name="phone" type="tel" autoComplete="tel" required />
            </label>
            <label>
              <span>E-mail</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
            {isStand ? (
              <label className="application-modal__field--wide">
                <span>Комментарий / желаемый формат стенда</span>
                <textarea name="comment" rows="3" />
              </label>
            ) : null}
            <label className="application-modal__consent application-modal__field--wide">
              <input name="consent" type="checkbox" required />
              <span>Я соглашаюсь на обработку персональных данных для обработки этой заявки и принимаю условия политики конфиденциальности.</span>
            </label>
            <button className="application-modal__submit application-modal__field--wide" type="submit">
              <span>Отправить заявку</span>
              <img className="application-modal__submit-icon" src="assets/arrow-up.svg" alt="" aria-hidden="true" />
            </button>
          </form>
        )}
      </section>
    </div>,
    document.body,
  );
}
