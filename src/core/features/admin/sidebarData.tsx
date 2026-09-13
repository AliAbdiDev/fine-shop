import { PackageIcon, Settings2Icon, ShoppingCartIcon } from "lucide-react";

import { type AppSidebarData } from "@/core/components/app-sidebar";
import { type Route, ROUTES } from "@/core/constants/misc";
import { type BuildRouteOptions, createRoute } from "@/core/utils/routeBuilder";

export const createAdminRoute = (
  segments: Route | Route[],
  options?: BuildRouteOptions,
): string => createRoute<Route>(ROUTES.ADMIN, segments, options);

export const sidebarData: AppSidebarData = {
  user: {
    name: "علی رضایی",
    email: "ali@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "محصولات",
      url: createAdminRoute("/products"),
      icon: <PackageIcon />,
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
