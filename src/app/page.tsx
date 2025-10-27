
'use client'

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Palette, PenTool, Pencil, Handshake, UserRound, TabletSmartphone, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn, getPlaceholderImage } from '@/lib/utils';
import HeroAnimation from '@/components/hero-animation';
import type { Gallery } from '@/lib/types';
import { useCollection } from '@/firebase';

const categoryIcons: { [key: string]: React.ReactNode } = {
  'digital-arts': <TabletSmartphone className="size-8 text-accent" />,
  'realism-portraits': <UserRound className="size-8 text-accent" />,
  'water-colour-paintings': <Palette className="size-8 text-accent" />,
  'inking': <PenTool className="size-8 text-accent" />,
  'pencil-sketches': <Pencil className="size-8 text-accent" />,
  'commissions': <Handshake className="size-8 text-accent" />,
};

export default function Home() {
  const heroAvatar = getPlaceholderImage('hero-avatar');
  const { data: galleries, loading: galleriesLoading } = useCollection<Gallery>('galleries');
  const galleryCategories = galleries?.filter(g => g.slug !== 'commissions') || [];

  return (
    <div className="container mx-auto px-4">
      <section className="flex flex-col items-center text-center pt-8 md:pt-12 pb-16 md:pb-24 relative overflow-hidden">
        <HeroAnimation heroAvatarUrl={heroAvatar?.imageUrl} />
        <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl tracking-wider mt-4">
          RUBAYAT HASSAN
        </h1>
        <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-2xl">
          Creative Illustrator & Digital Artist
        </p>
        <p className="mt-6 font-bio text-2xl md:text-3xl text-foreground/80 max-w-3xl leading-relaxed">
          Hi, I’m RUBAYAT, an 18-year-old artist who loves creating both digitally and traditionally. I work with digital art, inking, and painting — whatever helps bring my ideas to life. My style is a mix of mood, character, and a bit of pop culture. Sometimes it’s clean, sometimes messy — but always personal. I’m still growing, still experimenting, and always making something that feels true to me.
        </p>
        <div className="mt-12 flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
                <Link href="#" aria-label="Facebook" className="p-3 text-foreground/70 transition-all hover:text-primary hover:scale-110 hover:[&>svg]:drop-shadow-[0_0_5px_hsl(var(--primary))]">
                  <Facebook className="h-8 w-8 transition-all" />
                </Link>
                <Link href="#" aria-label="Instagram" className="p-3 text-foreground/70 transition-all hover:text-primary hover:scale-110 hover:[&>svg]:drop-shadow-[0_0_5px_hsl(var(--primary))]">
                  <Instagram className="h-8 w-8 transition-all" />
                </Link>
                <Link href="#" aria-label="X / Twitter" className="p-3 text-foreground/70 transition-all hover:text-primary hover:scale-110 hover:[&>svg]:drop-shadow-[0_0_5px_hsl(var(--primary))]">
                  <Twitter className="h-8 w-8 transition-all" />
                </Link>
                <Link href="#" aria-label="YouTube" className="p-3 text-foreground/70 transition-all hover:text-primary hover:scale-110 hover:[&>svg]:drop-shadow-[0_0_5px_hsl(var(--primary))]">
                  <Youtube className="h-8 w-8 transition-all" />
                </Link>
            </div>
            <p className="text-sm text-foreground/60 mt-2">Follow me on social media</p>
        </div>
      </section>

      <section className="my-8 md:my-12 py-16 bg-card/50 rounded-2xl shadow-lg">
        <div className="grid grid-cols-1 items-center gap-12 px-8 md:px-16">
          <div className="md:col-span-2 text-center">
            <h2 className="font-headline text-5xl text-primary mb-4 tracking-wide">
              A Glimpse into My World
            </h2>
            <p className="font-bio text-3xl md:text-4xl leading-relaxed text-foreground/90 max-w-4xl mx-auto">
              &ldquo;Every canvas is a journey, and every stroke tells a story. I pour my heart into creating art that feels alive, blending chaotic creativity with clean, heartfelt expression.&rdquo;
            </p>
          </div>
        </div>
      </section>

      <section id="gallery" className="my-16 md:my-24 scroll-mt-20">
        <h2 className="text-center font-headline text-5xl tracking-wider mb-12">
          Explore My Gallery
        </h2>
        {galleriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="h-[400px]"><CardContent className="p-6 h-full w-full animate-pulse bg-muted"></CardContent></Card>
                ))}
            </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryCategories.map((category) => {
            const image = getPlaceholderImage(`category-${category.slug}`);
            return (
              <Link href={`/gallery/${category.slug}`} key={category.slug} className="group block">
                <Card className="overflow-hidden h-full transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 border-2 border-transparent hover:border-primary/50">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative h-60 w-full">
                      {image && (
                        <Image
                          src={image.imageUrl}
                          alt={image.description}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          data-ai-hint={image.imageHint}
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                    <div className="p-6 bg-card flex-grow flex flex-col justify-between">
                      <div>
                        <div className="mb-4">
                          {categoryIcons[category.slug]}
                        </div>
                        <h3 className="font-headline text-3xl tracking-wide">
                          {category.name}
                        </h3>
                      </div>
                      <div className="mt-4 flex items-center text-primary font-semibold">
                        <span>View Collection</span>
                        <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
        )}
      </section>
    </div>
  );
}
