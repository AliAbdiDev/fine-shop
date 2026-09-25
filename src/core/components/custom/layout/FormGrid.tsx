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
        "xs:grid-cols-2",
        "lg:grid-cols-3",
        "gap-5 md:gap-7",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
