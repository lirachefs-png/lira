'use client';

import Link from 'next/link';
import { ChevronDown, Plane, CreditCard, RefreshCcw, HelpCircle, MessageCircle } from 'lucide-react';
import { useRegion } from '@/contexts/RegionContext';

// FAQ data is stored per language
const faqsData = {
    pt: [
        {
            categoryKey: 'bookings',
            icon: Plane,
            questions: [
                { q: 'Como faço uma reserva de voo?', a: 'Utilize a barra de pesquisa na página inicial para inserir origem, destino e datas. Selecione o voo desejado e siga as instruções para completar a reserva.' },
                { q: 'Posso reservar voos para várias pessoas?', a: 'Sim! No momento da pesquisa, selecione o número de passageiros (adultos, crianças e bebés). Cada passageiro terá os seus dados preenchidos durante o checkout.' },
                { q: 'Recebi confirmação da minha reserva?', a: 'Após a conclusão do pagamento, receberá um email de confirmação com todos os detalhes do voo e o código de reserva (PNR).' },
                { q: 'Posso segurar um preço sem pagar?', a: 'Algumas tarifas permitem "segurar" o preço por um período limitado (geralmente 24-72 horas). Esta opção aparece no checkout quando disponível.' }
            ]
        },
        {
            categoryKey: 'payments',
            icon: CreditCard,
            questions: [
                { q: 'Quais métodos de pagamento são aceites?', a: 'Aceitamos cartões de crédito e débito (Visa, Mastercard, American Express). Os pagamentos são processados de forma segura através dos nossos parceiros certificados.' },
                { q: 'O pagamento é seguro?', a: 'Sim. Utilizamos encriptação de ponta e os pagamentos são processados através de parceiros com certificação PCI-DSS, garantindo a máxima segurança dos seus dados.' },
                { q: 'Em que moeda sou cobrado?', a: 'O valor é cobrado na moeda indicada no momento da reserva. O seu banco pode aplicar taxas de conversão se a moeda for diferente da sua conta.' }
            ]
        },
        {
            categoryKey: 'changes',
            icon: RefreshCcw,
            questions: [
                { q: 'Posso cancelar a minha reserva?', a: 'As políticas de cancelamento dependem da tarifa escolhida e da companhia aérea. Verifique as condições no email de confirmação ou contacte-nos.' },
                { q: 'Como altero a data do meu voo?', a: 'Para alterações, contacte-nos através do email contato@alltripapp.com ou WhatsApp. Taxas de alteração podem aplicar-se conforme as regras da companhia aérea.' },
                { q: 'Quanto tempo demora um reembolso?', a: 'Os reembolsos são processados conforme as políticas da companhia aérea. Geralmente, o valor aparece na sua conta em 7-14 dias úteis após aprovação.' }
            ]
        },
        {
            categoryKey: 'about',
            icon: HelpCircle,
            questions: [
                { q: 'O que é a AllTrip?', a: 'A AllTrip é uma plataforma de metabusca que compara preços de voos de diversas companhias aéreas. Facilitamos a reserva através de parceiros certificados.' },
                { q: 'A AllTrip é uma agência de viagens?', a: 'Não. Somos uma plataforma tecnológica de comparação. As reservas são processadas diretamente através das companhias aéreas ou parceiros licenciados.' }
            ]
        }
    ],
    en: [
        {
            categoryKey: 'bookings',
            icon: Plane,
            questions: [
                { q: 'How do I make a flight booking?', a: 'Use the search bar on the homepage to enter your origin, destination and dates. Select your desired flight and follow the instructions to complete the booking.' },
                { q: 'Can I book flights for multiple people?', a: 'Yes! When searching, select the number of passengers (adults, children and infants). Each passenger will have their details filled in during checkout.' },
                { q: 'Did I receive confirmation of my booking?', a: 'After completing payment, you will receive a confirmation email with all flight details and the booking reference (PNR).' },
                { q: 'Can I hold a price without paying?', a: 'Some fares allow you to "hold" the price for a limited period (usually 24-72 hours). This option appears at checkout when available.' }
            ]
        },
        {
            categoryKey: 'payments',
            icon: CreditCard,
            questions: [
                { q: 'What payment methods are accepted?', a: 'We accept credit and debit cards (Visa, Mastercard, American Express). Payments are processed securely through our certified partners.' },
                { q: 'Is the payment secure?', a: 'Yes. We use end-to-end encryption and payments are processed through PCI-DSS certified partners, ensuring maximum security for your data.' },
                { q: 'What currency am I charged in?', a: 'The amount is charged in the currency indicated at the time of booking. Your bank may apply conversion fees if the currency differs from your account.' }
            ]
        },
        {
            categoryKey: 'changes',
            icon: RefreshCcw,
            questions: [
                { q: 'Can I cancel my booking?', a: 'Cancellation policies depend on the fare chosen and the airline. Check the conditions in the confirmation email or contact us.' },
                { q: 'How do I change my flight date?', a: 'For changes, contact us via email contato@alltripapp.com or WhatsApp. Change fees may apply according to airline rules.' },
                { q: 'How long does a refund take?', a: 'Refunds are processed according to airline policies. Generally, the amount appears in your account within 7-14 business days after approval.' }
            ]
        },
        {
            categoryKey: 'about',
            icon: HelpCircle,
            questions: [
                { q: 'What is AllTrip?', a: 'AllTrip is a metasearch platform that compares flight prices from various airlines. We facilitate booking through certified partners.' },
                { q: 'Is AllTrip a travel agency?', a: 'No. We are a technology comparison platform. Bookings are processed directly through airlines or licensed partners.' }
            ]
        }
    ],
    es: [
        {
            categoryKey: 'bookings',
            icon: Plane,
            questions: [
                { q: '¿Cómo hago una reserva de vuelo?', a: 'Utiliza la barra de búsqueda en la página principal para ingresar origen, destino y fechas. Selecciona el vuelo deseado y sigue las instrucciones para completar la reserva.' },
                { q: '¿Puedo reservar vuelos para varias personas?', a: '¡Sí! Al momento de la búsqueda, selecciona el número de pasajeros (adultos, niños y bebés). Cada pasajero tendrá sus datos completados durante el checkout.' },
                { q: '¿Recibí confirmación de mi reserva?', a: 'Después de completar el pago, recibirás un email de confirmación con todos los detalles del vuelo y el código de reserva (PNR).' },
                { q: '¿Puedo mantener un precio sin pagar?', a: 'Algunas tarifas permiten "mantener" el precio por un período limitado (generalmente 24-72 horas). Esta opción aparece en el checkout cuando está disponible.' }
            ]
        },
        {
            categoryKey: 'payments',
            icon: CreditCard,
            questions: [
                { q: '¿Qué métodos de pago se aceptan?', a: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express). Los pagos se procesan de forma segura a través de nuestros socios certificados.' },
                { q: '¿El pago es seguro?', a: 'Sí. Utilizamos cifrado de extremo a extremo y los pagos se procesan a través de socios con certificación PCI-DSS, garantizando la máxima seguridad de tus datos.' },
                { q: '¿En qué moneda me cobran?', a: 'El monto se cobra en la moneda indicada en el momento de la reserva. Tu banco puede aplicar tasas de conversión si la moneda difiere de la de tu cuenta.' }
            ]
        },
        {
            categoryKey: 'changes',
            icon: RefreshCcw,
            questions: [
                { q: '¿Puedo cancelar mi reserva?', a: 'Las políticas de cancelación dependen de la tarifa elegida y de la aerolínea. Verifica las condiciones en el email de confirmación o contáctanos.' },
                { q: '¿Cómo cambio la fecha de mi vuelo?', a: 'Para cambios, contáctanos por email contato@alltripapp.com o WhatsApp. Pueden aplicarse tasas de cambio según las reglas de la aerolínea.' },
                { q: '¿Cuánto tiempo tarda un reembolso?', a: 'Los reembolsos se procesan según las políticas de la aerolínea. Generalmente, el monto aparece en tu cuenta en 7-14 días hábiles después de la aprobación.' }
            ]
        },
        {
            categoryKey: 'about',
            icon: HelpCircle,
            questions: [
                { q: '¿Qué es AllTrip?', a: 'AllTrip es una plataforma de metabúsqueda que compara precios de vuelos de diversas aerolíneas. Facilitamos la reserva a través de socios certificados.' },
                { q: '¿AllTrip es una agencia de viajes?', a: 'No. Somos una plataforma tecnológica de comparación. Las reservas se procesan directamente a través de las aerolíneas o socios licenciados.' }
            ]
        }
    ]
};

