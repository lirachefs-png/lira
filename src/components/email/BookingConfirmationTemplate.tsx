
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Hr,
    Row,
    Column,
} from '@react-email/components';
import { AIRLINE_CABIN_IMAGES } from '@/lib/airlineImages';

interface BookingConfirmationTemplateProps {
    customerName: string;
    bookingReference: string;
    originCity: string;
    destinationCity: string;
    flightDate: string;
    airlineName: string;
    airlineLogo?: string;
    totalAmount: string;
    destinationImage?: string;
}

export default function BookingConfirmationTemplate({
    customerName,
    bookingReference,
    originCity,
    destinationCity,
    flightDate,
    airlineName,
    airlineLogo,
    totalAmount,
    destinationImage,
}: BookingConfirmationTemplateProps) {

    // Default fallback image if none provided
    const heroImage = destinationImage || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop';

    return (
        <Html>
            <Head />
            <Preview>Sua viagem para {destinationCity} está confirmada!</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* HERO SECTION WITH DESTINATION IMAGE */}
                    <Section style={{ ...heroSection, backgroundImage: `url('${heroImage}')` }}>
                        <div style={darkOverlay}>
                            <Img
                                src="https://all-trip.vercel.app/logo-white.png" // We might need to ensure this logo exists or use text
                                width="150"
                                height="40"
                                alt="AllTrip"
                                style={logo}
                            />
                            <Heading style={heroTitle}>
                                Prepare as malas, {customerName.split(' ')[0]}!
                                <br />
                                <span style={heroSubtitle}>{destinationCity} te espera.</span>
                            </Heading>
                        </div>
                    </Section>

                    {/* BOOKING DETAILS */}
                    <Section style={contentSection}>
                        <Text style={paragraph}>
                            Olá <strong>{customerName}</strong>,
                        </Text>
                        <Text style={paragraph}>
                            Sua reserva foi confirmada com sucesso! Aqui estão os detalhes do seu voo.
                        </Text>

                        <Section style={ticketCard}>
                            <Row>
                                <Column>
                                    <Text style={label}>LOCALIZADOR</Text>
                                    <Text style={value}>{bookingReference}</Text>
                                </Column>
                                <Column align="right">
                                    <Text style={label}>COMPANHIA</Text>
                                    {airlineLogo ? (
                                        <Img src={airlineLogo} width="32" height="32" alt={airlineName} />
                                    ) : (
                                        <Text style={value}>{airlineName}</Text>
                                    )}
                                </Column>
                            </Row>
                            <Hr style={divider} />
                            <Row>
                                <Column>
                                    <Text style={flightCity}>{originCity}</Text>
                                    <Text style={flightDateText}>{flightDate}</Text>
                                </Column>
                                <Column align="center">
                                    <Img src="https://cdn-icons-png.flaticon.com/512/3125/3125713.png" width="24" height="24" alt="to" />
                                </Column>
                                <Column align="right">
                                    <Text style={flightCity}>{destinationCity}</Text>
                                    <Text style={flightDateText}>{flightDate}</Text>
                                </Column>
                            </Row>
                        </Section>

                        <Text style={paragraph}>
                            Valor Total Pago: <strong>{totalAmount}</strong>
                        </Text>

                        <Section align="center" style={btnContainer}>
                            <Link href="#" style={button}>
                                Ver Bilhete Completo
                            </Link>
                        </Section>
                    </Section>

                    <Section style={footer}>
                        <Text style={footerText}>
                            © 2025 AllTrip. Todos os direitos reservados.
                            <br />
                            Dúvidas? Responda a este e-mail.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

// STYLES
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '0',
    borderRadius: '12px',
    overflow: 'hidden',
    maxWidth: '600px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
};

const heroSection = {
    height: '250px',
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative' as const,
};

const darkOverlay = {
    backgroundColor: 'rgba(0,0,0,0.4)',
    height: '100%',
    width: '100%',
    padding: '30px',
    boxSizing: 'border-box' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
};

const logo = {
    marginBottom: '20px',
};

const heroTitle = {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0',
    lineHeight: '1.2',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
};

const heroSubtitle = {
    color: '#f0f0f0',
    fontSize: '24px',
    fontWeight: 'normal',
};

const contentSection = {
    padding: '40px',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#484848',
    marginBottom: '20px',
};

const ticketCard = {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '20px',
    border: '1px solid #e0e0e0',
    marginBottom: '24px',
};

const label = {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#8898aa',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    marginBottom: '4px',
};

const value = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1a1a1a',
    margin: '0',
};

const divider = {
    borderColor: '#e0e0e0',
    margin: '15px 0',
};

const flightCity = {
    fontSize: '20px',
    fontWeight: '900',
    color: '#1a1a1a',
    margin: '0',
};

const flightDateText = {
    fontSize: '14px',
    color: '#666',
    margin: '4px 0 0 0',
};

const btnContainer = {
    marginTop: '30px',
};

const button = {
    backgroundColor: '#000000',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
};

const footer = {
    backgroundColor: '#f6f9fc',
    padding: '20px',
    textAlign: 'center' as const,
};

const footerText = {
    fontSize: '12px',
    color: '#8898aa',
    lineHeight: '1.5',
};
