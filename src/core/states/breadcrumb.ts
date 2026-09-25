// stores/breadcrumb-store.ts
import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";

import { type Route, ROUTES, type Routekeys } from "@/core/constants/misc";

export const ROUTE_LABELS: Partial<Record<Routekeys, string>> = {
    PRODUCTS: "محصولات",
};

const buildInitialLabels = (): Record<string, string> => {
    const result: Record<string, string> = {};
    (Object.entries(ROUTES) as [Routekeys, string][]).forEach(([key, path]) => {
        const label = ROUTE_LABELS[key];
        if (label && typeof path === "string") result[path] = label;
    });
    return result;
};

export type BreadcrumbStore = {
    labels: Record<string, string>;
    setLabel: (path: Route, label: string) => () => void;
};

export const useBreadcrumbStore = create<BreadcrumbStore>((set) => ({
    labels: buildInitialLabels(),

    setLabel: (path, label) => {
        set((s) => ({ labels: { ...s.labels, [path]: label } }))
        return () => set((s) => {
            const next = { ...s.labels };
            delete next[path];
            return { labels: next };
        })
    },


}));

export const useBreadCrumbSelector = createSelectorHooks(useBreadcrumbStore)
