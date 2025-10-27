'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';

// This is a client component that will listen for authentication errors and display a toast.
// This should be used in a layout component that is wrapped in a client provider.
export const FirebaseErrorListener = () => {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: any) => {
      console.error('Caught permission error:', error.message);
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description:
          'You do not have permission to perform this action. Check Firestore rules.',
      });
      // This will also log the contextual error to the dev console overlay
      throw error;
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
};
