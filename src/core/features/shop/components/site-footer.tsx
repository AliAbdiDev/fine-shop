import { Send } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { Separator } from "@/core/components/ui/separator";

export function SiteFooter() {
  return (
    <footer
      dir="rtl"
      className="bg-background text-muted-foreground border-t py-3 text-xs sm:text-sm"
    >
      <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:gap-4">
        <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-3">
          <span className="text-foreground font-medium">فروشگاه من</span>
          <Separator orientation="vertical" className="hidden h-3 sm:block" />
          <a
            href="mailto:info@shop.com"
            className="hover:text-foreground transition-colors"
          >
            تماس با ما: info@shop.com
          </a>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <a
              href="https://t.me/yourchannel"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تلگرام"
            >
              <Send className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <a
              href="https://instagram.com/yourshop"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="اینستاگرام شاپ"
            >
              {/* <Instagram className="h-4 w-4" /> */}
            </a>
          </Button>
        </div>

        <div className="text-center sm:text-left">
          © ۱۴۰۳ فروشگاه من. تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
