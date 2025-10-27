
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore, useFirebaseApp } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import type { Gallery } from '@/lib/types';
import { Card } from '@/components/ui/card';

const thumbnailSchema = z.object({
  thumbnail: z
    .any()
    .refine((files) => files?.length === 1, 'A thumbnail image is required.')
    .refine((files) => files?.[0]?.size <= 1000000, `Max file size is 1MB.`),
});

type ThumbnailFormValues = z.infer<typeof thumbnailSchema>;

type UpdateGalleryThumbnailFormProps = {
  gallery: Gallery;
};

export default function UpdateGalleryThumbnailForm({ gallery }: UpdateGalleryThumbnailFormProps) {
  const app = useFirebaseApp();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(gallery.thumbnailUrl || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ThumbnailFormValues>({
    resolver: zodResolver(thumbnailSchema),
  });

  const imageFile = watch('thumbnail');

  useEffect(() => {
    if (imageFile && imageFile[0]) {
      const newPreview = URL.createObjectURL(imageFile[0]);
      setPreview(newPreview);
      // Clean up the object URL on unmount
      return () => URL.revokeObjectURL(newPreview);
    }
  }, [imageFile]);


  const onSubmit = async (data: ThumbnailFormValues) => {
    if (!firestore || !app) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firebase not initialized.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const file = data.thumbnail[0];
      const storage = getStorage(app);
      const storageRef = ref(storage, `gallery-thumbnails/${gallery.id}/${file.name}`);

      const uploadResult = await uploadBytes(storageRef, file);
      const thumbnailUrl = await getDownloadURL(uploadResult.ref);

      const galleryDocRef = doc(firestore, 'galleries', gallery.id);
      await updateDoc(galleryDocRef, { thumbnailUrl });
      
      toast({
        title: 'Thumbnail Updated!',
        description: 'The gallery thumbnail has been successfully updated.',
      });
      // Update the preview with the final URL from storage
      setPreview(thumbnailUrl);
    } catch (error: any) {
      console.error('Error updating gallery thumbnail:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
       <div className="space-y-2">
            <Label>Current Thumbnail</Label>
            <Card className="p-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                    {preview ? (
                        <Image src={preview} alt={`${gallery.name} thumbnail`} fill className="object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                            No thumbnail
                        </div>
                    )}
                </div>
            </Card>
        </div>
      <div className="space-y-2">
        <Label htmlFor="thumbnail">New Thumbnail Image (Max 1MB)</Label>
        <Input id="thumbnail" type="file" accept="image/*" {...register('thumbnail')} />
        {errors.thumbnail && <p className="text-destructive text-sm">{(errors.thumbnail as any)?.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Uploading...' : 'Save Thumbnail'}
      </Button>
    </form>
  );
}
