
import { Resend } from 'resend';

// Initialize Resend with API Key
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailPayload {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async (data: EmailPayload) => {
    const { to, subject, html } = data;

    // Use onboarding domain if no custom domain is configured in env
    // Users must verify their domain in Resend to use a custom 'from' address
    const from = process.env.EMAIL_FROM || 'AllTrip <onboarding@resend.dev>';

    try {
        const { data: emailData, error } = await resend.emails.send({
            from: from,
            to: [to],
            // Resend Free Tier restriction: can only send to registered email if using onboarding domain
            // If user verified domain, they can send to anyone.
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('Resend API Error:', error);
            throw new Error(`Resend Error: ${error.message} (${error.name})`);
        }

        console.log('Email sent via Resend:', emailData?.id);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        // Throwing error allows the caller (test endpoint) to see what happened
        throw error;
    }
};
