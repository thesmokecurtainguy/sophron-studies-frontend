# FAQ Schema Documentation

This directory contains the schema definitions for the FAQ system in Sanity CMS.

## Schema Files

### 1. `faqCategory.ts`
Defines the FAQ Category document type for organizing FAQs into logical groups.

**Fields:**
- `title` (string, required) - Category name
- `slug` (slug, required) - Auto-generated from title
- `description` (text, optional) - Category introduction text
- `order` (number) - For sorting categories

### 2. `faq.ts`
Defines the FAQ document type for individual questions and answers.

**Fields:**
- `question` (string, required, 10-200 chars) - The FAQ question
- `answer` (block content, required) - Rich text answer with formatting support
- `category` (reference, required) - Reference to faqCategory
- `order` (number) - For sorting within category
- `tags` (array of strings) - For searchability
- `featured` (boolean) - To highlight on homepage

## Integration Steps

### Step 1: Add Schemas to Sanity Studio

If your Sanity Studio is in a separate repository:

1. Copy these schema files to your Sanity Studio project's `schemas` folder
2. Update your `sanity.config.ts` (or `sanity.config.js`) to import and register the schemas:

```typescript
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { faqCategory, faq } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Sophron Studies CMS',
  
  projectId: 'your-project-id',
  dataset: 'production',
  
  plugins: [deskTool()],
  
  schema: {
    types: [
      // ... your existing schemas
      faqCategory,
      faq,
    ],
  },
})
```

### Step 2: Generate TypeScript Types

After adding the schemas to your Sanity Studio:

1. Run the type generation command (if you have it set up):
   ```bash
   npx sanity typegen generate
   ```

2. This will update `src/sanity/types.ts` with the new FAQ types

### Step 3: Create Test Content

1. Open Sanity Studio
2. Create a few FAQ Categories (e.g., "Shipping", "Returns", "Products")
3. Create FAQs and assign them to categories
4. Mark some FAQs as "featured" for homepage display

## Document Structure

### FAQ Category
```typescript
{
  _type: "faqCategory",
  _id: "...",
  title: "Shipping",
  slug: { current: "shipping" },
  description: "Questions about shipping and delivery",
  order: 1
}
```

### FAQ
```typescript
{
  _type: "faq",
  _id: "...",
  question: "How long does shipping take?",
  answer: [
    {
      _type: "block",
      children: [{ _type: "span", text: "Standard shipping takes 5-7 business days..." }]
    }
  ],
  category: { _ref: "category-id", _type: "reference" },
  order: 1,
  tags: ["shipping", "delivery"],
  featured: true
}
```

## Features

- ✅ Auto-generated slugs from titles
- ✅ Rich text formatting for answers (headings, lists, links, bold, italic, code)
- ✅ Validation (required fields, character limits)
- ✅ Sorting support (order fields)
- ✅ Searchability (tags)
- ✅ Featured FAQs for homepage
- ✅ Custom previews in Sanity Studio
- ✅ Multiple ordering options

## Next Steps

After adding these schemas:
1. Create FAQ query functions in `src/sanity/queries/faq.queries.ts`
2. Build FAQ components for the frontend
3. Create FAQ pages/routes in Next.js

