'use client';

import { useState } from 'react';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Chrome } from 'lucide-react';


export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();
  const { app } = useAuth();
  const firestore = useFirestore();

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSigningIn(true);

    if (!app || !firestore) {
      setError("Firebase is not initialized.");
      setIsSigningIn(false);
      return;
    }
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create or update user document in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }, { merge: true });

      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center">
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6">
          <p className="text-muted-foreground text-center">
            Sign in with your Google account to access the admin dashboard.
          </p>
          <Button 
            onClick={handleGoogleSignIn} 
            disabled={isSigningIn}
            className="w-full" 
            size="lg"
          >
            <Chrome className="mr-2 h-5 w-5" />
            {isSigningIn ? 'Signing In...' : 'Sign in with Google'}
          </Button>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
