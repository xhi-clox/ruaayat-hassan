
'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import {
  collection,
  doc,
  writeBatch,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { SEED_GALLERIES, SEED_ARTWORKS } from '@/lib/seed-data';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SeedDatabase() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSeed = async () => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firestore is not initialized.',
      });
      return;
    }

    setIsSeeding(true);
    try {
      const batch = writeBatch(firestore);
      let operationsCount = 0;

      // Seed Galleries
      const galleriesRef = collection(firestore, 'galleries');
      for (const galleryData of SEED_GALLERIES) {
        const q = query(galleriesRef, where('slug', '==', galleryData.slug));
        const existing = await getDocs(q);
        if (existing.empty) {
          const newGalleryRef = doc(galleriesRef);
          batch.set(newGalleryRef, galleryData);
          operationsCount++;
        }
      }

      // Seed Artworks
      for (const artworkData of SEED_ARTWORKS) {
         const gallerySlug = artworkData.galleryId; // The seed data uses slugs as galleryId
         const qGallery = query(collection(firestore, 'galleries'), where('slug', '==', gallerySlug));
         const gallerySnapshot = await getDocs(qGallery);

         if (!gallerySnapshot.empty) {
            const galleryDoc = gallerySnapshot.docs[0];
            const artworksRef = collection(firestore, `galleries/${galleryDoc.id}/artworks`);
            
            // Check if artwork with the same imageUrlId already exists
            const qArtwork = query(artworksRef, where('imageUrlId', '==', artworkData.imageUrlId));
            const existingArtwork = await getDocs(qArtwork);

            if (existingArtwork.empty) {
                const newArtworkRef = doc(artworksRef);
                // Create a new object with the correct galleryId
                const finalArtworkData = { ...artworkData, galleryId: galleryDoc.id };
                batch.set(newArtworkRef, finalArtworkData);
                operationsCount++;
            }
         }
      }

      if (operationsCount > 0) {
        await batch.commit();
        toast({
          title: 'Database Seeded!',
          description: `${operationsCount} new documents have been added.`,
        });
      } else {
        toast({
          title: 'Database Already Seeded',
          description: 'No new documents were added.',
        });
      }
      setIsDone(true);
    } catch (error: any) {
      console.error('Error seeding database:', error);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  if (isDone) {
    return null; // Hide component after successful seeding
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Click the button below to populate your portfolio with the original set of galleries and artworks. This is a one-time operation.
      </p>
      <Alert>
        <AlertTitle>Restore Initial Data</AlertTitle>
        <AlertDescription>
          This will add the default galleries and artwork to your database. It will not overwrite or delete any existing content you have created.
        </AlertDescription>
      </Alert>
      <Button onClick={handleSeed} disabled={isSeeding}>
        {isSeeding ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Seeding...
          </>
        ) : (
          'Seed Database'
        )}
      </Button>
    </div>
  );
}
