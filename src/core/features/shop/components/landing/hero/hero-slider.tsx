"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/core/components/ui/badge";
import { cn } from "@/core/utils/helpers";

export interface HeroSlide {
  src: string;
  alt: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
}

const SLIDE_INTERVAL = 3500;
const TRANSITION_MS = 700;

export function HeroSlider({ slides }: HeroSliderProps) {
  const count = slides.length;
  const loop = count > 1;

  const trackRef = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () => (loop ? [slides[count - 1], ...slides, slides[0]] : slides),
    [slides, count, loop],
  );

  const [pos, setPos] = useState(loop ? 1 : 0);
  const [animated, setAnimated] = useState(true);
  const [paused, setPaused] = useState(false);
  const [rtl, setRtl] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const activeIndex = loop ? (pos - 1 + count) % count : 0;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    setRtl(getComputedStyle(el).direction === "rtl");
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || !loop) return;

    const id = setInterval(() => {
      setPos((p) => (p >= count + 1 ? p : p + 1));
    }, SLIDE_INTERVAL);

    return () => clearInterval(id);
  }, [paused, loop, count, pos]);

  useEffect(() => {
    if (!loop || (pos !== 0 && pos !== count + 1)) return;

    const id = setTimeout(
      () => {
        setAnimated(false);
        setPos(pos === 0 ? count : 1);
      },
      reducedMotion ? 0 : TRANSITION_MS,
    );

    return () => clearTimeout(id);
  }, [pos, count, loop, reducedMotion]);

  useEffect(() => {
    if (animated) return;

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setAnimated(true));
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [animated]);

  const goTo = useCallback(
    (i: number) => {
      if (!loop) return;
      setAnimated(true);
      setPos(i + 1);
    },
    [loop],
  );

  // در RTL آیتم‌ها از راست چیده می‌شوند، پس جابه‌جایی مثبت است.
  const offset = (rtl ? pos : -pos) * 100;

  return (
    <div
      className="bg-muted relative mx-auto aspect-4/3 w-full overflow-hidden rounded-2xl md:max-w-md lg:max-w-lg xl:max-w-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="محصولات منتخب"
    >
      <div
        ref={trackRef}
        className={cn(
          "flex h-full w-full will-change-transform",
          animated &&
            !reducedMotion &&
            "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        )}
        style={{ transform: `translate3d(${offset}%, 0, 0)` }}
      >
        {items.map((slide, i) => {
          const isActive = i === (loop ? pos : 0);
          const isFirst = i === (loop ? 1 : 0);

          return (
            <Link
              key={`${i}-${slide.src}`}
              href="#"
              className="relative h-full w-full shrink-0"
              aria-label={slide.alt}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 1024px) 448px, (max-width: 1280px) 512px, 576px"
                draggable={false}
                decoding={isFirst ? "sync" : "async"}
                quality={85}
                className="object-cover"
                // چون اسلایدها بیرون از viewport قرار دارند و lazy-load
                // هرگز trigger نمی‌شود، بقیه را eager بارگذاری می‌کنیم.
                {...(isFirst ? { priority: true } : { loading: "eager" })}
              />
            </Link>
          );
        })}
      </div>

      <Badge
        variant="secondary"
        className="bg-card/90 text-foreground hover:bg-card/90 absolute top-4 right-4 rounded-full px-3 py-1.5 text-[11px] font-medium shadow-sm backdrop-blur-sm"
      >
        منتخب‌های فصل تازه
      </Badge>

      {loop && (
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`رفتن به اسلاید ${i + 1}`}
              aria-current={activeIndex === i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                activeIndex === i
                  ? "bg-primary w-5"
                  : "bg-card/70 hover:bg-card w-1.5",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
