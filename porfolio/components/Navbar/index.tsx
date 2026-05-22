import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-primary">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">Portfolio</Link>
        <div className="flex gap-4">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/photo" className="hover:underline">Photo</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </div>
      </div>
    </nav>
  );
}
