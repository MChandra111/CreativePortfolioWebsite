"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Photo } from "@/lib/types";
import Atom from "react-loading-indicators/Atom";
import Masonry from "react-masonry-css";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

const breakpointColumnsObj = {
  default: 2,
  1100: 2,
  700: 1,
};

function MasonryPhotoItem({ photo, onClick }: { photo: Photo; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: false,
    amount: 0.12,
    margin: "0px 0px -20% 0px",
  });

  return (
    <motion.div
      ref={ref}
      className="mb-4"
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <div className="overflow-hidden bg-neutral-900">
        <Image
          src={photo.src}
          alt={photo.title ?? "Photo"}
          width={1200}
          height={1600}
          className="h-auto w-full object-cover"
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          loading="lazy"
          onClick={onClick}
        />
      </div>
    </motion.div>
  );
}

export default function PortfolioPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

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

    void fetchPhotos();
  }, []);

  if (loading) {
    return (
      <main className="page-background mx-auto justify-items-center-safe mt-10 px-6 pb-16">
        <div className="flex h-64 flex-col items-center justify-center">
          <Atom color="#71AD9B" size="medium" text="Loading photos..." textColor="#71AD9B" />
        </div>
      </main>
    );
  }

  return (
    <main className="page-background mx-auto mt-10 max-w-7xl px-6 pb-24">
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        plugins={[Captions]}
        captions={{ showToggle: false }}
        styles={{
          container: { backgroundColor: "#F9FAFB" },
          captionsDescription: { color: "#334155", fontSize: "25px", justifyContent: "center", fontWeight: "bold" },
          captionsTitle: { color: "#334155", fontSize: "25px", fontWeight: "bold" },
          captionsTitleContainer: { alignItems: "center", background: "transparent" },
          icon: { color: "#334155" },
        }}
        close={() => setLightboxIndex(-1)}
        slides={photos.map((p) => ({
          src: p.src,
          alt: p.title,
          title: "",
          description: [p.date ? new Date(p.date).toLocaleDateString("en-US") : undefined, p.location].filter(Boolean).join(" | ") || undefined,
        }))}
      />

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="-ml-4 flex w-auto"
        columnClassName="bg-clip-padding pl-4"
      >
        {photos.map((p) => (
          <MasonryPhotoItem
            key={p._id ?? p.src}
            photo={p}
            onClick={() => setLightboxIndex(photos.findIndex((photo) => photo._id === p._id))}
          />
        ))}
      </Masonry>
    </main>
  );
}
