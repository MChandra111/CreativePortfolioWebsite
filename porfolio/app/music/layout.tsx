"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MusicLayout({
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
        <ArrowLeft size={40} className="text-[#502419] hover:text-[#EE964B] transition-colors duration-200"/>
      </Link>
      {children}
    </div>
  );
}
