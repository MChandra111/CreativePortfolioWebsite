"use client";

import React from "react";
import MusicCarousel from "@/components/music-carousel";
import BorderGlow from "@/components/BorderGlow";
import { YoutubeIcon } from "@/components/ui/youtube";
import { motion } from "framer-motion";

export default function MusicPage() {
  return (
    <main className="page-background mx-auto max-w-7xl px-6 pb-16 pt-24">
      <header className="mb-10 w-full text-center">
        <div className="mx-auto max-w-lg">
          <BorderGlow
            edgeSensitivity={5}
            glowColor="40 80 80"
            backgroundColor="#71AD9B"
            borderRadius={20}
            glowRadius={40}
            glowIntensity={1}
            coneSpread={25}
            animated={false}
            colors={["#c084fc", "#f472b6", "#38bdf8"]}
          >
            <div className="p-8">
              <h1 className="text-4xl font-bold text-[#FFFFE7]">Music</h1>
            </div>
          </BorderGlow>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-5 flex-col justify-items-center pt-5 pb-10">
            <motion.a
                href="https://www.youtube.com/@OrionMusic04"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full"
                style={{ backgroundColor: "#71AD9B", color: "#FFFFE7" }}
              >
                <YoutubeIcon size={40} color="white" />
              </motion.a>
        </div>
      <MusicCarousel />
    </main>
  );
}
