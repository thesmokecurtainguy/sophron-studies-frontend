import React from 'react';
import Image from 'next/image';
import HeroVimeoDeferred from '@/components/home/HeroVimeoDeferred';

interface HeroSectionProps {
  /** Used for a single accessible H1 (screen-reader or visible later from CMS) */
  headingText?: string;
  vimeoUrl?: string;
  backgroundImage?: {
    url: string;
    alt: string;
  };
  posterImageUrl?: string; // Poster image URL for Vimeo iframe background
  overlayOpacity?: number; // 0-1, defaults to 0.3
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  headingText,
  vimeoUrl, 
  backgroundImage, 
  posterImageUrl,
  overlayOpacity = 0.3 
}) => {
  // Extract Vimeo video ID from URL
  const getVimeoId = (url: string): string | null => {
    const match = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/);
    return match ? match[1] : null;
  };

  const vimeoId = vimeoUrl ? getVimeoId(vimeoUrl) : null;

  return (
    <section className="w-full min-h-[35vh] md:min-h-[50vh] lg:min-h-[65vh] flex items-center justify-center bg-olive relative overflow-hidden">
      {/* Background Video or Image */}
      {vimeoId ? (
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            backgroundImage: posterImageUrl ? `url(${posterImageUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <HeroVimeoDeferred
            vimeoId={vimeoId}
            iframeTitle="Decorative background video for Sophron Studies"
          />
        </div>
      ) : backgroundImage ? (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage.url}
            alt={backgroundImage.alt}
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : null}
      
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
        {/* Use heading-hero class */}
        {/* <h1 className="heading-hero text-gray-800">
          {title}
        </h1> */}
      </div>
    </section>
  );
};

export default HeroSection; 