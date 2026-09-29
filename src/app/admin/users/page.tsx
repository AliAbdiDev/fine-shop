"use client";

import { useMemo, useState } from "react";

import dynamic from "next/dynamic";
import Image from "next/image";

import { format } from "date-fns-jalali";
import { Ban, CheckCircle2, Search, UserRound } from "lucide-react";

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
import { Input } from "@/core/components/ui/input";
import { useDebounce } from "@/core/hooks/useDebounce";
import { usePaginationQuery } from "@/core/hooks/usePaginationQuery";
import {
  useActivateUser,
  useDeactivateUser,
  useUsers,
} from "@/core/services/client/users";
import { type User } from "@/core/types/entities.types";
import { toPersianNum } from "@/core/utils/helpers";

const AlertModal = dynamic(
  () => import("@/core/components/custom/AlertModal").then((m) => m.AlertModal),
  { ssr: false },
);
const helper = columnHelper<User>();

type ActivateMutation = ReturnType<typeof useActivateUser>;
type DeactivateMutation = ReturnType<typeof useDeactivateUser>;

/* ---------- آواتار کاربر ---------- */

function UserAvatar({ user }: { user: User }) {
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  if (!user.avatarUrl) {
    return (
      <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-full">
        <UserRound className="h-5 w-5" />
      </div>
    );
  }

  return (
    <Image
      src={user.avatarUrl}
      alt={fullName}
      width={40}
      height={40}
      className="h-10 w-10 rounded-full object-cover"
    />
  );
}

/* ---------- دکمه فعال/غیرفعال + مودال تایید ---------- */

export function UserActions({
  user,
  activate,
  deactivate,
}: {
  user: User;
  activate: ActivateMutation;
  deactivate: DeactivateMutation;
}) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const isActive = user.isActive;
  const isPending = activate.isPending || deactivate.isPending;

  return (
    <>
      <Button
        size="sm"
        variant={isActive ? "destructive" : "secondary"}
        disabled={isPending}
        onClick={() => setOpenConfirm(true)}
      >
        {isActive ? (
          <>
            <Ban /> مسدود کردن
          </>
        ) : (
          <>
            <CheckCircle2 /> فعال کردن
          </>
        )}
      </Button>

      <AlertModal
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title={isActive ? "مسدود کردن کاربر" : "فعال کردن کاربر"}
        description={
          isActive ? (
            <>
              آیا از مسدود کردن کاربر <strong>{user.email}</strong> مطمئنید؟
              <br /> تمامی اطلاعات این کاربر دست‌نخورده باقی می‌ماند.
            </>
          ) : (
            <>
              آیا از فعال کردن کاربر <strong>{user.email}</strong> مطمئنید؟
            </>
          )
        }
        confirmText={isActive ? "مسدود کن" : "فعال کن"}
        cancelText="انصراف"
        confirmVariant={isActive ? "destructive" : "default"}
        loading={isPending}
        onConfirm={() => {
          if (!user.id) return;
          if (isActive) {
            deactivate.mutate(user.id);
          } else {
            activate.mutate(user.id);
          }
        }}
      />
    </>
  );
}

/* ---------- ستون‌های جدول ---------- */

export const getColumns = (
  activate: ActivateMutation,
  deactivate: DeactivateMutation,
) => [
  helper.display({
    id: "avatar",
    header: "تصویر",
    maxSize: 70,
    cell: ({ row }) => <UserAvatar user={row.original} />,
  }),

  helper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: "fullName",
    header: "نام و نام خانوادگی",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),

  helper.accessor("email", {
    header: "ایمیل",
    cell: (info) => info.getValue(),
  }),

  helper.accessor("phoneNumber", {
    header: "شماره تماس",
    cell: (info) => toPersianNum(info.getValue() ?? "-"),
  }),

  helper.accessor("createdAt", {
    header: "تاریخ ثبت‌نام",
    cell: (info) =>
      toPersianNum(format(new Date(info.getValue()), "yyyy/MM/dd")),
  }),

  helper.accessor("isActive", {
    header: "وضعیت",
    cell: (info) => {
      const isActive = info.getValue();
      return (
        <Badge variant={isActive ? "secondary" : "destructive"}>
          {isActive ? "فعال" : "غیرفعال"}
        </Badge>
      );
    },
  }),

  helper.display({
    id: "actions",
    maxSize: 180,
    cell: ({ row }) => (
      <UserActions
        user={row.original}
        activate={activate}
        deactivate={deactivate}
      />
    ),
  }),
];

/* ---------- صفحه ---------- */

export default function UsersPage() {
  const activate = useActivateUser();
  const deactivate = useDeactivateUser();

  const { page, size, setPagination } = usePaginationQuery();

  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput.trim(), 400);

  const { data, isPending } = useUsers({
    page,
    pageSize: size,
    search: search || undefined,
  });

  const columns = useMemo(
    () => getColumns(activate, deactivate),
    [activate, deactivate],
  );

  return (
    <Page>
      <PageHeader>
        <PageHeading>
          <PageTitle>مدیریت کاربران</PageTitle>
          <PageDescription>
            لیست کاربران به همراه وضعیت دسترسی. کاربران متخلف را می‌توانید مسدود
            یا دوباره فعال کنید.
          </PageDescription>
        </PageHeading>

        <PageActions>
          <div className="relative w-64">
            <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="جستجو با ایمیل یا نام..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pr-9"
            />
          </div>
        </PageActions>
      </PageHeader>

      <PageContent>
        <DataTable
          columns={columns}
          data={data?.data}
          pageCount={data?.meta?.totalPages}
          rowCount={data?.meta?.rowCount}
          isLoading={isPending || activate.isPending || deactivate.isPending}
          pagination={{ page, size }}
          onPaginationChange={setPagination}
        />
      </PageContent>
    </Page>
  );
}
