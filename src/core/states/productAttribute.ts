import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { createStore } from "zustand";

export type ProductAttributeStore = {
    atts: { key: string, value: string }[]
    addAtt: (params: { key: string, value: string }) => { message: string } | void;
    removeAtt: (key: string) => void,
}

export const useProductAttributeStore = createStore<ProductAttributeStore>((set, get) => {
    return {
        atts: [],
        addAtt: (payload) => {
            const atts = get().atts;
            if (atts.some((att) => payload.key === att.key)) return {
                message: 'این ویژگی را قبلا اضافه کردید. نمیتوانید مجدد اضافه کنید.'
            };
            set((prev) => ({ atts: [...prev.atts, payload] }))
        },
        removeAtt: (key) => {
            set((prev) => ({ atts: prev.atts.filter((att) => att.key !== key) }))
        }
    }
})

export const useProductAttributeSelector = createSelectorHooks(useProductAttributeStore)