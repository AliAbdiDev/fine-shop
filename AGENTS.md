# Project Guidelines & Architecture — fine-shop

This document is the single source of truth for AI agents (Antigravity) working in this codebase. Read this first to minimize token overhead and adhere strictly to existing patterns.

---

## 1. Tech Stack Overview

- **Framework**: Next.js 16 (React 19, Turbopack, App Router, Server Actions, Typed Routes, `cacheComponents: true`)
- **Language**: TypeScript 5 (Strict mode enabled, `@/*` pointing to `./src/*`, `@/core` to `./src/core`)
- **Styling & UI**: Tailwind CSS, `@base-ui/react`, `@radix-ui/react-slot`, `shadcn/ui`, `lucide-react`, `embla-carousel-react`, `date-fns-jalali`
- **Data Fetching & Caching**: TanStack Query v5, `ofetch` wrapper, Next.js cache tags (`cacheTag`, `revalidateTag`)
- **State Management**: Zustand with `auto-zustand-selectors-hook`
- **Validation**: Zod (schemas located in `src/core/validation-shema.ts`)
- **API Mocking**: MSW (Mock Service Worker) initialized in `src/instrumentation.ts` when `NEXT_PUBLIC_API_MOCKING=true`
- **Package Manager**: pnpm

---

## 2. Directory Structure

```text
fine-shop/
├── public/                     # Static assets & MSW mockServiceWorker.js
├── scripts/                    # Shell & maintenance scripts
├── src/
│   ├── app/                    # Next.js App Router routes
│   │   ├── (shop)/             # Public storefront (home `/`, `/shop`)
│   │   ├── admin/              # Admin dashboard (`/admin/products`, `/admin/users`, `/admin/profile`)
│   │   ├── signin/             # Authentication (`/signin`, `/signin/verify`)
│   │   ├── globals.css         # Tailwind global styles
│   │   └── layout.tsx          # Root layout with QueryProvider
│   ├── core/                   # Shared architectural core
│   │   ├── components/         # UI primitives (`ui/`) & business widgets (`custom/`)
│   │   ├── constants/          # App constants (`misc.ts`, `status-messages.ts`)
│   │   ├── features/           # Feature-specific components (`admin/`, `shop/`, `signin/`)
│   │   ├── hooks/              # Reusable React hooks (`useDebounce`, `usePaginationQuery`, etc.)
│   │   ├── mocks/              # MSW handlers, schema, and server sync scripts
│   │   ├── services/           # Network & data access layer
│   │   │   ├── client/         # Client-side React Query services (`products.ts`, etc.)
│   │   │   ├── configs/        # `api.ts`, ofetch fetcher, QueryClient setup
│   │   │   ├── server/         # Next.js Server Actions & server-side fetchers
│   │   │   └── shared/         # Query key factories (`keys.ts`) & cache tags (`tages.ts`)
│   │   ├── states/             # Zustand stores (`auth.tsx`, `breadcrumb.ts`, etc.)
│   │   ├── types/              # Domain entities (`entities.types.ts`) & shared types
│   │   ├── utils/              # Pure utilities (`helpers.ts`, `jalali.ts`, cookies, proxy modules)
│   │   └── validation-shema.ts # Zod validation schemas
│   ├── instrumentation.ts      # Server-side runtime instrumentation (MSW setup)
│   └── proxy.ts                # Next.js route proxy / auth middleware
├── components.json             # Shadcn configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies and npm scripts
└── tsconfig.json               # Path aliases and TS options
```

---

## 3. Core Architectural Patterns

### A. Two-Shape API Layer (Contract vs. Client)
To prevent backend response changes from breaking UI components, this codebase enforces strict decoupling:
1. **Contract Layer** (`src/core/services/configs/fetcher/types/contract.types.ts`):
   - Represents the raw JSON envelope returned by the backend.
2. **Client Layer** (`src/core/services/configs/fetcher/types/client.types.ts`):
   - Represents the clean domain entity consumed by the frontend.
3. **Adapter** (`src/core/services/configs/fetcher/adapters.ts`):
   - Single boundary function `contractToClient` unwraps the backend envelope. Callers never see or depend on the contract envelope directly.
4. **API Client** (`src/core/services/configs/api.ts`):
   - Use `api.get`, `api.post`, etc. Always unwrap results using `unwrap(res)` in mutations/queries.

### B. Query Keys & Cache Invalidation
- Define and use query key factories from `src/core/services/shared/keys.ts` (`createKeys` helper).
- Invalidate queries on mutation success via `queryClient.invalidateQueries({ queryKey: productKeys.lists() })`.
- Use `revalidateTagWithTags` from `src/core/services/server/actions.ts` for on-demand server tag revalidation (`Tags` defined in `src/core/services/shared/tages.ts`).

### C. State Management
- Zustand stores are wrapped with `createSelectorHooks` (`auto-zustand-selectors-hook`).
- Use dedicated selector hooks (e.g. `useAuthSelector.useToken()`, `useAuthSelector.useUser()`) to avoid unnecessary re-renders.

### D. Routing & Route Guards
- Route paths must reference `ROUTES` in `src/core/constants/misc.ts` rather than hardcoded string literals.
- Request intercepting and role-based redirects are managed centrally in `src/proxy.ts` (NextProxy) and `src/core/utils/proxy-modules/auth.ts`.

---

## 4. Key Developer Commands

```bash
pnpm dev         # Run development server with Turbopack and typegen
pnpm check       # Run TypeScript compiler check (tsc --noEmit)
pnpm lint        # Run ESLint validation
pnpm full-check  # Run tsc and ESLint together
pnpm build       # Full production build (typegen + tsc + next build)
pnpm mock-sync   # Sync MSW schema from remote/local definitions
pnpm mock-init   # Re-initialize public/mockServiceWorker.js
```

---

## 5. Strict Guidelines for AI Agents

1. **English Comments Only**:
   - All code comments, docstrings, and config annotations must be written in English only. Never include Persian comments in code files.
2. **Path Aliases**:
   - Use `@/core/...` or `@/...` for internal imports. Avoid fragile relative paths (`../../..`).
3. **Component Placement**:
   - Place generic primitives in `src/core/components/ui/`.
   - Place reusable compound widgets in `src/core/components/custom/`.
   - Place route-specific components in their respective feature or app directory.
4. **Validation Schemas**:
   - Centralize validation in `src/core/validation-shema.ts` using Zod.
5. **No Speculative Dependencies**:
   - Do not install new packages unless strictly required and compatible with React 19 / Next.js 16.
