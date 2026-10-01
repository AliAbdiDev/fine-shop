import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "ارسال سریع", desc: "تحویل ۲۴ ساعته" },
  { icon: ShieldCheck, title: "ضمانت اصالت", desc: "۱۰۰٪ اورجینال" },
  { icon: RefreshCw, title: "بازگشت کالا", desc: "۷ روز ضمانت بازگشت" },
  { icon: Headphones, title: "پشتیبانی ۲۴/۷", desc: "همیشه در دسترس" },
];

export function FeaturesSection() {
  return (
    <section
      dir="rtl"
      className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"
    >
      {features.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="bg-card hover:bg-accent/50 flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors"
        >
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
            <Icon className="text-primary h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-muted-foreground text-xs">{desc}</p>
        </div>
      ))}
    </section>
  );
}
