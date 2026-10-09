"use client";

import { useEffect } from "react";

import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { shallow } from "zustand/shallow";
import { createStore } from "zustand/vanilla";

import { type User } from "../types/entities.types";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */

type AuthState = {
  token: string | null;
  userInfo: Partial<User> | null;
  /** True once the client has been told about `token` at least once. */
  tokenIsHydrated: boolean;
  /** True once the client has been told about `userInfo` at least once. */
  userInfoIsHydrated: boolean;
};

type AuthActions = {
  /**
   * Mirror the server-resolved token into the store.
   * - `undefined` → "server didn't check": only flip the hydration flag.
   * - `null`      → "checked, no token": clear it.
   * - `string`    → "checked, here it is": store it.
   */
  setToken: (token: string | null | undefined) => void;

  /**
   * Mirror the server-resolved userInfo into the store.
   * Same `undefined` / `null` semantics as `setToken`.
   */
  setUserInfo: (userInfo: Partial<User> | null | undefined) => void;

  /**
   * One-shot hydration used by `<AuthInitializer />`. Applies both
   * `token` and `userInfo` in a single `set`, so subscribers re-render
   * once instead of twice.
   */
  hydrate: (input: {
    token: string | null | undefined;
    userInfo: Partial<User> | null | undefined;
  }) => void;

  /**
   * Clear auth state on logout.
   * Hydration flags are intentionally left untouched — initialization
   * happens once per app lifecycle, not once per session.
   */
  reset: () => void;
};

type AuthStore = AuthState & AuthActions;

/* ─────────────────────────────────────────────
   Store
   ───────────────────────────────────────────── */

const useAuthStore = createStore<AuthStore>((set, get) => ({
  token: null,
  userInfo: null,
  tokenIsHydrated: false,
  userInfoIsHydrated: false,

  setToken: (payload) => {
    // undefined = "not checked yet" → don't touch the value
    if (payload === undefined) {
      if (!get().tokenIsHydrated) set({ tokenIsHydrated: true });
      return;
    }

    const prev = get().token;
    const needsValueUpdate = prev !== payload;
    const needsHydrationFlag = !get().tokenIsHydrated;

    if (!needsValueUpdate && !needsHydrationFlag) return;

    set({
      ...(needsValueUpdate ? { token: payload } : null),
      ...(needsHydrationFlag ? { tokenIsHydrated: true } : null),
    });
  },

  setUserInfo: (next) => {
    // undefined = "not checked yet" → don't touch the value
    if (next === undefined) {
      if (!get().userInfoIsHydrated) set({ userInfoIsHydrated: true });
      return;
    }

    const prev = get().userInfo;
    // shallow handles all cases: null↔null, null↔obj, obj↔obj
    const needsValueUpdate = !shallow(prev, next);
    const needsHydrationFlag = !get().userInfoIsHydrated;

    if (!needsValueUpdate && !needsHydrationFlag) return;

    set({
      ...(needsValueUpdate ? { userInfo: next } : null),
      ...(needsHydrationFlag ? { userInfoIsHydrated: true } : null),
    });
  },

  hydrate: ({ token, userInfo }) =>
    set((state) => {
      const patch: Partial<AuthState> = {};

      // token
      if (token !== undefined && state.token !== token) {
        patch.token = token;
      }
      if (!state.tokenIsHydrated) {
        patch.tokenIsHydrated = true;
      }

      // userInfo
      if (userInfo !== undefined && !shallow(state.userInfo, userInfo)) {
        patch.userInfo = userInfo;
      }
      if (!state.userInfoIsHydrated) {
        patch.userInfoIsHydrated = true;
      }

      return patch;
    }),

  reset: () =>
    set({
      token: null,
      userInfo: null,
      // hydration flags are intentionally untouched
    }),
}));

/* ─────────────────────────────────────────────
   Selectors
   ───────────────────────────────────────────── */

export const useAuthSelector = createSelectorHooks(useAuthStore);

/* ─────────────────────────────────────────────
   Initializer
   ───────────────────────────────────────────── */

/**
 * Mirrors the server-resolved auth state into the client store.
 *
 * Pass the raw values you got from the server:
 * - `undefined` → "this route didn't check" (skipped)
 * - `null`      → "checked, nothing there"   (applied)
 *
 * Renders nothing.
 */
export const AuthInitializer = ({
  token,
  userInfo,
}: {
  token: string | null | undefined;
  userInfo: Partial<User> | null | undefined;
}) => {
  const hydrate = useAuthSelector.useHydrate();

  useEffect(() => {
    hydrate({ token, userInfo });
  }, [hydrate, token, userInfo]);

  return null;
};
