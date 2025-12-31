import { NextResponse } from 'next/server';

/**
 * Duffel Assistant - Client Key Generation
 * 
 * This endpoint generates ephemeral component_client_keys for the Duffel Assistant.
 * Each key is unique per user and should be generated each time the Assistant opens.
 * 
 * The key allows the Assistant to:
 * - Show the user's flight bookings
 * - Enable trip management (changes, cancellations)
 * - Provide real-time support chat
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, orderId } = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'userId is required' },
                { status: 400 }
            );
        }

        const DUFFEL_TOKEN = process.env.DUFFEL_ACCESS_TOKEN;

        if (!DUFFEL_TOKEN) {
            console.error('❌ DUFFEL_ACCESS_TOKEN not configured');
            return NextResponse.json(
                { error: 'Payment service not configured' },
                { status: 500 }
            );
        }

        // Generate ephemeral component_client_key from Duffel
        // If orderId is provided, support will be contextual to that order
        const response = await fetch('https://api.duffel.com/identity/component_client_keys', {
            method: 'POST',
            headers: {
                'Duffel-Version': 'v2',
                'Authorization': `Bearer ${DUFFEL_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    user_id: userId,
                    ...(orderId && { order_id: orderId })
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ Duffel Assistant Key Error:', response.status, errorData);
            return NextResponse.json(
                { error: 'Failed to generate assistant key', details: errorData },
                { status: response.status }
            );
        }

        const { data } = await response.json();

        console.log('✅ Duffel Assistant key generated for user:', userId);

        return NextResponse.json({
            clientKey: data.component_client_key,
            expiresAt: data.expires_at
        });

    } catch (error: any) {
        console.error('❌ Assistant Key Generation Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
