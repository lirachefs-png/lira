'use server';

import nodemailer from 'nodemailer';

export async function sendItineraryEmail(toEmail: string, itineraryData: any) {
    try {
        const { tripTitle, duration, days, totalBudgetEstimate } = itineraryData;

        // Validar configuração
        if (!process.env.ZOHO_EMAIL || !process.env.ZOHO_PASSWORD) {
            throw new Error('Configuração de e-mail ausente (ZOHO)');
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.zoho.eu",
            port: 465,
            secure: true,
            auth: {
                user: process.env.ZOHO_EMAIL,
                pass: process.env.ZOHO_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Gerar HTML do E-mail
        // (Simplificado para consistência, mas poderia ser um template mais elaborado)
        const daysHtml = days.map((day: any) => `
            <div style="margin-bottom: 20px; border-left: 3px solid #6366f1; padding-left: 15px;">
                <h3 style="margin: 0; color: #4f46e5;">Dia ${day.day}: ${day.title}</h3>
                <p style="margin: 5px 0; font-size: 13px; color: #6b7280;">${day.weather || ''}</p>
                <ul style="padding-left: 20px; margin-top: 10px;">
                    ${day.activities.map((act: any) => `
                        <li style="margin-bottom: 8px;">
                            <strong>${act.time}</strong> - ${act.description}
                            <br/><span style="font-size: 12px; color: #888;">📍 ${act.location || 'Local a definir'}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `).join('');

        const htmlContent = `
            <div style="font-family: sans-serif; bg-color: #f9fafb; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <div style="text-align: center; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 20px;">
                        <h1 style="color: #111827; margin: 0;">✈️ AllTrip</h1>
                        <p style="color: #6b7280; font-size: 14px;">Seu roteiro personalizado criado pelo Éden</p>
                    </div>
                    
                    <h2 style="color: #4338ca;">${tripTitle}</h2>
                    <p><strong>Duração:</strong> ${duration} | <strong>Custo Est.:</strong> ${totalBudgetEstimate || 'N/A'}</p>
                    
                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                    
                    ${daysHtml}
                    
                    <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #9ca3af;">
                        <p>Planejado com ❤️ pela Inteligência Artificial do AllTrip.</p>
                    </div>
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: `"AllTrip Éden" <${process.env.ZOHO_EMAIL}>`,
            to: toEmail,
            subject: `AllTrip: Seu Roteiro para ${tripTitle}`,
            html: htmlContent,
        });

        return { success: true };

    } catch (error: any) {
        console.error('Falha ao enviar e-mail:', error);
        return { success: false, error: error.message };
    }
}
