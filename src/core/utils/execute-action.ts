import { notify } from '../components/custom/notify';

interface ActionError {
    message: string;
    fields?: Record<string, string>;
}

interface ExecuteOptions {
    successMessage?: string;
    showErrorToast?: boolean;
}

export async function executeAction<TArgs extends unknown[], TReturn>(
    action: (...args: TArgs) => Promise<TReturn | ActionError | void>,
    args: TArgs,
    options: ExecuteOptions = {}
): Promise<TReturn | ActionError | void> {
    const { successMessage, showErrorToast = true } = options;

    try {
        const result = await action(...args);

        if (result && typeof result === 'object' && 'message' in result) {
            if (showErrorToast) {
                notify.error(result.message);
            }
            return result;
        }

        if (successMessage) notify.success(successMessage);

        return result;

    } catch (e) {
        if (showErrorToast) notify.error(e);
    }
}