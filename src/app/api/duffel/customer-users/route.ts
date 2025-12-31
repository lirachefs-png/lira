import { NextResponse } from 'next/server';

/**
 * Duffel Customer Users API
 * 
 * Creates and manages customer users in Duffel.
 * A customer_user is required for the Duffel Assistant to work properly.
 * The customer_user_id should be linked to orders for proper trip management.
 */

const DUFFEL_API = 'https://api.duffel.com';

// Create a new customer user
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, given_name, family_name, phone_number } = body;

        if (!email || !given_name || !family_name) {
            return NextResponse.json(
                { error: 'email, given_name, and family_name are required' },
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

        // Create customer user in Duffel
        const response = await fetch(`${DUFFEL_API}/identity/customer_users`, {
            method: 'POST',
            headers: {
                'Duffel-Version': 'v2',
                'Authorization': `Bearer ${DUFFEL_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    email,
                    given_name,
                    family_name,
                    ...(phone_number && { phone_number })
                }
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Duffel Create Customer User Error:', response.status, data);

            // Check if user already exists (email conflict)
            if (data.errors?.[0]?.code === 'email_already_exists') {
                // Try to get existing user
                return NextResponse.json({
                    exists: true,
                    message: 'Customer user already exists with this email'
                });
            }

            return NextResponse.json(
                { error: data.errors?.[0]?.message || 'Failed to create customer user', details: data },
                { status: response.status }
            );
        }

        console.log('✅ Duffel Customer User created:', data.data.id);

        return NextResponse.json({
            id: data.data.id,
            email: data.data.email,
            given_name: data.data.given_name,
            family_name: data.data.family_name,
            created: true
        });

    } catch (error: any) {
        console.error('❌ Customer User Creation Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// Get customer user by email (search)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { error: 'email query parameter is required' },
                { status: 400 }
            );
        }

        const DUFFEL_TOKEN = process.env.DUFFEL_ACCESS_TOKEN;

        if (!DUFFEL_TOKEN) {
            return NextResponse.json(
                { error: 'Payment service not configured' },
                { status: 500 }
            );
        }

        // List customer users and filter by email
        const response = await fetch(`${DUFFEL_API}/identity/customer_users?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Duffel-Version': 'v2',
                'Authorization': `Bearer ${DUFFEL_TOKEN}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Duffel Get Customer User Error:', response.status, data);
            return NextResponse.json(
                { error: data.errors?.[0]?.message || 'Failed to find customer user' },
                { status: response.status }
            );
        }

        // Find exact match
        const user = data.data?.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return NextResponse.json({ found: false });
        }

        return NextResponse.json({
            found: true,
            id: user.id,
            email: user.email,
            given_name: user.given_name,
            family_name: user.family_name
        });

    } catch (error: any) {
        console.error('❌ Customer User Lookup Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
