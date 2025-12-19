import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface BookingConfirmationProps {
    customerName: string;
    bookingReference: string;
    origin: string;
    destination: string;
    totalAmount: string;
    airline?: string;
}

export const BookingConfirmation = ({
    customerName,
    bookingReference,
    origin,
    destination,
    totalAmount,
    airline = "AllTrip Flight",
}: BookingConfirmationProps) => (
    <Html>
        <Head />
        <Preview>Your flight to {destination} is confirmed!</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    <Heading style={logo}>AllTrip</Heading>
                </Section>
                <Section style={content}>
                    <Heading style={{ ...h1, margin: '0 0 20px 0' }}>Booking Confirmed! ✈️</Heading>
                    <Text style={paragraph}>
                        Hi {customerName},
                    </Text>
                    <Text style={paragraph}>
                        Great news! Your flight from <strong>{origin}</strong> to <strong>{destination}</strong> has been successfully booked.
                    </Text>

                    <Section style={box}>
                        <Text style={boxText}><strong>Booking Reference:</strong> {bookingReference}</Text>
                        <Text style={boxText}><strong>Airline:</strong> {airline}</Text>
                        <Text style={boxText}><strong>Total Paid:</strong> {totalAmount}</Text>
                    </Section>

                    <Text style={paragraph}>
                        We wish you a safe and pleasant journey. You can view your full itinerary by clicking the button below.
                    </Text>

                    <Section style={{ textAlign: 'center', marginTop: '32px' }}>
                        <Link style={button} href="https://alltrip.com/my-trips">
                            View Itinerary
                        </Link>
                    </Section>

                    <Hr style={hr} />

                    <Text style={footer}>
                        This email was sent to you by AllTrip. If you have any questions, reply to this email.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default BookingConfirmation;

const main = {
    backgroundColor: '#000000',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#0b0f19',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
    borderRadius: '12px',
    maxWidth: '600px',
    border: '1px solid #333',
};

const header = {
    padding: '20px 48px',
    borderBottom: '1px solid #333',
};

const logo = {
    color: '#F43F5E', // Rose 500
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
};

const content = {
    padding: '40px 48px',
};

const h1 = {
    color: '#fff',
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '1.3',
};

const paragraph = {
    color: '#ccc',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '16px 0',
};

const box = {
    padding: '24px',
    backgroundColor: '#151926',
    borderRadius: '8px',
    border: '1px solid #333',
    marginTop: '24px',
};

const boxText = {
    color: '#fff',
    fontSize: '14px',
    margin: '8px 0',
};

const button = {
    backgroundColor: '#F43F5E',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
};

const hr = {
    borderColor: '#333',
    margin: '40px 0',
};

const footer = {
    color: '#666',
    fontSize: '12px',
    lineHeight: '1.5',
};
