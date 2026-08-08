"use client";

import { HeadphonesIcon, MegaphoneIcon, ReceiptTextIcon } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/core/components/ui/breadcrumb";
import { Separator } from "@/core/components/ui/separator";
import { SidebarTrigger } from "@/core/components/ui/sidebar";

export default function Page() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ms-1" />
          <Separator
            orientation="vertical"
            className="me-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">مدیریت فروشگاه</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>نمای کلی</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl p-6">
            <ReceiptTextIcon className="text-primary mb-3 size-5" />
            <p className="text-muted-foreground text-sm">سفارش‌های امروز</p>
            <p className="font-vazir-bold mt-2 text-2xl">۱۲۸</p>
          </div>
          <div className="bg-muted/50 aspect-video rounded-xl p-6">
            <MegaphoneIcon className="text-primary mb-3 size-5" />
            <p className="text-muted-foreground text-sm">کمپین‌های فعال</p>
            <p className="font-vazir-bold mt-2 text-2xl">۳</p>
          </div>
          <div className="bg-muted/50 aspect-video rounded-xl p-6">
            <HeadphonesIcon className="text-primary mb-3 size-5" />
            <p className="text-muted-foreground text-sm">درخواست پشتیبانی</p>
            <p className="font-vazir-bold mt-2 text-2xl">۹</p>
          </div>
        </div>
        <div className="bg-muted/50 min-h-screen flex-1 rounded-xl p-6 md:min-h-min">
          <h1 className="font-vazir-bold text-xl">خلاصه عملکرد فروشگاه</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            این بخش برای نمایش نمودارها و گزارش‌های اصلی داشبورد آماده است.
          </p>
        </div>
      </div>
    </>
  );
}
