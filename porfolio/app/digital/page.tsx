"use client";

import React, { useEffect, useState } from "react";
import { Photo } from "@/lib/types";
import Atom from "react-loading-indicators/Atom";
import EnhancedCarousel from "@/components/enhancedcarousel";

const albums = [
  {
    id: 1,
    imageUrl: "https://i.pinimg.com/736x/d6/8a/12/d68a121e960094f99ad8acd37505fb7d.jpg",
    title: "Colorado 2026",
    year: "2026",
    tags: ["Nature", "Landscape"],
    href: "/photos/colorado-2026"
  },
  {
    id: 2,
    imageUrl: "https://i.pinimg.com/736x/21/16/f7/2116f71f9d51d875e44d809f074ff079.jpg",
    title: "2025-2026 Miscellaneous",
    year: "2025",
    tags: ["Nature", "Landscape"],
    href: "/photos/los-cabos-2025"
  },
  {
    id: 3,
    imageUrl: "https://i.pinimg.com/736x/21/16/f7/2116f71f9d51d875e44d809f074ff079.jpg",
    title: "Los Cabos 2025",
    year: "2025",
    tags: ["Nature", "Landscape"],
    href: "/photos/los-cabos-2025"
  },
  {
    id: 4,
    imageUrl: "https://i.pinimg.com/1200x/fe/c2/0d/fec20d2958059b8463bffb138d4eaac6.jpg",
    title: "South Korea 2025",
    year: "2025",
    tags: ["Nature", "Landscape"],
    href: "/photos/south-korea-2025"
  },
  {
    id: 5,
    imageUrl: "https://i.pinimg.com/736x/84/dc/62/84dc62de850a34a9d420c97f3a2d58f4.jpg",
    title: "Japan 2025",
    year: "2025",
    tags: ["Nature", "Landscape"],
    href: "/photos/japan-2025"
  },
  {
    id: 6,
    imageUrl: "https://i.pinimg.com/1200x/be/c3/7e/bec37e2c43e703f922f887db2578ce2e.jpg",
    title: "2024-2025 Miscellaneous",
    year: "2024",
    tags: ["Nature", "Landscape"],
    href: "/photos/iceland-2024"
  }
];

export default function DigitalPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <div className="mx-auto">
      <div className="justify-items-center-safe mt-10 px-6 pb-5 w-full h-full gap-6">
        <EnhancedCarousel
          storiesData={albums
            .map((p, idx) => ({
              id: idx,
              title: p.title,
              imageUrl: p.imageUrl,
              year: p.year,
              tags: p.tags || [],
              href: p.href,
            }))}
        />
      </div>
      <div className="mx-100 justify-items-start bg-[#71AD9B] rounded-2xl">
        <h2 className="text-4xl font-bold text-[#FFFFE7] pt-5 pl-5">Gear</h2>
        <p className="text-[#FFFFE7] text-lg p-5">
          Camera: Canon Rebel T7<br />
          Lens: Canon EF-S 18-55mm f/3.5-5.6 IS II<br />
          Lens: Canon EF 50mm f/1.8 STM<br />
          Lens: Canon EF-S 55-250mm f/4-5.6 IS II<br />
        </p>
      </div>
    </div>
  );
}
