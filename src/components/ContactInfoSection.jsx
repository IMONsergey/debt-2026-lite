import { typograf } from '../lib/typography.js';
import { assetUrl } from '../lib/assets.js';
import { ChannelIcon } from './ChannelIcon.jsx';

export function ContactInfoSection({ contacts, venue, channels, footer }) {
  const telegram = channels.find((channel) => channel.id === 'telegram');
  const mapUrl = `https://yandex.ru/map-widget/v1/?${new URLSearchParams({ text: venue.address, z: '16' })}`;

  return (
    <section className="contact-info page-section" id="contacts" aria-labelledby="contact-info-title">
      <img className="contact-info__artwork" src={assetUrl('assets/images/contacts-rocket.png')} width="1752" height="1752" loading="lazy" alt="" aria-hidden="true" />
      <div className="contact-info__heading">
        <h2 className="section-title" id="contact-info-title">{contacts.title}</h2>
        <a className="contact-info__accreditation" href={`mailto:${contacts.accreditationEmail}`}>
          <span>Аккредитация СМИ:<strong>{contacts.accreditationEmail}</strong></span>
          <span className="contact-info__info-icon" aria-hidden="true">i</span>
        </a>
      </div>
      <div className="contact-info__grid">
        {[contacts.tickets, contacts.partnership].map((contact) => (
          <article className="contact-info__group" key={contact.email}>
            <h3>{typograf(contact.title)}</h3>
            <address>
              <span className="contact-info__label">E-mail</span>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <span className="contact-info__label">Тел.</span>
              <a className="contact-info__phone" href={contact.phoneHref}>{contact.phone}</a>
            </address>
          </article>
        ))}
        <article className="contact-info__group">
          <h3>Другие ресурсы:</h3>
          <div className="contact-info__resources">
            <span className="contact-info__label">Сайт</span>
            <a href={contacts.website} target="_blank" rel="noreferrer">rvzrus.ru</a>
            {telegram && <><span className="contact-info__label">Телеграм</span><a href={telegram.href} target="_blank" rel="noreferrer">@rvzrus_chat</a></>}
          </div>
        </article>
      </div>
      <div className="contact-info__bottom">
        <div className="contact-info__closing">
          <div className="contact-info__socials">
            <span className="contact-info__label">Связаться с нами</span>
            <div>
              {channels.map((channel) => (
                <a key={channel.id} href={channel.href} target="_blank" rel="noreferrer" aria-label={`Написать в ${channel.label}`} title={channel.label}>
                  <ChannelIcon id={channel.id} />
                </a>
              ))}
            </div>
          </div>
          <footer className="contact-info__footer" id="privacy">
            <img className="contact-info__organizers" src={assetUrl('assets/icons/organizers-contact.svg')} width="397" height="73" alt="Организаторы: DEBTPRICE и Рынок взыскания" loading="lazy" />
            <div className="contact-info__legal">
              <span>{typograf(footer.copyright)}</span>
              <a href={footer.privacyHref} target="_blank" rel="noreferrer">{typograf(footer.privacyLabel)}</a>
            </div>
          </footer>
        </div>
        <div className="contact-info__map">
          <iframe title={`Карта: ${venue.name}, ${venue.address}`} src={mapUrl} width="560" height="320" loading="lazy" />
          <a href={venue.routeHref} target="_blank" rel="noreferrer" aria-label={`Открыть карту: ${venue.address}`} title="Открыть в Яндекс Картах">
            <img src={assetUrl('assets/icons/arrow-up.svg')} width="20" height="20" alt="" />
          </a>
        </div>
      </div>
      <a className="contact-info__brand" href="#top" aria-label="DEBT TECH 2026 — наверх">
        <img src={assetUrl('assets/icons/debttech-finale.svg')} width="364" height="173" loading="lazy" alt="DEBT TECH 2026" />
      </a>
    </section>
  );
}
