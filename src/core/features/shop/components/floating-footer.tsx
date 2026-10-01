import { Send } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { Separator } from "@/core/components/ui/separator";

export function FloatingFooter() {
  return (
    <footer className="pb-3">
      <div className="bg-background/80 supports-backdrop-filter:bg-background/60 mx-auto min-h-20 w-[calc(100%-1.5rem)] max-w-6xl rounded-lg border shadow-sm backdrop-blur-md">
        <div className="text-muted-foreground flex flex-col items-center justify-between gap-2 px-4 py-2 text-xs sm:flex-row sm:gap-4 sm:text-sm">
          <div className="flex items-center gap-3">
            <span className="text-foreground font-medium">فروشگاه من</span>
            <Separator orientation="vertical" className="h-3" />
            <a
              href="mailto:info@shop.com"
              className="hover:text-foreground transition-colors"
            >
              info@shop.com
            </a>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <a
                href="https://t.me/yourchannel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تلگرام"
              >
                <Send className="h-3.5 w-3.5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <a
                href="https://instagram.com/yourshop"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="اینستاگرام شاپ"
              >
                {/* <Instagram className="h-3.5 w-3.5" /> */}
              </a>
            </Button>
          </div>

          <span className="text-center">
            © ۱۴۰۳ فروشگاه من. تمامی حقوق محفوظ است.
          </span>
        </div>
      </div>
    </footer>
  );
}
