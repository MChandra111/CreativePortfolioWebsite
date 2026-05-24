"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Masonry from "react-masonry-css";
import Image from "next/image";
import { X } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import type { Photo } from "@/lib/types";

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1,
};

interface AlbumGalleryOverlayProps {
  album: string;
  title: string;
  /** When provided, skips fetch and opens instantly */
  photos?: Photo[];
  category?: string;
  onClose: () => void;
}

export default function AlbumGalleryOverlay({
  album,
  title,
  photos: photosProp,
  onClose,
}: AlbumGalleryOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fetchedPhotos, setFetchedPhotos] = useState<Photo[] | null>(null);
  const [loading, setLoading] = useState(photosProp === undefined);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const photos = photosProp ?? fetchedPhotos ?? [];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [mounted]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (lightboxIndex >= 0) {
        setLightboxIndex(-1);
        return;
      }
      onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, lightboxIndex]);

  useEffect(() => {
    if (photosProp !== undefined) return;

    let cancelled = false;

    async function fetchAlbumPhotos() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ album });
        const res = await fetch(`/api/photos?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load album");
        const data: Photo[] = await res.json();
        if (!cancelled) setFetchedPhotos(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Could not load this album.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchAlbumPhotos();
    return () => {
      cancelled = true;
    };
  }, [album, photosProp]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-150 md:p-8 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} album`}
    >
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        plugins={[Captions]}
        captions={{ showToggle: false }}
        styles={{
          container: { backgroundColor: "#F9FAFB" },
          captionsDescription: {
            color: "334155",
            fontSize: "25px",
            justifyContent: "center",
            fontWeight: "bold",
          },
          captionsTitle: {
            color: "#334155",
            fontSize: "25px",
            fontWeight: "bold",
          },
          captionsTitleContainer: { alignItems: "center", background: "transparent" },
          icon: { color: "#334155" }
        }}
        close={() => setLightboxIndex(-1)}
        slides={photos.map((p) => ({
          src: p.src,
          alt: p.title,
          title: "",
          description: (p.date ? new Date(p.date).toLocaleDateString("en-US") : undefined) + " | " + p.location,
        }))}
      />

      <button
        type="button"
        className="absolute inset-0 bg-slate-900/80"
        onClick={onClose}
        aria-label="Close album"
      />

      <div
        className="relative z-10 flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-[#F9FAFB] shadow-2xl contain-layout"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 md:px-6">
          <h2 className="text-xl font-bold text-slate-700 md:text-2xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-700 transition-colors hover:bg-slate-200"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 md:px-6">
          {loading && (
            <p className="py-16 text-center text-slate-500">Loading album…</p>
          )}

          {!loading && error && (
            <p className="py-16 text-center text-slate-500">{error}</p>
          )}

          {!loading && !error && photos.length === 0 && (
            <p className="py-16 text-center text-slate-500">No photos in this album yet.</p>
          )}

          {!loading && !error && photos.length > 0 && (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="-ml-4 flex w-auto"
              columnClassName="bg-clip-padding pl-4"
            >
              {photos.map((photo, index) => (
                <div
                  key={photo._id ?? photo.src}
                  className="mb-4 overflow-hidden rounded-xl bg-neutral-100"
                >
                  <Image
                    src={photo.src}
                    alt={photo.title ?? photo.location ?? "Photo"}
                    width={1200}
                    height={1600}
                    className="h-auto w-full cursor-pointer object-cover"
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    loading="lazy"
                    onClick={() => setLightboxIndex(index)}
                  />
                </div>
              ))}
            </Masonry>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
