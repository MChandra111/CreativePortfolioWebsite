"use client";

import React, { useEffect, useState } from "react";
import { Photo } from "@/lib/types";
import Atom from "react-loading-indicators/Atom";
import Masonary from "@/components/masonary";

export default function PortfolioPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch("/api/photos?portfolio=true");
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
    <main className="scrolling-page-background mx-auto justify-items-center-safe mt-10 px-6 pb-16">
      <h1 className="text-4xl font-bold mb-6">Photography Portfolio</h1>
      
      <div className="flex gap-6">

        <Masonary items={photos
          .map((p, idx) => ({
              id: idx,
              imageUrl: p.src,
              title: p.location,
            }))}    
        />
      </div>
    </main>
  );
}
