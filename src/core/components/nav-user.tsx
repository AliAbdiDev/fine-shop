"use client";

import { useRouter } from "next/navigation";

import { isString } from "@sindresorhus/is";
import { useQuery } from "@tanstack/react-query";
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

import { notify } from "./custom/notify";
import { actionLogout, getTokenFromCookie } from "../services/server/auth";
import { getProfile } from "../services/server/profile";

export function NavUser() {
  const { isMobile } = useSidebar();

  // const userInfo = useAuthSelector.useUserInfo();
  // const avatar = userInfo?.avatar;
  // const email = userInfo?.email;
  // const firstName = userInfo?.firstName;
  // const lastName = userInfo?.lastName;

  const { data: token } = useQuery({
    queryFn: getTokenFromCookie,
    queryKey: ["token"],
  });
  const { data: userResponse } = useQuery({
    queryFn: () => getProfile({ token }),
    queryKey: ["user-profile", token],
  });

  const user = userResponse?.ok ? userResponse.data : null;

  const router = useRouter();

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
              {isString(user?.avatar) && (
                <AvatarImage src={user?.avatar} alt={user?.firstName} />
              )}
              <AvatarFallback>{user?.firstName?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="space-x-1 truncate font-medium">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="truncate text-xs">{user?.email}</span>
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
                    {isString(user?.avatar) && (
                      <AvatarImage src={user?.avatar} alt={user?.firstName} />
                    )}
                    <AvatarFallback>
                      {user?.firstName?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="space-x-1 truncate font-medium">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  router.push("/admin/profile");
                }}
              >
                <BadgeCheckIcon />
                حساب کاربری
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                const r = await actionLogout();
                if (!r?.ok) notify.error(r?.error.code);
              }}
              className={"hover:bg-destructive/35!"}
            >
              <LogOutIcon />
              خروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
