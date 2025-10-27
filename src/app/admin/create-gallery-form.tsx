
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


const gallerySchema = z.object({
  name: z.string().min(2, 'Gallery name must be at least 2 characters long.'),
});

type GalleryFormValues = z.infer<typeof gallerySchema>;

export default function CreateGalleryForm() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
  });

  const onSubmit = (data: GalleryFormValues) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore not initialized.' });
      return;
    }

    setIsSubmitting(true);
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const galleryData = {
      name: data.name,
      slug: slug,
      thumbnailUrl: '', // Initialize with an empty thumbnail
    };

    addDoc(collection(firestore, 'galleries'), galleryData)
      .then(() => {
        toast({
          title: 'Gallery Created!',
          description: `The "${data.name}" gallery has been added.`,
        });
        reset();
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: 'galleries',
            operation: 'create',
            requestResourceData: galleryData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Gallery Name</Label>
        <Input id="name" {...register('name')} placeholder="e.g., Digital Paintings" />
        {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Gallery'}
      </Button>
    </form>
  );
}
