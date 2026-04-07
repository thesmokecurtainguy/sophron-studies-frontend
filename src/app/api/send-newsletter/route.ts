import { timingSafeEqual } from 'node:crypto';

import { render } from '@react-email/components';
import { NextRequest, NextResponse } from 'next/server';
import { createElement } from 'react';
import { Resend } from 'resend';

import NewsletterTemplate from '@/emails/NewsletterTemplate';
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
  const origin = request.headers.get('origin') || '';
  const allowedOrigins = [
    'https://sophronstudies.sanity.studio',
    'https://sanity.io',
  ];

  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  function jsonWithCors(data: unknown, status: number) {
    return NextResponse.json(data, { status, headers: corsHeaders });
  }

  try {
    const expectedSecret = process.env.NEWSLETTER_SECRET;
    if (!expectedSecret) {
      console.error('NEWSLETTER_SECRET is not set');
      return jsonWithCors(
        { error: 'Newsletter trigger is not configured on the server.' },
        500
      );
    }

    let body: { campaignId?: unknown; secret?: unknown };
    try {
      body = await request.json();
    } catch {
      return jsonWithCors({ error: 'Invalid JSON body' }, 400);
    }

    const { campaignId, secret } = body;

    if (!campaignId || typeof campaignId !== 'string' || !campaignId.trim()) {
      return jsonWithCors({ error: 'campaignId is required' }, 400);
    }

    if (!secret || typeof secret !== 'string') {
      return jsonWithCors({ error: 'secret is required' }, 400);
    }

    if (!secretsMatch(secret, expectedSecret)) {
      return jsonWithCors({ error: 'Unauthorized' }, 401);
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not set');
      return jsonWithCors(
        { error: 'Email service is not configured on the server.' },
        500
      );
    }

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    if (!projectId || !dataset) {
      return jsonWithCors(
        { error: 'Content service is not configured on the server.' },
        500
      );
    }

    const campaign = await client.fetch<CampaignDoc>(
      NEWSLETTER_CAMPAIGN_QUERY,
      { campaignId: campaignId.trim() },
      { cache: 'no-store' }
    );

    if (!campaign) {
      return jsonWithCors({ error: 'Newsletter campaign not found' }, 404);
    }

    const title = campaign.title?.trim();
    if (!title) {
      return jsonWithCors(
        { error: 'Campaign is missing a title (required for subject line)' },
        400
      );
    }

    const previewText = (campaign.previewText ?? '').trim();
    const messageFromMelissa = toPlainText(campaign.messageFromMelissa).trim();

    const featuredProduct =
      campaign.featuredProduct?.slug ?
        {
          title: (campaign.featuredProduct.name ?? '').trim() || 'Featured study',
          description: toPlainText(campaign.featuredProduct.description).trim(),
          price: formatPrice(campaign.featuredProduct.price),
          slug: campaign.featuredProduct.slug,
          ...(campaign.featuredProduct.firstImageUrl ?
            { imageUrl: campaign.featuredProduct.firstImageUrl }
          : {}),
        }
      : undefined;

    const featuredPost =
      campaign.featuredPost?.slug ?
        {
          title: (campaign.featuredPost.title ?? '').trim() || 'From the blog',
          excerpt: toPlainText(campaign.featuredPost.excerpt).trim(),
          slug: campaign.featuredPost.slug,
        }
      : undefined;

    const html = await render(
      createElement(NewsletterTemplate, {
        previewText: previewText || title,
        messageFromMelissa,
        featuredProduct,
        featuredPost,
      })
    );

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
        return jsonWithCors(
          { error: 'Too many requests. Please try again later.' },
          429
        );
      }

      if (error.name === 'missing_api_key' || error.name === 'invalid_api_Key') {
        return jsonWithCors(
          { error: 'Email service authentication failed' },
          500
        );
      }

      if (
        error.name === 'validation_error' ||
        error.name === 'invalid_parameter' ||
        error.name === 'missing_required_field'
      ) {
        return jsonWithCors(
          { error: error.message || 'Invalid broadcast request' },
          422
        );
      }

      return jsonWithCors(
        { error: 'Failed to send newsletter broadcast' },
        502
      );
    }

    return jsonWithCors(
      {
        success: true,
        broadcastId: data.id,
      },
      200
    );
  } catch (err) {
    console.error('send-newsletter error:', err);
    return jsonWithCors(
      { error: 'Failed to process newsletter send request' },
      500
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  const allowedOrigins = [
    'https://sophronstudies.sanity.studio',
    'https://sanity.io',
  ];
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
