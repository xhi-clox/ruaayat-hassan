'use client';

import { useState } from 'react';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const { app } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!app) {
      setError("Firebase is not initialized.");
      return;
    }
    const auth = getAuth(app);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        // You might want to auto-login the user here or redirect to login
        setIsSignUp(false);
        router.push('/admin');

      } else {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center">
            {isSignUp ? 'Admin Sign Up' : 'Admin Login'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
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
                placeholder="********"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" size="lg">
              {isSignUp ? 'Sign Up' : 'Login'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <Button variant="link" onClick={() => setIsSignUp(false)} className="p-0 h-auto">
                  Login
                </Button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Button variant="link" onClick={() => setIsSignUp(true)} className="p-0 h-auto">
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
