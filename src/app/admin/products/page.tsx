"use client";

import { useMemo } from "react";

import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

import { MoreHorizontal } from "lucide-react";

import { Dropdown } from "@/core/components/custom/Dropdown";
import {
  Page,
  PageActions,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeading,
  PageTitle,
} from "@/core/components/custom/layout/Page";
import {
  columnHelper,
  DataTable,
} from "@/core/components/custom/table/DataTable";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { TableContentTemp } from "@/core/components/ui/table";
import { ROUTES } from "@/core/constants/misc";
import { usePaginationQuery } from "@/core/hooks/usePaginationQuery";
import { useProducts } from "@/core/services/client/products";
import { type Product } from "@/core/types/entities.types";
import { getDiscountInfo, toPersianNum } from "@/core/utils/helpers";

const helper = columnHelper<Product>();

export const columns = (router: AppRouterInstance) => [
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
          <span className="font-medium text-emerald-600">
            {toPersianNum(discounted)}
          </span>
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
      <Dropdown
        options={[
          {
            label: "ویرایش",
            value: "edit",
            onClick: () => {
              router.push(
                ROUTES.PRODUCTS_CREATE_UPDATE +
                  `?id=${row.original.id}&edit=true`,
              );
            },
          },
        ]}
        trigger={
          <Button size={"icon"} variant={"secondary"}>
            <MoreHorizontal />
          </Button>
        }
      />
    ),
  }),
];

export default function ProductsPage() {
  const router = useRouter();

  const cols = useMemo(() => columns(router), [router]);
  const { page, size, setPagination } = usePaginationQuery();

  const { data, isPending } = useProducts({ page, size });

  return (
    <Page>
      <PageHeader>
        <PageHeading>
          <PageTitle>مدیریت محصولات</PageTitle>
          <PageDescription>
            لیست تمام محصولات ثبت‌شده به همراه قیمت، موجودی و وضعیت.
          </PageDescription>
        </PageHeading>
        <PageActions>
          <Button
            onClick={() => {
              router.push(ROUTES.PRODUCTS_CREATE_UPDATE);
            }}
          >
            افزودن کالای جدید
          </Button>
        </PageActions>
      </PageHeader>

      <PageContent>
        <DataTable
          columns={cols}
          data={data?.data}
          pageCount={data?.meta?.totalPages}
          rowCount={data?.meta?.rowCount}
          isLoading={isPending}
          pagination={{ page, size }}
          onPaginationChange={setPagination}
        />
      </PageContent>
    </Page>
  );
}
