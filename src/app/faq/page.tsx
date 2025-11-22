import { Metadata } from 'next'
import { fetchSanity } from '@/sanity/client'
import { faqsGroupedByCategoryQuery } from '@/sanity/queries'
import FaqAccordion from '@/components/faq/FaqAccordion'
import type { BlockContent } from '@/sanity/types'

/**
 * Type definitions for FAQ data structure
 * Based on the GROQ query structure in faq.queries.ts
 */
interface FAQCategory {
  _id: string
  title: string
  slug: string
  description?: string // Text field, not BlockContent
  order?: number
  faqs: FAQ[]
}

interface FAQ {
  _id: string
  question: string
  answer: BlockContent
  category: {
    id: string
    title: string
    slug: string
  }
  order?: number
  tags?: string[]
  featured?: boolean
}

type FaqsGroupedByCategoryQueryResult = FAQCategory[]

/**
 * Fetch FAQ data grouped by category
 */
async function getFaqData(): Promise<FaqsGroupedByCategoryQueryResult | null> {
  try {
    const data = await fetchSanity<FaqsGroupedByCategoryQueryResult>(
      faqsGroupedByCategoryQuery,
      {},
      {
        revalidate: 300,
        tags: ['faqs', 'faq-categories']
      }
    )
    
    return data
  } catch (error) {
    console.error('Error fetching FAQ data:', error)
    return null
  }
}

/**
 * Convert PortableText BlockContent to plain text for structured data
 */
function portableTextToPlainText(blocks: BlockContent | null | undefined): string {
  if (!blocks || !Array.isArray(blocks)) return ''
  
  return blocks
    .map((block: any) => {
      if (block._type !== 'block' || !block.children) return ''
      return block.children
        .map((child: any) => child.text || '')
        .join('')
    })
    .join('\n\n')
    .trim()
}

/**
 * Generate FAQPage structured data schema
 */
function generateFaqPageSchema(faqs: FAQ[]): object {
  const mainEntity = faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: portableTextToPlainText(faq.answer),
    },
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Frequently Asked Questions | Sophron Studies',
    description:
      "Find answers to common questions about our reformed women&apos;s Bible studies, ordering, shipping, leader resources, and more.",
    openGraph: {
      title: 'Frequently Asked Questions | Sophron Studies',
      description:
        "Find answers to common questions about our reformed women&apos;s Bible studies, ordering, shipping, leader resources, and more.",
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: 'Frequently Asked Questions | Sophron Studies',
      description:
        "Find answers to common questions about our reformed women&apos;s Bible studies, ordering, shipping, leader resources, and more.",
    },
  }
}

/**
 * FAQ Page Component
 */
export default async function FAQPage() {
  const data = await getFaqData()

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;re currently updating our FAQ section. Please check back soon or{' '}
              <a href="/contact" className="text-blue-600 hover:text-blue-700 underline">
                contact us
              </a>{' '}
              if you have questions.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Flatten all FAQs for structured data
  const allFaqs: FAQ[] = data.flatMap((category) => category.faqs || [])

  // Generate structured data
  const faqPageSchema = generateFaqPageSchema(allFaqs)

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our reformed women&apos;s Bible studies,
              ordering, shipping, leader resources, and more.
            </p>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="space-y-12">
            {data.map((category) => (
              <section
                key={category._id}
                id={category.slug}
                className="scroll-mt-8"
              >
                {/* Category Header */}
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {category.title}
                  </h2>
                  {category.description && (
                    <p className="text-gray-600 mt-2 max-w-3xl">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* FAQs Accordion */}
                {category.faqs && category.faqs.length > 0 ? (
                  <FaqAccordion faqs={category.faqs} />
                ) : (
                  <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
                    <p>No FAQs available in this category yet.</p>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 pt-12 border-t border-gray-200 text-center">
            <p className="text-lg text-gray-700 mb-4">
              Still have questions? We&apos;re here to help!
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

