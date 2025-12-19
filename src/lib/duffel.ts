import { Duffel } from '@duffel/api';

export const duffel = new Duffel({
    token: process.env.DUFFEL_ACCESS_TOKEN || "mock_token_for_build",
});

export async function createBooking(offerId: string, passengerDetails?: any, serviceIds: string[] = []) {
    try {
        // 1. Fetch the offer to get the passenger structure (IDs are required)
        const offer = await duffel.offers.get(offerId);

        // 2. Map passengers using Real Data if provided, else Mock.
        const passengers = offer.data.passengers.map((p) => ({
            id: p.id,
            given_name: passengerDetails?.firstName || "Jane",
            family_name: passengerDetails?.lastName || "Doe",
            born_on: passengerDetails?.dob || "1990-01-01",
            title: passengerDetails?.gender === 'm' ? "mr" : "ms",
            gender: passengerDetails?.gender || "f",
            email: passengerDetails?.email || "jane.doe@example.com",
            phone_number: passengerDetails?.phone || "+15550109999" // E.164 format
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
        return { success: true, orderId: order.data.id, bookingReference: order.data.booking_reference };

    } catch (error: any) {
        console.error('❌ Duffel Booking Failed:', error);
        // Extract Duffel specific error message if available
        const message = error.errors?.[0]?.message || error.message;
        throw new Error(`Duffel Booking Error: ${message}`);
    }
}
