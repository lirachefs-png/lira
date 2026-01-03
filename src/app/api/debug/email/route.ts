import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
    try {
        const email = process.env.ZOHO_EMAIL;
        const password = process.env.ZOHO_PASSWORD;

        // 1. Check Env Vars availability
        const envStatus = {
            hasEmail: !!email,
            emailValue: email, // Safe to show if it's the public contact email
            hasPassword: !!password,
            passwordLength: password ? password.length : 0,
            nodeEnv: process.env.NODE_ENV
        };

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing Credentials', envStatus }, { status: 500 });
        }

        // 2. Configure Transporter (Exact same config as booking-email.ts)
        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.eu',
            port: 465,
            secure: true,
            auth: {
                user: email,
                pass: password,
            },
            tls: {
                rejectUnauthorized: false
            },
            debug: true, // Enable debug logs
            logger: true // Enable logger
        });

        // 3. Verify Connection
        console.log('Verifying SMTP connection...');
        await transporter.verify();

        // 4. Send Test Email
        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: `"AllTrip Debug" <${email}>`,
            to: email, // Send to self
            subject: "AllTrip Production Email Test",
            text: "If you receive this, the email system is working correctly in production.",
            html: "<h1>It Works!</h1><p>The email system is receiving credentials and connecting to Zoho successfully.</p>"
        });

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully',
            messageId: info.messageId,
            envStatus
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack,
            envStatus: {
                hasEmail: !!process.env.ZOHO_EMAIL,
                hasPassword: !!process.env.ZOHO_PASSWORD
            },
            details: error
        }, { status: 500 });
    }
}
