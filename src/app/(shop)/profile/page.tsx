"use client";

import { MapPin, ShoppingBag, User as UserIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/core/components/ui/card";
import { Skeleton } from "@/core/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import {
  ProfileAddressesTab,
  ProfileInfoTab,
  ProfileOrdersTab,
} from "@/core/features/shop/components/profile";
import { useAuthSelector } from "@/core/states/auth";

/**
 * Skeleton placeholder displayed while authentication and user info are hydrating.
 * Annotated with accessible busy state for assistive technologies.
 */
function ProfileSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:py-8"
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="در حال بارگذاری اطلاعات حساب کاربری"
    >
      <span className="sr-only">در حال بارگذاری اطلاعات پروفایل...</span>

      {/* Tabs list skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32 rounded-2xl" />
        <Skeleton className="h-10 w-28 rounded-2xl" />
        <Skeleton className="h-10 w-44 rounded-2xl" />
      </div>

      {/* Main card skeleton */}
      <Card>
        <CardHeader className="space-y-3 pb-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 rounded-full sm:size-20" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
        <CardFooter className="pt-4">
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    </div>
  );
}

/**
 * Buyer Profile Page with 3 accessible tabs:
 * 1. Profile information (view and edit personal details)
 * 2. Addresses (manage saved shipping addresses)
 * 3. Orders and Payments (order tracking and payment history)
 */
export default function BuyerProfilePage() {
  const tokenIsHydrated = useAuthSelector.useTokenIsHydrated();
  const userInfoIsHydrated = useAuthSelector.useUserInfoIsHydrated();

  if (!tokenIsHydrated || !userInfoIsHydrated) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-3 py-4 sm:px-6 sm:py-6">
      {/* Hidden top-level heading for screen reader navigation hierarchy */}
      <h1 className="sr-only">پروفایل کاربری و تنظیمات حساب</h1>

      <Tabs
        defaultValue="info"
        className="w-full space-y-6"
        aria-label="بخش‌های پروفایل کاربر"
      >
        {/* Mobile-optimized scrollable tab bar */}
        <div className="w-full [scrollbar-width:none] overflow-x-auto pb-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <TabsList
            aria-label="انتخاب تب پروفایل"
            className="bg-muted/80 inline-flex h-auto w-full min-w-[340px] items-center justify-between gap-1 rounded-2xl p-1 sm:w-full"
          >
            <TabsTrigger
              value="info"
              id="profile-tab-info"
              aria-controls="profile-panel-info"
              className="data-active:bg-background min-h-[40px] flex-1 py-2 text-xs font-medium transition-all data-active:shadow-xs sm:text-sm"
            >
              <UserIcon className="size-4 shrink-0" aria-hidden="true" />
              <span>اطلاعات پروفایل</span>
            </TabsTrigger>

            <TabsTrigger
              value="addresses"
              id="profile-tab-addresses"
              aria-controls="profile-panel-addresses"
              className="data-active:bg-background min-h-[40px] flex-1 py-2 text-xs font-medium transition-all data-active:shadow-xs sm:text-sm"
            >
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              <span>آدرس‌ها</span>
            </TabsTrigger>

            <TabsTrigger
              value="orders"
              id="profile-tab-orders"
              aria-controls="profile-panel-orders"
              className="data-active:bg-background min-h-[40px] flex-1 py-2 text-xs font-medium transition-all data-active:shadow-xs sm:text-sm"
            >
              <ShoppingBag className="size-4 shrink-0" aria-hidden="true" />
              <span>سفارش‌ها</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Profile Information */}
        <TabsContent
          value="info"
          id="profile-panel-info"
          aria-labelledby="profile-tab-info"
          className="focus-visible:ring-ring rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <ProfileInfoTab />
        </TabsContent>

        {/* Tab 2: Saved Shipping Addresses */}
        <TabsContent
          value="addresses"
          id="profile-panel-addresses"
          aria-labelledby="profile-tab-addresses"
          className="focus-visible:ring-ring rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <ProfileAddressesTab />
        </TabsContent>

        {/* Tab 3: Orders and Payment History */}
        <TabsContent
          value="orders"
          id="profile-panel-orders"
          aria-labelledby="profile-tab-orders"
          className="focus-visible:ring-ring rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <ProfileOrdersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
