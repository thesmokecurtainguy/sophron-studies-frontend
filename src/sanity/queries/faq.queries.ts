import { defineQuery } from 'next-sanity'

/**
 * FAQ Queries
 * All queries related to FAQs and FAQ categories
 */

// Base FAQ fields that are reused across queries
const faqFields = `
  _id,
  question,
  answer,
  "category": {
    "id": category._id,
    "title": category->title,
    "slug": category->slug.current
  },
  order,
  tags,
  featured
`

// Base category fields
const categoryFields = `
  _id,
  title,
  "slug": slug.current,
  description,
  order
`

/**
 * Get all FAQ categories ordered by display order
 */
export const allFaqCategoriesQuery = defineQuery(`*[
  _type == "faqCategory"
  && defined(slug.current)
]|order(order asc, title asc){
  ${categoryFields}
}`)

/**
 * Get a single FAQ category by slug
 */
export const faqCategoryBySlugQuery = defineQuery(`*[
  _type == "faqCategory"
  && slug.current == $slug
][0]{
  ${categoryFields}
}`)

/**
 * Get all FAQs ordered by category and then by order
 */
export const allFaqsQuery = defineQuery(`*[
  _type == "faq"
  && defined(category)
]|order(category->order asc, order asc){
  ${faqFields}
}`)

/**
 * Get FAQs by category slug
 */
export const faqsByCategorySlugQuery = defineQuery(`*[
  _type == "faq"
  && category->slug.current == $categorySlug
]|order(order asc){
  ${faqFields}
}`)

/**
 * Get FAQs by category ID
 */
export const faqsByCategoryIdQuery = defineQuery(`*[
  _type == "faq"
  && category._ref == $categoryId
]|order(order asc){
  ${faqFields}
}`)

/**
 * Get featured FAQs (for homepage)
 */
export const featuredFaqsQuery = defineQuery(`*[
  _type == "faq"
  && featured == true
  && defined(category)
]|order(order asc){
  ${faqFields}
}`)

/**
 * Get FAQs by tag
 */
export const faqsByTagQuery = defineQuery(`*[
  _type == "faq"
  && $tag in tags
  && defined(category)
]|order(order asc){
  ${faqFields}
}`)

/**
 * Search FAQs by question or answer content
 */
export const searchFaqsQuery = defineQuery(`*[
  _type == "faq"
  && defined(category)
  && (
    question match $searchPattern ||
    pt::text(answer) match $searchPattern
  )
]|order(order asc){
  ${faqFields}
}`)

/**
 * Get FAQs grouped by category
 * Returns an array of categories with their FAQs nested inside
 */
export const faqsGroupedByCategoryQuery = defineQuery(`*[
  _type == "faqCategory"
  && defined(slug.current)
]|order(order asc){
  ${categoryFields},
  "faqs": *[
    _type == "faq"
    && category._ref == ^._id
  ]|order(order asc){
    ${faqFields}
  }
}`)

/**
 * Get all FAQ slugs for static generation
 */
export const allFaqCategorySlugsQuery = defineQuery(`*[
  _type == "faqCategory"
  && defined(slug.current)
].slug.current`)

