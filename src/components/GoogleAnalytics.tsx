'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { trackPageView } from '@/lib/analytics';

/**
 * Google Analytics 4 Component
 * Handles GA4 script loading and automatic pageview tracking on route changes
 */
export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Track pageviews on route changes
  useEffect(() => {
    if (!gaId) return;

    // Track pageview when pathname or search params change
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    trackPageView(url);
  }, [pathname, searchParams, gaId]);

  // Don't render anything if GA ID is not configured
  if (!gaId) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 Script - Loaded with lazyOnload to avoid blocking render */}
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

