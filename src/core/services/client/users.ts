import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthSelector } from "@/core/states/auth";
import {
    type Users,
    type EntityId,
} from "@/core/types/entities.types";

import { type ListParams, userKeys } from "./keys";
import { api } from "../configs/api";
import { type ApiError } from "../configs/fetcher/types/client.types";
import { unwrap } from "../configs/fetcher/unwrap";

export function useUsers(p: ListParams) {
    const token = useAuthSelector.useToken();

    return useQuery({
        queryKey: userKeys.list(p),
        queryFn: async () =>
            unwrap(
                await api.get<undefined, Users>("/account/users/", {
                    query: p,
                    token,
                }),
            ),
        enabled: !!token,
    });
}

export const useActivateUser = () => {
    const token = useAuthSelector.useToken();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { id: EntityId; isActive: boolean }) => {
            return unwrap(
                await api.patch<void, void, { isActive: boolean }>(
                    `/account/users/${payload.id}/`,
                    payload,
                    { token },
                ),
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        },
        meta: {
            toastMessage: (error) => {
                const apiError = error as ApiError;
                if (apiError.code === "NOT_FOUND") {
                    return "کاربر مورد نظر پیدا نشد.";
                }
                return null;
            },
        },
    });
};