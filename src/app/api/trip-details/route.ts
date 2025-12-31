import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getWeatherForecast, type WeatherSummary } from '@/services/weather';
import { getSmartPackingList, type PackingList } from '@/app/actions/smart-packer';

interface TripDetailsResponse {
    booking: {
        id: string;
        bookingReference: string;
        status: string;
        origin: string;
        destination: string;
        airline: string;
        departureDate: string;
        amount: number;
        currency: string;
        passengers: any[];
        createdAt: string;
    };
    weather: WeatherSummary | null;
    packingList: PackingList | null;
    destinationInfo: {
        name: string;
        country: string;
        timezone?: string;
    } | null;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const bookingId = searchParams.get('bookingId');
        const language = searchParams.get('lang') || 'pt'; // Default to Portuguese

        if (!bookingId) {
            return NextResponse.json(
                { error: 'bookingId is required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // 1. Fetch Booking from Database
        const { data: booking, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();

        if (error || !booking) {
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }

        // 2. Try to get flight details from Duffel if we have booking_reference
        let origin = 'N/A';
        let destination = 'N/A';
        let airline = 'Unknown Airline';
        let departureDate = new Date().toISOString().split('T')[0];
        let passengers: any[] = [];

        const bookingRef = booking.booking_reference;
        if (bookingRef && process.env.DUFFEL_ACCESS_TOKEN) {
            try {
                const duffelRes = await fetch(`https://api.duffel.com/air/orders?booking_reference=${bookingRef}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.DUFFEL_ACCESS_TOKEN}`,
                        'Duffel-Version': '2024-02-01',
                        'Accept': 'application/json'
                    }
                });

                if (duffelRes.ok) {
                    const duffelData = await duffelRes.json();
                    const order = duffelData.data?.[0];

                    if (order) {
                        const firstSlice = order.slices?.[0];
                        if (firstSlice) {
                            origin = firstSlice.origin?.iata_code || firstSlice.origin?.city_name || 'N/A';
                            destination = firstSlice.destination?.iata_code || firstSlice.destination?.city_name || 'N/A';
                            departureDate = firstSlice.segments?.[0]?.departing_at?.split('T')[0] || departureDate;
                        }
                        airline = order.owner?.name || 'Unknown Airline';
                        passengers = order.passengers || [];
                    }
                }
            } catch (duffelErr) {
                console.error('Duffel API error:', duffelErr);
            }
        }

        // Fallback to passenger_data if Duffel fetch failed
        if (origin === 'N/A') {
            const passengerData = booking.passenger_data || {};
            origin = passengerData.origem || passengerData.origin || 'N/A';
            destination = passengerData.destino || passengerData.destination || 'N/A';
            airline = passengerData.airline || 'Unknown Airline';
            departureDate = passengerData.departureDate || departureDate;
            passengers = passengerData.passengers || [];
        }

        // 3. Get destination coordinates for weather
        let weather: WeatherSummary | null = null;
        let destinationInfo: { name: string; country: string; timezone?: string } | null = null;

        if (destination && destination !== 'N/A') {
            try {
                const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1&language=en&format=json`;
                const geoRes = await fetch(geoUrl);
                const geoData = await geoRes.json();

                if (geoData.results?.length > 0) {
                    const { latitude, longitude, name, country, timezone } = geoData.results[0];
                    destinationInfo = { name, country, timezone };

                    const startDate = new Date(departureDate);
                    const endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + 7);

                    weather = await getWeatherForecast(latitude, longitude, startDate, endDate);
                }
            } catch (weatherErr) {
                console.error('Failed to fetch weather:', weatherErr);
            }
        }

        // 4. Get smart packing list
        let packingList: PackingList | null = null;
        if (destinationInfo && weather) {
            try {
                const endDate = new Date(departureDate);
                endDate.setDate(endDate.getDate() + 7);
                packingList = await getSmartPackingList(
                    destinationInfo.name,
                    departureDate,
                    endDate.toISOString().split('T')[0],
                    language
                );
            } catch (packErr) {
                console.error('Failed to generate packing list:', packErr);
            }
        }

        // 5. Build Response
        const response: TripDetailsResponse = {
            booking: {
                id: booking.id,
                bookingReference: booking.booking_reference || 'N/A',
                status: booking.state,
                origin,
                destination,
                airline,
                departureDate,
                amount: booking.amount_total / 100,
                currency: booking.currency || 'EUR',
                passengers,
                createdAt: booking.created_at
            },
            weather,
            packingList,
            destinationInfo
        };

        return NextResponse.json(response);

    } catch (error: any) {
        console.error('Trip Details Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch trip details' },
            { status: 500 }
        );
    }
}
