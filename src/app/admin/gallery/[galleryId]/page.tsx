
'use client';

import { useState } from 'react';
import { useCollection, useDoc } from '@/firebase';
import type { Artwork, Gallery } from '@/lib/types';
import { notFound, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AddArtworkForm from '../../add-artwork-form';
import Image from 'next/image';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import UpdateGalleryThumbnailForm from './update-gallery-thumbnail-form';
import { useFirestore } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import DeleteConfirmationDialog from '@/components/delete-confirmation-dialog';

export default function AdminGalleryPage() {
  const params = useParams();
  const galleryId = params.galleryId as string;
  const firestore = useFirestore();
  const { toast } = useToast();

  const { data: gallery, loading: galleryLoading } = useDoc<Gallery>(`galleries/${galleryId}`);
  const { data: artworks, loading: artworksLoading } = useCollection<Artwork>(`galleries/${galleryId}/artworks`);

  const loading = galleryLoading || artworksLoading;

  const handleDeleteArtwork = (artworkId: string, artworkTitle: string) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore not initialized.' });
      return;
    }
    const artworkRef = doc(firestore, `galleries/${galleryId}/artworks`, artworkId);
    deleteDoc(artworkRef)
      .then(() => {
        toast({
          title: 'Artwork Deleted',
          description: `"${artworkTitle}" has been successfully deleted.`,
        });
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: artworkRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: 'destructive',
          title: 'Permission Denied',
          description: 'Could not delete artwork. Check permissions.',
        });
      });
  };


  if (loading) {
    return <div>Loading gallery...</div>;
  }

  if (!gallery) {
    if (!galleryLoading) notFound();
    return <div>Loading gallery...</div>;
  }

  const allGalleries = [gallery];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl">{gallery.name}</h1>
          <p className="text-muted-foreground mt-2">Manage artworks and settings for this gallery.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Existing Artworks</CardTitle>
              <CardDescription>
                {artworks && artworks.length > 0
                  ? `You have ${artworks.length} artwork(s) in this gallery.`
                  : 'No artworks found in this gallery yet.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {artworks && artworks.map(artwork => (
                  <Card key={artwork.id} className="overflow-hidden group">
                    <div className="relative aspect-square w-full">
                      <Image src={artwork.thumbnailUrl} alt={artwork.title} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold truncate">{artwork.title}</h3>
                      <p className="text-sm text-muted-foreground">{artwork.medium}</p>
                      <div className="mt-4 flex gap-2">
                        <DeleteConfirmationDialog
                          onConfirm={() => handleDeleteArtwork(artwork.id, artwork.title)}
                          itemName={artwork.title}
                          itemType="artwork"
                        >
                          <Button size="sm" variant="destructive" className="w-full">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </DeleteConfirmationDialog>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add New Artwork</CardTitle>
            </CardHeader>
            <CardContent>
              <AddArtworkForm galleries={allGalleries} defaultGalleryId={galleryId} />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Update Gallery Thumbnail</CardTitle>
                </CardHeader>
                <CardContent>
                    <UpdateGalleryThumbnailForm gallery={gallery} />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
