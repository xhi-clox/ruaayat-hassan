export type Category = {
  name: string;
  slug: string;
};

export type Artwork = {
  id: string;
  title: string;
  date: string;
  medium: string;
  description: string;
  imageUrlId: string;
  categorySlug: string;
};

export const CATEGORIES: Category[] = [
  { name: 'Digital Arts', slug: 'digital-arts' },
  { name: 'Realism Portraits', slug: 'realism-portraits' },
  { name: 'Water Colour Paintings', slug: 'water-colour-paintings' },
  { name: 'Inking', slug: 'inking' },
  { name: 'Pencil Sketches', slug: 'pencil-sketches' },
];

export const ARTWORKS: Artwork[] = [
  { id: 'da1', title: 'Cybernetic Dreams', date: '2023-10-20', medium: 'Digital Painting', description: 'A glimpse into a neon-soaked future.', imageUrlId: 'digital-art-1', categorySlug: 'digital-arts' },
  { id: 'da2', title: 'Forest Guardian', date: '2023-08-15', medium: 'Character Concept Art', description: 'Concept for a guardian of an ancient, mystical forest.', imageUrlId: 'digital-art-2', categorySlug: 'digital-arts' },
  { id: 'da3', title: 'Floating Isles', date: '2023-05-01', medium: 'Matte Painting', description: 'A serene landscape of islands drifting in the sky.', imageUrlId: 'digital-art-3', categorySlug: 'digital-arts' },
  { id: 'da4', title: 'Chromatic Flow', date: '2022-11-11', medium: 'Abstract Digital', description: 'An exploration of color and form.', imageUrlId: 'digital-art-4', categorySlug: 'digital-arts' },
  
  { id: 'r1', title: 'The Window', date: '2023-11-05', medium: 'Graphite and Charcoal', description: 'A hyperrealistic drawing of an eye, reflecting a world outside.', imageUrlId: 'realism-1', categorySlug: 'realism-portraits' },
  { id: 'r2', title: 'Stories in Wrinkles', date: '2023-04-22', medium: 'Oil on Canvas (Digital)', description: 'A portrait capturing the life and wisdom in an elderly face.', imageUrlId: 'realism-2', categorySlug: 'realism-portraits' },
  { id: 'r3', title: 'Morning Harvest', date: '2022-09-30', medium: 'Digital Painting', description: 'A classical still life study of fruit with dramatic lighting.', imageUrlId: 'realism-3', categorySlug: 'realism-portraits' },
  
  { id: 'wc1', title: 'Spring Bloom', date: '2023-03-18', medium: 'Watercolor on Paper', description: 'Delicate floral arrangement captured with loose watercolor strokes.', imageUrlId: 'watercolor-1', categorySlug: 'water-colour-paintings' },
  { id: 'wc2', title: 'Mountain Mist', date: '2023-01-25', medium: 'Watercolor', description: 'Atmospheric painting of mountains shrouded in mist.', imageUrlId: 'watercolor-2', categorySlug: 'water-colour-paintings' },
  { id: 'wc3', title: 'Curious Fox', date: '2022-12-10', medium: 'Watercolor and Ink', description: 'A playful fox, painted with vibrant watercolor washes.', imageUrlId: 'watercolor-3', categorySlug: 'water-colour-paintings' },
  { id: 'wc4', title: 'Rainy Day in the City', date: '2022-10-02', medium: 'Watercolor', description: 'Reflections and light on a rainy city street.', imageUrlId: 'watercolor-4', categorySlug: 'water-colour-paintings' },
  
  { id: 'ink1', title: 'Celestial Geometry', date: '2023-09-09', medium: 'Ink on Paper', description: 'An intricate mandala design inspired by celestial patterns.', imageUrlId: 'ink-1', categorySlug: 'inking' },
  { id: 'ink2', title: 'Night Wanderer', date: '2023-07-12', medium: 'Brush and Ink', description: 'A comic-style character study with bold ink lines.', imageUrlId: 'ink-2', categorySlug: 'inking' },
  { id: 'ink3', title: 'Gothic Spire', date: '2022-08-19', medium: 'Fine Liner Ink', description: 'An architectural study of a gothic cathedral.', imageUrlId: 'ink-3', categorySlug: 'inking' },
  
  { id: 'ps1', title: 'Contemplation', date: '2023-02-14', medium: 'Graphite on Toned Paper', description: 'A soft and expressive portrait sketch.', imageUrlId: 'pencil-1', categorySlug: 'pencil-sketches' },
  { id: 'ps2', title: 'Noble Stag', date: '2022-11-20', medium: 'Graphite Pencil', description: 'A detailed sketch of a majestic stag.', imageUrlId: 'pencil-2', categorySlug: 'pencil-sketches' },
  { id: 'ps3', title: 'Whispering Woods', date: '2022-07-07', medium: 'Pencil on Paper', description: 'A quick landscape sketch of a dense forest path.', imageUrlId: 'pencil-3', categorySlug: 'pencil-sketches' },
];
