import type { Metadata } from 'next'
import Link from 'next/link'

const CONTACT_EMAIL = 'hello@sophronstudies.com'
const LEGAL_ENTITY = 'SoFrontStudies LLC'
const EFFECTIVE_DATE = 'April 6, 2026'
const MAILTO = `mailto:${CONTACT_EMAIL}`

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Terms of Service | Sophron Studies',
    description:
      'Terms governing your use of the Sophron Studies website, purchases, and digital materials.',
    openGraph: {
      title: 'Terms of Service | Sophron Studies',
      description:
        'Terms governing your use of the Sophron Studies website, purchases, and digital materials.',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: 'Terms of Service | Sophron Studies',
      description:
        'Terms governing your use of the Sophron Studies website, purchases, and digital materials.',
    },
  }
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Effective {EFFECTIVE_DATE}
          </p>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 text-gray-700 leading-relaxed">
        <p className="mb-6">
          Welcome to Sophron Studies. These Terms of Service (&ldquo;Terms&rdquo;)
          govern your access to and use of our website and related services
          (collectively, the &ldquo;Services&rdquo;), operated by{' '}
          <strong>{LEGAL_ENTITY}</strong> (&ldquo;Sophron Studies,&rdquo;
          &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By
          accessing or using the Services, you agree to these Terms. If you do
          not agree, do not use the Services.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Eligibility
        </h2>
        <p className="mb-6">
          You must be able to form a binding contract under applicable law to use
          the Services. If you use the Services on behalf of an organization, you
          represent that you have authority to bind that organization.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Products, pricing, and descriptions
        </h2>
        <p className="mb-6">
          We strive to describe our studies and products accurately. We may change
          prices, product offerings, and descriptions at any time. If an error
          affects pricing or availability, we may cancel or refuse an order and
          will make reasonable efforts to notify you.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Orders and payment
        </h2>
        <p className="mb-6">
          When you place an order, you agree to provide accurate information and pay
          all charges at the prices in effect, plus applicable taxes and shipping
          where relevant. Payments are processed by our third-party payment
          processor. Your use of payment services may be subject to the
          processor&apos;s terms and privacy policy.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Shipping, delivery, and risk of loss
        </h2>
        <p className="mb-6">
          Shipping timelines and carriers may vary. Title and risk of loss for
          physical goods pass to you upon delivery to the carrier unless otherwise
          required by law or stated at checkout.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Returns, refunds, and cancellations
        </h2>
        <p className="mb-6">
          Our return and refund practices are as stated on the Services
          (including our FAQ or product pages) at the time of purchase. If we do
          not post a specific policy for an item, contact us at{' '}
          <a
            href={MAILTO}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            {CONTACT_EMAIL}
          </a>{' '}
          for assistance.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Digital content and licenses
        </h2>
        <p className="mb-6">
          If you receive digital materials, we grant you a limited, non-exclusive,
          non-transferable license to access and use those materials for personal
          or church small-group use as expressly permitted by the product terms.
          You may not reproduce, distribute, publicly display, sell, or create
          derivative works except as allowed by law or with our written
          permission.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Intellectual property
        </h2>
        <p className="mb-6">
          The Services and all content (including text, graphics, logos, studies
          materials, and site design) are owned by Sophron Studies or our licensors
          and are protected by copyright, trademark, and other intellectual
          property laws. Unauthorized use is prohibited.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Acceptable use
        </h2>
        <p className="mb-6">
          You agree not to misuse the Services, interfere with their operation,
          attempt unauthorized access, scrape the Site in a way that harms our
          systems, or use the Services for unlawful purposes.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Third-party services
        </h2>
        <p className="mb-6">
          The Services may link to or integrate with third-party websites or
          tools. We are not responsible for third-party content or practices.
          Your use of third-party services is at your own risk and subject to
          their terms.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Disclaimer of warranties
        </h2>
        <p className="mb-6">
          The Services are provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; to the fullest extent permitted by law. We disclaim all
          warranties, express or implied, including implied warranties of
          merchantability, fitness for a particular purpose, and non-infringement.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Limitation of liability
        </h2>
        <p className="mb-6">
          To the fullest extent permitted by law, Sophron Studies and its owners,
          employees, and contractors will not be liable for any indirect,
          incidental, special, consequential, or punitive damages, or any loss of
          profits, data, or goodwill. Our total liability for claims arising out of
          or relating to these Terms or the Services will not exceed the greater of
          (a) the amount you paid us for the specific product or service giving
          rise to the claim during the twelve (12) months before the claim, or (b)
          one hundred U.S. dollars ($100), except where liability cannot be limited
          under applicable law.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Indemnity
        </h2>
        <p className="mb-6">
          You will defend and indemnify Sophron Studies against claims, damages,
          losses, and expenses (including reasonable attorneys&apos; fees) arising
          from your misuse of the Services, violation of these Terms, or
          violation of others&apos; rights, to the extent permitted by law.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Governing law and venue
        </h2>
        <p className="mb-6">
          These Terms are governed by the laws of the State of North Carolina,
          without regard to conflict-of-law principles, except where preempted by
          applicable federal law. You agree that the state and federal courts
          located in North Carolina have exclusive jurisdiction for disputes
          arising out of these Terms or the Services, unless a different forum is
          required by applicable consumer protection law for consumers in their
          home jurisdiction.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Changes
        </h2>
        <p className="mb-6">
          We may modify these Terms by posting updated Terms on the Services. The
          updated Terms are effective when posted unless we state otherwise. Your
          continued use of the Services after changes become effective constitutes
          acceptance of the revised Terms.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Severability
        </h2>
        <p className="mb-6">
          If any provision of these Terms is found unenforceable, the remaining
          provisions remain in effect.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Contact
        </h2>
        <p className="mb-6">
          Questions about these Terms:{' '}
          <a
            href={MAILTO}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="mb-10 text-gray-600 text-sm">Entity: {LEGAL_ENTITY}</p>

        <div className="pt-8 border-t border-gray-200 text-center">
          <Link
            href="/privacy"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Privacy Policy
          </Link>
        </div>
      </article>
    </div>
  )
}
