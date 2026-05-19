import { NextResponse } from "next/server";
import { readCmsData } from "@/lib/cmsStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const { pageContent } = await readCmsData();
  const config = pageContent.googleReviews || {};
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID || config.placeId;

  if (!apiKey || !placeId) {
    return NextResponse.json(fallbackPayload(config, "Google Places API key or Place ID is not configured."));
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "name,rating,user_ratings_total,reviews,url");
  url.searchParams.set("reviews_sort", "newest");
  url.searchParams.set("key", apiKey);

  try {
    const response = await fetch(url, { next: { revalidate: 1800 } });
    const payload = await response.json();

    if (!response.ok || payload.status !== "OK") {
      return NextResponse.json(fallbackPayload(config, payload.error_message || payload.status || "Unable to load Google reviews."));
    }

    const place = payload.result || {};

    return NextResponse.json({
      source: "google",
      name: place.name || "Zumar Law Firm",
      rating: place.rating || config.rating,
      reviewCount: place.user_ratings_total || config.reviewCount,
      placeUrl: place.url || config.placeUrl,
      reviews: (place.reviews || []).map((review) => ({
        author: review.author_name,
        authorUrl: review.author_url,
        profilePhotoUrl: review.profile_photo_url,
        rating: review.rating,
        text: stripHtml(review.text),
        time: review.relative_time_description
      }))
    });
  } catch (error) {
    return NextResponse.json(fallbackPayload(config, error.message || "Unable to load Google reviews."));
  }
}

function fallbackPayload(config, message) {
  return {
    source: "fallback",
    message,
    name: "Zumar Law Firm",
    rating: config.rating,
    reviewCount: config.reviewCount,
    placeUrl: config.placeUrl,
    reviews: (config.fallbackReviews || []).map((review) => ({
      author: review.author,
      rating: review.rating,
      text: review.text,
      time: review.time
    }))
  };
}

function stripHtml(value) {
  return String(value || "").replace(/<[^>]*>/g, "").trim();
}
