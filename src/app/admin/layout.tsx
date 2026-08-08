"use client";

import { type ReactNode } from "react";

import {
  HomeIcon,
  PackageIcon,
  Settings2Icon,
  ShoppingCartIcon,
} from "lucide-react";

import { AppSidebar, type AppSidebarData } from "@/core/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/core/components/ui/sidebar";

const sidebarData: AppSidebarData = {
  user: {
    name: "علی رضایی",
    email: "ali@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "داشبورد",
      url: "#",
      icon: <HomeIcon />,
      isActive: true,
      items: [
        {
          title: "نمای کلی",
          url: "#",
        },
        {
          title: "گزارش امروز",
          url: "#",
        },
      ],
    },
    {
      title: "سفارش‌ها",
      url: "#",
      icon: <ShoppingCartIcon />,
      items: [
        {
          title: "سفارش‌های جدید",
          url: "#",
        },
        {
          title: "پیگیری ارسال",
          url: "#",
        },
      ],
    },
    {
      title: "محصولات",
      url: "#",
      icon: <PackageIcon />,
      items: [
        {
          title: "فهرست محصولات",
          url: "#",
        },
        {
          title: "دسته‌بندی‌ها",
          url: "#",
        },
      ],
    },
    {
      title: "تنظیمات",
      url: "#",
      icon: <Settings2Icon />,
      items: [
        {
          title: "عمومی",
          url: "#",
        },
        {
          title: "اعضای تیم",
          url: "#",
        },
      ],
    },
  ],
};

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar data={sidebarData} side="right" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
