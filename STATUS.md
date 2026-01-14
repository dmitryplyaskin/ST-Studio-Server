# ST Studio — текущее состояние

## Что реализовано

### Серверный плагин
- Базовая модульная архитектура (routes/services/utils).
- Хранилище стейта на диске:
  - `GET /api/plugins/st-studio/state?scope=...&key=...`
  - `POST /api/plugins/st-studio/state`
  - `revision` для контроля конфликтов.
- SSE‑заготовка:
  - `GET /api/plugins/st-studio/events`
  - keepalive `ping` события.

### Веб‑расширение (UI)
- Базовый UI в настройках расширений.
- Настройки:
  - `enabled` (включено/выключено).
  - `serverBase` (опционально, если пусто — текущий origin).
- Кнопка **Ping state**:
  - делает запрос на `/api/plugins/st-studio/state?scope=global`
  - выводит результат в консоль.

## Точки интеграции
- Серверные роуты доступны под `/api/plugins/st-studio/...`.
- Клиент использует `fetch(..., { credentials: "include" })` для сессии.

## Что пока не сделано
- Patch‑эндпоинт (`/state/patch`).
- Health‑эндпоинт.
- Оркестрация multi‑agent.
- UI для продвинутых настроек.
