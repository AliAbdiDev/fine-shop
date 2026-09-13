
import * as React from "react";

export type UploadState =
    "idle" | "uploading" | "processing" | "error" | "done";

export interface UseImageUploadProps {
    value?: File | string | null;
    onChange?: (value: File | string | null) => void;
    onUpload?: (
        file: File,
        onProgress?: (percent: number) => void,
    ) => Promise<string>;
    accept?: string;
    maxSize?: number;
    disabled?: boolean;
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function validateFile(
    file: File,
    accept: string,
    maxSize?: number,
): string | null {
    if (accept && accept !== "*/*") {
        const acceptedTypes = accept.split(",").map((t) => t.trim().toLowerCase());
        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();

        const matches = acceptedTypes.some((type) => {
            if (type.startsWith(".")) return fileName.endsWith(type);
            if (type.endsWith("/*")) return fileType.startsWith(type.slice(0, -2));
            return fileType === type;
        });

        if (!matches) return `فرمت فایل مجاز نیست. فرمت‌های مجاز: ${accept}`;
    }

    if (maxSize && file.size > maxSize) {
        return `حجم فایل نباید بیشتر از ${formatBytes(maxSize)} باشد.`;
    }
    return null;
}

// ==========================================
// 2. The Custom Hook (Logic Layer)
// ==========================================

export function useImageUpload({
    value,
    onChange,
    onUpload,
    accept = "image/*",
    maxSize,
    disabled = false,
}: UseImageUploadProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const isMounted = React.useRef(true); // برای جلوگیری از آپدیت استیت بعد از unmount

    const [internalFile, setInternalFile] = React.useState<File | null>(null);
    const [uploadState, setUploadState] = React.useState<UploadState>("idle");
    const [progress, setProgress] = React.useState(0);
    const [error, setError] = React.useState<string | null>(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalFile;

    React.useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    React.useEffect(() => {
        if (!currentValue) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUploadState("idle");
            setError(null);
            setProgress(0);
        } else if (typeof currentValue === "string" && uploadState === "idle") {
            setUploadState("done");
        }
    }, [currentValue, uploadState]);

    // مدیریت امن Preview URL (Memory Leak Prevention)
    const previewUrl = React.useMemo(() => {
        if (!currentValue) return null;
        if (typeof currentValue === "string") return currentValue;
        return URL.createObjectURL(currentValue);
    }, [currentValue]);

    React.useEffect(() => {
        return () => {
            if (previewUrl && typeof currentValue !== "string") {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl, currentValue]);

    // منطق اصلی پردازش فایل
    const processFile = React.useCallback(
        async (file: File) => {
            const validationError = validateFile(file, accept, maxSize);
            if (validationError) {
                setError(validationError);
                setUploadState("error");
                return;
            }

            if (!isControlled) setInternalFile(file);
            setError(null);

            if (onUpload) {
                setUploadState("uploading");
                setProgress(0);
                try {
                    const uploadedUrl = await onUpload(file, (percent) => {
                        if (isMounted.current)
                            setProgress(Math.min(100, Math.max(0, percent)));
                    });
                    if (isMounted.current) {
                        setUploadState("done");
                        onChange?.(uploadedUrl);
                    }
                } catch (err) {
                    if (isMounted.current) {
                        setUploadState("error");
                        setError(err instanceof Error ? err.message : "خطا در آپلود فایل");
                    }
                }
            } else {
                setUploadState("done");
                onChange?.(file);
            }
        },
        [accept, maxSize, isControlled, onUpload, onChange],
    );

    // هندلرهای رویداد
    const handleFileChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = event.target.files?.[0];
            // Reset input value so the same file can be selected again after an error
            if (event.target) event.target.value = "";
            if (!selectedFile) return;
            processFile(selectedFile);
        },
        [processFile],
    );

    const handleRemove = React.useCallback(
        (e?: React.MouseEvent) => {
            e?.stopPropagation();
            if (!isControlled) setInternalFile(null);
            setUploadState("idle");
            setError(null);
            setProgress(0);
            onChange?.(null);
        },
        [isControlled, onChange],
    );

    const handleRetry = React.useCallback(
        (e?: React.MouseEvent) => {
            e?.stopPropagation();
            if (currentValue instanceof File) {
                processFile(currentValue);
            } else {
                inputRef.current?.click();
            }
        },
        [currentValue, processFile],
    );

    // محاسبه متادیتای نمایشی
    const title = React.useMemo(() => {
        if (!currentValue) return "انتخاب تصویر";
        if (typeof currentValue === "string") {
            const parts = currentValue.split("/");
            return parts[parts.length - 1] || "تصویر انتخاب شده";
        }
        return currentValue.name;
    }, [currentValue]);

    const description = React.useMemo(() => {
        if (error) return error;
        if (uploadState === "uploading") return `در حال آپلود... ${progress}%`;
        if (uploadState === "processing") return "در حال پردازش...";
        if (currentValue instanceof File) return formatBytes(currentValue.size);
        if (typeof currentValue === "string") return "تصویر آپلود شده";
        return "برای انتخاب یا کشیدن تصویر کلیک کنید";
    }, [error, uploadState, progress, currentValue]);

    return {
        inputRef,
        currentValue,
        previewUrl,
        uploadState,
        progress,
        error,
        isDragging,
        title,
        description,
        handlers: {
            handleFileChange,
            handleRemove,
            handleRetry,
            triggerPicker: () => inputRef.current?.click(),
        },
        dropzoneProps: {
            onDragOver: (e: React.DragEvent) => {
                e.preventDefault();
                if (!disabled) setIsDragging(true);
            },
            onDragLeave: (e: React.DragEvent) => {
                e.preventDefault();
                setIsDragging(false);
            },
            onDrop: (e: React.DragEvent) => {
                e.preventDefault();
                setIsDragging(false);
                if (disabled) return;
                const droppedFile = e.dataTransfer.files?.[0];
                if (droppedFile) processFile(droppedFile);
            },
        },
    };
}