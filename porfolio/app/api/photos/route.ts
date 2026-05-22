import { NextRequest, NextResponse } from "next/server";
import { getAllPhotos, getPhotosByCategory } from "@/lib/photos";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let photos;
    if (category) {
      photos = await getPhotosByCategory(category);
    } else {
      photos = await getAllPhotos();
    }

    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}
