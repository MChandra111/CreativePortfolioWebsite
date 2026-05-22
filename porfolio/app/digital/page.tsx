"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Photo } from "@/lib/types";
import Atom from "react-loading-indicators/Atom";

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
      <h1 className="text-4xl font-bold mb-6">Digital Photography</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((p, idx) => (
          <motion.a
            key={idx}
            href={p.href}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="group block overflow-hidden rounded-xl shadow-lg bg-white/5"
          >
            <div className="relative h-56 w-full bg-gray-100">
              <Image
                src={p.src}
                alt={p.title}
                height={224}
                width={384}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.a>
        ))}
      </div>
    </main>
  );
}
