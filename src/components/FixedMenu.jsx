import { typograf } from '../lib/typography.js';

export function FixedMenu({ site, menu }) {
  return (
    <aside className="fixed-menu" aria-label="Информация о конференции">
      <a className="fixed-menu__brand" href="#top" aria-label={site.title}>
        <img src={site.logo} alt={site.title} />
      </a>
      <SidebarInfo className="fixed-menu__info" menu={menu} />
    </aside>
  );
}

export function SidebarInfo({ className = 'sidebar-info', menu }) {
  const sidebar = menu.sidebar ?? {};

  return (
    <div className={className}>
      <div className="video-widget-slot" data-video-widget-slot aria-hidden="true" />

      <a className="contact-link" href={`mailto:${sidebar.contactEmail}`}>
        <span>{typograf(sidebar.contactLabel)}</span>
        <strong>{sidebar.contactEmail}</strong>
        <img className="contact-link__arrow" src="assets/icons/arrow-up.svg" alt="" aria-hidden="true" />
      </a>

      <div className="organizers-mark">
        <span>{typograf(sidebar.organizersLabel)}</span>
        <img src={sidebar.organizersImage} alt={sidebar.organizersLabel} />
      </div>

      <SidebarCta cta={menu.cta} />
      {menu.secondaryCta ? <SidebarCta cta={menu.secondaryCta} secondary /> : null}
    </div>
  );
}

function SidebarCta({ cta, secondary = false }) {
  const className = `fixed-menu__cta${secondary ? ' fixed-menu__cta--secondary' : ''}`;
  const isExternal = /^https?:\/\//.test(cta.href ?? '');

  return (
    <a
      className={className}
      href={cta.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
    >
      <span>{typograf(cta.label)}</span>
      <img className="fixed-menu__cta-icon" src="assets/icons/arrow-up.svg" alt="" aria-hidden="true" />
    </a>
  );
}
