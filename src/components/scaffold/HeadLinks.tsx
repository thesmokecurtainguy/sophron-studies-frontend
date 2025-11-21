/**
 * Component to add preconnect and dns-prefetch links to the document head
 * Uses a script that runs immediately to ensure links are added early
 */
export default function HeadLinks() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            if (typeof document !== 'undefined') {
              var preconnect = document.createElement('link');
              preconnect.rel = 'preconnect';
              preconnect.href = 'https://player.vimeo.com';
              preconnect.crossOrigin = 'anonymous';
              document.head.appendChild(preconnect);
              
              var dnsPrefetch = document.createElement('link');
              dnsPrefetch.rel = 'dns-prefetch';
              dnsPrefetch.href = 'https://cdn.sanity.io';
              document.head.appendChild(dnsPrefetch);
            }
          })();
        `,
      }}
    />
  );
}

