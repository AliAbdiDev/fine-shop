# API Layer — Design Decisions

A short guide to how this project talks to the backend, and why.

---

## Goal

Keep the frontend **independent of the backend's response envelope**.

The entity shapes (`Product`, `Category`, `User`) are shared. The envelope around them is not. If the backend changes, only one file needs a rewrite — the rest of the codebase stays untouched.

---

## Two Shapes, One Boundary

| Layer        | Describes                  | Lives in                  |
| ------------ | -------------------------- | ------------------------- |
| **Contract** | What the backend returns   | `types/contract.types.ts` |
| **Client**   | What the frontend consumes | `types/client.types.ts`   |
| **Adapter**  | The bridge between them    | `adapters.ts`             |

Callers never see the contract shape. They ask for the client shape and get it.

---

## One Adapter, One Source of Truth

`contractToClient` is the **only** function that knows the backend's envelope.

```ts
export const contractToClient: DefaultAdapter = (raw, query) => {
  // detect shape → unwrap → build meta
};
```
