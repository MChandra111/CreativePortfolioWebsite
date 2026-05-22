"use client";
import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Folder } from "lucide-react";
import BorderGlow from '@/components/BorderGlow';

const folders = [
  { id: 1, label: "Software", color: "#71AD9B", href: "/software" },
  { id: 2, label: "Photography", color: "#71AD9B", href: "/photography" },
  { id: 3, label: "Music", color: "#71AD9B", href: "/music" },
  { id: 4, label: "Blog", color: "#71AD9B", href: "/blog" },
];

export default function Home() {
  return (
    <div className="page-background min-h-screen size-full flex flex-col items-center justify-center gap-10 bg-linear-to-br from-[#FFFCBB] to-[#FFFFE7]">
      <div className="text-center cursor-default">
        <BorderGlow
          edgeSensitivity={5}
          glowColor="40 80 80"
          backgroundColor="#71AD9B"
          borderRadius={20}
          glowRadius={40}
          glowIntensity={1}
          coneSpread={25}
          animated={false}
          colors={['#c084fc', '#f472b6', '#38bdf8']}
        >
          <div style={{ padding: '2em' }}>
            <p className="text-3xl font-bold text-[#FFFFE7]">Maheshwar Chandra Portfolio</p>
          </div>
        </BorderGlow>
      </div>
      <div className="grid grid-cols-2 gap-16">
        {folders.map((folder) => (
          <Link key={folder.id} href={folder.href} className="block">
          <motion.div
            key={folder.id}
            className="relative cursor-pointer"
            whileHover={{ scale: 1.1, y: -8 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Folder
              size={300}
              fill={folder.color}
              stroke={"#53917E"}
              strokeWidth={0.1}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[#FFFFE7] text-3xl font-bold mt-6">
              {folder.label}
            </span>
          </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}