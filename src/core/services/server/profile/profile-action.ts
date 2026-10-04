'use server'

import { updateTag } from "next/cache";

import { isNullOrUndefined } from "@sindresorhus/is";

import { type User } from "@/core/types/entities.types";

import { api } from "../../configs/api";
import { profileKey, type Token } from "../misc";

export async function updateProfile({ token, data }: { token: Token, data: FormData }) {

    if (isNullOrUndefined(token)) return null;
    const r = await api.patch<User>("/account/profile/", data, { token, timeout: 30_000, });
    console.log("🚀 ~ updateProfile ~ r:", r)
    if (r.ok) {
        updateTag(profileKey(token))
        return r
    }
}