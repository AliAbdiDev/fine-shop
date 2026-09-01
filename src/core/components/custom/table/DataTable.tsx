"use client";

import * as React from "react";

import {
  type ColumnDef,
  type TableOptions,
  flexRender,
  stockFeatures,
  useTable,
  type Row,
  type RowData,
  type StockFeatures,
  createColumnHelper,
} from "@tanstack/react-table";

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

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<StockFeatures, TData, unknown>[];
  data: TData[];
  pageCount?: number;
  rowCount?: number;
  isLoading?: boolean;
  showPagination?: boolean;
  pageSizeOptions?: number[];
  onRowClick?: (row: DataTableRow<TData>) => void;
  containerClassName?: string;
  options?: Omit<
    TableOptions<StockFeatures, TData>,
    "data" | "columns" | "features"
  >;
}

export const columnHelper = <TData extends RowData>() => {
  return createColumnHelper<StockFeatures, TData>();
};

export function DataTable<TData extends RowData>({
  columns,
  data,
  pageCount = -1,
  rowCount,
  isLoading = false,
  showPagination = true,
  pageSizeOptions = [10, 20, 30, 50],
  onRowClick,
  containerClassName,
  options,
}: DataTableProps<TData>) {
  const table = useTable({
    data,
    columns,
    features: stockFeatures,
    manualPagination: true,
    pageCount: pageCount,
    rowCount: rowCount,
    ...options,
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
        "border-border bg-background flex w-full flex-col overflow-hidden rounded-md border",
        containerClassName,
      )}
    >
      <div className="relative min-h-50 w-full overflow-auto">
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
              <TableRow>
                <TableCell
                  colSpan={colSpanCount}
                  className="text-muted-foreground h-32 text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="animate-pulse">
                      در حال دریافت اطلاعات...
                    </span>
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
