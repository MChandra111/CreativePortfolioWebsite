"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Photo } from "@/lib/types";

export default function FilmPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch("/api/photos?category=film");
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
        <p>Loading photos...</p>
      </main>
    );
  }

  return (
    <main className="page-background mx-auto justify-items-center-safe mt-10 px-6 pb-16">
      <h1 className="text-4xl font-bold mb-6">Film Photography</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((p, idx) => (
          <motion.a
            key={idx}
            whileHover={{ y: -20 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="group block overflow-hidden rounded-xl shadow-lg bg-white/5"
          >
            <div className="relative h-56 w-full bg-gray-100">
              <Image
                src={p.src}
                alt={p.title}
                height={224}
                width={384}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center"
              >
                <p
                  className="text-white text-xl font-bold px-4 h-full flex items-center justify-center"
                  style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
                >
                  {p.title}
                </p>
              </motion.div>
            </div>
          </motion.a>
        ))}
      </div>
    </main>
  );
}
