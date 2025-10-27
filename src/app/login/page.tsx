'use client';

import { useState } from 'react';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(true); // To toggle between sign-in and sign-up
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { app } = useAuth();
  const firestore = useFirestore();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!app || !firestore) {
      setError("Firebase is not initialized.");
      setIsLoading(false);
      return;
    }
    const auth = getAuth(app);

    try {
      if (isSigningIn) {
        // Handle Sign In
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/admin');
      } else {
        // Handle Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document in Firestore
        const userDocRef = doc(firestore, 'users', user.uid);
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.email, // Default display name
          photoURL: '', // Default photo URL
        }, { merge: true });
        
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">
            {isSigningIn ? 'Admin Login' : 'Create Admin Account'}
          </CardTitle>
          <CardDescription>
            {isSigningIn ? 'Enter your credentials to access the dashboard.' : 'Fill out the form to create a new account.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
              {isLoading ? 'Loading...' : (isSigningIn ? 'Login' : 'Sign Up')}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            {isSigningIn ? "Don't have an account?" : "Already have an account?"}
            <Button
              variant="link"
              onClick={() => {
                setIsSigningIn(!isSigningIn);
                setError(null);
              }}
              className="font-semibold"
            >
              {isSigningIn ? 'Sign Up' : 'Login'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
