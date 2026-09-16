# DEBT TECH 2026

React + Vite, обычный CSS. Глобальная чистка: `codex/global-layout-cleanup`, созданная от `codex/new-sections-experiment`.

```sh
npm ci
npm run dev
```

Перед публикацией:

```sh
npm run check
```

Содержимое страницы: `src/data/content.js`. Секции: `src/components`. Порядок стилей: `src/styles/index.css`. Кнопки: `src/styles/ui.css`.

[Аудит и ограничения проверки](docs/global-layout-audit.md) · [Интеграция форм](docs/forms-integration.md).

`/api/lead` в Vercel перенаправляется в существующий сервис заявок. Для локального интерфейса backend не требуется; не отправляйте пробные заявки в рабочий сервис. Тесты отправки используют подставные ответы.

`npm run check` включает ESLint, тесты скидок и отправки, проверку ассетов и их бюджета, production build и статические проверки адаптивного CSS. Workflow `check.yml` выполняет их для этой ветки и pull request, затем проверяет сборку с префиксом GitHub Pages.

Изображения используют `ResponsiveImage` и `src/data/images.json`: полная версия + варианты 640/960 px, когда исходник больше. Все файлы готовы к публикации; Python в production не требуется. Для повторной генерации из исходников в истории Git: `python scripts/optimize-images.py` (Pillow с поддержкой WebP; нужен указанный в скрипте коммит). Бюджет папки `public/assets` — 14 МБ.

Заставка имеет отдельный `public/preloader.js`, чтобы показать ошибку даже при сбое загрузки приложения. Готовность первого экрана определяет `src/lib/page-ready.js`; картинки нижних секций не задерживают открытие страницы. Код диалогов загружается отдельно при открытии.
