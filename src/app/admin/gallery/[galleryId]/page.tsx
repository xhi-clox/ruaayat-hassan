
'use client';

import { useCollection, useDoc } from '@/firebase';
import type { Artwork, Gallery } from '@/lib/types';
import { notFound, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AddArtworkForm from '../../add-artwork-form';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import UpdateGalleryThumbnailForm from './update-gallery-thumbnail-form';

export default function AdminGalleryPage() {
  const params = useParams();
  const galleryId = params.galleryId as string;

  const { data: gallery, loading: galleryLoading } = useDoc<Gallery>(`galleries/${galleryId}`);
  const { data: artworks, loading: artworksLoading } = useCollection<Artwork>(`galleries/${galleryId}/artworks`);

  const loading = galleryLoading || artworksLoading;

  if (loading) {
    return <div>Loading gallery...</div>;
  }

  if (!gallery) {
    // This will show a loading state until gallery is fetched.
    // If gallery is still null after loading, it means not found.
    if(!galleryLoading) notFound();
    return <div>Loading gallery...</div>
  }

  const allGalleries = [gallery]; // AddArtworkForm expects an array

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

      <div className="flex justify-between items-start mb-8">
        <div>
            <h1 className="font-headline text-4xl">{gallery.name}</h1>
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
                            <Card key={artwork.id} className="overflow-hidden">
                                <div className="relative aspect-square w-full">
                                    <Image src={artwork.thumbnailUrl} alt={artwork.title} fill className="object-cover" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold truncate">{artwork.title}</h3>
                                    <p className="text-sm text-muted-foreground">{artwork.medium}</p>
                                    <div className="mt-4 flex gap-2">
                                        {/* Future buttons */}
                                        {/* <Button size="sm" variant="outline">Edit</Button> */}
                                        {/* <Button size="sm" variant="destructive">Delete</Button> */}
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
        <div>
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
