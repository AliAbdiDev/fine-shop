"use client";

import * as React from "react";

import { type PaginationState } from "@tanstack/react-table";

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
import { Button } from "@/core/components/ui/button";

// ۱. تعریف ساختار دیتای نمونه
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "فعال" | "غیرفعال";
}

// ۲. ساخت دیتای ماک (۴۵ سطر برای شبیه‌سازی ۵ صفحه)
const MOCK_USERS: User[] = Array.from({ length: 45 }, (_, index) => {
  const id = index + 1;
  return {
    id,
    name: `کاربر شماره ${id}`,
    email: `user${id}@example.com`,
    role: id % 3 === 0 ? "مدیر" : id % 2 === 0 ? "ویرایشگر" : "کاربر عادی",
    status: id % 4 === 0 ? "غیرفعال" : "فعال",
  };
});

// ۳. تعریف ستون‌های جدول با استفاده از columnHelper
const helper = columnHelper<User>();

const columns = [
  helper.accessor("id", {
    header: "شناسه",
    size: 80,
  }),
  helper.accessor("name", {
    header: "نام و نام خانوادگی",
  }),
  helper.accessor("email", {
    header: "ایمیل",
  }),
  helper.accessor("role", {
    header: "نقش",
  }),
  helper.accessor("status", {
    header: "وضعیت",
    cell: (info) => {
      const isStatusActive = info.getValue() === "فعال";
      return (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isStatusActive
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
          }`}
        >
          {info.getValue()}
        </span>
      );
    },
  }),
];

export default function UsersTableDemo() {
  // مدیریت استیت پیجینیشن (شامل pageIndex و pageSize)
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // استیت شبیه‌سازی لودینگ
  const [isLoading, setIsLoading] = React.useState(false);

  // ۴. شبیه‌سازی برش دیتا بر اساس صفحه جاری (کار بک‌اند)
  const data = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return MOCK_USERS.slice(start, end);
  }, [pagination.pageIndex, pagination.pageSize]);

  // محاسبه تعداد کل صفحات
  const pageCount = Math.ceil(MOCK_USERS.length / pagination.pageSize);

  // شبیه‌سازی تاخیر شبکه (Network Delay) هنگام تغییر صفحه
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 150); // ۳۰۰ میلی‌ثانیه لودینگ مصنوعی

    return () => clearTimeout(timer);
  }, [pagination.pageIndex, pagination.pageSize]);

  return (
    <Page>
      <PageHeader>
        <PageHeading>
          <PageTitle>مدیریت کاربران</PageTitle>
          <PageDescription>
            لیست تمام کاربران ثبت‌نام‌شده به همراه جزئیات و امکان تغییر وضعیت.
          </PageDescription>
        </PageHeading>
        <PageActions>
          <Button variant="outline">خروجی اکسل</Button>
          <Button>افزودن کاربر جدید</Button>
        </PageActions>
      </PageHeader>

      <PageContent>
        <DataTable
          columns={columns}
          data={data}
          pageCount={pageCount}
          rowCount={MOCK_USERS.length}
          isLoading={isLoading}
          options={{
            state: { pagination },
            onPaginationChange: setPagination,
          }}
        />
      </PageContent>
    </Page>
  );
}
