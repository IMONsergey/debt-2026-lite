import { FixedMenu } from './FixedMenu.jsx';
import { HeroSection } from './HeroSection.jsx';
import { CorporatePackagesSection } from './CorporatePackagesSection.jsx';
import { AboutForumSection } from './AboutForumSection.jsx';
import { VenueSection } from './VenueSection.jsx';
import { GallerySection } from './GallerySection.jsx';
import { OrganizerSection } from './OrganizerSection.jsx';
import { OtherConferencesSection } from './OtherConferencesSection.jsx';
import { TariffsSection } from './TariffsSection.jsx';
import { ContactInfoSection } from './ContactInfoSection.jsx';
import { TickerStrip } from './TickerStrip.jsx';

export function SitePage({ content, onOpenApplication }) {
  return (
    <div className="app-shell">
      <div className="site-grid">
        <FixedMenu site={content.site} menu={content.menu} video={content.heroVideo} onOpenApplication={onOpenApplication} />
        <main className="page-flow" aria-label="Debt Tech 2026">
          <HeroSection content={content} onOpenApplication={onOpenApplication} />

          <TickerStrip items={content.ticker?.items} />
          <AboutForumSection about={content.aboutForum} />
          <VenueSection venue={content.venue} />
          <GallerySection gallery={content.gallery} />
          <OrganizerSection organizer={content.organizer} />
          <OtherConferencesSection archive={content.otherConferences} />
          <TariffsSection tariffs={content.tariffs} onOpenApplication={onOpenApplication} />
          <CorporatePackagesSection tariffs={content.tariffs} privacyHref={content.footer.privacyHref} config={content.forms} />
          <ContactInfoSection contacts={content.contacts} venue={content.venue} channels={content.forms.channels} footer={content.footer} />
        </main>
      </div>
    </div>
  );
}
