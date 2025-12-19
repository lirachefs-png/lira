import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createBooking as createBookingDuffel } from '@/lib/duffel';
import { createBooking, updateBooking } from "@/lib/bookingStore";

export const runtime = "nodejs";

export async function GET(request: Request) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Check if paid
        if (session.payment_status !== 'paid') {
            return NextResponse.json({ status: 'pending_payment' });
        }

        // Check if Duffel fulfillment happened (via Webhook update)
        let duffelOrderId = session.metadata?.duffel_order_id;
        let duffelRef = session.metadata?.duffel_booking_ref;
        const bookingStatus = session.metadata?.booking_status;
        const bookingError = session.metadata?.booking_error;

        if (bookingStatus === 'failed') {
            return NextResponse.json({
                status: 'error',
                message: bookingError || 'Booking creation failed'
            });
        }

        if (duffelOrderId) {
            return NextResponse.json({
                status: 'confirmed',
                orderId: duffelOrderId,
                bookingReference: duffelRef
            });
        }

        // Fallback: If paid but no Order ID (Webhook failed/missing), create it now.
        const offerId = session.metadata?.offer_id;
        if (offerId && !bookingStatus) {
            console.log("⚠️ Webhook missing? Triggering fallback booking creation...");

            // Extract data from metadata
            const passengerMetadata = session.metadata?.passenger_data;
            const servicesMetadata = session.metadata?.selected_services;
            const customerEmail = session.customer_details?.email || session.metadata?.email;

            let passengerData = null;
            try { if (passengerMetadata) passengerData = JSON.parse(passengerMetadata); } catch (e) { }

            let serviceIds: string[] = [];
            try { if (servicesMetadata) serviceIds = JSON.parse(servicesMetadata); } catch (e) { }

            try {
                // 1. Create DB Record (if not exists)
                await createBooking(
                    session.id,
                    "processing",
                    customerEmail || undefined,
                    session.amount_total || 0,
                    session.currency?.toUpperCase() || 'EUR',
                    passengerData
                ).catch(() => { }); // Ignore if exists

                // 2. Call Duffel
                const booking = await createBookingDuffel(offerId, passengerData, serviceIds);
                console.log(`✅ Fallback Booking Success: ${booking.bookingReference}`);

                // 3. Update DB
                await updateBooking(session.id, {
                    state: "confirmed",
                    offerId: offerId,
                    bookingReference: booking.bookingReference,
                    orderId: booking.orderId
                });

                // 4. Update Stripe Metadata (to stop future fallbacks)
                await stripe.checkout.sessions.update(session.id, {
                    metadata: {
                        booking_status: 'confirmed',
                        duffel_order_id: booking.orderId,
                        duffel_booking_ref: booking.bookingReference
                    }
                });

                return NextResponse.json({
                    status: 'confirmed',
                    orderId: booking.orderId,
                    bookingReference: booking.bookingReference
                });

            } catch (err: any) {
                console.error("Fallback Booking Failed", err);
                return NextResponse.json({
                    status: 'error',
                    message: err.message || 'Fallback booking failed'
                });
            }
        }

        return NextResponse.json({ status: 'processing' });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
