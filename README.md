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
