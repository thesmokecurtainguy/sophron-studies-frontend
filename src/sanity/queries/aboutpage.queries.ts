import { defineQuery } from 'next-sanity'

/**
 * About Page Queries
 * All queries related to the about page content
 */

// Main about page query with all sections
export const aboutPageQuery = defineQuery(`*[_type == "aboutPage"][0] {
  _id,
  title,
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
  aboutHeroSection {
    name,
    backgroundImage,
    rightImage,
    leftImage
  },
  aboutBioSection {
    heading,
    body
  },
  aboutGallerySection {
    images[]
  },
  newsletterSection-> {
    title,
    subtitle,
    placeholderText,
    buttonText
  }
}`) 