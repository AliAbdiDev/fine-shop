"use client";

import { isString } from "@sindresorhus/is";
import { BadgeCheckIcon, ChevronsUpDownIcon, LogOutIcon } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/core/components/ui/sidebar";

import { useAuthSelector } from "../states/auth";

export function NavUser() {
  const { isMobile } = useSidebar();
  const userProfile = useAuthSelector.useUserInfo();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar>
              {isString(userProfile?.avatar) && (
                <AvatarImage
                  src={userProfile?.avatar}
                  alt={userProfile?.firstName}
                />
              )}
              <AvatarFallback>
                {userProfile?.firstName?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-medium">
                {userProfile?.firstName}
              </span>
              <span className="truncate text-xs">{userProfile?.email}</span>
            </div>
            <ChevronsUpDownIcon className="ms-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "left"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                  <Avatar>
                    {isString(userProfile?.avatar) && (
                      <AvatarImage
                        src={userProfile?.avatar}
                        alt={userProfile?.firstName}
                      />
                    )}
                    <AvatarFallback>
                      {" "}
                      {userProfile?.firstName?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-medium">
                      {userProfile?.firstName}
                    </span>
                    <span className="truncate text-xs">
                      {userProfile?.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheckIcon />
                حساب کاربری
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className={"hover:bg-destructive/35!"}>
              <LogOutIcon />
              خروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
