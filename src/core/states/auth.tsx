"use client";
import { useEffect } from "react";

import { isNullOrUndefined, isString } from "@sindresorhus/is";
import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { createStore } from "zustand";

import { type User } from "../types/entities.types";

type AuthStore = {
  token: string | null;
  userInfo: Partial<User> | null;
  userInfoIsHydrated: boolean;
  tokenIsHydrated: boolean;
  setToken: (token: string | null) => void;
  setUserInfo: (userProfile: Partial<User> | null) => void;
  reset: () => void;
};

const useAuthStore = createStore<AuthStore>((set, get) => {
  return {
    token: null,
    userInfo: null,
    userInfoIsHydrated: false,
    tokenIsHydrated: false,

    setToken: (payload) => {
      if (!isString(payload)) {
        set({ token: null, tokenIsHydrated: true });
        return;
      }
      if (get().token === payload) {
        set({ tokenIsHydrated: true });
        return;
      }
      set({ token: payload, tokenIsHydrated: true });
    },

    setUserInfo: (payload) => {
      if (isNullOrUndefined(payload)) {
        set({ userInfo: null, userInfoIsHydrated: true });
        return;
      }
      set({ userInfo: payload, userInfoIsHydrated: true });
    },

    reset: () => {
      set({ token: null, userInfo: null });
    },
  };
});

export const useAuthSelector = createSelectorHooks(useAuthStore);

export const AutInitializer = ({
  token,
  userInfo,
}: {
  token: string | undefined;
  userInfo: Partial<User> | undefined;
}) => {
  const setToken = useAuthSelector.useSetToken();
  const setUserInfo = useAuthSelector.useSetUserInfo();

  useEffect(() => {
    setUserInfo(userInfo ?? null);
    setToken(token ?? null);
  }, [setUserInfo, setToken, userInfo, token]);

  return null;
};
