import { Headphones, RefreshCw, ShieldCheck, Truck } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "ارسال سریع و مطمئن",
    desc: "تحویل به سراسر ایران با پست",
  },
  {
    icon: RefreshCw,
    title: "۷ روز ضمانت بازگشت",
    desc: "بدون قید و شرط، پول شما برمی‌گردد",
  },
  {
    icon: ShieldCheck,
    title: "ضمانت اصالت کالا",
    desc: "کالای اورجینال با گارانتی معتبر",
  },
  {
    icon: Headphones,
    title: "همیشه کنارتان هستیم",
    desc: "پشتیبانی ۲۴ ساعته و ۷ روز هفته",
  },
];

export function FeaturesSection() {
  return (
    <div className="border-border bg-secondary grid grid-cols-2 gap-3 rounded-2xl border p-4 sm:gap-4 sm:p-6 md:grid-cols-4">
      {features.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="flex flex-col items-center gap-2 rounded-xl p-3 text-center sm:p-4"
        >
          <div className="bg-card/70 flex h-10 w-10 items-center justify-center rounded-full">
            <Icon className="text-primary h-5 w-5" />
          </div>
          <h3 className="font-vazir-bold text-xs sm:text-sm">{title}</h3>
          <p className="text-muted-foreground text-[11px] leading-relaxed sm:text-xs">
            {desc}
          </p>
        </div>
      ))}
    </div>
  );
}
