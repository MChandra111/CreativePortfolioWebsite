import { NextRequest, NextResponse } from "next/server";
import { seedPhotos } from "@/lib/photos";
import { Photo } from "@/lib/types";

const samplePhotos: Photo[] = [
  {
    title: "Coastal Sunset",
    category: "digital",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop",
    href: "#",
    description: "Golden hour at the coast",
  },
  {
    title: "Mountain Range",
    category: "digital",
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1920&auto=format&fit=crop",
    href: "#",
    description: "Majestic peaks and valleys",
  },
  {
    title: "City Lights",
    category: "portfolio",
    src: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?q=80&w=1920&auto=format&fit=crop",
    href: "#",
    description: "Urban night photography",
  },
  {
    title: "Forest Path",
    category: "portfolio",
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1920&auto=format&fit=crop",
    href: "#",
    description: "Woods and natural light",
  },
  {
    title: "Desert Dunes",
    category: "film",
    src: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1920&auto=format&fit=crop",
    href: "#",
    description: "Film analog aesthetic",
  },
  {
    title: "Snow Peak",
    category: "film",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&auto=format&fit=crop",
    href: "#",
    description: "Winter mountain photography",
  },
];

export async function POST(request: NextRequest) {
  try {
    await seedPhotos(samplePhotos);
    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
