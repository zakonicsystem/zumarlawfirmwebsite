"use client";

import { useMemo, useRef, useState } from "react";
import FaIcon from "@/components/FaIcon";
import RichContent from "@/components/RichContent";

export default function YoutubeVideoCarousel({ videos = [] }) {
  const trackRef = useRef(null);
  const [loadedVideos, setLoadedVideos] = useState(() => new Set());
  const items = useMemo(
    () =>
      videos
        .filter((item) => item.enabled !== false && item.embedUrl)
        .map((item) => {
          const videoId = youtubeVideoId(item.embedUrl);
          return {
            ...item,
            embedSrc: youtubeEmbedUrl(item.embedUrl),
            thumbnail: videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : ""
          };
        }),
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

  function loadVideo(index) {
    setLoadedVideos((current) => {
      const next = new Set(current);
      next.add(index);
      return next;
    });
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
              {loadedVideos.has(index) ? (
                <iframe
                  className="h-full w-full"
                  src={`${video.embedSrc}${video.embedSrc.includes("?") ? "&" : "?"}autoplay=1`}
                  title={video.title || `Zumar Law Firm YouTube video ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <button
                  className="group relative h-full w-full overflow-hidden text-white"
                  type="button"
                  onClick={() => loadVideo(index)}
                  aria-label={`Play ${video.title || `Zumar Law Firm YouTube video ${index + 1}`}`}
                >
                  {video.thumbnail ? (
                    <img className="h-full w-full object-cover opacity-85 transition duration-300 group-hover:scale-105 group-hover:opacity-100" src={video.thumbnail} alt="" loading="lazy" decoding="async" />
                  ) : null}
                  <span className="absolute inset-0 bg-primary/45" />
                  <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-secondary text-primary shadow-2xl shadow-black/25 transition duration-300 group-hover:scale-105">
                    <FaIcon className="ml-1 size-7" name="arrowRight" />
                  </span>
                </button>
              )}
            </div>
            {video.title ? <h3 className="p-4 text-base font-black text-primary">{video.title && <RichContent content={video.title} inline />}</h3> : null}
          </article>
        ))}
      </div>
    </div>
  );
}

function youtubeEmbedUrl(value) {
  const videoId = youtubeVideoId(value);

  if (videoId) {
    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  }

  const input = String(value || "").trim();
  if (!input) {
    return "";
  }

  if (/^https?:\/\//i.test(input)) {
    return input.replace("www.youtube.com/embed/", "youtube.com/embed/");
  }

  return `https://youtube.com/embed/${input.replace(/^\/+/, "")}`;
}

function youtubeVideoId(value) {
  const input = String(value || "").trim();

  if (!input) {
    return "";
  }

  if (/^[a-zA-Z0-9_-]{8,}$/.test(input) && !input.includes("/")) {
    return input;
  }

  try {
    const url = new URL(input);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (url.searchParams.get("v")) {
      return url.searchParams.get("v") || "";
    }

    const parts = url.pathname.split("/").filter(Boolean);
    const embedIndex = parts.findIndex((part) => part === "embed" || part === "shorts");
    return embedIndex >= 0 ? parts[embedIndex + 1] || "" : "";
  } catch {
    return "";
  }
}
