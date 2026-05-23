"use client";
import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Folder } from "lucide-react";
import BorderGlow from '@/components/BorderGlow';
import { Code } from "lucide-react";
import { Camera } from "lucide-react";
import { Music } from "lucide-react";
import { Newspaper } from "lucide-react";


const folders = [
  { id: 1, label: <Code size={60}/>, color: "#334155", href: "/software" },
  { id: 2, label: <Camera size={60}/>, color: "#334155", href: "/photography" },
  { id: 3, label: <Music size={60}/>, color: "#334155", href: "/music" },
  { id: 4, label: <Newspaper size={60}/>, color: "#334155", href: "/blog" },
];

export default function Home() {
  return (
    <div className="page-background min-h-screen size-full flex flex-col items-center justify-center gap-10">
      <div className="text-center cursor-default">
        <BorderGlow
          edgeSensitivity={5}
          glowColor="40 80 80"
          backgroundColor="#334155"
          borderRadius={20}
          glowRadius={40}
          glowIntensity={1}
          coneSpread={25}
          animated={false}
          colors={['#c084fc', '#f472b6', '#38bdf8']}
        >
          <div style={{ padding: '2em' }}>
            <p className="text-4xl font-bold text-[#F9FAFB]">Maheshwar Chandra Portfolio</p>
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
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <Folder
              size={300}
              fill={folder.color}
              stroke={"#53917E"}
              strokeWidth={0.1}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[#F9FAFB] text-3xl font-bold mt-6">
              {folder.label}
            </span>
          </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}