export type Platform = "PS4" | "PS5";
export type Game = {
  id: string;
  title: string;
  slug?: string;
  platform: Platform;
  genre: string;
  year?: number | null;
  cover_url: string;
  description: string;
  featured: boolean;
  created_at?: string;
};
