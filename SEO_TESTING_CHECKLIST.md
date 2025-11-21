# SEO Testing Checklist

## How to Test Your SEO Integration

### Quick Test Method (Browser Inspector)

1. **Open any page** on http://localhost:3001
2. **Right-click → Inspect** (or press F12)
3. **Go to Elements tab**
4. **Look at the `<head>` section**
5. **Search for** (Ctrl/Cmd + F):
   - `og:title` - Should find Open Graph tags
   - `twitter:card` - Should find Twitter Card tags
   - `robots` - Should find robots meta tag
   - `canonical` - Should find canonical URL

---

## What to Check on Each Page

### ✅ Homepage (http://localhost:3001)

**Expected Meta Tags:**
- Title: "Sophron Studies" (or custom from Sanity)
- Description: "Reformed Bible studies for women" (or custom from Sanity)
- OG Image: Should have an image URL
- Canonical: http://localhost:3001/

**How to Check:**
1. View page source (Ctrl/Cmd + U)
2. Search for `<meta property="og:title"`
3. Search for `<meta name="description"`

---

### ✅ About Page (http://localhost:3001/about)

**Expected Meta Tags:**
- Title: "About - Sophron Studies" (or custom from Sanity)
- Description: Custom description from Sanity
- OG tags with about page content

---

### ✅ Blog Post (http://localhost:3001/blog/[any-post])

**Expected Meta Tags:**
- Title: "[Post Title] | The Sophron Blog"
- Description: Post excerpt
- OG Image: Post cover image
- Twitter Card: summary_large_image

**Example:**
http://localhost:3001/blog/wondering-what-sophron-studies-means-let-s-talk-vision

---

### ✅ Product Page (http://localhost:3001/shop/[any-product])

**Expected Meta Tags:**
- Title: "[Product Name] - Sophron Studies"
- Description: Product description
- OG Image: Product image

**Expected Structured Data (JSON-LD):**
Look for a `<script type="application/ld+json">` tag with:
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "...",
  "image": "...",
  "offers": {
    "@type": "Offer",
    "price": "...",
    "priceCurrency": "USD"
  }
}
```

---

## Easy Way: Use This Bookmarklet

**Create a bookmark with this code to quickly check SEO:**

```javascript
javascript:(function(){
  const title = document.querySelector('title')?.textContent;
  const desc = document.querySelector('meta[name="description"]')?.content;
  const ogTitle = document.querySelector('meta[property="og:title"]')?.content;
  const ogDesc = document.querySelector('meta[property="og:description"]')?.content;
  const ogImage = document.querySelector('meta[property="og:image"]')?.content;
  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  const robots = document.querySelector('meta[name="robots"]')?.content;
  
  alert(`
SEO CHECK:
━━━━━━━━━━━━━━━━━━━━
Title: ${title || '❌ Missing'}
Description: ${desc ? '✅ Present' : '❌ Missing'}
OG Title: ${ogTitle ? '✅ Present' : '❌ Missing'}
OG Description: ${ogDesc ? '✅ Present' : '❌ Missing'}
OG Image: ${ogImage ? '✅ Present' : '❌ Missing'}
Canonical: ${canonical || '❌ Missing'}
Robots: ${robots || '❌ Missing'}
  `);
})();
```

**How to use:**
1. Create a new bookmark
2. Paste the code above as the URL
3. Click it on any page to see SEO summary

---

## Test Google Analytics

### Check GA4 is Loading:

1. Open **Browser DevTools** (F12)
2. Go to **Network** tab
3. Filter by "gtag"
4. Reload the page
5. You should see requests to `googletagmanager.com`

### Check GA4 Events:

1. Open **Browser DevTools** (F12)
2. Go to **Console** tab
3. You should see logs like:
   - `[GA4] Logged event: page_view`
   - `[GA4] Logged event: newsletter_signup` (when you test forms)

**Note:** Events are logged in development, sent to GA4 in production only.

---

## Test Structured Data (Products Only)

### Method 1: View Page Source
1. Go to a product page
2. View source (Ctrl/Cmd + U)
3. Search for `application/ld+json`
4. You should see a JSON block with product data

### Method 2: Google's Rich Results Test
1. Go to: https://search.google.com/test/rich-results
2. Enter your product page URL (once deployed)
3. Or paste the HTML
4. Check for Product schema validation

---

## Quick Visual Test

### What You Should See in Page Source:

**Near the top of `<head>`:**
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-9CDHT3GDKE"></script>

<!-- Meta Tags -->
<title>Your Page Title</title>
<meta name="description" content="...">
<meta name="keywords" content="...">

<!-- Open Graph -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:type" content="website">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">

<!-- SEO -->
<meta name="robots" content="index, follow">
<link rel="canonical" href="...">
```

---

## Common Issues & Solutions

### ❌ "I don't see any meta tags"
**Solution:** Make sure you're looking in the `<head>` section, not `<body>`

### ❌ "Meta tags say 'null' or are empty"
**Solution:** The SEO data might not be set in Sanity CMS yet. Add it in Sanity Studio.

### ❌ "No structured data on product pages"
**Solution:** Make sure the product has data in Sanity and the page loaded correctly.

### ❌ "GA4 not loading"
**Solution:** Check that `NEXT_PUBLIC_GA_MEASUREMENT_ID` is in your `.env.local`

---

## Next Steps After Testing

1. ✅ **Verify meta tags are present** on all page types
2. ✅ **Check GA4 is loading** in Network tab
3. ✅ **Test events** by interacting with the site
4. ✅ **Validate structured data** on product pages
5. 🚀 **Deploy to production** when ready!

---

**Need help?** Check the browser console for any errors or warnings.

