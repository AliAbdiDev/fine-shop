"use cache";

import { cacheTag } from "next/cache";
import { cacheLife } from "next/cache";

import { isNullOrUndefined } from "@sindresorhus/is";

import { type User } from "@/core/types/entities.types";

import { api } from "../../configs/api";
import { profileKey, type Token } from "../misc";

export async function getProfile({ token }: { token: Token }) {
    if (isNullOrUndefined(token)) return null;

    cacheTag(profileKey(token));
    cacheLife("weeks");
    const r = await api.get<User>("/account/profile/", { token })
    if (r.ok) return r;
}