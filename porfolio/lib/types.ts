export interface Photo {
  _id: string;
  src: string;
  category: "digital" | "film";
  title: string;
  portfolio: boolean;
  location: string;
  date: Date;
  tags?: string[];
}
