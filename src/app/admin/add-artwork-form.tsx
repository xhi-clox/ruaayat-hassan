'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { useFirestore, useFirebaseApp } from '@/firebase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Gallery } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const artworkSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  galleryId: z.string().min(1, 'Please select a gallery'),
  medium: z.string().min(1, 'Medium is required'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(1, 'Description is required'),
  image: z
    .any()
    .refine((files) => files?.length === 1, 'Image is required.')
    .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`),
  thumbnail: z
    .any()
    .refine((files) => files?.length === 1, 'Thumbnail is required.')
    .refine((files) => files?.[0]?.size <= 1000000, `Max file size is 1MB.`),
});

type ArtworkFormValues = z.infer<typeof artworkSchema>;

type AddArtworkFormProps = {
  galleries: Gallery[];
  defaultGalleryId?: string;
};

export default function AddArtworkForm({ galleries, defaultGalleryId }: AddArtworkFormProps) {
  const { app } = useFirebaseApp();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      galleryId: defaultGalleryId || '',
    }
  });

  const uploadImage = async (storage: any, imageFile: File, folder: string) => {
    const storageRef = ref(storage, `${folder}/${Date.now()}_${imageFile.name}`);
    const uploadResult = await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(uploadResult.ref);
  }

  const onSubmit = async (data: ArtworkFormValues) => {
    if (!firestore || !app) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firebase not initialized.' });
      return;
    }

    setIsSubmitting(true);

    let imageUrl = '';
    let thumbnailUrl = '';

    try {
      // Step 1: Upload images first
      const storage = getStorage(app);
      imageUrl = await uploadImage(storage, data.image[0], 'artworks');
      thumbnailUrl = await uploadImage(storage, data.thumbnail[0], 'thumbnails');

      // Step 2: Prepare data for Firestore
      const galleryRefPath = `galleries/${data.galleryId}/artworks`;
      const artworkData = {
          title: data.title,
          date: data.date,
          medium: data.medium,
          description: data.description,
          galleryId: data.galleryId,
          categorySlug: galleries.find(g => g.id === data.galleryId)?.slug || '',
          imageUrl: imageUrl,
          thumbnailUrl: thumbnailUrl,
          imageUrlId: `artwork-${Date.now()}` 
      };

      // Step 3: Add document to Firestore using the non-blocking pattern
      addDoc(collection(firestore, galleryRefPath), artworkData)
        .then(() => {
          toast({
              title: 'Artwork Added!',
              description: `${data.title} has been successfully uploaded.`,
          });
          reset();
          if (defaultGalleryId) {
              setValue('galleryId', defaultGalleryId);
          }
        })
        .catch(async (serverError) => {
           // This is the correct way to handle permission errors for this app
           const permissionError = new FirestorePermissionError({
              path: `galleries/${data.galleryId}/artworks`,
              operation: 'create',
              requestResourceData: artworkData,
          });
          errorEmitter.emit('permission-error', permissionError);
        })
        .finally(() => {
          // This will always run, un-sticking the UI
          setIsSubmitting(false);
        });

    } catch (error: any) {
      // This outer catch handles failures from image uploads
      console.error('Error during image upload:', error);
      toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: error.message || 'Could not upload images.',
      });
      setIsSubmitting(false); // Ensure submission state is reset on upload failure
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register('title')} />
        {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="galleryId">Gallery</Label>
        <Select
            onValueChange={(value) => setValue('galleryId', value)}
            defaultValue={defaultGalleryId}
            disabled={!!defaultGalleryId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a gallery" />
          </SelectTrigger>
          <SelectContent>
            {galleries.map((gallery) => (
              <SelectItem key={gallery.id} value={gallery.id}>
                {gallery.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.galleryId && <p className="text-destructive text-sm">{errors.galleryId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="medium">Medium</Label>
          <Input id="medium" {...register('medium')} />
          {errors.medium && <p className="text-destructive text-sm">{errors.medium.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" {...register('date')} />
          {errors.date && <p className="text-destructive text-sm">{errors.date.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} />
        {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image">Artwork Image (Max 5MB)</Label>
        <Input id="image" type="file" accept="image/*" {...register('image')} />
        {errors.image && <p className="text-destructive text-sm">{(errors.image as any)?.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail">Thumbnail Image (Max 1MB)</Label>
        <Input id="thumbnail" type="file" accept="image/*" {...register('thumbnail')} />
        {errors.thumbnail && <p className="text-destructive text-sm">{(errors.thumbnail as any)?.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Uploading...' : 'Add Artwork'}
      </Button>
    </form>
  );
}
