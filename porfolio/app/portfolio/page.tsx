"use client";

import React, { useEffect, useState } from "react";
import { Photo } from "@/lib/types";
import { preloadImages } from "@/lib/preload-images";
import Atom from "react-loading-indicators/Atom";
import Masonary from "@/components/masonary";

export default function PortfolioPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState({ loaded: 0, total: 0 });

  useEffect(() => {
    let cancelled = false;

    async function fetchAndPreload() {
      try {
        const res = await fetch("/api/photos?portfolio=true");
        const data: Photo[] = await res.json();
        if (cancelled) return;

        const sources = data.map((p) => p.src);
        setLoadProgress({ loaded: 0, total: sources.length });

        await preloadImages(sources, {
          concurrency: 6,
          onProgress: (loaded, total) => {
            if (!cancelled) {
              setLoadProgress({ loaded, total });
            }
          },
        });

        if (!cancelled) {
          setPhotos(data);
        }
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchAndPreload();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main className="page-background mx-auto justify-items-center-safe mt-10 px-6 pb-16">
        <div className="flex flex-col items-center justify-center h-64">
          <Atom color="#71AD9B" size="medium" text="Loading photos..." textColor="#71AD9B" />
          {loadProgress.total > 0 && (
            <p className="mt-4 text-sm text-[#71AD9B]">
              Preparing {loadProgress.loaded} of {loadProgress.total} images…
            </p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="scrolling-page-background mx-auto justify-items-center-safe mt-10 px-6 pb-16">
      <div className="flex gap-6">
        <Masonary
          items={photos.map((p) => ({
            id: p._id,
            imageUrl: p.src,
            title: p.location,
          }))}
        />
      </div>
    </main>
  );
}
