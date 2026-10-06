'use server'

import { updateTag } from "next/cache";

import { isNullOrUndefined } from "@sindresorhus/is";

import { type User } from "@/core/types/entities.types";
import { getCookieValue } from "@/core/utils/cookie/serverCookie";

import { api } from "../../configs/api";
import { profileKey } from "../misc";

export async function updateProfile({ data }: { data: FormData }) {
    const token = await getCookieValue('token')

    if (isNullOrUndefined(token)) return null;
    const r = await api.patch<User>("/account/profile/", data, { token, timeout: 30_000, });
    if (r.ok) {
        updateTag(profileKey(token))
    }
    return r
}


export async function removeAvatar() {
    const token = await getCookieValue('token')
    if (isNullOrUndefined(token)) return null;
    const r = await api.delete("/account/profile/avatar/", { token, });
    console.log("🚀 ~ removeAvatar ~ r:", r)
    return r
}

