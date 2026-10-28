"use client";

import { useState } from "react";

import { type Route } from "next";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { MoreHorizontal, PackageMinusIcon, Pen } from "lucide-react";

import { Dropdown } from "@/core/components/custom/Dropdown";
import { columnHelper } from "@/core/components/custom/table/DataTable";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { TableContentTemp } from "@/core/components/ui/table";
import { ROUTES } from "@/core/constants/misc";
import { type useRemoveProduct } from "@/core/services/client/products";
import { type Product } from "@/core/types/entities.types";
import { getDiscountInfo, toPersianNum } from "@/core/utils/helpers";

const helper = columnHelper<Product>();

type RemoveMutation = ReturnType<typeof useRemoveProduct>;

const AlertModal = dynamic(
  () => import("@/core/components/custom/AlertModal").then((m) => m.AlertModal),
  { ssr: false },
);

export function ProductActions({
  product,
  remove,
}: {
  product: Product;
  remove: RemoveMutation;
}) {
  const router = useRouter();
  const [openRemove, setOpenRemove] = useState(false);

  return (
    <>
      <Dropdown
        showSelected={false}
        options={[
          {
            label: (
              <div className="flex items-center gap-1">
                <Pen /> ویرایش
              </div>
            ),
            value: "edit",
            onClick: () => {
              router.push(
                `${ROUTES.PRODUCTS_CREATE_UPDATE}?id=${product.id}&edit=true` as Route,
              );
            },
          },
          {
            label: (
              <div className="flex items-center gap-1">
                <PackageMinusIcon /> حذف
              </div>
            ),
            value: "remove",
            onClick: () => setOpenRemove(true),
          },
        ]}
        trigger={
          <Button size="icon" variant="secondary" disabled={remove.isPending}>
            <MoreHorizontal />
          </Button>
        }
      />

      <AlertModal
        open={openRemove}
        onOpenChange={setOpenRemove}
        title="حذف محصول"
        description={
          <>
            آیا از حذف این محصول <strong>{product.name}</strong> مطمئنید؟
            <br /> این عملیات غیر قابل بازگشت است
          </>
        }
        confirmText="حذف کن"
        cancelText="انصراف"
        confirmVariant="destructive"
        loading={remove.isPending}
        onConfirm={() => {
          if (!product.id) return;
          remove.mutate(product.id);
        }}
      />
    </>
  );
}

export const getProductCols = (remove: RemoveMutation) => [
  helper.accessor("name", {
    header: "نام محصول",
    maxSize: 600,
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),

  helper.accessor("category", {
    header: "دسته‌بندی",
    cell: (info) => <Badge variant="outline">{info.getValue()}</Badge>,
  }),

  helper.accessor("stock", {
    header: "موجودی",
    cell: (info) => toPersianNum(info.getValue()),
  }),

  helper.accessor("basePrice", {
    header: "قیمت پایه",
    cell: (info) => toPersianNum(info.getValue()),
  }),

  helper.accessor("discountedPrice", {
    header: "قیمت با تخفیف",
    cell: (info) => {
      const discounted = info.getValue();
      const base = info.row.original.basePrice;

      if (!discounted || discounted >= base) return <TableContentTemp />;

      const percent = getDiscountInfo(base, discounted).percent;

      return (
        <div className="flex items-center gap-2">
          {toPersianNum(discounted)}
          <Badge variant="secondary">٪{toPersianNum(percent)}</Badge>
        </div>
      );
    },
  }),

  helper.accessor("isAvailable", {
    header: "وضعیت",
    cell: (info) => {
      const isAvailable = info.getValue();
      return (
        <Badge variant={isAvailable ? "secondary" : "outline"}>
          {isAvailable ? "موجود" : "ناموجود"}
        </Badge>
      );
    },
  }),

  helper.display({
    id: "actions",
    maxSize: 55,
    cell: ({ row }) => (
      <ProductActions product={row.original} remove={remove} />
    ),
  }),
];
