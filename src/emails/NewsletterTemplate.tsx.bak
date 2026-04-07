import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export type FeaturedProduct = {
  title: string;
  description: string;
  price: string;
  slug: string;
  imageUrl?: string;
};

export type FeaturedPost = {
  title: string;
  excerpt: string;
  slug: string;
};

export type NewsletterTemplateProps = {
  previewText: string;
  messageFromMelissa: string;
  featuredProduct?: FeaturedProduct;
  featuredPost?: FeaturedPost;
};

const fontLiterata = "'Literata', Georgia, serif";
const fontInter = "'Inter', Arial, sans-serif";
const fontLogo = "'Northwell', 'Pinyon Script', cursive";

const colors = {
  pageBg: '#f5f0e8',
  headerBg: '#2d3b2d',
  accent: '#8b7355',
  body: '#333333',
  heading: '#2d3b2d',
  divider: '#d4c9b0',
  footerMuted: '#888888',
  white: '#ffffff',
} as const;

const UNSUBSCRIBE_PLACEHOLDER = '{{{RESEND_UNSUBSCRIBE_URL}}}';

export default function NewsletterTemplate({
  previewText,
  messageFromMelissa,
  featuredProduct,
  featuredPost,
}: NewsletterTemplateProps) {
  const productUrl = featuredProduct
    ? `https://www.sophronstudies.com/products/${featuredProduct.slug}`
    : undefined;
  const postUrl = featuredPost
    ? `https://www.sophronstudies.com/blog/${featuredPost.slug}`
    : undefined;

  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,300..700;1,7..72,300..700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Preview>{previewText}</Preview>
      <Body
        style={{
          backgroundColor: colors.pageBg,
          margin: 0,
          padding: '40px 16px',
          fontFamily: fontInter,
          color: colors.body,
        }}
      >
        <Container
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: colors.pageBg,
          }}
        >
          {/* Header */}
          <Section
            style={{
              backgroundColor: colors.headerBg,
              padding: '36px 40px 32px',
              textAlign: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: fontLogo,
                fontSize: '42px',
                lineHeight: '1.1',
                color: colors.white,
                margin: '0 0 12px',
                fontWeight: 400,
              }}
            >
              Sophron Studies
            </Text>
            <Text
              style={{
                fontFamily: fontLiterata,
                fontStyle: 'italic',
                fontSize: '15px',
                lineHeight: '1.5',
                color: colors.white,
                margin: 0,
                opacity: 0.95,
              }}
            >
              Reformed Women&apos;s Bible Studies
            </Text>
          </Section>

          <Hr
            style={{
              borderColor: colors.divider,
              borderWidth: '1px 0 0',
              borderStyle: 'solid',
              margin: 0,
            }}
          />

          {/* A Note from Melissa */}
          <Section style={{ padding: '40px 40px 32px' }}>
            <Heading
              as="h2"
              style={{
                fontFamily: fontLiterata,
                fontSize: '22px',
                fontWeight: 600,
                lineHeight: '1.3',
                color: colors.heading,
                margin: '0 0 20px',
              }}
            >
              A Note from Melissa
            </Heading>
            <Text
              style={{
                fontFamily: fontInter,
                fontSize: '16px',
                lineHeight: '1.65',
                color: colors.body,
                margin: 0,
                whiteSpace: 'pre-wrap',
              }}
            >
              {messageFromMelissa}
            </Text>
          </Section>

          {featuredProduct && (
            <>
              <Hr
                style={{
                  borderColor: colors.divider,
                  borderWidth: '1px 0 0',
                  borderStyle: 'solid',
                  margin: '0 40px',
                }}
              />
              <Section style={{ padding: '36px 40px 40px' }}>
                <Heading
                  as="h2"
                  style={{
                    fontFamily: fontLiterata,
                    fontSize: '22px',
                    fontWeight: 600,
                    lineHeight: '1.3',
                    color: colors.heading,
                    margin: '0 0 24px',
                  }}
                >
                  New Release
                </Heading>
                {featuredProduct.imageUrl ? (
                  <Img
                    alt={featuredProduct.title}
                    src={featuredProduct.imageUrl}
                    width={520}
                    style={{
                      width: '100%',
                      maxWidth: '520px',
                      height: 'auto',
                      display: 'block',
                      margin: '0 auto 24px',
                      borderRadius: '4px',
                    }}
                  />
                ) : null}
                <Text
                  style={{
                    fontFamily: fontLiterata,
                    fontSize: '20px',
                    fontWeight: 600,
                    lineHeight: '1.35',
                    color: colors.heading,
                    margin: '0 0 12px',
                  }}
                >
                  {featuredProduct.title}
                </Text>
                <Text
                  style={{
                    fontFamily: fontInter,
                    fontSize: '16px',
                    lineHeight: '1.65',
                    color: colors.body,
                    margin: '0 0 16px',
                  }}
                >
                  {featuredProduct.description}
                </Text>
                <Text
                  style={{
                    fontFamily: fontInter,
                    fontSize: '16px',
                    fontWeight: 600,
                    lineHeight: '1.5',
                    color: colors.heading,
                    margin: '0 0 24px',
                  }}
                >
                  {featuredProduct.price}
                </Text>
                {productUrl && (
                  <Button
                    href={productUrl}
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.white,
                      fontFamily: fontInter,
                      fontSize: '15px',
                      fontWeight: 600,
                      lineHeight: '1',
                      textDecoration: 'none',
                      textAlign: 'center',
                      display: 'inline-block',
                      padding: '14px 28px',
                      borderRadius: '4px',
                    }}
                  >
                    View product
                  </Button>
                )}
              </Section>
            </>
          )}

          {featuredPost && (
            <>
              <Hr
                style={{
                  borderColor: colors.divider,
                  borderWidth: '1px 0 0',
                  borderStyle: 'solid',
                  margin: '0 40px',
                }}
              />
              <Section style={{ padding: '36px 40px 40px' }}>
                <Heading
                  as="h2"
                  style={{
                    fontFamily: fontLiterata,
                    fontSize: '22px',
                    fontWeight: 600,
                    lineHeight: '1.3',
                    color: colors.heading,
                    margin: '0 0 24px',
                  }}
                >
                  From the Blog
                </Heading>
                <Text
                  style={{
                    fontFamily: fontLiterata,
                    fontSize: '18px',
                    fontWeight: 600,
                    lineHeight: '1.4',
                    color: colors.heading,
                    margin: '0 0 12px',
                  }}
                >
                  {featuredPost.title}
                </Text>
                <Text
                  style={{
                    fontFamily: fontInter,
                    fontSize: '16px',
                    lineHeight: '1.65',
                    color: colors.body,
                    margin: '0 0 20px',
                  }}
                >
                  {featuredPost.excerpt}
                </Text>
                {postUrl && (
                  <Link
                    href={postUrl}
                    style={{
                      fontFamily: fontInter,
                      fontSize: '15px',
                      fontWeight: 600,
                      color: colors.accent,
                      textDecoration: 'underline',
                    }}
                  >
                    Read the full post →
                  </Link>
                )}
              </Section>
            </>
          )}

          <Hr
            style={{
              borderColor: colors.divider,
              borderWidth: '1px 0 0',
              borderStyle: 'solid',
              margin: '0 40px',
            }}
          />

          {/* Shop CTA */}
          <Section style={{ padding: '40px 40px 48px', textAlign: 'center' }}>
            <Button
              href="https://www.sophronstudies.com/shop"
              style={{
                backgroundColor: colors.accent,
                color: colors.white,
                fontFamily: fontInter,
                fontSize: '15px',
                fontWeight: 600,
                lineHeight: '1',
                textDecoration: 'none',
                textAlign: 'center',
                display: 'inline-block',
                padding: '14px 32px',
                borderRadius: '4px',
              }}
            >
              Shop All Studies
            </Button>
          </Section>

          <Hr
            style={{
              borderColor: colors.divider,
              borderWidth: '1px 0 0',
              borderStyle: 'solid',
              margin: 0,
            }}
          />

          {/* Footer */}
          <Section style={{ padding: '28px 40px 40px', textAlign: 'center' }}>
            <Text
              style={{
                fontFamily: fontInter,
                fontSize: '12px',
                lineHeight: '1.6',
                color: colors.footerMuted,
                margin: '0 0 12px',
              }}
            >
              <Link
                href={UNSUBSCRIBE_PLACEHOLDER}
                style={{ color: colors.footerMuted, textDecoration: 'underline' }}
              >
                Unsubscribe
              </Link>
              {' · '}
              <Link
                href="https://www.sophronstudies.com/privacy-policy"
                style={{ color: colors.footerMuted, textDecoration: 'underline' }}
              >
                Privacy policy
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
