import { Metadata } from 'next'
import { urlFor } from '@/sanity/client'

/**
 * SEO Data Types - Compatible with Sanity query results (which use null instead of undefined)
 */
export interface SEOData {
  metaTitle?: string | null
  metaDescription?: string | null
  metaKeywords?: Array<string> | null
  ogImage?: {
    asset?: any
    alt?: string | null
  } | null
  ogTitle?: string | null
  ogDescription?: string | null
  canonicalUrl?: string | null
  noIndex?: boolean | null
  noFollow?: boolean | null
}

/**
 * Generate Next.js Metadata from SEO data
 */
export function generateMetadata(
  seo: SEOData | null | undefined,
  fallbackTitle: string,
  fallbackDescription?: string,
  fallbackImage?: { asset?: any } | any
): Metadata {
  const title = seo?.metaTitle || fallbackTitle
  const description = seo?.metaDescription || fallbackDescription || ''
  const keywords = seo?.metaKeywords || []
  
  // Generate OG image URL
  const ogImageUrl = seo?.ogImage?.asset
    ? urlFor(seo.ogImage.asset).width(1200).height(630).fit('crop').url()
    : fallbackImage?.asset
    ? urlFor(fallbackImage.asset).width(1200).height(630).fit('crop').url()
    : fallbackImage
    ? urlFor(fallbackImage).width(1200).height(630).fit('crop').url()
    : undefined

  const ogTitle = seo?.ogTitle || title
  const ogDescription = seo?.ogDescription || description

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: ogImageUrl ? [{ url: ogImageUrl, alt: seo?.ogImage?.alt || title }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    robots: {
      index: !seo?.noIndex,
      follow: !seo?.noFollow,
      googleBot: {
        index: !seo?.noIndex,
        follow: !seo?.noFollow,
      },
    },
    alternates: seo?.canonicalUrl
      ? {
          canonical: seo.canonicalUrl,
        }
      : undefined,
  }
}

/**
 * Generate Schema.org Product structured data
 */
export interface ProductStructuredDataInput {
  brand?: string | null
  sku?: string | null
  gtin?: string | null
  mpn?: string | null
  availability?: string | null
  condition?: string | null
  aggregateRating?: {
    ratingValue?: number | null
    reviewCount?: number | null
  } | null
}

export interface ProductData {
  name: string
  description: string
  price?: number | null
  image?: string
  url: string
  structuredData?: ProductStructuredDataInput | null
}

export function generateProductStructuredData(product: ProductData): object {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    url: product.url,
  }

  if (product.price) {
    Object.assign(baseSchema, {
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'USD',
        availability: product.structuredData?.availability || 'https://schema.org/InStock',
        condition: product.structuredData?.condition || 'https://schema.org/NewCondition',
      },
    })
  }

  if (product.structuredData?.brand) {
    Object.assign(baseSchema, {
      brand: {
        '@type': 'Brand',
        name: product.structuredData.brand,
      },
    })
  }

  if (product.structuredData?.sku) {
    Object.assign(baseSchema, { sku: product.structuredData.sku })
  }

  if (product.structuredData?.gtin) {
    Object.assign(baseSchema, { gtin: product.structuredData.gtin })
  }

  if (product.structuredData?.mpn) {
    Object.assign(baseSchema, { mpn: product.structuredData.mpn })
  }

  if (product.structuredData?.aggregateRating?.ratingValue) {
    Object.assign(baseSchema, {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.structuredData.aggregateRating.ratingValue,
        reviewCount: product.structuredData.aggregateRating.reviewCount || 0,
      },
    })
  }

  return baseSchema
}

/**
 * Get image alt text from Sanity image object
 */
export function getImageAlt(
  image: { alt?: string | null; asset?: { altText?: string } | null } | undefined | null,
  fallback: string | null | undefined = 'Image'
): string {
  if (!image) return fallback || 'Image'
  return image.alt || image.asset?.altText || fallback || 'Image'
}