export default function HelpPage() {
    const { labels, language } = useRegion();
    const faqs = faqsData[language] || faqsData.pt;

    const getCategoryLabel = (key: string) => {
        const map: Record<string, string> = {
            bookings: labels.help.bookings,
            payments: labels.help.payments,
            changes: labels.help.changes,
            about: labels.help.about
        };
        return map[key] || key;
    };

    return (
        <main className="min-h-screen bg-[#0B0F19]">
            <section className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                            {labels.help.title}
                        </h1>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            {labels.help.subtitle}
                        </p>
                    </div>

                    {/* FAQ Sections */}
                    <div className="space-y-8">
                        {faqs.map((section) => (
                            <div key={section.categoryKey} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                                {/* Category Header */}
                                <div className="flex items-center gap-3 p-6 border-b border-white/10">
                                    <div className="p-2 bg-rose-500/20 rounded-lg">
                                        <section.icon className="w-5 h-5 text-rose-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">{getCategoryLabel(section.categoryKey)}</h2>
                                </div>

                                {/* Questions */}
                                <div className="divide-y divide-white/5">
                                    {section.questions.map((faq, idx) => (
                                        <details key={idx} className="group">
                                            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-colors">
                                                <span className="text-white font-medium pr-4">{faq.q}</span>
                                                <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform shrink-0" />
                                            </summary>
                                            <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">
                                                {faq.a}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-12 text-center bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl p-8">
                        <MessageCircle className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">{labels.help.not_found}</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            {labels.help.contact_team}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-colors"
                            >
                                {labels.help.contact_us}
                            </Link>
                            <a
                                href="https://wa.me/351964271232"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                {labels.help.whatsapp}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
