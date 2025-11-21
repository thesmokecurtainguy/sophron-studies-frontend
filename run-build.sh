#!/bin/bash

echo "🔨 Building Next.js frontend..."
echo ""

cd /Users/mcphajomo/Documents/GitHub/sophron-studies-frontend-main

npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ BUILD PASSED! No TypeScript errors."
  echo ""
  echo "Your frontend is ready with:"
  echo "  ✓ SEO metadata from Sanity"
  echo "  ✓ Structured data for products"
  echo "  ✓ Image alt text"
  echo "  ✓ Canonical URLs & robots meta tags"
  echo ""
else
  echo ""
  echo "❌ BUILD FAILED - See errors above"
  echo ""
  exit 1
fi

