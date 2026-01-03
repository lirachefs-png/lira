import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function GET(request: Request) {
    try {
        const apiKey = process.env.RESEND_API_KEY;

        // Default to a safe recipient for testing if none provided
        // In Resend free tier/onboarding, you usually can only send to yourself
        const recipient = request.headers.get('x-test-recipient') || 'delivered@resend.dev';

        if (!apiKey) {
            return NextResponse.json({
                success: false,
                error: 'Configuration Missing',
                details: {
                    RESEND_API_KEY: 'MISSING'
                }
            }, { status: 500 });
        }

        await sendEmail({
            to: recipient,
            subject: 'Railway Production Email Test (Resend)',
            html: `
                <h1>Email System Operational</h1>
                <p>This is a test email sent using <strong>Resend</strong>.</p>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            `,
        });

        return NextResponse.json({
            success: true,
            message: `Email sent request via Resend to ${recipient}`,
            environment: {
                provider: 'resend',
                node_env: process.env.NODE_ENV
            }
        });

    } catch (error: any) {
        console.error('Email Test Failed:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown error',
            details: error
        }, { status: 500 });
    }
}
