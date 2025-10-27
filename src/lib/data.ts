import type { Category, Artwork } from './types';

// This data is now managed in Firestore. The arrays are kept here for type reference if needed,
// but they should not be used for rendering data in the application.

export const CATEGORIES: Category[] = [
  // { id: '1', name: 'Digital Arts', slug: 'digital-arts' },
  // { id: '2', name: 'Realism Portraits', slug: 'realism-portraits' },
  // { id: '3', name: 'Water Colour Paintings', slug: 'water-colour-paintings' },
  // { id: '4', name: 'Inking', slug: 'inking' },
  // { id: '5', name: 'Pencil Sketches', slug: 'pencil-sketches' },
  // { id: '6', name: 'Commissions', slug: 'commissions' },
];

export const ARTWORKS: Artwork[] = [
  // This data is now in Firestore, under /galleries/{galleryId}/artworks
];
