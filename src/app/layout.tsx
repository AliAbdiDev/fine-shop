import { Suspense } from "react";

import localFont from "next/font/local";

import "./globals.css";
import { Toaster } from "sonner";

import { TooltipProvider } from "@/core/components/ui/tooltip";
import { MswProvider } from "@/core/mocks/configs/MswProvider";
import QueryProvider from "@/core/services/configs/query/QueryProvider";
import { getTokenFromCookie } from "@/core/services/server/auth";
import { getProfile } from "@/core/services/server/profile";
import { AuthInitializer } from "@/core/states/auth";
import { cn } from "@/core/utils/helpers";

const vazirRegular = localFont({
  variable: "--vazir-regular",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/vazir-normal/Vazir-Regular-FD-UI.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/vazir-normal/Vazir.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/vazir-normal/Vazir.ttf",
      weight: "400",
      style: "normal",
    },
  ],
});

const vazirBold = localFont({
  variable: "--vazir-bold",
  display: "swap",
  fallback: ["Tahoma", "sans-serif"],
  adjustFontFallback: "Arial",
  src: [
    {
      path: "../../public/fonts/vazir-bold/Vazir-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/vazir-bold/Vazir-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/vazir-bold/Vazir-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={cn(
        vazirRegular.className,
        "h-full",
        "antialiased",
        vazirRegular.variable,
        vazirBold.variable,
      )}
    >
      <body>
        <TooltipProvider>
          <MswProvider>
            <QueryProvider>
              <Suspense fallback={null}>
                <AuthInitializerWrapper />
              </Suspense>
              {children}
              <Toaster richColors position="bottom-center" />
            </QueryProvider>
          </MswProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}

export async function AuthInitializerWrapper() {
  const token = await getTokenFromCookie();
  console.log("🚀 ~ AuthInitializerWrapper ~ token:", token);
  const r = await getProfile({ token });
  const userInfo = r?.ok ? r.data : undefined;

  return <AuthInitializer token={token} userInfo={userInfo} />;
}
