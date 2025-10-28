
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreateGalleryForm from './create-gallery-form';
import UpdateProfilePicForm from './update-profile-pic-form';
import type { UserProfile } from '@/lib/types';
import { useEffect } from 'react';
import { useAuth, useDoc, useCollection, useFirestore } from '@/firebase';
import type { Gallery } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { doc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import DeleteConfirmationDialog from '@/components/delete-confirmation-dialog';
import { Pencil, Trash2 } from 'lucide-react';

export default function AdminPage() {
  const { user, loading: userLoading } = useUser();
  const { auth } = useAuth();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(
    user ? `users/${user.uid}` : 'users/admin'
  );

  const { data: galleries, loading: galleriesLoading } = useCollection<Gallery>('galleries');
  
  const loading = userLoading || profileLoading || galleriesLoading;

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/login');
    }
  };

  const handleDeleteGallery = (galleryId: string, galleryName: string) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore not initialized.' });
      return;
    }
    
    // Note: This does not delete subcollections (artworks). 
    // Firestore requires deleting subcollections manually.
    const galleryRef = doc(firestore, 'galleries', galleryId);
    deleteDoc(galleryRef)
      .then(() => {
        toast({
          title: 'Gallery Deleted',
          description: `The "${galleryName}" gallery has been deleted. Note: Artworks inside the gallery are not automatically deleted.`,
        });
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: galleryRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: 'destructive',
          title: 'Permission Denied',
          description: 'Could not delete gallery. Check permissions.',
        });
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const welcomeEmail = userProfile?.email || user.email;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="font-headline text-3xl md:text-4xl">Admin Dashboard</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <p className="mb-8 text-sm md:text-base">
        Welcome, {welcomeEmail}! This is your admin dashboard.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <Card>
            <CardHeader>
              <CardTitle>Manage Galleries</CardTitle>
            </CardHeader>
            <CardContent>
              {galleries && galleries.length > 0 ? (
                <ul className="space-y-4">
                  {galleries.map((gallery) => (
                    <li key={gallery.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-secondary rounded-md">
                        <div className="relative h-24 w-full sm:h-16 sm:w-24 flex-shrink-0 overflow-hidden rounded-md border">
                            {gallery.thumbnailUrl ? (
                                <Image src={gallery.thumbnailUrl} alt={gallery.name} fill className="object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                                    No Thumb
                                </div>
                            )}
                        </div>
                      <div className="flex-grow">
                        <span className="font-semibold">{gallery.name}</span>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none">
                          <Link href={`/admin/gallery/${gallery.id}`}>
                            <Pencil className="mr-2 h-3 w-3" /> Manage
                          </Link>
                        </Button>
                        <DeleteConfirmationDialog
                          onConfirm={() => handleDeleteGallery(gallery.id, gallery.name)}
                          itemName={gallery.name}
                          itemType="gallery"
                        >
                           <Button variant="destructive" size="sm" className="flex-1 sm:flex-none">
                            <Trash2 className="mr-2 h-3 w-3" /> Delete
                          </Button>
                        </DeleteConfirmationDialog>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No galleries found. Create one.</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Create New Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateGalleryForm />
            </CardContent>
          </Card>

          {userProfile && (
            <Card>
              <CardHeader>
                <CardTitle>Manage Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <UpdateProfilePicForm user={user} userProfile={userProfile} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
