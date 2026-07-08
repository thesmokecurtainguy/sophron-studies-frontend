/**
 * Removes Vercel Live Feedback script (injected automatically by Vercel).
 * Preconnect hints live in the root layout <head> for earlier discovery.
 */
export default function HeadLinks() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            if (typeof document !== 'undefined') {
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

