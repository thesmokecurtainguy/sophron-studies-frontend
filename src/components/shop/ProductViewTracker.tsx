'use client';

import { useEffect } from 'react';
import { trackProductView } from '@/lib/analytics';

interface ProductViewTrackerProps {
  productId: string;
  productName: string | null | undefined;
  productPrice?: number | null;
}

/**
 * Client component to track product views
 * Used in server components where we need to track product views
 */
export default function ProductViewTracker({
  productId,
  productName,
  productPrice,
}: ProductViewTrackerProps) {
  useEffect(() => {
    // Track product view when component mounts
    trackProductView(productId, productName || 'Product', productPrice ?? undefined);
  }, [productId, productName, productPrice]);

  return null;
}

