
export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Gallery = {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl?: string;
};

export type Artwork = {
  id: string;
  title: string;
  date: string;
  medium: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  galleryId: string;
  categorySlug: string;
  imageUrlId: string;
};

export type UserProfile = {
  id?: string; // id is the doc id, which could be 'admin' or a uid
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
};
