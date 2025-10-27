
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, X, Maximize } from 'lucide-react';
import { notFound } from 'next/navigation';

import type { Artwork, Gallery } from '@/lib/types';
import { useCollection } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';


type GalleryClientProps = {
  categorySlug: string;
};

export default function GalleryClient({ categorySlug }: GalleryClientProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: galleries, loading: galleriesLoading } = useCollection<Gallery>('galleries', { where: ['slug', '==', categorySlug], limit: 1 });

  const gallery = galleries?.[0];
  const galleryId = gallery?.id;

  // Only fetch artworks if we have a valid galleryId
  const { data: artworks, loading: artworksLoading } = useCollection<Artwork>(
    galleryId ? `galleries/${galleryId}/artworks` : null
  );
  
  const loading = galleriesLoading || (galleryId && artworksLoading);

  const selectedArtwork = selectedId && artworks ? artworks.find(art => art.id === selectedId) : null;
  const selectedIndex = selectedArtwork && artworks ? artworks.indexOf(selectedArtwork) : -1;

  const handleNext = () => {
    if (selectedIndex === -1 || !artworks) return;
    const nextIndex = (selectedIndex + 1) % artworks.length;
    setSelectedId(artworks[nextIndex].id);
  };

  const handlePrev = () => {
    if (selectedIndex === -1 || !artworks) return;
    const prevIndex = (selectedIndex - 1 + artworks.length) % artworks.length;
    setSelectedId(artworks[prevIndex].id);
  };

  if (!galleriesLoading && !gallery) {
    notFound();
  }

  return (
    <>
      <div className="text-center mb-12">
        {loading || !gallery ? (
          <>
            <Skeleton className="h-16 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
          </>
        ) : (
          <>
            <h1 className="font-headline text-6xl md:text-7xl tracking-wider text-primary">
              {gallery.name}
            </h1>
            <p className="mt-2 text-lg text-foreground/80">A collection of my work in {gallery.name.toLowerCase()}.</p>
          </>
        )}
      </div>

      {loading ? (
         <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
            ))}
         </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {artworks?.map((artwork) => (
            <div
              key={artwork.id}
              className="group relative break-inside-avoid overflow-hidden rounded-lg shadow-lg cursor-pointer"
              onClick={() => setSelectedId(artwork.id)}
            >
              <Image
                src={artwork.thumbnailUrl}
                alt={artwork.title}
                width={600}
                height={800}
                className="w-full h-auto object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {artwork.title}
                </h3>
                <p className="text-white/80 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  {artwork.medium}
                </p>
                <div className="absolute top-4 right-4 p-2 bg-black/50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300">
                  <Maximize className="text-white size-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedArtwork && (
          <Dialog open={!!selectedId} onOpenChange={(isOpen) => !isOpen && setSelectedId(null)}>
            <DialogContent className="max-w-6xl w-full h-[90vh] p-0 !gap-0 bg-card border-border flex flex-col md:flex-row">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full md:w-2/3 h-1/2 md:h-full flex items-center justify-center bg-black"
              >
                <Image
                  src={selectedArtwork.imageUrl}
                  alt={selectedArtwork.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
                 <Button variant="ghost" size="icon" className="absolute top-4 left-4 md:hidden bg-black/50 hover:bg-black/80 text-white" onClick={() => setSelectedId(null)}>
                  <X />
                </Button>
              </motion.div>
              <div className="w-full md:w-1/3 p-6 flex flex-col overflow-y-auto">
                <DialogTitle className="font-headline text-4xl tracking-wide mb-2 text-primary">{selectedArtwork.title}</DialogTitle>
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Badge variant="secondary">{selectedArtwork.medium}</Badge>
                  <span>{selectedArtwork.date}</span>
                </div>
                <p className="text-foreground/80 leading-relaxed">{selectedArtwork.description}</p>
              </div>
              
              <Button variant="ghost" size="icon" className="absolute top-4 left-4 hidden md:flex" onClick={handlePrev}>
                <ArrowLeft />
              </Button>
              <Button variant="ghost" size="icon" className="absolute top-4 right-4 hidden md:flex" onClick={handleNext}>
                <ArrowRight />
              </Button>

              <div className="md:hidden absolute bottom-4 left-4 right-4 flex justify-between">
                <Button variant="secondary" size="icon" onClick={handlePrev}>
                  <ArrowLeft />
                </Button>
                <Button variant="secondary" size="icon" onClick={handleNext}>
                  <ArrowRight />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
