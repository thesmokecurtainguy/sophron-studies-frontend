import { defineQuery } from 'next-sanity'

/**
 * Shop & Product Queries
 * All queries related to products, categories, and shop functionality
 */

// Get all categories with product counts
export const categoriesQuery = defineQuery(`*[_type == "category"] {
  _id,
  title,
  slug,
  description,
  seo {
    metaTitle,
    metaDescription,
    metaKeywords,
    ogImage {alt, asset->},
    ogTitle,
    ogDescription,
    canonicalUrl,
    noIndex,
    noFollow
  },
  "productCount": count(*[_type == "product" && isAvailable == true && !(_id in path("drafts.**")) && references(^._id)])
} | order(title asc)`)

// Get paginated products with filters (basic query - will be built dynamically)
export const productsQuery = defineQuery(`*[_type == "product" && isAvailable == true && !(_id in path("drafts.**"))] | order(_createdAt desc) {
  _id,
  name,
  slug,
  images[]{alt, asset->},
  price,
  externalUrl,
  categories[]->{_id, title, slug},
  sizes,
  _createdAt
}`)

// Get a single product by slug
export const productBySlugQuery = defineQuery(`*[
  _type == "product"
  && slug.current == $slug
][0]{
  _id,
  name,
  slug,
  images[]{alt, asset->},
  description,
  price,
  externalUrl,
  isAvailable,
  categories[]->{_id, title, slug},
  sizes,
  seo {
    metaTitle,
    metaDescription,
    metaKeywords,
    ogImage {alt, asset->},
    ogTitle,
    ogDescription,
    canonicalUrl,
    noIndex,
    noFollow
  },
  structuredData {
    brand,
    sku,
    gtin,
    mpn,
    availability,
    condition,
    aggregateRating {
      ratingValue,
      reviewCount
    }
  },
  _createdAt
}`)

// Get all product slugs for static generation
export const allProductSlugsQuery = defineQuery(`*[
  _type == "product"
  && defined(slug.current)
  && isAvailable == true
].slug.current`)

// Get a single category by slug (with SEO)
export const categoryBySlugQuery = defineQuery(`*[
  _type == "category"
  && slug.current == $slug
][0]{
  _id,
  title,
  slug,
  description,
  seo {
    metaTitle,
    metaDescription,
    metaKeywords,
    ogImage {alt, asset->},
    ogTitle,
    ogDescription,
    canonicalUrl,
    noIndex,
    noFollow
  },
  "productCount": count(*[_type == "product" && isAvailable == true && !(_id in path("drafts.**")) && references(^._id)])
}`)

// Category slugs that have at least one available product (for generateStaticParams)
export const allCategorySlugsQuery = defineQuery(`*[
  _type == "category"
  && defined(slug.current)
  && count(*[_type == "product" && isAvailable == true && !(_id in path("drafts.**")) && references(^._id)]) > 0
].slug.current`)

// Paginated products for a single category by slug
// $sortOrder: "newest" (default) | "price-asc" | "price-desc"
export const productsByCategorySlugQuery = defineQuery(`{
  "products": *[
    _type == "product" &&
    isAvailable == true &&
    !(_id in path("drafts.**")) &&
    $categorySlug in categories[]->slug.current
  ] | order(
    select($sortOrder == "price-asc" => price) asc,
    select($sortOrder == "price-desc" => price) desc,
    _createdAt desc
  )[$start...$end] {
    _id,
    name,
    slug,
    images[]{..., asset->},
    price,
    externalUrl,
    categories[]->{_id, title, slug},
    sizes,
    _createdAt
  },
  "totalProducts": count(*[
    _type == "product" &&
    isAvailable == true &&
    !(_id in path("drafts.**")) &&
    $categorySlug in categories[]->slug.current
  ])
}`) 