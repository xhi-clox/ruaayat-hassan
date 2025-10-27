
// This file contains the initial data for galleries and artworks to seed the database.

import type { Gallery, Artwork } from './types';

// Using Omit to exclude 'id' since Firestore will generate it.
type SeedGallery = Omit<Gallery, 'id'>;
type SeedArtwork = Omit<Artwork, 'id'>;


export const SEED_GALLERIES: SeedGallery[] = [
    { name: 'Digital Arts', slug: 'digital-arts', thumbnailUrl: "https://images.unsplash.com/photo-1515222410484-613a51c43721?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxkaWdpdGFsJTIwcGFpbnRpbmd8ZW58MHx8fHwxNzYxNTYyNDM2fDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: 'Realism Portraits', slug: 'realism-portraits', thumbnailUrl: "https://images.unsplash.com/photo-1606143412458-acc5f86de897?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxwb3J0cmFpdCUyMHBob3RvZ3JhcGh5fGVufDB8fHx8MTc2MTU1OTk0M3ww&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: 'Water Colour Paintings', slug: 'water-colour-paintings', thumbnailUrl: "https://images.unsplash.com/photo-1601662528567-526cd06f6582?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHx3YXRlcmNvbG9yJTIwdGV4dHVyZXxlbnwwfHx8fDE3NjE0OTQ1Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: 'Inking', slug: 'inking', thumbnailUrl: "https://images.unsplash.com/photo-1662524518497-df3201ff76c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxpbmslMjBkcmF3aW5nfGVufDB8fHx8MTc2MTU2ODYzM3ww&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: 'Pencil Sketches', slug: 'pencil-sketches', thumbnailUrl: "https://images.unsplash.com/photo-1602738328654-51ab2ae6c4ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwZW5jaWwlMjBza2V0Y2h8ZW58MHx8fHwxNzYxNDcyMTE1fDA&ixlib=rb-4.1.0&q=80&w=1080" },
];

export const SEED_ARTWORKS: SeedArtwork[] = [
    // Digital Arts
    { title: 'Cyber Cityscape', date: '2023-05-10', medium: 'Digital Painting', description: 'A vibrant, neon-lit cityscape of the future.', imageUrl: 'https://picsum.photos/seed/da1/800/1200', thumbnailUrl: 'https://picsum.photos/seed/da1/400/600', galleryId: 'digital-arts', categorySlug: 'digital-arts', imageUrlId: 'da1' },
    { title: 'Forest Spirit', date: '2023-03-22', medium: 'Digital Painting', description: 'A mystical creature in a glowing, enchanted forest.', imageUrl: 'https://picsum.photos/seed/da2/1200/800', thumbnailUrl: 'https://picsum.photos/seed/da2/600/400', galleryId: 'digital-arts', categorySlug: 'digital-arts', imageUrlId: 'da2' },

    // Realism Portraits
    { title: 'The Scholar', date: '2022-11-05', medium: 'Oil on Canvas', description: 'A portrait capturing the wisdom and kindness in an old man\'s eyes.', imageUrl: 'https://picsum.photos/seed/rp1/800/1000', thumbnailUrl: 'https://picsum.photos/seed/rp1/400/500', galleryId: 'realism-portraits', categorySlug: 'realism-portraits', imageUrlId: 'rp1' },

    // Water Colour Paintings
    { title: 'Coastal Morning', date: '2023-07-19', medium: 'Watercolor', description: 'Soft morning light breaking over a calm sea.', imageUrl: 'https://picsum.photos/seed/wc1/1200/800', thumbnailUrl: 'https://picsum.photos/seed/wc1/600/400', galleryId: 'water-colour-paintings', categorySlug: 'water-colour-paintings', imageUrlId: 'wc1' },
    { title: 'Autumn Harvest', date: '2023-09-28', medium: 'Watercolor', description: 'A still life of pumpkins and leaves, capturing the essence of autumn.', imageUrl: 'https://picsum.photos/seed/wc2/1000/800', thumbnailUrl: 'https://picsum.photos/seed/wc2/500/400', galleryId: 'water-colour-paintings', categorySlug: 'water-colour-paintings', imageUrlId: 'wc2' },

    // Inking
    { title: 'Mechanical Heart', date: '2023-01-15', medium: 'Ink on Paper', description: 'An intricate drawing of a heart made of gears and clockwork.', imageUrl: 'https://picsum.photos/seed/ink1/800/800', thumbnailUrl: 'https://picsum.photos/seed/ink1/400/400', galleryId: 'inking', categorySlug: 'inking', imageUrlId: 'ink1' },
    { title: 'The Crow', date: '2022-12-20', medium: 'Ink on Paper', description: 'A detailed illustration of a crow perched on a branch, with a full moon in the background.', imageUrl: 'https://picsum.photos/seed/ink2/800/1100', thumbnailUrl: 'https://picsum.photos/seed/ink2/400/550', galleryId: 'inking', categorySlug: 'inking', imageUrlId: 'ink2' },

    // Pencil Sketches
    { title: 'Study of Hands', date: '2022-08-14', medium: 'Graphite on Paper', description: 'A detailed sketch focusing on the anatomy and expression of human hands.', imageUrl: 'https://picsum.photos/seed/ps1/1000/800', thumbnailUrl: 'https://picsum.photos/seed/ps1/500/400', galleryId: 'pencil-sketches', categorySlug: 'pencil-sketches', imageUrlId: 'ps1' },
];
