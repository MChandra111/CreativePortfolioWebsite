"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Photo } from "@/lib/types";
import Atom from "react-loading-indicators/Atom";
import EnhancedCarousel from "@/components/enhancedcarousel";
import AlbumGalleryOverlay from "@/components/album-gallery-overlay";
import type { Story } from "@/components/enhancedcarousel";

const albums = [
  {
    id: 5,
    imageUrl: "/albumCovers/Colorado26.jpg",
    title: "Colorado 2026",
    album: "colorado26",
    tags: ["Nature", "Landscape"],
    href: "/photos/colorado-2026"
  },
  {
    id: 4,
    imageUrl: "/albumCovers/LosCabos25.jpg",
    title: "Los Cabos 2025",
    album: "loscabos25",
    tags: ["Nature", "Landscape"],
    href: "/photos/los-cabos-2025"
  },
  {
    id: 3,
    imageUrl: "/albumCovers/Korea25.jpg",
    title: "South Korea 2025",
    album: "korea25",
    tags: ["Nature", "Landscape"],
    href: "/photos/south-korea-2025"
  },
  {
    id: 2,
    imageUrl: "/albumCovers/Japan25.jpg",
    title: "Japan 2025",
    album: "japan25",
    tags: ["Nature", "Landscape"],
    href: "/photos/japan-2025"
  },
  {
    id: 1,
    imageUrl: "/albumCovers/Misc.jpg",
    title: "Miscellaneous",
    album: "misc",
    tags: ["Nature", "Landscape"],
    href: "/photos/iceland-2024"
  }
];

export default function DigitalPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<{
    album: string;
    title: string;
  } | null>(null);

  const handleAlbumClick = (story: Story) => {
    if (!story.album) return;
    setSelectedAlbum({ album: story.album, title: story.title });
  };

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch("/api/photos?category=Digital");
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
          storiesData={albums.toReversed()
            .map((p, idx) => ({
              id: idx,
              title: p.title,
              imageUrl: p.imageUrl,
              album: p.album,
              tags: p.tags || [],
              href: p.href,
            }))}
          onAlbumClick={handleAlbumClick}
        />
      </div>

      {selectedAlbum && (
        <AlbumGalleryOverlay
          key={selectedAlbum.album}
          album={selectedAlbum.album}
          title={selectedAlbum.title}
          category="Digital"
          photos={photos.filter((p) => p.album === selectedAlbum.album)}
          onClose={() => setSelectedAlbum(null)}
        />
      )}
      <motion.div
        className="mx-100 justify-items-start bg-[#334155] rounded-2xl"
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.55,
          delay: albums.length * 0.12,
          ease: "easeOut",
        }}
      >
        <h2 className="text-4xl font-bold text-[#F9FAFB] pt-5 pl-5">Gear</h2>
        <p className="text-[#F9FAFB] text-lg p-5">
          Camera: Canon Rebel T7<br />
          Lens: Canon EF-S 18-55mm f/3.5-5.6 IS II<br />
          Lens: Canon EF 50mm f/1.8 STM<br />
          Lens: Canon EF-S 55-250mm f/4-5.6 IS II<br />
        </p>
      </motion.div>
    </div>
  );
}
