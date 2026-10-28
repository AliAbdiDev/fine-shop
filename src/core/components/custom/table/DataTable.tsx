"use client";

import * as React from "react";

import {
  type ColumnDef,
  type PaginationState,
  type OnChangeFn,
  type TableOptions,
  flexRender,
  stockFeatures,
  useTable,
  type Row,
  type RowData,
  type StockFeatures,
  createColumnHelper,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { cn } from "@/core/utils/helpers";

import { Pagination } from "./Pagination";

export type DataTableRow<TData extends RowData> = Row<StockFeatures, TData>;

export interface DataTablePagination {
  page: number;
  size: number;
}

/**
 * حالت جدول:
 * - `"server"` (پیش‌فرض): داده از سرور صفحه‌بندی/سورت/فیلتر می‌شود.
 *   باید `pagination` و `onPaginationChange` بدهی و `pageCount`/`rowCount` را از متادیتا پر کنی.
 * - `"client"`: تمام داده را یک‌جا می‌دهی، TanStack خودش صفحه‌بندی/سورت/فیلتر را انجام می‌دهد.
 *   `pagination`/`onPaginationChange` را نده.
 */
export type DataTableMode = "server" | "client";

interface DataTableProps<TData extends RowData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<StockFeatures, TData, any>[];
  data: TData[] | undefined | null;

  /** "server" (پیش‌فرض) یا "client" */
  mode?: DataTableMode;

  /* ---------- server mode فقط ---------- */
  pageCount?: number | null;
  rowCount?: number | null;

  /* ---------- مشترک ---------- */
  isLoading?: boolean;
  showPagination?: boolean;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  onRowClick?: (row: DataTableRow<TData>) => void;
  containerClassName?: string;

  /* ---------- کنترل‌شده (server mode) ---------- */
  pagination?: DataTablePagination;
  onPaginationChange?: (next: DataTablePagination) => void;

  /* ---------- پاس دادن به TanStack ---------- */
  options?: Omit<
    TableOptions<StockFeatures, TData>,
    | "data"
    | "columns"
    | "features"
    | "state"
    | "onPaginationChange"
    | "manualPagination"
  > & {
    state?: Omit<
      NonNullable<TableOptions<StockFeatures, TData>["state"]>,
      "pagination"
    >;
  };
}

export const columnHelper = <TData extends RowData>() => {
  return createColumnHelper<StockFeatures, TData>();
};

export function DataTable<TData extends RowData>({
  columns,
  data,
  mode = "server",
  pageCount,
  rowCount,
  isLoading = false,
  showPagination = true,
  pageSizeOptions = [10, 20, 30, 50],
  defaultPageSize,
  onRowClick,
  containerClassName,
  pagination,
  onPaginationChange,
  options,
}: DataTableProps<TData>) {
  const isServerMode = mode === "server";
  const isControlled = pagination !== undefined;

  const resolvedDefaultPageSize = defaultPageSize ?? pageSizeOptions[1] ?? 20;

  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: resolvedDefaultPageSize,
    });

  // در حالت server با pagination کنترل‌شده، از بیرون می‌خوانیم.
  // در حالت client یا server غیرکنترل‌شده، از internal استفاده می‌کنیم.
  const tablePagination: PaginationState = React.useMemo(
    () =>
      pagination
        ? {
            pageIndex: Math.max(0, pagination.page - 1),
            pageSize: pagination.size,
          }
        : internalPagination,
    [pagination, internalPagination],
  );

  const handlePaginationChange = React.useCallback<OnChangeFn<PaginationState>>(
    (updater) => {
      const prev = tablePagination;
      const next = typeof updater === "function" ? updater(prev) : updater;
      const sizeChanged = next.pageSize !== prev.pageSize;

      const normalized: PaginationState = sizeChanged
        ? { pageIndex: 0, pageSize: next.pageSize }
        : next;

      if (isControlled) {
        onPaginationChange?.({
          page: normalized.pageIndex + 1,
          size: normalized.pageSize,
        });
      } else {
        setInternalPagination(normalized);
      }
    },
    [tablePagination, isControlled, onPaginationChange],
  );

  const table = useTable({
    data: data || [],
    columns,
    features: stockFeatures,
    // 👇 کلید اصلی: در server mode صفحه‌بندی دستی، در client mode خودکار
    manualPagination: isServerMode,
    ...(isServerMode && {
      pageCount: pageCount ?? -1,
      rowCount: rowCount ?? 0,
    }),
    ...options,
    state: {
      ...options?.state,
      pagination: tablePagination,
    },
    onPaginationChange: handlePaginationChange,
  });

  const colSpanCount = Math.max(1, table.getAllLeafColumns().length);

  const handleRowClick = (e: React.MouseEvent, row: DataTableRow<TData>) => {
    if (!onRowClick) return;

    const target = e.target as HTMLElement;
    const isInteractive = target.closest(
      'button, a, input, select, textarea, [role="checkbox"], [role="menuitem"], [data-prevent-row-click="true"]',
    );

    if (!isInteractive) onRowClick(row);
  };

  return (
    <div
      className={cn(
        "border-border flex size-full flex-col overflow-hidden rounded-md border",
        containerClassName,
      )}
    >
      <div className="bg-background min-h-[40vh] w-full overflow-auto md:min-h-[56vh]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width:
                        header.column.getSize() === 150
                          ? "auto"
                          : header.column.getSize(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow className="hover:bg-inherit">
                <TableCell colSpan={colSpanCount} className="p-0">
                  <div className="flex h-[49vh] items-center justify-center">
                    <Loader2 className="text-muted-foreground size-6 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={(e) => handleRowClick(e, row)}
                  className={cn(
                    onRowClick &&
                      "hover:bg-muted/60 cursor-pointer transition-colors",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={colSpanCount}
                  className="text-muted-foreground h-32 text-center"
                >
                  داده‌ای برای نمایش وجود ندارد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <Pagination table={table} pageSizeOptions={pageSizeOptions} />
      )}
    </div>
  );
}
