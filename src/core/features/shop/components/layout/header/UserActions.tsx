"use client";

import { type ComponentProps } from "react";

import Link from "next/link";

import { Menu, ShoppingBag, User2 } from "lucide-react";

import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { useIsMobile } from "@/core/hooks/use-mobile";
import { useAuthSelector } from "@/core/states/auth";

/* ─────────────────────────────────────────────
   Shared
   ───────────────────────────────────────────── */
function useAuthState() {
  const token = useAuthSelector.useToken();
  const tokenIsHydrated = useAuthSelector.useTokenIsHydrated();
  return {
    isLoading: !tokenIsHydrated,
    isSignedIn: tokenIsHydrated && Boolean(token),
  };
}

function CartBadge() {
  return (
    <Badge
      variant="default"
      className="font-vazir-bold size-4.5 justify-center rounded-full px-1 text-[10px] leading-none"
    >
      ۲
    </Badge>
  );
}

/* ─────────────────────────────────────────────
   Desktop: inline actions
   ───────────────────────────────────────────── */
function DesktopActions({ showText }: { showText: boolean }) {
  const { isLoading, isSignedIn } = useAuthState();

  return (
    <div className="mr-auto flex items-center gap-1 md:gap-3">
      <Button
        variant="ghost"
        size={isSignedIn ? "icon" : "default"}
        aria-label={isSignedIn ? "حساب کاربری" : "ورود / ثبت‌نام"}
        render={<Link href={isSignedIn ? "/#" : "/signin"} />}
        loading={isLoading}
        loadingType="skeleton"
        nativeButton={false}
      >
        {isSignedIn ? (
          <User2 className="h-5 w-5" aria-hidden />
        ) : (
          <>
            <User2 className="h-5 w-5" aria-hidden />
            {showText && (
              <span className="text-[13px] max-md:hidden">ورود / ثبت‌نام</span>
            )}
          </>
        )}
      </Button>

      <Button
        variant="ghost"
        className="h-auto gap-1.5 px-2 py-1.5"
        aria-label="سبد خرید"
      >
        <ShoppingBag className="h-5 w-5" aria-hidden />
        {showText && (
          <span className="hidden text-[13px] md:inline">سبد خرید</span>
        )}
        <CartBadge />
      </Button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Mobile: hamburger + dropdown
   ───────────────────────────────────────────── */

function MenuTrigger(props: ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="mr-auto h-9 w-9"
      aria-label="منو"
      {...props}
    >
      <Menu className="h-5 w-5" aria-hidden />
    </Button>
  );
}

function MobileMenu() {
  const { isLoading, isSignedIn } = useAuthState();

  return (
    <Popover>
      <PopoverTrigger render={<MenuTrigger />} />
      <PopoverContent align="end" sideOffset={8} className="w-60 p-2">
        <ul className="flex flex-col">
          <li>
            <Link
              href={isSignedIn ? "/#" : "/signin"}
              className="hover:bg-muted hover:text-foreground flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] transition-colors"
            >
              <User2 className="h-4 w-4 shrink-0" aria-hidden />
              <span>
                {isLoading
                  ? "..."
                  : isSignedIn
                    ? "حساب کاربری"
                    : "ورود / ثبت‌نام"}
              </span>
            </Link>
          </li>

          <li>
            <Link
              href="/#"
              className="hover:bg-muted hover:text-foreground flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] transition-colors"
            >
              <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden />
              <span className="flex-1">سبد خرید</span>
              <CartBadge />
            </Link>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}

/* ─────────────────────────────────────────────
   Public API — picks one based on viewport
   ───────────────────────────────────────────── */

export function UserActions({ showText = true }: { showText?: boolean }) {
  const isMobile = useIsMobile();

  if (isMobile === undefined) {
    return (
      <div
        aria-hidden
        className={
          showText
            ? "h-9 w-32 animate-pulse rounded-lg bg-current/5"
            : "h-9 w-9 animate-pulse rounded-lg bg-current/5"
        }
      />
    );
  }

  return isMobile ? <MobileMenu /> : <DesktopActions showText={showText} />;
}
