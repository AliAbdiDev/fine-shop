# MSW Mock Layer: Important Points

## Why this design?

- MSW intercepts at the network layer. The app code does not change.
- Handlers are made at runtime from the OpenAPI schema. So there is no difference between schema and mock.
- `schema.json` is stored in the repo. It works offline and in CI.
- Manual `overrides` are put first. So they are more important than generic schema handlers.
- Unhandled requests must show a warning. They should not silently go to the real server.

---

## Main files and their roles

| File          | Important role                                                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `logger.ts`   | Unified logging with three labels: `MOCK`, `REAL API`, `UNHANDLED`; uses `request.method` and `new URL(request.url).pathname` for log lines |
| `handlers.ts` | Defines `BASE`, manual overrides, and builds handlers from `schema.json`                                                                    |
| `browser.ts`  | Starts `setupWorker` with `onUnhandledRequest: 'warn'` and `quiet: true`                                                                    |
| `server.ts`   | Starts `setupServer` in Node/SSR with `server.listen({ onUnhandledRequest: 'warn' })`                                                       |

---
