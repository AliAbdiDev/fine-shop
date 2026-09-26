import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { createStore } from "zustand";

import { type ProductAttributes, type ProductAttribute } from "../types/entities.types";
import { type Override } from "../types/misc";

export type ProductAttributeStore = {
    atts: ProductAttributes
    init: (payload: ProductAttributes) => void;
    addAtt: (payload: Override<ProductAttribute, { values: string[] | null, key: string | null }>) => { message: string } | void;
    removeAtt: (key: string) => void,
}

export const useProductAttributeStore = createStore<ProductAttributeStore>((set, get) => {
    return {
        atts: [],
        init: (payload) => {
            if (payload && payload?.length) set({ atts: payload })
        },
        addAtt: (payload) => {
            const atts = get().atts;

            if (atts.some((att) => payload.key === att.key)) {
                return {
                    message: "این ویژگی را قبلا اضافه کردید. نمیتوانید مجدد اضافه کنید.",
                };
            }

            if (!payload.key) {
                return { message: "ویژگی را تعیین کنید" };
            }

            if (!payload.values || payload.values.length === 0) {
                return { message: "مقدار ویژگی را تعیین کنید" };
            }

            const nextAtt: ProductAttribute = {
                key: payload.key,
                values: payload.values,
            };

            set((prev) => ({ atts: [...prev.atts, nextAtt] }));
        },
        removeAtt: (key) => {
            set((prev) => ({ atts: prev.atts.filter((att) => att?.key !== key) }))
        }
    }
})

export const useProductAttributeSelector = createSelectorHooks(useProductAttributeStore)