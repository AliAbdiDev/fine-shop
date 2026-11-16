"use cache";

import { cacheTag } from "next/cache";
import { cacheLife } from "next/cache";

import { isNullOrUndefined } from "@sindresorhus/is";

import { type User } from "@/core/types/entities.types";

import { api } from "../../configs/api";

import { profileKey, type Token } from "../misc-utils";

export async function getProfile({ token }: { token: Token }) {
    if (isNullOrUndefined(token)) return null;

    try {
        cacheTag(profileKey(token));
        cacheLife("hours");
        const r = await api.get<User>("/account/profile/", { token });
        if (r.ok && r.data) return r;
        return null;
    } catch {
        return null;
    }
}
