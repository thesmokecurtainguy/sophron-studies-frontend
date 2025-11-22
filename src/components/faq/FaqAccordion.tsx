'use client'

import { useState } from 'react'
import { PortableText } from '@portabletext/react'
import type { BlockContent } from '@/sanity/types'

interface FAQ {
  _id: string
  question: string
  answer: BlockContent
  order?: number
}

interface FaqAccordionProps {
  faqs: FAQ[]
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  if (!faqs || faqs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p>No FAQs available in this category.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index
        
        return (
          <div
            key={faq._id}
            className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:border-gray-300"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${faq._id}`}
            >
              <span className="font-semibold text-gray-900 pr-4 flex-1">
                {faq.question}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            
            <div
              id={`faq-answer-${faq._id}`}
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
              aria-hidden={!isOpen}
            >
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="prose prose-sm max-w-none text-gray-700">
                  <PortableText value={faq.answer || []} />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

