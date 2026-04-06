import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email;

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!apiKey || !audienceId) {
      console.error(
        'Missing Resend newsletter configuration. Check RESEND_API_KEY and RESEND_AUDIENCE_ID in environment variables.'
      );
      return NextResponse.json(
        { error: 'Newsletter service configuration error' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const { data, error } = await resend.contacts.create({
      email: email.trim(),
      unsubscribed: false,
      audienceId,
    });

    if (error) {
      console.error('Resend Audiences error:', error);

      if (error.name === 'rate_limit_exceeded') {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }

      if (error.name === 'missing_api_key' || error.name === 'invalid_api_Key') {
        return NextResponse.json(
          { error: 'Newsletter service authentication error' },
          { status: 500 }
        );
      }

      if (
        error.name === 'validation_error' ||
        error.name === 'invalid_parameter' ||
        error.name === 'missing_required_field'
      ) {
        const msg = error.message?.toLowerCase() ?? '';
        if (msg.includes('email')) {
          return NextResponse.json(
            { error: 'Please enter a valid email address' },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { error: 'Invalid subscription data provided' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter' },
        { status: 500 }
      );
    }

    console.log('Successfully added contact to Resend audience:', data);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: {
        id: data.id,
        email: email.trim(),
        status: 'active',
        isNew: true,
      },
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process newsletter subscription' },
      { status: 500 }
    );
  }
}
