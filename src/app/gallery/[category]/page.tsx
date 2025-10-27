import { ARTWORKS, CATEGORIES } from '@/lib/data';
import { notFound } from 'next/navigation';
import GalleryClient from './gallery-client';

type GalleryPageProps = {
  params: {
    category: string;
  };
};

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    category: category.slug,
  }));
}

export default function GalleryPage({ params }: GalleryPageProps) {
  const { category: categorySlug } = params;

  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) {
    notFound();
  }

  const artworks = ARTWORKS.filter((art) => art.categorySlug === categorySlug);

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-6xl md:text-7xl tracking-wider text-primary">
          {category.name}
        </h1>
        <p className="mt-2 text-lg text-foreground/80">A collection of my work in {category.name.toLowerCase()}.</p>
      </div>
      <GalleryClient artworks={artworks} />
    </div>
  );
}
