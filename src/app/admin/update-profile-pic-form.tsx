
'use client';

import { useState } from 'react';
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
import type { User } from 'firebase/auth';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon } from 'lucide-react';
import type { UserProfile } from '@/lib/types';

const profileSchema = z.object({
  profileImage: z
    .any()
    .refine((files) => files?.length === 1, 'A profile image is required.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type UpdateProfilePicFormProps = {
  user: User;
  userProfile: UserProfile;
};

export default function UpdateProfilePicForm({ user, userProfile }: UpdateProfilePicFormProps) {
  const { app } = useFirebaseApp();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(userProfile.photoURL || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const imageFile = watch('profileImage');
  if (imageFile && imageFile[0]) {
    const newPreview = URL.createObjectURL(imageFile[0]);
    if (newPreview !== preview) {
      setPreview(newPreview);
    }
  }

  const onSubmit = async (data: ProfileFormValues) => {
    if (!firestore || !app || !user) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firebase not initialized or user not found.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const imageFile = data.profileImage[0];
      const storage = getStorage(app);
      const storageRef = ref(storage, `profile-pictures/admin/${imageFile.name}`);

      const uploadResult = await uploadBytes(storageRef, imageFile);
      const photoURL = await getDownloadURL(uploadResult.ref);

      // Update the 'admin' document
      const adminUserDocRef = doc(firestore, 'users', 'admin');
      await updateDoc(adminUserDocRef, { photoURL });

      // Also update the personal user document
      const personalUserDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(personalUserDocRef, { photoURL });
      
      toast({
        title: 'Profile Updated!',
        description: 'Your profile picture has been successfully updated.',
      });
      // No need to reset form, as we want to keep the preview
    } catch (error: any) {
      console.error('Error updating profile picture:', error);
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
      <div className="flex items-center space-x-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={preview || undefined} alt={user.displayName || 'User'} />
          <AvatarFallback>
            <UserIcon className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2 flex-grow">
          <Label htmlFor="profileImage">Update Profile Picture</Label>
          <Input id="profileImage" type="file" accept="image/*" {...register('profileImage')} />
          {errors.profileImage && <p className="text-destructive text-sm">{(errors.profileImage as any)?.message}</p>}
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Uploading...' : 'Save Profile Picture'}
      </Button>
    </form>
  );
}
