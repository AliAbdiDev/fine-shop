import { isNullOrUndefined, isNumber } from "@sindresorhus/is";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthSelector } from "@/core/states/auth";
import {
    type User,
    type Users,
    type EntityId,
} from "@/core/types/entities.types";

import { type ListParams, userKeys } from "./keys";
import { api } from "../configs/api";
import { paginatedAdapter } from "../configs/fetcher/adapters";
import { type ApiError } from "../configs/fetcher/types/client.types";
import { type DrfPaginated } from "../configs/fetcher/types/contract.types";
import { unwrap } from "../configs/fetcher/unwrap";


export function useUsers(p: ListParams) {
    return useQuery({
        queryKey: userKeys.list(p),
        queryFn: async () =>
            unwrap(
                await api.get<DrfPaginated<User>, Users>("/user/", {
                    query: p,
                    adapter: paginatedAdapter(p),
                }),
            ),
    });
}


export function useUser({
    id,
    enabled = true,
}: {
    id: EntityId | null;
    enabled?: boolean;
}) {
    const isId = isNumber(id);

    return useQuery({
        queryKey: isId ? userKeys.detail(id) : [],
        queryFn: async () => {
            if (isNullOrUndefined(isId)) throw new Error("id is required");
            return unwrap(await api.get<User>(`/user/${id}/`));
        },
        enabled: enabled && isId,
    });
}


export const useActivateUser = () => {
    const token = useAuthSelector.useToken();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: EntityId) =>
            unwrap(
                await api.patch<User, User>(
                    `/user/${id}/activate/`,
                    undefined,
                    { token },
                ),
            ),
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


export const useDeactivateUser = () => {
    const token = useAuthSelector.useToken();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: EntityId) =>
            unwrap(
                await api.patch<User, User>(
                    `/user/${id}/deactivate/`,
                    undefined,
                    { token },
                ),
            ),
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