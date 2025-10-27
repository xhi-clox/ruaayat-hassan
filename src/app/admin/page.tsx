'use client';

import { useAuth, useUser, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddArtworkForm from './add-artwork-form';
import type { Gallery } from '@/lib/types';

export default function AdminPage() {
  const { user, loading: userLoading } = useUser();
  const { auth } = useAuth();
  const router = useRouter();
  
  const { data: galleries, loading: galleriesLoading } = useCollection<Gallery>('galleries');

  if (userLoading || galleriesLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
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
            {galleries ? (
              <AddArtworkForm galleries={galleries} />
            ) : (
              <p>No galleries found. Please add a gallery first.</p>
            )}
          </CardContent>
        </Card>
        {/* We can add more admin components here, like "Add Gallery" */}
      </div>
    </div>
  );
}
