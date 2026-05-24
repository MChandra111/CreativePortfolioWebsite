import { NextRequest, NextResponse } from "next/server";
import {
  getAllPhotos,
  getPhotosByAlbum,
  getPhotosByCategory,
  getPortfolioPhotos,
} from "@/lib/photos";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const portfolio = searchParams.get("portfolio");
    const album = searchParams.get("album");

    let photos;
    if (album) {
      photos = await getPhotosByAlbum(
        album,
        category ?? undefined
      );
    } else if (portfolio === "true") {
      photos = await getPortfolioPhotos();
    } else if (category) {
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
