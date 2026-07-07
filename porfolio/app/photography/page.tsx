"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Digital from "./digital.jpg";
import Film from "./film.jpg";
import Portfolio from "./portfolio.jpg";

const photos = [
  {
    id: 1,
    title: "DIGITAL",
    src: Digital,
    href: "/digital",
  },
  {
    id: 2,
    title: "PORTFOLIO",
    src: Portfolio,
    href: "/portfolio",
  },
  {
    id: 3,
    title: "FILM",
    src: Film,
    href: "/film",
  },
];

export default function Photo() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <motion.div
        className="grid flex-1 w-full grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 md:min-h-[70vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {photos.map((p, index) => (
          <motion.a
            key={p.id}
            href={p.href}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: index * 0.12,
              ease: "easeOut",
            }}
            whileHover={{
              y: -20,
              transition: { type: "spring", stiffness: 300, damping: 24 },
            }}
            whileTap={{ scale: 0.98 }}
            className="group h-full overflow-hidden rounded-2xl bg-white/5 shadow-[0_12px_30px_rgba(2,6,23,0.2)]"
          >
            <div className="relative h-full min-h-[320px] w-full bg-transparent">
              <Image
                src={p.src}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center bg-[#334155]/60"
              >
                <p
                  className="flex h-full items-center justify-center px-4 text-3xl font-bold text-[#F9FAFB]"
                  style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
                >
                  {p.title}
                </p>
              </motion.div>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
