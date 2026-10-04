"use client";

import { AppSidebar } from "@/core/components/app-sidebar";
import { FloatingHeader } from "@/core/components/custom/layout/PanelHeader";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/core/components/ui/sidebar";
import { dataPanel } from "@/core/features/admin/sidebarData";

export default function Layout({ children }: LayoutProps<"/admin">) {
  return (
    <SidebarProvider>
      <AppSidebar data={dataPanel} side="right" />

      <SidebarInset className="flex h-[calc(100vh-1rem)] flex-col overflow-hidden">
        <FloatingHeader />
        <ScrollArea className="bg-background w-full overflow-y-auto px-6 py-5">
          {children}
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
