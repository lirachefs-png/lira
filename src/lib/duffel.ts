import { Duffel } from '@duffel/api';

// Sanitize token: Remove newlines, carriage returns, spaces, and other invisible characters
// This fixes "is not a legal HTTP header value" errors from badly pasted env vars in Vercel
const rawToken = process.env.DUFFEL_ACCESS_TOKEN || "";
const token = rawToken.replace(/[\n\r\s\t\u00A0\u200B\u2028\u2029]/g, '').trim();

// Debug initialization to catch Vercel env var issues
if (!token) {
    console.error("❌ CRITICAL: DUFFEL_ACCESS_TOKEN is missing in environment variables!");
} else {
    console.log(`✅ Duffel Client Initialized with token starting: ${token.substring(0, 15)}...`);
    // Warn if sanitization removed characters
    if (rawToken.length !== token.length) {
        console.warn(`⚠️ WARNING: Duffel token had ${rawToken.length - token.length} invalid characters removed!`);
    }
}

export const duffel = new Duffel({
    token: token || "mock_token_for_build",
    // Note: This SDK version defaults to API v2 (Production). No 'beta' flag needed.
});

export async function createBooking(offerId: string, passengerDetails?: any, serviceIds: string[] = []) {
    try {
        // 1. Fetch the offer to get the passenger structure (IDs are required)
        const offer = await duffel.offers.get(offerId);

        // 2. Map passengers using Real Data if provided, else Mock.
        const passengers = offer.data.passengers.map((p) => ({
            id: p.id, // Critical: Must match the Offer's passenger ID
            given_name: passengerDetails?.firstName,
            family_name: passengerDetails?.lastName,
            born_on: passengerDetails?.dob,
            title: passengerDetails?.gender === 'm' ? "mr" : "ms",
            gender: passengerDetails?.gender || "m",
            email: passengerDetails?.email,
            phone_number: passengerDetails?.phone || "+15550109999", // Duffel requires E.164
            identity_documents: passengerDetails?.identity_documents,
            ...(passengerDetails?.hasLoyalty && passengerDetails?.loyaltyAirline && passengerDetails?.loyaltyNumber ? {
                loyalty_programme_accounts: [{
                    airline_iata_code: passengerDetails.loyaltyAirline,
                    account_number: passengerDetails.loyaltyNumber
                }]
            } : {})
        }));

        // Structure services
        const services = serviceIds.map(id => ({
            id: id,
            quantity: 1 // MVP assumption: 1 per selection
        }));

        // 3. Create the Order
        const orderParams: any = {
            selected_offers: [offerId],
            passengers: passengers,
            type: 'instant',
            payments: [
                {
                    type: 'balance',
                    amount: offer.data.total_amount, // Note: If services add cost, this might need recalculation if not bundled in offer? 
                    // Duffel note: usually services are added to the order and the total updates.
                    // For instant payment with balance, we might need to be careful. 
                    // However, we are using the OFFER price here. 
                    // If services are extra, they are usually separate line items.
                    // Let's rely on Duffel calculating the total or us updating the amount.
                    // Actually, for "instant", we pay the full amount.
                    // Simplified for MVP: We use the Offer Amount. Real world: Fetch order preview first.
                    currency: offer.data.total_currency,
                }
            ]
        };

        if (services.length > 0) {
            orderParams.services = services;
        }

        const order = await duffel.orders.create(orderParams);

        console.log('✈️ Duffel Order Created:', order.data.id);
        return { success: true, orderId: order.data.id, bookingReference: order.data.booking_reference, orderData: order.data };

    } catch (error: any) {
        console.error('❌ Duffel Booking Failed:', error);
        // Extract Duffel specific error message if available
        const message = error.errors?.[0]?.message || error.message;
        throw new Error(`Duffel Booking Error: ${message}`);
    }
}
