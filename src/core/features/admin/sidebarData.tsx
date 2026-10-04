// sidebarData.tsx
import {
  PackageIcon,
  PackageOpen,
  Settings2Icon,
  ShoppingCartIcon,
  Users,
  UsersRound,
} from "lucide-react";

import { type AppSidebarData } from "@/core/components/app-sidebar";
import { ROUTES } from "@/core/constants/misc";

export const dataPanel: AppSidebarData = {
  navMain: [
    {
      title: "محصولات",
      url: ROUTES.PRODUCTS,
      icon: PackageIcon,
      activeIcon: PackageOpen,
    },
    {
      title: "کاربران",
      url: ROUTES.USERS,
      icon: Users,
      activeIcon: UsersRound,
    },
    {
      title: "سفارش‌ها",
      url: "#",
      icon: ShoppingCartIcon,
      items: [
        { title: "سفارش‌های جدید", url: "#" },
        { title: "پیگیری ارسال", url: "#" },
      ],
    },
    {
      title: "تنظیمات",
      url: "#",
      icon: Settings2Icon,
      items: [
        { title: "عمومی", url: "#" },
        { title: "اعضای تیم", url: "#" },
      ],
    },
  ],
};
