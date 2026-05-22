import clientPromise from "@/lib/mongodb";
import { Photo } from "@/lib/types";

export async function getPhotosByCategory(category: string): Promise<Photo[]> {
  const client = await clientPromise;
  const db = client.db("portfolio");
  
  const photos = await db
    .collection("photos")
    .find({ category })
    .toArray();
  
  return photos as Photo[];
}

export async function getAllPhotos(): Promise<Photo[]> {
  const client = await clientPromise;
  const db = client.db("portfolio");
  
  const photos = await db
    .collection("photos")
    .find({})
    .toArray();
  
  return photos as Photo[];
}

export async function seedPhotos(photos: Photo[]) {
  const client = await clientPromise;
  const db = client.db("portfolio");
  const collection = db.collection("photos");
  
  // Clear existing photos
  await collection.deleteMany({});
  
  // Insert new photos
  const result = await collection.insertMany(photos);
  return result;
}
