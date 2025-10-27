'use client';

import { useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const { user, loading } = useUser();
  const { auth } = useAuth();
  const router = useRouter();

  if (loading) {
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
      <p>Welcome, {user.email}! This is your admin dashboard. More features coming soon!</p>
    </div>
  );
}
