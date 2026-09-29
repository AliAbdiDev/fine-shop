"use client";

import { usePathname } from "next/navigation";

import { ChevronRightIcon } from "lucide-react";

import { type AppSidebarData } from "@/core/components/app-sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/core/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/core/components/ui/sidebar";

export function NavMain({ items }: { items: AppSidebarData["navMain"] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>مدیریت</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = item.url !== "#" && pathname.startsWith(item.url);
          const Icon =
            isActive && item.activeIcon ? item.activeIcon : item.icon;
          const isCollapsible = !!item.items?.length;

          return (
            <Collapsible
              key={item.title}
              defaultOpen={isActive}
              render={<SidebarMenuItem />}
            >
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive}
                render={<a href={item.url} />}
              >
                <Icon className="size-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>

              {isCollapsible && (
                <>
                  <CollapsibleTrigger
                    render={
                      <SidebarMenuAction className="aria-expanded:-rotate-90 rtl:aria-expanded:rotate-90" />
                    }
                  >
                    <ChevronRightIcon className="rtl:rotate-180" />
                    <span className="sr-only">باز و بسته کردن</span>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items!.map((subItem) => {
                        const isSubActive =
                          subItem.url !== "#" &&
                          pathname.startsWith(subItem.url);

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              isActive={isSubActive}
                              render={<a href={subItem.url} />}
                            >
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              )}
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
