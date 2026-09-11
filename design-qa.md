# Design QA

Status: PASS

## References

- Organizer layout: `/var/folders/jh/rw4gjc1n0qxcfyrgk32nd5kh0000gn/T/TemporaryItems/NSIRD_screencaptureui_h0mTpu/Снимок экрана — 2026-09-11 в 14.06.45.png`
- Conference heading: `/Users/erdc/Desktop/Снимок экрана — 2026-09-11 в 14.34.05.png`
- Conference card: `/Users/erdc/Desktop/Снимок экрана — 2026-09-11 в 14.35.53.png`

## Verification

- Organizer cards, contacts, dividers, arrows, spacing, and heading hierarchy match the supplied layout at desktop size.
- Conference title backgrounds wrap each explicit title line independently.
- Conference card typography and arrow controls are reduced to the supplied visual scale.
- The conference carousel has continuous content on both sides and recenters without a visible jump.
- Previous from the first 2026 card reaches the last 2021 card; next returns to the first card.
- All conference cards open their supplied external URL in a new tab.
- Desktop viewport: 1536 x 1200, no document overflow.
- Mobile viewport: 390 x 844, no document overflow.
- Production build: PASS.

## Artifacts

- `output/playwright/other-conferences-desktop-final.png`
- `output/playwright/other-conferences-mobile-final.png`
