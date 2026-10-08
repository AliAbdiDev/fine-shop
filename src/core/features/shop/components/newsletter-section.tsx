import { Mail, Send } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";

export function NewsletterSection() {
  return (
    <div className="border-border bg-secondary grid items-center gap-6 rounded-2xl border p-6 sm:p-8 md:grid-cols-2 md:gap-10 md:p-10">
      <div className="space-y-2 text-center md:text-right">
        {/* extra bold */}
        <h2 className="font-vazir-bold text-xl sm:text-2xl">
          خبرهای خوب، زودتر برای شما
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm">
          از تخفیف‌ها، مجموعه‌های جدید و پیشنهادهای ویژه باخبر شوید.
        </p>
      </div>

      <form className="flex w-full flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="email"
            placeholder="ایمیل شما"
            className="bg-card h-11 rounded-full pr-10"
          />
        </div>
        <Button size="lg" className="gap-2 rounded-full">
          عضویت
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
