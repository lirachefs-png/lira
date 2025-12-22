import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingEmailData {
    to: string;
    passengerName: string;
    bookingReference: string;
    orderId: string;
    flightDetails: {
        origin: string;
        destination: string;
        departureDate: string;
        departureTime: string;
        airline: string;
    };
    totalAmount: string;
    currency: string;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
    const { to, passengerName, bookingReference, orderId, flightDetails, totalAmount, currency } = data;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0B0F19; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #FFFFFF; font-size: 28px; margin: 0;">✈️ AllTrip</h1>
        </div>

        <div style="background: #151926; border-radius: 16px; padding: 32px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
                <div style="width: 64px; height: 64px; background-color: rgba(16, 185, 129, 0.2); border-radius: 50%; display: inline-block; line-height: 64px;">
                    <span style="font-size: 32px; color: #10B981;">✓</span>
                </div>
            </div>

            <h2 style="color: #FFFFFF; text-align: center; margin: 0 0 8px 0; font-size: 24px;">Reserva Confirmada!</h2>
            <p style="color: #9CA3AF; text-align: center; margin: 0 0 32px 0;">Olá ${passengerName}, a sua viagem está confirmada.</p>

            <div style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <p style="color: #10B981; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0; font-weight: bold;">Código de Reserva</p>
                <p style="color: #10B981; font-size: 32px; font-weight: bold; margin: 0; font-family: monospace;">${bookingReference}</p>
            </div>

            <div style="background-color: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="color: #9CA3AF; font-size: 12px; padding-bottom: 4px;">Origem</td>
                        <td style="color: #9CA3AF; font-size: 12px; padding-bottom: 4px; text-align: right;">Destino</td>
                    </tr>
                    <tr>
                        <td style="color: #FFFFFF; font-size: 24px; font-weight: bold;">${flightDetails.origin}</td>
                        <td style="color: #FFFFFF; font-size: 24px; font-weight: bold; text-align: right;">${flightDetails.destination}</td>
                    </tr>
                </table>
                <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 16px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="color: #9CA3AF; font-size: 12px;">Data</td>
                        <td style="color: #9CA3AF; font-size: 12px;">Hora</td>
                    </tr>
                    <tr>
                        <td style="color: #FFFFFF; font-size: 14px; padding-bottom: 12px;">${flightDetails.departureDate}</td>
                        <td style="color: #FFFFFF; font-size: 14px; padding-bottom: 12px;">${flightDetails.departureTime}</td>
                    </tr>
                    <tr>
                        <td style="color: #9CA3AF; font-size: 12px;">Companhia</td>
                        <td style="color: #9CA3AF; font-size: 12px;">Total Pago</td>
                    </tr>
                    <tr>
                        <td style="color: #FFFFFF; font-size: 14px;">${flightDetails.airline}</td>
                        <td style="color: #10B981; font-size: 14px; font-weight: bold;">${currency} ${totalAmount}</td>
                    </tr>
                </table>
            </div>

            <p style="text-align: center; color: #6B7280; font-size: 11px; margin-bottom: 24px;">Order ID: ${orderId}</p>

            <a href="https://alltripapp.com/my-trips" style="display: block; background: linear-gradient(90deg, #F97316, #E11D48); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; text-align: center; font-weight: bold; font-size: 16px;">
                Ver Minhas Viagens →
            </a>
        </div>

        <div style="text-align: center; margin-top: 32px;">
            <p style="color: #6B7280; font-size: 12px; margin: 0 0 8px 0;">Precisa de ajuda?</p>
            <a href="mailto:contato@alltripapp.com" style="color: #6366F1; font-size: 12px;">contato@alltripapp.com</a>
            <p style="color: #4B5563; font-size: 11px; margin: 24px 0 0 0;">
                © 2024 AllTrip. Todos os direitos reservados.
            </p>
        </div>
    </div>
</body>
</html>
    `;

    try {
        const result = await resend.emails.send({
            from: 'AllTrip <contato@alltripapp.com>',
            to: [to],
            subject: `✈️ Reserva Confirmada - ${flightDetails.origin} → ${flightDetails.destination} | ${bookingReference}`,
            html: emailHtml,
        });

        console.log('📧 Booking confirmation email sent:', result);
        return { success: true, id: result.data?.id };
    } catch (error) {
        console.error('❌ Failed to send booking email:', error);
        return { success: false, error };
    }
}
