"use client";

import {
  type ReactTable,
  type StockFeatures,
  type RowData,
} from "@tanstack/react-table";
import {
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";

import { cn } from "@/core/utils/helpers";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface DataTablePaginationProps<TData extends RowData> {
  table: ReactTable<StockFeatures, TData>;
  pageSizeOptions?: number[];
}

export function Pagination<TData extends RowData>({
  table,
  pageSizeOptions = [10, 20, 30, 50],
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.state.pagination;
  const rawPageCount = table.getPageCount();

  const pageCount = rawPageCount < 0 ? 1 : rawPageCount;

  // بررسی امن تعداد ردیف‌های انتخاب شده (بدون نیاز به Row Model اضافه‌تر)
  const totalSelectedRows = Object.keys(table.state.rowSelection || {}).length;

  if (pageCount <= 1 && totalSelectedRows === 0) return null;

  const getVisiblePages = () => {
    const currentPage = pageIndex + 1;

    if (pageCount <= 7) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", pageCount];
    }

    if (currentPage >= pageCount - 3) {
      return [
        1,
        "...",
        pageCount - 4,
        pageCount - 3,
        pageCount - 2,
        pageCount - 1,
        pageCount,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      pageCount,
    ];
  };

  return (
    <div className="border-border flex flex-col-reverse items-center justify-between gap-4 border-t px-3 py-3 text-sm sm:flex-row">
      <div className="text-muted-foreground flex items-center gap-4 text-xs sm:text-sm">
        {totalSelectedRows > 0 && (
          <span>{totalSelectedRows} ردیف انتخاب شده</span>
        )}
        <div className="flex items-center gap-2">
          <span>تعداد در صفحه:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger
              size="sm"
              className="h-8 w-16 px-2 text-xs"
              aria-label="تعداد در صفحه"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="border-border hover:bg-muted rounded-md border p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          title="صفحه اول"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>

        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="border-border hover:bg-muted rounded-md border p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          title="صفحه قبلی"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, idx) => (
            <button
              key={idx}
              onClick={() =>
                typeof page === "number" && table.setPageIndex(page - 1)
              }
              disabled={page === "..."}
              className={cn(
                "flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors",
                page === "..."
                  ? "text-muted-foreground cursor-default"
                  : "hover:bg-muted cursor-pointer border border-transparent",
                pageIndex + 1 === page
                  ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 font-bold"
                  : "",
              )}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="border-border hover:bg-muted rounded-md border p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          title="صفحه بعدی"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
          className="border-border hover:bg-muted rounded-md border p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          title="صفحه آخر"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
