
"use client";

import Image from 'next/image';
import { Droplets, Palette, PenTool, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type HeroAnimationProps = {
  heroAvatarUrl?: string | null;
  variant?: 'default' | 'small';
};

const OrbitingIcon = ({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div
    className={`absolute ${className}`}
    style={style}
  >
    {children}
  </div>
);

export default function HeroAnimation({ heroAvatarUrl, variant = 'default' }: HeroAnimationProps) {
  const containerSize = variant === 'default' ? 'h-72 w-72 md:h-96 md:w-96' : 'h-24 w-80';
  const imageSize = variant === 'default' ? 'h-64 w-64 md:h-80 md:w-80' : 'h-24 w-24';

  const icons = [
    { icon: <Palette className="size-8 md:size-10" />, top: '0', left: '10', delay: '0s' },
    { icon: <Sparkles className="size-6 md:size-8" />, top: '1/4', right: '0', delay: '1.5s' },
    { icon: <PenTool className="size-7 md:size-9" />, top: 'auto', bottom: '1/4', left: '0', delay: '3s' },
    { icon: <Droplets className="size-8 md:size-10" />, top: 'auto', bottom: '0', right: '10', delay: '4.5s' },
  ];

  if (variant === 'small') {
    return (
      <div className={cn("relative flex justify-center items-center", containerSize)}>
        {icons.map((item, index) => (
            <OrbitingIcon 
                key={index}
                className={cn(
                    'animate-float text-foreground/20', // Changed color
                    {
                        'top-0 left-10': index === 0,
                        'top-0 right-10': index === 1,
                        'bottom-0 left-20': index === 2,
                        'bottom-0 right-20': index === 3,
                    }
                )}
                style={{ animationDelay: `${index * 0.8}s`, transform: 'scale(0.4)' }} // Made smaller
            >
                {item.icon}
            </OrbitingIcon>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("relative mb-8 flex justify-center items-center", containerSize)}>
      {icons.map((item, index) => (
        <OrbitingIcon 
          key={index}
          className="animate-float text-primary opacity-60"
          style={{ 
            animationDelay: item.delay,
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
           }}
        >
          {item.icon}
        </OrbitingIcon>
      ))}
      
      {heroAvatarUrl && (
        <div className={cn(
            "relative rounded-full overflow-hidden bg-background/50",
            imageSize
        )}>
          <Image
              src={heroAvatarUrl}
              alt={"Rubayat Hassan's avatar"}
              fill
              priority
              sizes="(max-width: 768px) 50vw, 33vw"
              data-ai-hint={"anime artist"}
              className="object-cover"
          />
        </div>
      )}
    </div>
  );
}
