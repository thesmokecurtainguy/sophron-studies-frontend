/**
 * Component to add preconnect and dns-prefetch links to the document head
 * Also removes Vercel Live Feedback script (injected automatically by Vercel)
 * Uses a script that runs immediately to ensure links are added early
 */
export default function HeadLinks() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            if (typeof document !== 'undefined') {
              // Add preconnect hints for faster resource loading
              var preconnect = document.createElement('link');
              preconnect.rel = 'preconnect';
              preconnect.href = 'https://player.vimeo.com';
              preconnect.crossOrigin = 'anonymous';
              document.head.appendChild(preconnect);
              
              var dnsPrefetch = document.createElement('link');
              dnsPrefetch.rel = 'dns-prefetch';
              dnsPrefetch.href = 'https://cdn.sanity.io';
              document.head.appendChild(dnsPrefetch);
              
              // Remove Vercel Live Feedback script (injected automatically by Vercel)
              // This script is only useful during development and adds unnecessary weight
              var removeVercelLive = function() {
                // Remove script tags with vercel.live in src
                var scripts = document.querySelectorAll('script[src*="vercel.live"]');
                scripts.forEach(function(script) {
                  script.remove();
                });
                
                // Also remove any iframes or other elements injected by Vercel Live
                var vercelElements = document.querySelectorAll('[data-vercel-live], [id*="vercel"], [class*="vercel-live"]');
                vercelElements.forEach(function(el) {
                  el.remove();
                });
              };
              
              // Remove immediately if DOM is ready
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', removeVercelLive);
              } else {
                removeVercelLive();
              }
              
              // Also check periodically in case Vercel injects it later
              setTimeout(removeVercelLive, 100);
              setTimeout(removeVercelLive, 500);
              setTimeout(removeVercelLive, 1000);
            }
          })();
        `,
      }}
    />
  );
}

