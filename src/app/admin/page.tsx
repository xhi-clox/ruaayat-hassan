
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreateGalleryForm from './create-gallery-form';
import UpdateProfilePicForm from './update-profile-pic-form';
import type { UserProfile } from '@/lib/types';
import { useEffect } from 'react';
import { useAuth, useDoc, useCollection } from '@/firebase';
import type { Gallery } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminPage() {
  const { user, loading: userLoading } = useUser();
  const { auth } = useAuth();
  const router = useRouter();

  // Fetch the 'admin' user profile for display and management purposes
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const welcomeEmail = userProfile?.email || user.email;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-headline text-4xl">Admin Dashboard</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <p className="mb-8">
        Welcome, {welcomeEmail}! This is your admin dashboard.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <Card>
            <CardHeader>
              <CardTitle>Manage Galleries</CardTitle>
            </CardHeader>
            <CardContent>
              {galleries && galleries.length > 0 ? (
                <ul className="space-y-4">
                  {galleries.map((gallery) => (
                    <li key={gallery.id} className="flex items-center gap-4 p-3 bg-secondary rounded-md">
                        <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border">
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
                       <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/gallery/${gallery.id}`}>
                          Manage
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No galleries found. Create one to get started.</p>
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
