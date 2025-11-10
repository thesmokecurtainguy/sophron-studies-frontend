# Google Analytics 4 Implementation Guide

## Summary

Google Analytics 4 (GA4) tracking has been successfully implemented for your Next.js App Router application. All tracking is configured to only work in production mode (not in development).

## Project Analysis

✅ **Router Type**: App Router (confirmed - `src/app/` directory exists)  
✅ **TypeScript**: Yes (confirmed - `tsconfig.json` and `.tsx`/`.ts` files throughout)  
✅ **Environment**: Next.js 15.4.5 with React 19

## Step 1: Environment Variable Setup

**IMPORTANT**: You need to manually create the `.env.local` file in your project root since it's gitignored.

Create `/Users/mcphajomo/Documents/GitHub/sophron-studies-frontend-main/.env.local` with the following content:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-9CDHT3GDKE
```

This file is already in `.gitignore`, so it won't be committed to your repository.

## Step 2: Files Created/Modified

### New Files Created:

1. **`src/lib/analytics.ts`**
   - Utility functions for GA4 event tracking
   - Includes: `trackEvent`, `trackPageView`, `trackNewsletterSignup`, `trackProductView`, `trackAddToCart`, `trackFormSubmission`, `trackExternalLinkClick`
   - All functions automatically disable in development mode

2. **`src/components/GoogleAnalytics.tsx`**
   - Client component that loads GA4 script
   - Handles automatic pageview tracking on route changes
   - Uses Next.js `Script` component with `afterInteractive` strategy

3. **`src/components/shop/ProductViewTracker.tsx`**
   - Client component for tracking product views in server components
   - Used in the product detail page

### Files Modified:

1. **`src/app/layout.tsx`**
   - Added `GoogleAnalytics` component import and usage
   - GA4 script now loads on all pages

2. **`src/components/sections/NewsletterSection.tsx`**
   - Added `trackNewsletterSignup` call on successful newsletter signup
   - Tracks source (footer, homepage, blog, etc.)

3. **`src/components/ContactForm.tsx`**
   - Added `trackFormSubmission` call on successful form submission
   - Tracks form type (general, study, seminar)

4. **`src/app/shop/[slug]/page.tsx`**
   - Added `ProductViewTracker` component
   - Tracks product views with product ID, name, and price

5. **`src/components/shop/AddToCartButton.tsx`**
   - Added `trackAddToCart` call when items are added to cart
   - Includes product ID, name, price, quantity, and size (if applicable)
   - Added `trackExternalLinkClick` for external product links

6. **`src/components/shop/ProductCard.tsx`**
   - Added `trackAddToCart` call when items are added to cart from product cards
   - Added `trackExternalLinkClick` for external product links

## Step 3: Event Tracking Implementation

### Automatic Tracking:

- **Pageviews**: Automatically tracked on all route changes via `GoogleAnalytics` component
- **Product Views**: Tracked when viewing a product detail page (`/shop/[slug]`)

### Custom Event Tracking:

1. **Newsletter Signups** (`newsletter_signup`)
   - Triggered: When user successfully subscribes to newsletter
   - Parameters: `source` (footer, homepage, blog, etc.)
   - Location: `NewsletterSection.tsx`

2. **Form Submissions** (`form_submit`)
   - Triggered: When contact form is successfully submitted
   - Parameters: `formName` (contact), `formType` (general, study, seminar)
   - Location: `ContactForm.tsx`

3. **Product Views** (`view_item`)
   - Triggered: When viewing a product detail page
   - Parameters: `productId`, `productName`, `productPrice`
   - Location: `shop/[slug]/page.tsx`

4. **Add to Cart** (`add_to_cart`)
   - Triggered: When user adds a product to cart
   - Parameters: `productId`, `productName`, `productPrice`, `quantity`, `size` (optional)
   - Locations: `AddToCartButton.tsx`, `ProductCard.tsx`

5. **External Link Clicks** (`external_link_click`)
   - Triggered: When user clicks external product links
   - Parameters: `url`, `linkText` (product name)
   - Locations: `AddToCartButton.tsx`, `ProductCard.tsx`

## Step 4: Testing GA4 Implementation

### Development Mode Testing:

In development mode (`npm run dev`), GA4 tracking is **disabled** but will log to console:

1. Open browser DevTools Console (F12)
2. Navigate through your site
3. Look for console logs like:
   ```
   [GA4] Pageview tracked (dev mode): /shop
   [GA4] Event tracked (dev mode): add_to_cart { ... }
   ```

### Production Mode Testing:

To test actual GA4 tracking, you need to build and run in production mode:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

3. **Open browser DevTools:**
   - Open Network tab
   - Filter by "google-analytics" or "gtag"
   - Navigate through your site

4. **What to look for:**
   - Requests to `https://www.googletagmanager.com/gtag/js?id=G-9CDHT3GDKE`
   - Requests to `https://www.google-analytics.com/g/collect` (GA4 endpoint)
   - These requests should include your event data

