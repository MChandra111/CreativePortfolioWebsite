import { NextRequest, NextResponse } from "next/server";
import { seedPhotos } from "@/lib/photos";
import { Photo } from "@/lib/types";

const samplePhotos: Photo[] = [
  {
    _id: "1",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop",
    category: "digital",
    title: "Test",
    portfolio: true,
    location: "Test",
    date: new Date("2004-01-11"),
    tags: ["Test1", "Test2"],
    album: "other",
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
