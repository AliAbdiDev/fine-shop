import { PackageIcon, Settings2Icon, ShoppingCartIcon } from "lucide-react";

import { type AppSidebarData } from "@/core/components/app-sidebar";

export const sidebarData: AppSidebarData = {
  user: {
    name: "علی رضایی",
    email: "ali@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
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