5. **Check GA4 Real-Time Reports:**
   - Go to Google Analytics 4 dashboard
   - Navigate to Reports > Real-time
   - You should see your activity appear within seconds

### Browser DevTools Verification:

1. **Console Tab:**
   - In production, you should see no console logs (tracking is silent)
   - In development, you'll see `[GA4]` prefixed logs

2. **Network Tab:**
   - Filter by "collect" or "gtag"
   - Look for POST requests to `google-analytics.com/g/collect`
   - Click on a request → Payload tab to see event data

3. **Application Tab:**
   - Check Cookies → Should see `_ga` and `_ga_*` cookies
   - Check Local Storage → Should see GA4 data

### Testing Specific Events:

1. **Test Newsletter Signup:**
   - Fill out newsletter form
   - Submit successfully
   - Check Network tab for `newsletter_signup` event

2. **Test Product View:**
   - Navigate to `/shop/[any-product-slug]`
   - Check Network tab for `view_item` event

3. **Test Add to Cart:**
   - Click "Add to Cart" on any product
   - Check Network tab for `add_to_cart` event

4. **Test Form Submission:**
   - Fill out contact form at `/contact`
   - Submit successfully
   - Check Network tab for `form_submit` event

5. **Test External Link:**
   - Click "Visit Website" on an external product
   - Check Network tab for `external_link_click` event

## Step 5: Verification Checklist

- [ ] Created `.env.local` file with `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-9CDHT3GDKE`
- [ ] Restarted development server after adding environment variable
- [ ] Verified GA4 script loads (check Network tab for `gtag/js`)
- [ ] Tested pageview tracking (navigate between pages)
- [ ] Tested newsletter signup event
- [ ] Tested contact form submission event
- [ ] Tested product view event
- [ ] Tested add to cart event
- [ ] Tested external link click event
- [ ] Verified events appear in GA4 Real-Time reports (production only)

## Important Notes

1. **Development vs Production:**
   - Tracking is **disabled** in development mode
   - Only works when `NODE_ENV === 'production'`
   - Development mode logs to console for debugging

2. **Environment Variables:**
   - Must restart dev server after adding/changing `.env.local`
   - Variable must start with `NEXT_PUBLIC_` to be available in browser

3. **Privacy:**
   - GA4 respects user privacy settings
   - Consider adding cookie consent banner if required by your jurisdiction

4. **Performance:**
   - GA4 script loads with `afterInteractive` strategy (non-blocking)
   - Pageview tracking uses Next.js router events (efficient)

## Troubleshooting

### GA4 not tracking:
- ✅ Check `.env.local` file exists and has correct Measurement ID
- ✅ Restart dev server after adding environment variable
- ✅ Verify `NODE_ENV === 'production'` for actual tracking
- ✅ Check browser console for errors
- ✅ Verify Measurement ID is correct: `G-9CDHT3GDKE`

### Events not appearing:
- ✅ Check Network tab for GA4 requests
- ✅ Verify event names match GA4 event naming conventions
- ✅ Check GA4 Real-Time reports (may take a few seconds)
- ✅ Ensure you're testing in production mode

### Script not loading:
- ✅ Check browser console for errors
- ✅ Verify internet connection
- ✅ Check if ad blockers are interfering
- ✅ Verify `GoogleAnalytics` component is in `layout.tsx`

## Next Steps

1. Create `.env.local` file with your GA4 Measurement ID
2. Test in development mode (check console logs)
3. Build and test in production mode
4. Verify events in GA4 Real-Time reports
5. Set up custom reports in GA4 dashboard for your specific events

## Support

If you encounter any issues:
1. Check browser console for errors
2. Verify environment variable is set correctly
3. Test in production mode (not development)
4. Check GA4 Real-Time reports for event data

