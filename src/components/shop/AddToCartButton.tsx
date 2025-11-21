'use client';

import React from 'react';
import { useCart } from '@/lib/cart-context';
import { urlFor } from '@/sanity/client';
import { FiShoppingCart, FiExternalLink } from 'react-icons/fi';
import { trackAddToCart, trackExternalLinkClick } from '@/lib/analytics';
import type { ProductBySlugQueryResult } from '@/sanity/types';

interface AddToCartButtonProps {
  product: NonNullable<ProductBySlugQueryResult>;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const { addItem, openCart } = useCart();
  const [selectedSize, setSelectedSize] = React.useState<string>('');

  const isExternalProduct = !!product.externalUrl;

  const handleAddToCart = () => {
    // If product has sizes, require size selection
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    const cartItem = {
      _id: product._id,
      name: product.name || 'Product',
      price: product.price!,
      slug: product.slug?.current || '',
      image: product.images?.[0]?.asset
        ? urlFor(product.images[0].asset).width(400).height(533).fit('crop').url()
        : undefined,
      size: selectedSize || undefined,
    };

    addItem(cartItem);
    openCart();
    
    // Track add to cart event
    trackAddToCart(product._id, product.name || 'Product', product.price!, 1, selectedSize || undefined);
  };

  const handleVisitWebsite = () => {
    if (product.externalUrl) {
      // Track external link click
      trackExternalLinkClick(product.externalUrl, product.name || 'Product');
      window.open(product.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-4">
      {/* Size Selection - only show for non-external products */}
      {!isExternalProduct && product.sizes && product.sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Size</label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-black"
          >
            <option value="">Select a size</option>
            {product.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      {isExternalProduct ? (
        <button
          onClick={handleVisitWebsite}
          className="bg-black text-white py-3 px-6 hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 w-full md:w-auto mb-6"
        >
          <FiExternalLink size={16} />
          Visit Website
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          className="bg-black text-white py-3 px-6 hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 w-full md:w-auto mb-6"
        >
          <FiShoppingCart size={16} />
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default AddToCartButton; 