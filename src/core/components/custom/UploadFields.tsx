import * as React from "react";

import { cn } from "cn";
import { Camera, X, RefreshCw, Loader2 } from "lucide-react";

import {
  useImageUpload,
  type UseImageUploadProps,
} from "@/core/hooks/useUpload";

interface ImageUploadProps extends UseImageUploadProps {
  className?: string;
  isDisabled?: boolean;
  onRemove?: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  className,
  isDisabled,
  onRemove,
  ...hookProps
}) => {
  const accept = "image/*";
  const {
    inputRef,
    previewUrl,
    uploadState,
    progress,
    error,
    isDragging,
    title,
    handlers,
    dropzoneProps,
  } = useImageUpload({ accept, ...hookProps });

  const isLoading = uploadState === "uploading" || uploadState === "processing";

  return (
    <div
      {...dropzoneProps}
      onClick={isDisabled ? undefined : handlers.triggerPicker}
      title={title}
      className={cn(
        "group relative flex size-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors duration-200 ease-in-out",
        "border-border hover:border-muted-foreground/50 hover:bg-accent/50",
        isDragging && !isDisabled && "border-primary bg-primary/10",
        error && "border-destructive bg-destructive/10",
        isDisabled &&
          "hover:border-border cursor-not-allowed opacity-50 hover:bg-transparent",
        className,
      )}
    >
      {previewUrl ? (
        <>
          {
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          }

          {isLoading && (
            <div className="bg-background/80 text-foreground absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm">
              <Loader2 className="mb-1 animate-spin" size={20} />
              <span className="text-xs font-medium">{progress}%</span>
            </div>
          )}

          {error && !isLoading && (
            <div className="bg-destructive/90 text-destructive-foreground absolute inset-0 flex flex-col items-center justify-center p-2 text-center backdrop-blur-sm">
              <span className="line-clamp-3 text-[10px] leading-tight">
                {error}
              </span>
              <button
                type="button"
                onClick={handlers.handleRetry}
                className="bg-background/20 hover:bg-background/40 mt-1.5 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px]"
              >
                <RefreshCw size={10} />
                تلاش مجدد
              </button>
            </div>
          )}

          {!isLoading && !isDisabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlers.handleRemove();
                onRemove?.();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute top-1 right-1 rounded-full p-1"
              aria-label="حذف تصویر"
            >
              <X size={20} />
            </button>
          )}
        </>
      ) : (
        <>
          <Camera
            size={28}
            className={cn(
              "text-foreground mb-1.5",
              isDisabled && "text-muted-foreground/50",
            )}
          />
          <span
            className={cn(
              "text-muted-foreground text-xs font-medium",
              isDisabled && "text-muted-foreground/50",
            )}
          >
            آپلود
          </span>
        </>
      )}

      <input
        type="file"
        ref={inputRef}
        accept={accept}
        onChange={handlers.handleFileChange}
        className="hidden"
        disabled={isDisabled}
      />
    </div>
  );
};
