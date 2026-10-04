"use client";

import { useMemo } from "react";

import { useRouter } from "next/navigation";

import { PackagePlusIcon } from "lucide-react";

import {
  Page,
  PageActions,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeading,
  PageTitle,
} from "@/core/components/custom/layout/Page";
import { DataTable } from "@/core/components/custom/table/DataTable";
import { Button } from "@/core/components/ui/button";
import { getProductCols } from "@/core/features/admin/products/column";
import { usePaginationQuery } from "@/core/hooks/usePaginationQuery";
import { useProducts, useRemoveProduct } from "@/core/services/client/products";

export default function ProductsPage() {
  const router = useRouter();
  const remove = useRemoveProduct();

  const { page, size, setPagination } = usePaginationQuery();

  const { data, isPending } = useProducts({ page, pageSize: size });

  const columns = useMemo(() => getProductCols(remove), [remove]);

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
              router.push("/admin/products/create-update");
            }}
          >
            <PackagePlusIcon /> ایجاد محصول
          </Button>
        </PageActions>
      </PageHeader>

      <PageContent>
        <DataTable
          columns={columns}
          data={data?.data}
          pageCount={data?.meta?.totalPages}
          rowCount={data?.meta?.rowCount}
          isLoading={isPending || remove.isPending}
          pagination={{ page, size }}
          onPaginationChange={setPagination}
        />
      </PageContent>
    </Page>
  );
}
