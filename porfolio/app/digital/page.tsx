"use client";

import React, { useEffect, useState } from "react";
import { Photo } from "@/lib/types";
import Atom from "react-loading-indicators/Atom";
import Carousel from "@/components/carousel";

export default function DigitalPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch("/api/photos?category=digital");
        const data = await res.json();
        setPhotos(data);
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPhotos();
  }, []);

  if (loading) {
    return (
      <main className="page-background mx-auto justify-items-center-safe mt-10 px-6 pb-16">
        <div className="flex flex-col items-center justify-center h-64">
          <Atom color="#71AD9B" size="medium" text="Loading photos..." textColor="#71AD9B" />
        </div>
      </main>
    );
  }

  return (
    <main className="page-background mx-auto justify-items-center-safe mt-10 px-6 pb-16">
      <div className="w-full h-full gap-6">
        <Carousel
          albumName="Other"
          cards={photos
            .filter((p) => p.album === "other")
            .map((p, idx) => ({
              id: idx,
              title: p.title,
              imageUrl: p.src,
              tags: p.tags || [],
              location: p.location,
              date: p.date ? new Date(p.date) : "Unknown",
            }))}
        />
        <Carousel
          albumName="Japan 2025"
          cards={photos
            .filter((p) => p.album === "japan25")
            .map((p, idx) => ({
              id: idx,
              title: p.title,
              imageUrl: p.src,
              tags: p.tags || [],
              location: p.location,
              date: p.date ? new Date(p.date) : "Unknown",
            }))}
        />
      </div>
    </main>
  );
}
