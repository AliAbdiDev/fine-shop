"use client";
import { useEffect, useRef } from "react";

import { isNullOrUndefined, isString } from "@sindresorhus/is";
import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { createStore } from "zustand";

import { type User } from "../types/entities.types";

type AuthStore = {
  token: string | null;
  userInfo: User | null;
  setToken: (token: string) => void;
  setUserInfo: (userProfile: User) => void;
  reset: () => void;
};

const useAuthStore = createStore<AuthStore>((set, get) => {
  return {
    token: null,
    userInfo: null,
    setToken: (payload) => {
      if (!isString(payload)) return;
      if (get().token === payload) return;
      set({ token: payload });
    },
    setUserInfo: (payload) => {
      if (isNullOrUndefined(payload)) return;
      set({ userInfo: payload });
    },

    reset: () => {
      set({ token: null });
      set({ userInfo: null });
    },
  };
});

export const useAuthSelector = createSelectorHooks(useAuthStore);

export const AutInitializer = ({
  token,
  userInfo,
}: {
  token: string | undefined;
  userInfo: User | undefined;
}) => {
  const setToken = useAuthSelector.useSetToken();
  const setUserInfo = useAuthSelector.useSetUserInfo();

  const isHydrated = useRef(false);
  useEffect(() => {
    if (isNullOrUndefined(userInfo) || isNullOrUndefined(token)) return;

    if (isHydrated.current) return;

    setUserInfo(userInfo);
    setToken(token);
    isHydrated.current = true;
  }, [setUserInfo, setToken, userInfo, token]);

  return null;
};
