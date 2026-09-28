// types/react-query.d.ts
import '@tanstack/react-query';

declare module '@tanstack/react-query' {
    interface Register {
        queryMeta: { toastMessage?: (error: unknown) => string | null };
        mutationMeta: { toastMessage?: (error: unknown) => string | null };
    }
}