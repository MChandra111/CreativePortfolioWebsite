"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export default function SoftwareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <Link
        href="/"
        className="absolute top-6 left-6 p-2 rounded-lg"
      >
      <motion.div
        className="relative p-6 cursor-pointer text-[#334155] hover:text-[#E11D48] transition-colors duration-30"
        style={{ borderColor: "transparent", borderWidth: "0px" }}
        whileHover={{ x: -3, color: "#E11D48" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <ArrowLeft size={40} className=""/>
      </motion.div>
      </Link>
      {children}
    </div>
  );
}
