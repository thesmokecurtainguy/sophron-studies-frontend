/**
 * Google Analytics 4 Event Tracking Utilities
 * 
 * This file provides functions to track custom events in GA4.
 * All tracking is disabled in development mode.
 */

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Check if GA4 tracking should be enabled
 * Only track in production environment
 */
const isGAEnabled = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    process.env.NODE_ENV === 'production' &&
    !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID &&
    typeof window.gtag === 'function'
  );
};

/**
 * Get the GA4 Measurement ID from environment variables
 */
const getGAId = (): string | null => {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || null;
};

/**
 * Track a custom event in GA4
 * 
 * @param eventName - The name of the event (e.g., 'newsletter_signup', 'add_to_cart')
 * @param eventParams - Additional parameters for the event
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
): void => {
  if (!isGAEnabled()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GA4] Event tracked (dev mode):', eventName, eventParams);
    }
    return;
  }

  const gaId = getGAId();
  if (!gaId) {
    console.warn('[GA4] Measurement ID not found');
    return;
  }

  window.gtag?.('event', eventName, {
    ...eventParams,
  });
};

/**
 * Track a pageview
 * 
 * @param url - The URL of the page (optional, defaults to current path)
 */
export const trackPageView = (url?: string): void => {
  if (!isGAEnabled()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GA4] Pageview tracked (dev mode):', url || window.location.pathname);
    }
    return;
  }

  const gaId = getGAId();
  if (!gaId) {
    console.warn('[GA4] Measurement ID not found');
    return;
  }

  window.gtag?.('config', gaId, {
    page_path: url || window.location.pathname,
  });
};

/**
 * Track a newsletter signup event
 * 
 * @param source - Where the signup occurred (e.g., 'footer', 'homepage', 'blog')
 */
export const trackNewsletterSignup = (source?: string): void => {
  trackEvent('newsletter_signup', {
    event_category: 'engagement',
    event_label: source || 'unknown',
  });
};

/**
 * Track a product view event
 * 
 * @param productId - The product ID
 * @param productName - The product name
 * @param productPrice - The product price (optional)
 */
export const trackProductView = (
  productId: string,
  productName: string,
  productPrice?: number
): void => {
  trackEvent('view_item', {
    event_category: 'ecommerce',
    event_label: productName,
    items: [
      {
        item_id: productId,
        item_name: productName,
        price: productPrice,
        item_category: 'product',
      },
    ],
    value: productPrice,
    currency: 'USD',
  });
};

/**
 * Track an add to cart event
 * 
 * @param productId - The product ID
 * @param productName - The product name
 * @param productPrice - The product price
 * @param quantity - The quantity added (default: 1)
 * @param size - The product size (optional)
 */
export const trackAddToCart = (
  productId: string,
  productName: string,
  productPrice: number,
  quantity: number = 1,
  size?: string
): void => {
  trackEvent('add_to_cart', {
    event_category: 'ecommerce',
    event_label: productName,
    items: [
      {
        item_id: productId,
        item_name: productName,
        price: productPrice,
        quantity: quantity,
        item_variant: size,
        item_category: 'product',
      },
    ],
    value: productPrice * quantity,
    currency: 'USD',
  });
};

/**
 * Track a form submission event
 * 
 * @param formName - The name/type of the form (e.g., 'contact', 'inquiry')
 * @param formType - The specific form type (e.g., 'general', 'study', 'seminar')
 */
export const trackFormSubmission = (
  formName: string,
  formType?: string
): void => {
  trackEvent('form_submit', {
    event_category: 'engagement',
    event_label: formName,
    form_type: formType,
  });
};

/**
 * Track an external link click event
 * 
 * @param url - The external URL that was clicked
 * @param linkText - The text of the link (optional)
 */
export const trackExternalLinkClick = (
  url: string,
  linkText?: string
): void => {
  trackEvent('external_link_click', {
    event_category: 'outbound',
    event_label: linkText || url,
    outbound_url: url,
  });
};

