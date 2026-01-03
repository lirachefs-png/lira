import { NextResponse } from 'next/server';
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
        const language = searchParams.get('lang') || 'pt';

        if (!bookingId) {
            return NextResponse.json(
                { error: 'bookingId is required' },
                { status: 400 }
            );
        }

        // --- MOCK DATABASE FETCH ---
        // Since Supabase is removed, we can't fetch booking details from DB.
        // In a real app, replace this with your new DB logic.
        // For now, if we have a bookingId, we will try to return a mock or fetch from Duffel if possible.

        console.warn("⚠️ Database unavailable. Cannot fetch unique booking by ID:", bookingId);

        // Return 404 effectively since we have no DB
        return NextResponse.json(
            { error: 'Trip details unavailable (Auth/DB removed)' },
            { status: 404 }
        );

    } catch (error: any) {
        console.error('Trip Details Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch trip details' },
            { status: 500 }
        );
    }
}
