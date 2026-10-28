import { type AppErrorCode } from "@/core/constants/status-messages";

export interface ErrorEnvelope {
    error: {
        code: AppErrorCode;
        message: string | null;
        details: { name: string[] } | null;
    };
}
