
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
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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
    const batch = writeBatch(firestore);
    let operationsCount = 0;
    
    try {
        // Prepare Galleries
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

        // Prepare Artworks
        for (const artworkData of SEED_ARTWORKS) {
            const gallerySlug = artworkData.galleryId; // The seed data uses slugs as galleryId
            const qGallery = query(collection(firestore, 'galleries'), where('slug', '==', gallerySlug));
            const gallerySnapshot = await getDocs(qGallery);

            if (!gallerySnapshot.empty) {
                const galleryDoc = gallerySnapshot.docs[0];
                const artworksRef = collection(firestore, `galleries/${galleryDoc.id}/artworks`);
                
                const qArtwork = query(artworksRef, where('imageUrlId', '==', artworkData.imageUrlId));
                const existingArtwork = await getDocs(qArtwork);

                if (existingArtwork.empty) {
                    const newArtworkRef = doc(artworksRef);
                    const finalArtworkData = { ...artworkData, galleryId: galleryDoc.id };
                    batch.set(newArtworkRef, finalArtworkData);
                    operationsCount++;
                }
            }
        }

        if (operationsCount > 0) {
            batch.commit()
                .then(() => {
                    toast({
                        title: 'Database Seeded!',
                        description: `${operationsCount} new documents have been added.`,
                    });
                    setIsDone(true);
                })
                .catch(async (serverError) => {
                    // This is the correct way to handle permission errors for this app
                    const permissionError = new FirestorePermissionError({
                        path: 'Multiple paths (batch write)',
                        operation: 'write',
                        requestResourceData: { note: `Batch write failed with ${operationsCount} operations.` },
                    });
                    errorEmitter.emit('permission-error', permissionError);
                })
                .finally(() => {
                    setIsSeeding(false);
                });
        } else {
            toast({
            title: 'Database Already Seeded',
            description: 'No new documents were added.',
            });
            setIsDone(true);
            setIsSeeding(false);
        }
    } catch (error: any) {
        // This outer catch handles failures from reading data (getDocs)
        console.error('An error occurred during the seeding preparation:', error);
        toast({
            variant: 'destructive',
            title: 'An Unexpected Error Occurred',
            description: error.message || 'Could not prepare the seed data.',
        });
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
