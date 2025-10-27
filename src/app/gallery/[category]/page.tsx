
import GalleryClient from './gallery-client';

type GalleryPageProps = {
  params: {
    category: string;
  };
};

export default function GalleryPage({ params }: GalleryPageProps) {
  const { category: categorySlug } = params;

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <GalleryClient categorySlug={categorySlug} />
    </div>
  );
}
