"use client";

import * as React from "react";

import { type Route } from "next";

import Link from "next/link";

import { StoreIcon } from "lucide-react";

import { NavMain } from "@/core/components/nav-main";
import { NavUser } from "@/core/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/core/components/ui/sidebar";

type IconComponent = React.ComponentType<{ className?: string }>;

export type AppSidebarData = {
  navMain: {
    title: string;
    url: Route;
    icon: IconComponent;
    activeIcon?: IconComponent;
    isActive?: boolean;
    items?: {
      title: string;
      url: Route;
    }[];
  }[];
};

export function AppSidebar({
  data,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  data: AppSidebarData;
}) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg" render={<Link href={"/"} prefetch />}>
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <StoreIcon className="size-4" />
          </div>
          <span className="text-sm"> رفتن به فروشگاه</span>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
