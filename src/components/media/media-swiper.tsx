"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type MediaItem = {
  id: string | number;
  url: string;
  resourceType?: "image" | "video";
};

type Props = {
  media: MediaItem[];
  className?: string;
};

export default function MediaSwiper({ media, className = "" }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeMedia = useMemo(
    () => (activeIndex === null ? null : (media[activeIndex] ?? null)),
    [activeIndex, media],
  );

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
        return;
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) => {
          if (current === null) return current;
          return (current + 1) % media.length;
        });
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => {
          if (current === null) return current;
          return (current - 1 + media.length) % media.length;
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, media.length]);

  if (!media || media.length === 0) return null;

  return (
    <>
      <div className={className}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={media.length > 1}
        >
          {media.map((m, index) => (
            <SwiperSlide key={m.id}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="block w-full cursor-pointer"
                aria-label={
                  m.resourceType === "video" ? "Open video" : "Open image"
                }
              >
                {m.resourceType === "video" ? (
                  <div className="relative h-72 w-full overflow-hidden rounded">
                    <video
                      src={m.url}
                      playsInline
                      muted
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 grid place-items-center bg-black/20 text-white transition hover:bg-black/10">
                      <div className="rounded-full bg-black/40 px-4 py-2 text-sm font-medium backdrop-blur">
                        Click to view video
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-72 w-full overflow-hidden rounded">
                    <Image
                      src={m.url}
                      alt="property media"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-black/0 transition hover:bg-black/5" />
                  </div>
                )}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {activeMedia ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Media preview"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-background shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="text-sm text-muted-foreground">
                {activeMedia.resourceType === "video" ? "Video" : "Photo"}
              </div>
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition hover:text-foreground"
                aria-label="Close media preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black/95">
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((current) =>
                    current === null
                      ? current
                      : (current - 1 + media.length) % media.length,
                  )
                }
                className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
                aria-label="Previous media"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {activeMedia.resourceType === "video" ? (
                <video
                  src={activeMedia.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <Image
                  src={activeMedia.url}
                  alt="property media preview"
                  width={1600}
                  height={1200}
                  className="h-full w-full object-contain"
                />
              )}

              <button
                type="button"
                onClick={() =>
                  setActiveIndex((current) =>
                    current === null ? current : (current + 1) % media.length,
                  )
                }
                className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
                aria-label="Next media"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
