"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Digital from "./digital.jpg";
import Film from "./film.jpg";
import Portfolio from "./portfolio.jpg";
import { InstagramIcon } from "@/components/ui/instagram";

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
    <div className="mx-auto justify-items-center-safe mt-10 pt-6">
      <div className="grid grid-cols-1 gap-5 flex-col justify-center pt-5 pb-10">
            <motion.a
                href="https://www.instagram.com/di0pika/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0,
                  ease: "easeOut",
                }}
                className="p-3 rounded-full"
                style={{ backgroundColor: "#334155", color: "#F9FAFB" }}
              >
                <InstagramIcon size={40} color="white" />
              </motion.a>
        </div>
      <motion.div
        className="grid grid-cols-3 gap-20"
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
            className="group block overflow-hidden rounded-xl shadow-lg bg-white/5"
          >
            <div className="relative h-200 max-h-fit w-100 bg-transparent">
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
                className="absolute inset-0 bg-[#334155]/60 flex items-center justify-center"
              >
                <p
                  className="text-[#F9FAFB] text-3xl font-bold px-4 h-full flex items-center justify-center"
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
