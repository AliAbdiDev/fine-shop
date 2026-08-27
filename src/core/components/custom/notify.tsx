import { toast } from "sonner";

import { APP_MODE } from "@/core/constants/misc";
import {
  ERROR_MESSAGES,
  GENERIC_ERROR,
  GENERIC_SUCCESS,
} from "@/core/constants/status-messages";
import { type ApiError } from "@/core/services/configs/fetcher/types/client.types";

export function resolveErrorMessage(error: unknown): string {
  if (!error) return GENERIC_ERROR;

  if (typeof error === "object" && "status" in error) {
    const apiError = error as ApiError;

    if (apiError.code && apiError.code in ERROR_MESSAGES) {
      return ERROR_MESSAGES[apiError.code as keyof typeof ERROR_MESSAGES];
    }

    if (
      apiError.status === 0 ||
      apiError.status === 502 ||
      apiError.status === 504
    ) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }

    if (apiError.message) {
      return apiError.message;
    }
  }

  if (typeof error === "string") return error;

  return GENERIC_ERROR;
}

export const notify = {
  success: (title: string = GENERIC_SUCCESS, description?: string) => {
    if (!APP_MODE.isClient()) return;
    toast.success(title, { description });
  },

  error: (error?: unknown) => {
    if (!APP_MODE.isClient()) return;
    const title = resolveErrorMessage(error);
    toast.error(title);
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
