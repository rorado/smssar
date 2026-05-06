"use client";

import React from "react";
import MediaSwiper from "./media-swiper";

type MediaItem = {
  id: string | number;
  url: string;
  resourceType?: "image" | "video";
};

type Props = {
  media: MediaItem[];
  className?: string;
};

export default function MediaSwiperClient({ media, className }: Props) {
  return <MediaSwiper media={media} className={className} />;
}
