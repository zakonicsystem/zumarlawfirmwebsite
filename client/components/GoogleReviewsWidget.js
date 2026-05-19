"use client";

import { useEffect, useState } from "react";
import FaIcon from "@/components/FaIcon";

export default function GoogleReviewsWidget({ content }) {
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    let mounted = true;

    fetch("/api/google-reviews", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (mounted) {
          setPayload(data);
        }
      })
      .catch(() => {
        if (mounted) {
          setPayload({
            rating: content?.rating,
            reviewCount: content?.reviewCount,
            placeUrl: content?.placeUrl,
            reviews: content?.fallbackReviews || []
          });
        }
      });

    return () => {
      mounted = false;
    };
  }, [content]);

  const data = payload || {
    rating: content?.rating,
    reviewCount: content?.reviewCount,
    placeUrl: content?.placeUrl,
    reviews: content?.fallbackReviews || []
  };
  const reviews = data.reviews || [];

  return (
    <div className="overflow-hidden rounded-lg border border-primary/10 bg-paper shadow-xl shadow-primary/5">
      <div className="border-b border-primary/10 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-primary/60">Google Business Profile</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <strong className="text-4xl font-black text-primary">{data.rating || "5.0"}</strong>
              <span className="flex gap-1 text-secondary">
                {[0, 1, 2, 3, 4].map((item) => <FaIcon className="size-4" name="star" key={item} />)}
              </span>
              <span className="font-bold text-muted">{data.reviewCount || "Google reviews"}</span>
            </div>
          </div>
          <a className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-black text-white transition hover:-translate-y-1" href={data.placeUrl || content?.placeUrl || "#"} target="_blank" rel="noreferrer">
            View on Google
          </a>
        </div>
      </div>
      <div className="grid gap-4 p-5">
        {reviews.length ? reviews.slice(0, 5).map((review, index) => (
          <article className="rounded-md bg-white p-4 shadow-sm shadow-primary/5" key={`${review.author}-${index}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-black text-primary">{review.author || "Google user"}</h3>
                <p className="text-xs font-bold text-muted">{review.time}</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-black text-primary">
                <FaIcon className="size-3" name="star" />
                {review.rating || 5}
              </span>
            </div>
            {review.text ? <p className="mt-3 leading-7 text-muted">{review.text}</p> : null}
          </article>
        )) : (
          <div className="grid min-h-[220px] place-items-center text-center">
            <div>
              <FaIcon className="mx-auto size-10 text-primary" name="star" />
              <p className="mt-4 font-black text-primary">Google reviews will appear here after API setup.</p>
            </div>
          </div>
        )}
        {payload?.message ? <p className="text-xs font-semibold text-muted">{payload.message}</p> : null}
      </div>
    </div>
  );
}
