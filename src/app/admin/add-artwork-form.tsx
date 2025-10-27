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

const artworkSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  galleryId: z.string().min(1, 'Please select a gallery'),
  medium: z.string().min(1, 'Medium is required'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.instanceof(FileList).refine((files) => files.length === 1, 'Image is required.'),
});

type ArtworkFormValues = z.infer<typeof artworkSchema>;

type AddArtworkFormProps = {
  galleries: Gallery[];
};

export default function AddArtworkForm({ galleries }: AddArtworkFormProps) {
  const { app } = useFirebaseApp();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkSchema),
  });

  const onSubmit = async (data: ArtworkFormValues) => {
    if (!firestore || !app) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firebase not initialized.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const imageFile = data.image[0];
      const storage = getStorage(app);
      const storageRef = ref(storage, `artworks/${Date.now()}_${imageFile.name}`);

      // Upload file
      const uploadResult = await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(uploadResult.ref);
      const thumbnailUrl = imageUrl; // For now, use the same image for thumbnail

      // Save artwork data to Firestore
      const artworkData = {
        title: data.title,
        date: data.date,
        medium: data.medium,
        description: data.description,
        galleryId: data.galleryId,
        categorySlug: galleries.find(g => g.id === data.galleryId)?.slug || '',
        imageUrl: imageUrl,
        thumbnailUrl: thumbnailUrl,
        // Using a static ID for now, can be dynamic later
        imageUrlId: `artwork-${Date.now()}` 
      };

      await addDoc(collection(firestore, `galleries/${data.galleryId}/artworks`), artworkData);

      toast({
        title: 'Artwork Added!',
        description: `${data.title} has been successfully uploaded.`,
      });
      reset();
    } catch (error: any) {
      console.error('Error uploading artwork:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register('title')} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="galleryId">Gallery</Label>
        <Select onValueChange={(value) => setValue('galleryId', value)}>
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
        {errors.galleryId && <p className="text-red-500 text-sm">{errors.galleryId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="medium">Medium</Label>
          <Input id="medium" {...register('medium')} />
          {errors.medium && <p className="text-red-500 text-sm">{errors.medium.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" {...register('date')} />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image">Artwork Image</Label>
        <Input id="image" type="file" accept="image/*" {...register('image')} />
        {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Uploading...' : 'Add Artwork'}
      </Button>
    </form>
  );
}
