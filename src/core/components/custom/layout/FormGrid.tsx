import { cn } from "@/core/utils/helpers";

export function FormGrid({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid grid-cols-1",
        "md:grid-cols-2",
        "xl:grid-cols-3",
        "gap-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
