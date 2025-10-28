"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type HeroAnimationProps = {
  heroAvatarUrl?: string | null;
};

const BackgroundCard = ({ className, delay = 0 }: { className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, rotate: -10, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
    transition={{ type: 'spring', stiffness: 50, damping: 15, delay }}
    className={cn(
      "absolute rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10",
      className
    )}
  />
);

export default function HeroAnimation({ heroAvatarUrl }: HeroAnimationProps) {
  return (
    <div className="relative mb-8 flex h-72 w-72 items-center justify-center md:h-96 md:w-96">
      <div className="absolute inset-0">
        <BackgroundCard className="w-[70%] h-[50%] top-[5%] left-0 rotate-[-15deg]" delay={0} />
        <BackgroundCard className="w-[60%] h-[60%] top-[20%] right-0 rotate-[10deg]" delay={0.2} />
        <BackgroundCard className="w-[50%] h-[40%] bottom-[5%] left-[10%] rotate-[5deg]" delay={0.4} />
        <BackgroundCard className="w-[40%] h-[30%] bottom-[15%] right-[5%] rotate-[-5deg]" delay={0.6} />

        <div className="absolute inset-0 bg-radial-gradient from-transparent to-background" />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 50, damping: 15, delay: 0.5 }}
        className="relative z-10"
      >
        <div className="absolute -inset-2 rounded-full bg-primary/80 blur-xl"></div>
        <div className="relative rounded-full p-1 border-2 border-primary/50 bg-gradient-to-br from-primary to-accent">
          <div className={cn(
              "relative rounded-full overflow-hidden bg-card border-4 border-background",
              "h-64 w-64 md:h-80 md:w-80"
          )}>
            {heroAvatarUrl && (
              <Image
                  src={heroAvatarUrl}
                  alt={"Rubayat Hassan's avatar"}
                  fill
                  priority
                  sizes="(max-width: 768px) 50vw, 33vw"
                  data-ai-hint={"anime artist"}
                  className="object-cover"
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
