import React from 'react';
import Image from 'next/image';
import HeroVideoDeferred from '@/components/home/HeroVideoDeferred';

interface HeroSectionProps {
  /** Used for a single accessible H1 (screen-reader or visible later from CMS) */
  headingText?: string;
  backgroundImage?: {
    url: string;
    alt: string;
  };
  posterImageUrl?: string; // Poster image URL for LCP before deferred video mounts
  overlayOpacity?: number; // 0-1, defaults to 0.3
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  headingText,
  backgroundImage, 
  posterImageUrl,
  overlayOpacity = 0.3 
}) => {
  const posterSrc = posterImageUrl || backgroundImage?.url;

  return (
    <section className="w-full min-h-[35vh] md:min-h-[50vh] lg:min-h-[65vh] flex items-center justify-center bg-olive relative overflow-hidden">
      {/* Background poster + deferred self-hosted video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {posterSrc ? (
          <Image
            src={posterSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={75}
            className="object-cover"
          />
        ) : null}
        <HeroVideoDeferred />
      </div>
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black z-10" 
        style={{ opacity: overlayOpacity }}
      />
      
      <div className="relative z-20 text-center p-8 max-w-4xl mx-auto flex flex-col items-center">
        {headingText ? (
          <h1 className="sr-only">{headingText}</h1>
        ) : null}
        {/* Logo - full size, max-w-4xl */}
        <div className="w-full max-w-4xl mb-8">
          <Image
            src="/images/logo-white.svg"
            alt="Sophron Studies Logo"
            width={1600}
            height={400}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
