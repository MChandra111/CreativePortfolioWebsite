export interface Photo {
  _id?: string;
  title: string;
  category: "digital" | "portfolio" | "film";
  src: string;
  href: string;
  description?: string;
  createdAt?: Date;
}
