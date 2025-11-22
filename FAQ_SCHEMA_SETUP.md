# FAQ Schema Setup Guide

This document provides a complete guide for setting up the FAQ system in your Sanity CMS.

## 📁 Files Created

### Schema Files
1. **`src/sanity/schemas/faqCategory.ts`** - FAQ Category document schema
2. **`src/sanity/schemas/faq.ts`** - FAQ document schema
3. **`src/sanity/schemas/index.ts`** - Schema exports
4. **`src/sanity/schemas/README.md`** - Detailed schema documentation

### Query Files
5. **`src/sanity/queries/faq.queries.ts`** - GROQ queries for fetching FAQs
6. **`src/sanity/queries/index.ts`** - Updated to export FAQ queries

## 📋 Schema Overview

### 1. FAQ Category (`faqCategory`)

**Purpose:** Organize FAQs into logical groups (e.g., "Shipping", "Returns", "Products")

**Fields:**
- `title` (string, **required**) - Category name
- `slug` (slug, **required**) - Auto-generated from title, URL-friendly
- `description` (text, optional) - Category introduction text
- `order` (number) - For sorting categories (lower = first)

**Features:**
- Auto-generates slug from title
- Custom preview in Sanity Studio
- Multiple ordering options (by order, by title)

### 2. FAQ (`faq`)

**Purpose:** Individual FAQ items with questions and answers

**Fields:**
- `question` (string, **required**, 10-200 chars) - The FAQ question
- `answer` (block content, **required**) - Rich text answer with formatting
- `category` (reference, **required**) - Links to faqCategory
- `order` (number) - For sorting within category
- `tags` (array of strings) - For searchability and filtering
- `featured` (boolean) - Highlight on homepage

**Rich Text Features:**
- Headings (H3, H4)
- Bold, italic, code formatting
- Bullet and numbered lists
- Links (internal/external)
- Blockquotes

**Features:**
- Validation ensures questions aren't empty
- Custom preview shows category, featured status, and order
- Multiple ordering options (by order, by category, featured first)

## 🔧 Integration Steps

### Step 1: Add Schemas to Sanity Studio

Since your Sanity Studio appears to be in a separate repository (`sophron-studies-cms-main`), you'll need to:

1. **Copy the schema files** to your Sanity Studio project:
   ```bash
   # From your CMS repository
   cp src/sanity/schemas/faqCategory.ts /path/to/sanity-studio/schemas/
   cp src/sanity/schemas/faq.ts /path/to/sanity-studio/schemas/
   ```

2. **Update `sanity.config.ts`** in your Sanity Studio:

   ```typescript
   import { defineConfig } from 'sanity'
   import { deskTool } from 'sanity/desk'
   
   // Import existing schemas
   import product from './schemas/product'
   import category from './schemas/category'
   // ... other schemas
   
   // Import new FAQ schemas
   import faqCategory from './schemas/faqCategory'
   import faq from './schemas/faq'
   
   export default defineConfig({
     name: 'default',
     title: 'Sophron Studies CMS',
     
     projectId: process.env.SANITY_STUDIO_PROJECT_ID,
     dataset: process.env.SANITY_STUDIO_DATASET || 'production',
     
     plugins: [deskTool()],
     
     schema: {
       types: [
         // ... your existing schemas
         product,
         category,
         // ... other schemas
         
         // Add FAQ schemas
         faqCategory,
         faq,
       ],
     },
   })
   ```

### Step 2: Generate TypeScript Types

After adding the schemas to your Sanity Studio:

1. **Run type generation** (if you have the script set up):
   ```bash
   cd /path/to/sanity-studio
   npx sanity typegen generate
   ```

   Or if you have a custom script:
   ```bash
   node run-typegen.js
   ```

2. This will update `src/sanity/types.ts` in your frontend repo with:
   - `FaqCategory` type
   - `Faq` type
   - Updated `AllSanitySchemaTypes` union

### Step 3: Create Test Content

1. **Open Sanity Studio** in your browser
2. **Create FAQ Categories:**
   - Click "Create new" → "FAQ Category"
   - Examples:
     - Title: "Shipping & Delivery", Order: 1
     - Title: "Returns & Exchanges", Order: 2
     - Title: "Products", Order: 3
     - Title: "Account & Orders", Order: 4

