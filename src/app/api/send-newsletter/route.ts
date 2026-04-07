import { timingSafeEqual } from 'node:crypto';

// import { render } from '@react-email/components';
import { NextRequest, NextResponse } from 'next/server';
// import { createElement } from 'react';
import { Resend } from 'resend';

// import NewsletterTemplate from '@/emails/NewsletterTemplate';
import { client } from '@/sanity/client';

const RESEND_AUDIENCE_ID = '27e7b7c7-81cf-4613-b002-6ad46c330286';

const NEWSLETTER_CAMPAIGN_QUERY = `*[_type == "newsletterCampaign" && _id == $campaignId][0]{
  title,
  previewText,
  messageFromMelissa,
  featuredProduct->{
    name,
    description,
    price,
    "slug": slug.current,
    "firstImageUrl": images[0].asset->url
  },
  featuredPost->{
    title,
    excerpt,
    "slug": slug.current
  }
}`;

type PortableSpan = { text?: string };
type PortableBlock = {
  _type?: string;
  children?: PortableSpan[];
};

function toPlainText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (!Array.isArray(value)) return '';
  return value
    .map((block: PortableBlock) => {
      if (!block?.children) return '';
      return block.children.map((span) => span.text ?? '').join('');
    })
    .filter(Boolean)
    .join('\n\n');
}

function formatPrice(price: unknown): string {
  if (price == null) return '';
  if (typeof price === 'string') return price;
  if (typeof price === 'number') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  }
  return String(price);
}

function secretsMatch(provided: string, expected: string): boolean {
  try {
    const a = Buffer.from(provided, 'utf8');
    const b = Buffer.from(expected, 'utf8');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

type CampaignDoc = {
  title?: string | null;
  previewText?: string | null;
  messageFromMelissa?: unknown;
  featuredProduct?: {
    name?: string | null;
    description?: unknown;
    price?: unknown;
    slug?: string | null;
    firstImageUrl?: string | null;
  } | null;
  featuredPost?: {
    title?: string | null;
    excerpt?: unknown;
    slug?: string | null;
  } | null;
} | null;

export async function POST(request: NextRequest) {
  try {
    const expectedSecret = process.env.NEWSLETTER_SECRET;
    if (!expectedSecret) {
      console.error('NEWSLETTER_SECRET is not set');
      return NextResponse.json(
        { error: 'Newsletter trigger is not configured on the server.' },
        { status: 500 }
      );
    }

    let body: { campaignId?: unknown; secret?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { campaignId, secret } = body;

    if (!campaignId || typeof campaignId !== 'string' || !campaignId.trim()) {
      return NextResponse.json({ error: 'campaignId is required' }, { status: 400 });
    }

    if (!secret || typeof secret !== 'string') {
      return NextResponse.json({ error: 'secret is required' }, { status: 400 });
    }

    if (!secretsMatch(secret, expectedSecret)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json(
        { error: 'Email service is not configured on the server.' },
        { status: 500 }
      );
    }

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    if (!projectId || !dataset) {
      return NextResponse.json(
        { error: 'Content service is not configured on the server.' },
        { status: 500 }
      );
    }

    const campaign = await client.fetch<CampaignDoc>(
      NEWSLETTER_CAMPAIGN_QUERY,
      { campaignId: campaignId.trim() },
      { cache: 'no-store' }
    );

    if (!campaign) {
      return NextResponse.json({ error: 'Newsletter campaign not found' }, { status: 404 });
    }

    const title = campaign.title?.trim();
    if (!title) {
      return NextResponse.json(
        { error: 'Campaign is missing a title (required for subject line)' },
        { status: 400 }
      );
    }

    const previewText = (campaign.previewText ?? '').trim();
    const messageFromMelissa = toPlainText(campaign.messageFromMelissa).trim();

    // TEMP(react-email isolate): restore when re-enabling NewsletterTemplate
    // const featuredProduct =
    //   campaign.featuredProduct?.slug ?
    //     {
    //       title: (campaign.featuredProduct.name ?? '').trim() || 'Featured study',
    //       description: toPlainText(campaign.featuredProduct.description).trim(),
    //       price: formatPrice(campaign.featuredProduct.price),
    //       slug: campaign.featuredProduct.slug,
    //       ...(campaign.featuredProduct.firstImageUrl ?
    //         { imageUrl: campaign.featuredProduct.firstImageUrl }
    //       : {}),
    //     }
    //   : undefined;

    // const featuredPost =
    //   campaign.featuredPost?.slug ?
    //     {
    //       title: (campaign.featuredPost.title ?? '').trim() || 'From the blog',
    //       excerpt: toPlainText(campaign.featuredPost.excerpt).trim(),
    //       slug: campaign.featuredPost.slug,
    //     }
    //   : undefined;

    const html = `<p>${messageFromMelissa}</p>`;

    const resend = new Resend(apiKey);

    const { data, error } = await resend.broadcasts.create({
      audienceId: RESEND_AUDIENCE_ID,
      from: 'Sophron Studies <hello@sophronstudies.com>',
      replyTo: 'melissa@sophronstudies.com',
      subject: title,
      html,
      ...(previewText ? { previewText } : {}),
    });

    if (error) {
      console.error('Resend broadcast error:', error);

      if (error.name === 'rate_limit_exceeded') {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }

      if (error.name === 'missing_api_key' || error.name === 'invalid_api_Key') {
        return NextResponse.json(
          { error: 'Email service authentication failed' },
          { status: 500 }
        );
      }

      if (
        error.name === 'validation_error' ||
        error.name === 'invalid_parameter' ||
        error.name === 'missing_required_field'
      ) {
        return NextResponse.json(
          { error: error.message || 'Invalid broadcast request' },
          { status: 422 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to send newsletter broadcast' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      broadcastId: data.id,
    });
  } catch (err) {
    console.error('send-newsletter error:', err);
    return NextResponse.json(
      { error: 'Failed to process newsletter send request' },
      { status: 500 }
    );
  }
}
