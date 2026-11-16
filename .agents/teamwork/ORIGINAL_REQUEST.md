# Original User Request

## 2026-11-14T20:28:59Z

توسعه صفحه ویرایش پروفایل کاربر خریدار (عادی) در مسیر `src/app/(shop)/profile` بر اساس تایپ `User` و هماهنگ با دیزاین سیستم و کامپوننت‌های پروژه `fine-shop`.

Working directory: j:/dev/projects/fine-shop
Integrity mode: development

## Requirements

### R1. Shop User Profile Page
صفحه ویرایش پروفایل خریدار در مسیر `src/app/(shop)/profile/page.tsx` مطابق با دیزاین توکن‌ها، فونت، تم و کامپوننت‌های فرم و UI پروژه (`SmartForm`, `FormGrid`, `Input`, `ImageUpload`, `Page`).

### R2. Adherence to User Entity Type & Scope
استفاده دقیق از تایپ `User` در `src/core/types/entities.types.ts` (شامل `firstName`, `lastName`, `phoneNumber`, `avatar` و نمایش ایمیل/وضعیت بدون ایجاد فیلدهای اضافه یا خارج از اسکوپ).

### R3. API & Server Action Integration
اتصال به سرویس‌ها و سرور اکشن‌های موجود برای دریافت و به‌روزرسانی اطلاعات پروفایل و مدیریت خطا و اطلاع‌رسانی (Notify).

## Acceptance Criteria

### Functionality & Validation
- [ ] کاربر خریدار بتواند اطلاعات مجاز خود (نام، نام خانوادگی، شماره تماس، آواتار) را مشاهده و ویرایش کند.
- [ ] اعتبارسنجی فرم با اسکیماهای Zod پروژه همخوانی داشته باشد.
- [ ] هیچ کامنت فارسی در کدهای نوشته‌شده قرار نگیرد و فقط کامنت‌های انگلیسی درج شود.


## 2026-11-15T10:29:33Z

# Teamwork Project Prompt — Launched

> Status: Launched
> Goal: Delegate to teamwork_preview
> Requested team: [none — teamwork routes from the description]

توسعه و بازطراحی صفحه پروفایل خریدار به ساختار ۳ تب (اطلاعات پروفایل، آدرس‌ها، سفارش‌ها و پرداخت‌ها) با حفظ کامپوننت موجود و بهینه‌سازی کامل ریسپانسیو موبایل.

Working directory: j:\dev\projects\fine-shop

## Requirements

### R1. Profile Page Three-Tab Navigation
- Refactor `src/app/(shop)/profile/page.tsx` using `@base-ui/react/tabs` (`@/core/components/ui/tabs`).
- Tab 1: "اطلاعات حساب" (Profile Information) containing the existing profile view and edit form.
- Tab 2: "آدرس‌ها" (Addresses) for listing, adding, and managing user delivery addresses.
- Tab 3: "سفارش‌ها و پرداخت‌ها" (Orders & Payments) displaying order history and payment records with badges and details.

### R2. Mobile Responsive Optimization
- Optimize the tab triggers and panels for small mobile viewports (e.g. scrollable or wrap tabs, adaptive card paddings, touch targets).
- Ensure forms, address cards, and order lists adapt cleanly without horizontal overflow on mobile screens.

### R3. Strict Scope & Code Quality
- Follow existing architecture: clean separation, no Persian comments in code (English comments only), standard icons from `lucide-react`.
- Verify behavior in browser with Chrome DevTools MCP and ensure no regressions.

## Acceptance Criteria

### Tab Switching & Rendering
- [ ] Tab 1 renders existing profile details with form working as before.
- [ ] Tab 2 renders the addresses interface properly.
- [ ] Tab 3 renders the orders and payments list properly.
- [ ] Active tab state transitions smoothly without layout shift.

### Mobile Viewport & Responsiveness
- [ ] No horizontal scroll/overflow on viewports down to 360px width.
- [ ] Tab list remains accessible and touch-friendly on mobile screens.

### Verification
- [ ] Build and type check (`pnpm check`) pass with zero errors.
- [ ] In-browser verification confirms all tabs and mobile layout render correctly.
