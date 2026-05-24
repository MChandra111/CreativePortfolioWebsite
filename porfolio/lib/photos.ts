import clientPromise from "@/lib/mongodb";
import { Photo } from "@/lib/types";

export async function getPhotosByCategory(category: string): Promise<Photo[]> {
  const client = await clientPromise;
  const db = client.db("portfolio");
  
  const photos = await db
    .collection("photos")
    .find({ category })
    .toArray();
  
  return photos as unknown as Photo[];
}

export async function getAllPhotos(): Promise<Photo[]> {
  const client = await clientPromise;
  const db = client.db("portfolio");
  
  const photos = await db
    .collection("photos")
    .find({})
    .toArray();
  
  return photos as unknown as Photo[];
}

export async function getPhotosByAlbum(
  album: string,
  category?: string
): Promise<Photo[]> {
  const client = await clientPromise;
  const db = client.db("portfolio");

  const filter: Record<string, string> = { album };
  if (category) {
    filter.category = category;
  }

  const photos = await db.collection("photos").find(filter).toArray();

  return photos as unknown as Photo[];
}

export async function getPortfolioPhotos(): Promise<Photo[]> {
  const client = await clientPromise;
  const db = client.db("portfolio");

  const photos = await db
    .collection("photos")
    .find({
      $or: [{ portfolio: true }, { category: "portfolio" }],
    })
    .toArray();

  return photos as unknown as Photo[];
}

export async function seedPhotos(photos: Photo[]) {
  const client = await clientPromise;
  const db = client.db("portfolio");
  const collection = db.collection("photos");
  
  // Clear existing photos
  await collection.deleteMany({});
  
  // Insert new photos
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const docs = photos.map(({ _id, ...photo }) => photo);
  const result = await collection.insertMany(docs);
  return result;
}
