'use client';

import { useAuth, useUser, useCollection, useDoc } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddArtworkForm from './add-artwork-form';
import CreateGalleryForm from './create-gallery-form';
import UpdateProfilePicForm from './update-profile-pic-form';
import type { Gallery, UserProfile } from '@/lib/types';
import { useEffect } from 'react';

export default function AdminPage() {
  const { user, loading: userLoading } = useUser();
  const { auth } = useAuth();
  const router = useRouter();

  const { data: galleries, loading: galleriesLoading } = useCollection<Gallery>('galleries');
  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(user ? `users/${user.uid}` : '');

  const loading = userLoading || galleriesLoading || profileLoading;

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !userProfile) {
    return null; // Or a more specific loading/error state
  }
  
  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/login');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-headline text-4xl">Admin Dashboard</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <p className="mb-8">Welcome, {user.email}! This is your admin dashboard.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Artwork</CardTitle>
          </CardHeader>
          <CardContent>
            {galleries && galleries.length > 0 ? (
              <AddArtworkForm galleries={galleries} />
            ) : (
              <p>Please create a gallery first before adding artwork.</p>
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Create New Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateGalleryForm />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Manage Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdateProfilePicForm user={user} userProfile={userProfile} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Galleries</CardTitle>
            </CardHeader>
            <CardContent>
              {galleries && galleries.length > 0 ? (
                <ul className="space-y-2">
                  {galleries.map((gallery) => (
                    <li key={gallery.id} className="flex justify-between items-center p-2 bg-secondary rounded-md">
                      <span>{gallery.name}</span>
                      {/* Edit/Delete buttons can be added here in the future */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No galleries found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
