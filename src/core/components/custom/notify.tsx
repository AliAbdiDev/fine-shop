import { isNullOrUndefined, isString } from "@sindresorhus/is";
import { toast } from "sonner";

import { APP_MODE } from "@/core/constants/misc";
import {
  ERROR_MESSAGES,
  type ErrorMessagesKeys,
  GENERIC_ERROR,
  GENERIC_SUCCESS,
} from "@/core/constants/status-messages";
import { type ApiError } from "@/core/services/configs/fetcher/types/client.types";

interface ApiClientError extends Error {
  apiError: ApiError;
}

function isApiClientError(e: unknown): e is ApiClientError {
  return (
    e instanceof Error &&
    e.name === "ApiClientError" &&
    "apiError" in e &&
    typeof (e as ApiClientError).apiError === "object" &&
    (e as ApiClientError).apiError !== null
  );
}

export function resolveErrorMessage(error: unknown): string {
  if (isString(error)) {
    if (!error || !(error in ERROR_MESSAGES)) return GENERIC_ERROR;
    return ERROR_MESSAGES[error as ErrorMessagesKeys];
  }
  if (isApiClientError(error)) {
    const { code } = error.apiError;
    if (!code || !(code in ERROR_MESSAGES)) return GENERIC_ERROR;

    return ERROR_MESSAGES[code as ErrorMessagesKeys];
  }
  return GENERIC_ERROR;
}

export const notify = {
  success: (title: string = GENERIC_SUCCESS, description?: string) => {
    if (!APP_MODE.isClient()) return;
    toast.success(title, { description });
  },

  error: (error?: unknown) => {
    if (!APP_MODE.isClient()) return;

    const msg = resolveErrorMessage(error);
    if (!isNullOrUndefined(msg)) {
      toast.error(msg);
      return;
    }

    if (typeof error === "string") {
      toast.error(error);
      return;
    }
  },

  info: (title: string, description?: string) => {
    if (!APP_MODE.isClient()) return;
    toast.info(title, { description });
  },

  warning: (title: string, description?: string) => {
    if (!APP_MODE.isClient()) return;
    toast.warning(title, { description });
  },
};
