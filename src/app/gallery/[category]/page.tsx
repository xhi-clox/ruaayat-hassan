import { collection, getDocs, getDocsFromServer, query, where } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import GalleryClient from './gallery-client';
import { db } from '@/firebase/server';
import type { Artwork, Gallery } from '@/lib/types';


type GalleryPageProps = {
  params: {
    category: string;
  };
};

// This function is commented out because we are fetching categories dynamically from Firestore.
// If you want to pre-build static pages for known galleries, you can implement getStaticParams
// by fetching all galleries from Firestore at build time.
// export async function generateStaticParams() {
//   const galleriesSnapshot = await getDocsFromServer(collection(db, 'galleries'));
//   return galleriesSnapshot.docs.map((doc) => ({
//     category: doc.data().slug,
//   }));
// }

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { category: categorySlug } = params;

  const galleriesRef = collection(db, 'galleries');
  const q = query(galleriesRef, where('slug', '==', categorySlug));
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    notFound();
  }
  
  const gallery = querySnapshot.docs[0].data() as Gallery;
  gallery.id = querySnapshot.docs[0].id;


  const artworksRef = collection(db, `galleries/${gallery.id}/artworks`);
  const artworksSnapshot = await getDocs(artworksRef);
  const artworks = artworksSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Artwork[];

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-6xl md:text-7xl tracking-wider text-primary">
          {gallery.name}
        </h1>
        <p className="mt-2 text-lg text-foreground/80">A collection of my work in {gallery.name.toLowerCase()}.</p>
      </div>
      <GalleryClient artworks={artworks} />
    </div>
  );
}
