
import nodemailer from 'nodemailer';

interface EmailPayload {
    to: string;
    subject: string;
    html: string;
}

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD,
    },
});

export const sendEmail = async (data: EmailPayload) => {
    const { to, subject, html } = data;

    const mailOptions = {
        from: `"AllTrip" <${process.env.ZOHO_EMAIL}>`,
        to,
        subject,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