3. **Create FAQs:**
   - Click "Create new" → "FAQ"
   - Fill in question (100-200 characters recommended)
   - Add formatted answer using the rich text editor
   - Select a category
   - Set order (for sorting within category)
   - Add tags (e.g., "shipping", "delivery", "timeframe")
   - Toggle "Featured" for FAQs to show on homepage

## 📊 Query Examples

The FAQ queries are ready to use in your Next.js app. Here are some examples:

### Get All Categories
```typescript
import { allFaqCategoriesQuery } from '@/sanity/queries'
import { fetchSanity } from '@/sanity/client'

const categories = await fetchSanity(allFaqCategoriesQuery)
```

### Get FAQs by Category
```typescript
import { faqsByCategorySlugQuery } from '@/sanity/queries'

const faqs = await fetchSanity(faqsByCategorySlugQuery, {
  categorySlug: 'shipping'
})
```

### Get Featured FAQs (for Homepage)
```typescript
import { featuredFaqsQuery } from '@/sanity/queries'

const featuredFaqs = await fetchSanity(featuredFaqsQuery)
```

### Get FAQs Grouped by Category
```typescript
import { faqsGroupedByCategoryQuery } from '@/sanity/queries'

const groupedFaqs = await fetchSanity(faqsGroupedByCategoryQuery)
// Returns: [{ title, slug, faqs: [...] }, ...]
```

### Search FAQs
```typescript
import { searchFaqsQuery } from '@/sanity/queries'

const results = await fetchSanity(searchFaqsQuery, {
  searchPattern: '*shipping*'
})
```

## 🎨 Document Structure Examples

### FAQ Category Document
```json
{
  "_type": "faqCategory",
  "_id": "category-123",
  "title": "Shipping & Delivery",
  "slug": {
    "current": "shipping-delivery"
  },
  "description": "Questions about shipping times, costs, and delivery options",
  "order": 1
}
```

### FAQ Document
```json
{
  "_type": "faq",
  "_id": "faq-456",
  "question": "How long does standard shipping take?",
  "answer": [
    {
      "_type": "block",
      "style": "normal",
      "children": [
        {
          "_type": "span",
          "text": "Standard shipping typically takes 5-7 business days. Express shipping (2-3 business days) is available for an additional fee."
        }
      ]
    }
  ],
  "category": {
    "_ref": "category-123",
    "_type": "reference"
  },
  "order": 1,
  "tags": ["shipping", "delivery", "timeframe"],
  "featured": true
}
```

## ✅ Validation Rules

### FAQ Category
- ✅ Title is required (min 2, max 100 characters)
- ✅ Slug is required and auto-generated
- ✅ Order must be a non-negative integer

### FAQ
- ✅ Question is required (10-200 characters)
- ✅ Answer is required (at least 1 block)
- ✅ Category reference is required
- ✅ Order must be a non-negative integer

## 🚀 Next Steps

After setting up the schemas:

1. **Create FAQ Components:**
   - `src/components/faq/FaqCategory.tsx` - Display category with FAQs
   - `src/components/faq/FaqItem.tsx` - Display individual FAQ
   - `src/components/faq/FaqAccordion.tsx` - Accordion-style FAQ display
   - `src/components/faq/FaqSearch.tsx` - Search functionality

2. **Create FAQ Pages:**
   - `src/app/faq/page.tsx` - Main FAQ page
   - `src/app/faq/[category]/page.tsx` - Category-specific FAQ page

3. **Add FAQ to Homepage:**
   - Display featured FAQs in a section
   - Link to full FAQ page

4. **Add SEO:**
   - Meta descriptions for FAQ pages
   - Structured data (FAQPage schema)

## 📝 Notes

- Both documents are **portable and clean** - no dependencies on other schemas except the category reference
- **No published/draft states** - all documents are immediately available (you can add workflow later)
- **Slugs auto-generate** from titles using Sanity's built-in slugify function
- **Rich text answers** support full formatting for better readability
- **Order fields** allow flexible sorting without changing document creation dates

## 🐛 Troubleshooting

**Schema not appearing in Studio:**
- Check that schemas are imported in `sanity.config.ts`
- Restart Sanity Studio dev server
- Clear browser cache

**Types not updating:**
- Run `npx sanity typegen generate` in your CMS repo
- Check that the output path matches your frontend repo

**Validation errors:**
- Ensure all required fields are filled
- Check character limits (question: 10-200 chars)
- Verify category reference exists before creating FAQs

---

**Ready to use!** Once you've added these schemas to your Sanity Studio and created test content, you can start building the frontend components to display FAQs on sophronstudies.com.

