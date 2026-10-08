"use client";

import { useEffect } from "react";

import { usePathname } from "next/navigation";

import { AppSidebar } from "@/core/components/app-sidebar";
import { FloatingHeader } from "@/core/components/custom/layout/PanelHeader";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/core/components/ui/sidebar";
import { dataPanel } from "@/core/features/admin/sidebarData";
import { useBreadCrumbSelector } from "@/core/states/breadcrumb";

export default function Layout({ children }: LayoutProps<"/admin">) {
  const labels = useBreadCrumbSelector.useLabels();
  const currentPath = usePathname();
  useEffect(() => {
    if (!labels || !currentPath) return;

    const label = labels[currentPath];
    if (!label) return;

    if (document.title !== label) document.title = label;
  }, [labels, currentPath]);

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
