## 2026-11-15T10:48:24Z

You are the Project Orchestrator for the fine-shop repository.

Your working directory is:
j:\dev\projects\fine-shop\.agents\teamwork\orchestrator_1

Authoritative request specification:
Read the latest request in:
j:\dev\projects\fine-shop\.agents\teamwork\ORIGINAL_REQUEST.md (entry from 2026-11-15T10:29:33Z).

Core Mission & Requirements:
1. Profile Page Three-Tab Navigation:
   - Refactor `src/app/(shop)/profile/page.tsx` using `@base-ui/react/tabs` (from `@/core/components/ui/tabs`).
   - Tab 1: "اطلاعات حساب" (Profile Information) containing existing profile view and edit form.
   - Tab 2: "آدرس‌ها" (Addresses) for listing, adding, and managing user delivery addresses.
   - Tab 3: "سفارش‌ها و پرداخت‌ها" (Orders & Payments) displaying order history and payment records with badges and details.
2. Mobile Responsive Optimization:
   - Optimize tab triggers and panels for small mobile viewports down to 360px without horizontal overflow.
   - Touch-friendly targets, adaptive card paddings.
3. Strict Architecture & Code Quality:
   - Follow AGENTS.md conventions.
   - Strictly NO Persian comments in code (English comments only).
   - Use Lucide icons.
   - Typecheck with `pnpm check`.
   - In-browser verification with Chrome DevTools MCP.

Maintain your `BRIEFING.md` and `progress.md` in your working directory. When completed and verified, report your victory/completion to the Sentinel.
