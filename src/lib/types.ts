export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Gallery = {
  id: string;
  name: string;
  slug: string;
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
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
};
