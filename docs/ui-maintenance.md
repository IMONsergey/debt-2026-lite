# UI maintenance rules

This branch preserves the current DEBT TECH 2026 geometry. Changes should be made in the owning component/style instead of adding one-off patch files.

- Shared CTA tokens and the map/gallery/tariff CTA contract live in `src/styles/ui-system.css`.
- Hero WebGL/planet/logo behavior lives in `src/components/HeroRayColumnPortal.jsx` and `src/styles/hero-raycolumn-experiment.css`.
- Public hero assets live in `public/assets/hero-experiment/` and should be referenced through `assetUrl()`.
- Keep the existing breakpoints and computed section geometry unless a design change explicitly requires otherwise.
- Do not apply generic positioning rules to all hero descendants. The menu, meta block, bottom copy and countdown are protected geometry.
- Decorative RAF work must stop when off-screen/hidden and respect `prefers-reduced-motion`.
- Map, gallery and tariff CTAs use the shared UI tokens. Menu CTAs are intentionally separate variants.
- Before publishing a Preview, run `npm ci` and `GITHUB_ACTIONS=false npm run build`, then use the experimental branch audit for 1920×1080, 1440×1000, 768×1024 and 390×844 browser evidence.
- Preview work stays on `experiments/hero-raycolumn-2026-09-11`; do not promote it to production or trigger GitHub Pages from this workflow.
