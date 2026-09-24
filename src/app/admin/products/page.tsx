"use client";

import { useRouter } from "next/navigation";

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
import { createAdminRoute } from "@/core/features/admin/sidebarData";
import { usePaginationQuery } from "@/core/hooks/usePaginationQuery";
import { useProducts } from "@/core/services/client/products";
import { type Product } from "@/core/types/entities.types";
import { getDiscountInfo, toPersianNum } from "@/core/utils/helpers";

const helper = columnHelper<Product>();

export const columns = [
  helper.accessor("name", {
    header: "نام محصول",
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
];

export default function ProductsPage() {
  const router = useRouter();

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
          <Button variant="outline">خروجی اکسل</Button>
          <Button
            onClick={() => {
              router.push(createAdminRoute(["/products", "/create-update"]));
            }}
          >
            افزودن کالای جدید
          </Button>
        </PageActions>
      </PageHeader>

      <PageContent>
        <DataTable
          columns={columns}
          data={data?.data}
          pageCount={data?.meta?.totalPages}
          rowCount={data?.meta?.totalPages}
          isLoading={isPending}
          pagination={{ page, size }}
          onPaginationChange={setPagination}
        />
      </PageContent>
    </Page>
  );
}
