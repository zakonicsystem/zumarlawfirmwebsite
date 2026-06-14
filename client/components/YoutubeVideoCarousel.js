"use client";

import { useMemo, useRef } from "react";
import FaIcon from "@/components/FaIcon";
import RichContent from "@/components/RichContent";

export default function YoutubeVideoCarousel({ videos = [] }) {
  const trackRef = useRef(null);
  const items = useMemo(
    () =>
      videos
        .filter((item) => item.enabled !== false && item.embedUrl)
        .map((item) => ({ ...item, embedSrc: youtubeEmbedUrl(item.embedUrl) })),
    [videos]
  );

  function scroll(direction) {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const firstCard = track.querySelector("[data-video-card]");
    const distance = firstCard ? firstCard.getBoundingClientRect().width + 16 : 420;
    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  }

  if (!items.length) {
    return null;
  }

  return (
    <div className="relative">
      <div className="mb-4 flex justify-end gap-2">
        <button className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-secondary hover:text-primary" type="button" onClick={() => scroll(-1)} aria-label="Previous YouTube video">
          <FaIcon className="size-4" name="arrowLeft" />
        </button>
        <button className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-secondary hover:text-primary" type="button" onClick={() => scroll(1)} aria-label="Next YouTube video">
          <FaIcon className="size-4" name="arrowRight" />
        </button>
      </div>
      <div ref={trackRef} className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((video, index) => (
          <article className="w-[min(86vw,360px)] shrink-0 snap-start overflow-hidden rounded-[1.5rem] border border-white/10 bg-white shadow-xl shadow-black/10 lg:w-[calc((100%-2rem)/3)]" data-video-card key={`${video.embedSrc}-${index}`}>
            <div className="aspect-video bg-primary">
              <iframe
                className="h-full w-full"
                src={video.embedSrc}
                title={video.title || `Zumar Law Firm YouTube video ${index + 1}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            {video.title ? <h3 className="p-4 text-base font-black text-primary">{video.title && <RichContent content={video.title} inline />}</h3> : null}
          </article>
        ))}
      </div>
    </div>
  );
}

function youtubeEmbedUrl(value) {
  const input = String(value || "").trim();

  if (!input) {
    return "";
  }

  if (/^https?:\/\//i.test(input)) {
    return input.replace("www.youtube.com/embed/", "youtube.com/embed/");
  }

  return `https://youtube.com/embed/${input.replace(/^\/+/, "")}`;
}
