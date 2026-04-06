import type { Metadata } from 'next'
import Link from 'next/link'

const CONTACT_EMAIL = 'hello@sophronstudies.com'
const LEGAL_ENTITY = 'SoFrontStudies LLC'
const EFFECTIVE_DATE = 'April 6, 2026'
const MAILTO = `mailto:${CONTACT_EMAIL}`

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Privacy Policy | Sophron Studies',
    description:
      'How Sophron Studies collects, uses, and shares personal information when you use our website, shop, and newsletter.',
    openGraph: {
      title: 'Privacy Policy | Sophron Studies',
      description:
        'How Sophron Studies collects, uses, and shares personal information when you use our website, shop, and newsletter.',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: 'Privacy Policy | Sophron Studies',
      description:
        'How Sophron Studies collects, uses, and shares personal information when you use our website, shop, and newsletter.',
    },
  }
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Effective {EFFECTIVE_DATE}
          </p>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 text-gray-700 leading-relaxed">
        <p className="mb-6">
          <strong>Sophron Studies</strong> (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) operates this website (the &ldquo;Site&rdquo;). This
          Privacy Policy describes how we collect, use, and share personal
          information when you visit the Site, make a purchase, sign up for our
          newsletter, or otherwise interact with us.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Information we collect
        </h2>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong>Information you provide:</strong> For example, name, email
            address, mailing address, phone number, and payment-related details
            you enter when you contact us, subscribe to our newsletter, or place
            an order. Payment information is typically collected and processed by
            our payment processor (for example, Stripe); we do not store your full
            payment card details on our servers.
          </li>
          <li>
            <strong>Order and account information:</strong> Details needed to
            fulfill purchases, provide customer support, and communicate about
            your order.
          </li>
          <li>
            <strong>Device and usage data:</strong> Such as IP address, browser
            type, device type, general location derived from IP, pages viewed, and
            referring URLs. This may be collected using cookies, pixels, or
            similar technologies.
          </li>
          <li>
            <strong>Communications:</strong> Messages you send us by email or
            through forms on the Site.
          </li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          How we use information
        </h2>
        <p className="mb-3">We use personal information to:</p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Provide, fulfill, and support orders and downloads</li>
          <li>
            Communicate with you about purchases, inquiries, and transactional
            messages
          </li>
          <li>
            Send marketing emails when you have opted in (you can unsubscribe
            using the link in those emails)
          </li>
          <li>Operate, maintain, and improve the Site and our services</li>
          <li>
            Monitor and analyze usage and performance, including through analytics
            tools
          </li>
          <li>Detect, prevent, and address fraud, abuse, or security issues</li>
          <li>Comply with law and enforce our terms</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Legal bases (if applicable)
        </h2>
        <p className="mb-6">
          If we process personal information subject to certain privacy laws, we
          rely on one or more of the following bases as required by applicable
          law: your consent, performance of a contract, our legitimate interests
          (such as improving the Site and securing our services), and compliance
          with legal obligations.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          How we share information
        </h2>
        <p className="mb-3">We may share personal information with:</p>
        <ul className="list-disc pl-6 space-y-3 mb-6">
          <li>
            <strong>Service providers</strong> who assist us with hosting, content
            management, email delivery, payment processing, shipping, analytics,
            customer support, and security
          </li>
          <li>
            <strong>Professional advisors</strong> (such as lawyers or accountants)
            when needed
          </li>
          <li>
            <strong>Authorities</strong> when required by law or to protect
            rights, safety, and security
          </li>
          <li>
            <strong>Business transfers</strong> in connection with a merger,
            acquisition, or asset sale (we will continue to protect your
            information as described here to the extent required by law)
          </li>
        </ul>
        <p className="mb-6">
          We do not sell your personal information in the common sense of
          &ldquo;selling&rdquo; data for money. If we ever engage in activities
          that could be considered a &ldquo;sale&rdquo; or
          &ldquo;sharing&rdquo; under U.S. state privacy laws, we will provide
          legally required notices and choices.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Cookies and analytics
        </h2>
        <p className="mb-6">
          We may use cookies and similar technologies for Site functionality,
          preferences, security, and analytics. Depending on your browser or
          device settings, you may be able to control cookies. If we use analytics
          services, those providers may process usage data according to their
          policies.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Data retention
        </h2>
        <p className="mb-6">
          We retain personal information only as long as needed for the purposes
          described in this policy, unless a longer retention period is required or
          permitted by law (for example, tax or accounting records).
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Security
        </h2>
        <p className="mb-6">
          We take reasonable measures designed to protect personal information.
          However, no method of transmission over the internet or electronic
          storage is completely secure.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Children&apos;s privacy
        </h2>
        <p className="mb-6">
          The Site is not directed to children under 13, and we do not knowingly
          collect personal information from children under 13. If you believe we
          have collected information from a child under 13, please contact us and
          we will take appropriate steps.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Your choices and rights
        </h2>
        <p className="mb-6">
          Depending on where you live, you may have rights to access, correct,
          delete, or restrict certain processing of your personal information, or
          to opt out of certain uses. To exercise rights that may apply to you,
          contact us using the information below. We may need to verify your
          request.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          International visitors
        </h2>
        <p className="mb-6">
          If you access the Site from outside the United States, your information
          may be processed in the United States or other countries where we or our
          service providers operate.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Changes to this policy
        </h2>
        <p className="mb-6">
          We may update this Privacy Policy from time to time. We will post the
          updated version on this page and update the effective date above.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-3">
          Contact us
        </h2>
        <p className="mb-6">
          If you have questions about this Privacy Policy, contact us at{' '}
          <a
            href={MAILTO}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <p className="mb-10 text-gray-600 text-sm">
          Entity: {LEGAL_ENTITY}
        </p>

        <div className="pt-8 border-t border-gray-200 text-center">
          <Link
            href="/terms"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Terms of Service
          </Link>
        </div>
      </article>
    </div>
  )
}
