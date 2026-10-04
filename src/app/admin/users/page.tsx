"use client";

import { useMemo, useState } from "react";

import dynamic from "next/dynamic";

import { isNullOrUndefined, isString } from "@sindresorhus/is";
import { Search, UserCheck2Icon, UserRound, UserX2Icon } from "lucide-react";

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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { TableContentTemp } from "@/core/components/ui/table";
import { useDebounce } from "@/core/hooks/useDebounce";
import { usePaginationQuery } from "@/core/hooks/usePaginationQuery";
import { useActivateUser, useUsers } from "@/core/services/client/users";
import { type User } from "@/core/types/entities.types";
import { isFile, toPersianNum } from "@/core/utils/helpers";
import { formatAnyDate } from "@/core/utils/jalali";

const AlertModal = dynamic(
  () => import("@/core/components/custom/AlertModal").then((m) => m.AlertModal),
  { ssr: false },
);
const helper = columnHelper<User>();

type ActivateMutation = ReturnType<typeof useActivateUser>;

function UserAvatar({ user }: { user: User }) {
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  console.log("🚀 ~ UserAvatar ~ user:", user);
  if (isFile(user.avatar) || isNullOrUndefined(user?.avatar)) {
    return (
      <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-full">
        <UserRound className="h-5 w-5" />
      </div>
    );
  }

  return (
    <Avatar>
      {isString(user?.avatar) && (
        <AvatarImage src={user?.avatar} alt={fullName} />
      )}
      <AvatarFallback> {fullName?.slice(0, 2)}</AvatarFallback>
    </Avatar>
  );
}

/* ---------- دکمه فعال/غیرفعال + مودال تایید ---------- */

export function UserActions({
  user,
  activate,
}: {
  user: User;
  activate: ActivateMutation;
}) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const isActive = user.isActive;
  const isPending = activate.isPending;

  return (
    <>
      <Button
        size="xs"
        variant={isActive ? "destructive" : "secondary"}
        disabled={isPending || user.isSuperuser}
        onClick={() => setOpenConfirm(true)}
      >
        {isActive ? (
          <>
            <UserX2Icon /> مسدود کردن
          </>
        ) : (
          <>
            <UserCheck2Icon /> فعال کردن
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
          if (!user.id || isNullOrUndefined(user.isActive)) return;
          activate.mutate({ id: user.id, isActive: !user.isActive });
        }}
      />
    </>
  );
}

/* ---------- ستون‌های جدول ---------- */

export const getColumns = (activate: ActivateMutation) => [
  helper.display({
    id: "avatar",
    header: "تصویر",
    maxSize: 70,
    cell: ({ row }) => <UserAvatar user={row.original} />,
  }),

  helper.accessor((row) => `${row.firstName ?? ""} ${row.lastName ?? ""}`, {
    id: "fullName",
    header: "نام و نام خانوادگی",
    cell: (info) => {
      const names = info.getValue();

      return names.trim() !== "" ? (
        <span className="font-medium">{info.getValue()}</span>
      ) : (
        <TableContentTemp />
      );
    },
  }),

  helper.accessor("email", {
    header: "ایمیل",
    cell: (info) => info.getValue(),
  }),

  helper.accessor("phoneNumber", {
    header: "شماره تماس",
    cell: (info) => {
      const value = info.getValue();
      return value ? toPersianNum("0" + value, false) : <TableContentTemp />;
    },
  }),

  helper.accessor("createdAt", {
    header: "تاریخ ثبت‌نام",
    cell: (info) => {
      const value = info.getValue();
      return value ? formatAnyDate(value) : <TableContentTemp />;
    },
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

  helper.accessor("isSuperuser", {
    header: "نقش",
    cell: (info) => {
      const isAdmin = info.getValue();
      return (
        <Badge variant={isAdmin ? "default" : "outline"}>
          {isAdmin ? "مدیر" : "مشتری"}
        </Badge>
      );
    },
  }),
  helper.accessor("lastLogin", {
    header: "آخرین ورود",
    cell: (info) => {
      const value = info.getValue();
      return value ? formatAnyDate(value) : <TableContentTemp />;
    },
  }),

  helper.display({
    id: "actions",
    maxSize: 180,
    cell: ({ row }) => <UserActions user={row.original} activate={activate} />,
  }),
];

/* ---------- صفحه ---------- */

export default function UsersPage() {
  const activate = useActivateUser();

  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput, 300);
  const { page, size, setPagination } = usePaginationQuery({
    resetDeps: [search],
  });

  const { data, isPending } = useUsers({
    page,
    pageSize: size,
    search: search || undefined,
  });

  const columns = useMemo(() => getColumns(activate), [activate]);

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
              onValueChange={(val) => {
                if (!isNullOrUndefined(val.trim())) setSearchInput(val);
              }}

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
          isLoading={isPending || activate.isPending}
          pagination={{ page, size }}
          onPaginationChange={setPagination}
        />
      </PageContent>
    </Page>
  );
}
