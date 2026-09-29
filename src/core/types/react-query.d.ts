// types/react-query.d.ts
import '@tanstack/react-query';

type ToastResolver = (data: unknown) => string | null;

declare module '@tanstack/react-query' {
    interface Register {
        queryMeta: {
            toastMessage?: (error: unknown) => string | null;
        };
        mutationMeta: {
            toastMessage?: (error: unknown) => string | null;
            muteErrorToast?: boolean;
            successToast?: string | false | ToastResolver;
        };
    }
}