import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

import { getClientIp, isRateLimited } from '@/lib/server/rate-limit';

const CONTACT_RATE_LIMIT_MAX_REQUESTS = 10;
const CONTACT_RATE_LIMIT_WINDOW_MS = 60_000;

const INQUIRY_TYPES = new Set(['general', 'study', 'seminar']);

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimitKey = `contact:${clientIp}`;

    if (
      isRateLimited(rateLimitKey, CONTACT_RATE_LIMIT_MAX_REQUESTS, CONTACT_RATE_LIMIT_WINDOW_MS)
    ) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      name,
      email,
      message,
      inquiryType,
      studyPreference,
      availability,
      organization,
      preferredDate,
    } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    if (
      !inquiryType ||
      typeof inquiryType !== 'string' ||
      !INQUIRY_TYPES.has(inquiryType)
    ) {
      return NextResponse.json(
        { error: 'Valid inquiry type is required' },
        { status: 400 }
      );
    }

    if (inquiryType === 'general') {
      if (!message || typeof message !== 'string' || !message.trim()) {
        return NextResponse.json({ error: 'Message is required' }, { status: 400 });
      }
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.RESEND_TO_EMAIL_CONTACT;
    const from = process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !to || !from) {
      console.error(
        'Missing Resend contact configuration. Check RESEND_API_KEY, RESEND_TO_EMAIL_CONTACT, and RESEND_FROM_EMAIL.'
      );
      return NextResponse.json(
        { error: 'Contact service configuration error' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const lines: string[] = [
      'Inquiry type: ' + inquiryType,
      'Name: ' + name.trim(),
      'Email: ' + email.trim(),
    ];

    if (message != null && String(message).trim()) {
      lines.push('Message: ' + String(message).trim());
    }
    if (studyPreference != null && String(studyPreference).trim()) {
      lines.push('Study preference: ' + String(studyPreference).trim());
    }
    if (availability != null && String(availability).trim()) {
      lines.push('Availability: ' + String(availability).trim());
    }
    if (organization != null && String(organization).trim()) {
      lines.push('Organization: ' + String(organization).trim());
    }
    if (preferredDate != null && String(preferredDate).trim()) {
      lines.push('Preferred date(s): ' + String(preferredDate).trim());
    }

    const text = lines.join('\n');

    const { data, error } = await resend.emails.send({
      from,
      to,
      replyTo: email.trim(),
      subject: `New ${inquiryType} inquiry from ${name.trim()}`,
      text,
    });

    if (error) {
      console.error('Resend email error:', error);

      if (error.name === 'rate_limit_exceeded') {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }

      if (error.name === 'missing_api_key' || error.name === 'invalid_api_Key') {
        return NextResponse.json(
          { error: 'Contact service authentication error' },
          { status: 500 }
        );
      }

      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been sent.',
      id: data.id,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}
