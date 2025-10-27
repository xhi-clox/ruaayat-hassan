"use client";

import Image from 'next/image';
import { Droplets, Palette, PenTool, Sparkles } from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

type HeroAnimationProps = {
  heroAvatar: ImagePlaceholder;
};

const OrbitingIcon = ({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div
    className={`absolute text-accent opacity-60 ${className}`}
    style={style}
  >
    {children}
  </div>
);

export default function HeroAnimation({ heroAvatar }: HeroAnimationProps) {
  return (
    <div className="relative mb-8 flex justify-center items-center h-64 w-64 md:h-80 md:w-80">
      <OrbitingIcon className="top-0 left-10 animate-float" style={{ animationDelay: '0s' }}>
        <Palette className="size-8 md:size-10" />
      </OrbitingIcon>
      <OrbitingIcon className="top-1/4 right-0 animate-float" style={{ animationDelay: '1.5s' }}>
        <Sparkles className="size-6 md:size-8" />
      </OrbitingIcon>
      <OrbitingIcon className="bottom-1/4 left-0 animate-float" style={{ animationDelay: '3s' }}>
        <PenTool className="size-7 md:size-9" />
      </OrbitingIcon>
      <OrbitingIcon className="bottom-0 right-10 animate-float" style={{ animationDelay: '4.5s' }}>
        <Droplets className="size-8 md:size-10" />
      </OrbitingIcon>
      
      <div className="relative h-56 w-56 md:h-72 md:w-72 rounded-full overflow-hidden shadow-2xl shadow-primary/20">
        <Image
          src={heroAvatar.imageUrl}
          alt={heroAvatar.description}
          fill
          priority
          sizes="(max-width: 768px) 50vw, 33vw"
          data-ai-hint={heroAvatar.imageHint}
          className="object-cover"
        />
      </div>
    </div>
  );
}
