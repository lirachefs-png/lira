import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createBooking as createBookingDuffel } from '@/lib/duffel';
import { Resend } from 'resend';
import BookingConfirmation from '@/components/emails/BookingConfirmation';
import { createBooking, updateBooking } from "@/lib/bookingStore";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any,
});

const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

export async function POST(req: Request) {
    const headerPayload = await headers();
    const sig = headerPayload.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
        console.error("Missing Stripe Signature or Webhook Secret");
        return NextResponse.json({ error: "Missing webhook signature/secret" }, { status: 400 });
    }

    const rawBody = await req.text();
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verify failed: ${err.message}`);
        return NextResponse.json({ error: `Webhook Signature Error: ${err.message}` }, { status: 400 });
    }

    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;

            // Extract metadata
            const offerId = session.metadata?.offer_id;
            const passengerMetadata = session.metadata?.passenger_data;
            const servicesMetadata = session.metadata?.selected_services;
            const customerEmail = session.customer_details?.email || session.customer_email || session.metadata?.email;

            // Parse Passenger Data
            let passengerData = null;
            try {
                if (passengerMetadata) passengerData = JSON.parse(passengerMetadata);
            } catch (e) { console.error("Metadata Parse Error", e); }

            // Parse Services Data
            let serviceIds: string[] = [];
            try {
                if (servicesMetadata) serviceIds = JSON.parse(servicesMetadata);
            } catch (e) { console.error("Services Parse Error", e); }

            console.log("✅ Payment Confirmed (Webhook):", {
                sessionId: session.id,
                offerId: offerId,
                amount: session.amount_total,
                hasServices: serviceIds.length > 0
            });

            // Initial processing state - Create record in Supabase
            // We use a try-catch to avoid crashing if it already exists (idempotency)
            try {
                // Import the new helper functions (ensure you update imports at top of file too)
                await createBooking(
                    session.id,
                    "processing",
                    customerEmail,
                    session.amount_total || 0,
                    session.currency?.toUpperCase() || 'EUR',
                    passengerData
                );
            } catch (e) {
                console.log("Booking record might already exist, continuing...");
            }

            if (!offerId) {
                console.warn("⚠️ Missing offer_id in metadata");
                return NextResponse.json({ ok: true, ignored: true, reason: "missing_metadata" });
            }

            // Call Duffel API to finalize booking
            try {
                const booking = await createBookingDuffel(offerId, passengerData, serviceIds);
                console.log(`✅ Flight Booked! Ref: ${booking.bookingReference} (Order: ${booking.orderId})`);

                // Update Supabase Store
                await updateBooking(session.id, {
                    state: "confirmed",
                    offerId: offerId,
                    bookingReference: booking.bookingReference,
                    orderId: booking.orderId
                });

                // Update Stripe Session (Persistence/Backup)
                await stripe.checkout.sessions.update(session.id, {
                    metadata: {
                        booking_status: 'confirmed',
                        duffel_order_id: booking.orderId,
                        duffel_booking_ref: booking.bookingReference
                    }
                });

                // Send Confirmation Email via Resend (Best Effort - Non-blocking)
                if (customerEmail) {
                    try {
                        const { data, error } = await resend.emails.send({
                            from: 'AllTrip <onboarding@resend.dev>', // Change to your verified domain in prod
                            to: [customerEmail],
                            subject: 'Booking Confirmed! ✈️',
                            react: BookingConfirmation({
                                customerName: passengerData?.firstName || 'Traveler',
                                bookingReference: booking.bookingReference,
                                origin: 'LIS',
                                destination: 'USA',
                                totalAmount: `€${(session.amount_total! / 100).toFixed(2)}`,
                                airline: 'Airline'
                            }),
                        });

                        if (error) console.error("❌ Resend Error (Non-blocking):", error);
                        else console.log("📧 Email Sent:", data?.id);
                    } catch (emailErr) {
                        console.error("❌ Failed to send email (Non-blocking):", emailErr);
                    }
                }

            } catch (bookingError: any) {
                console.error("❌ Failed to book flight on Duffel:", bookingError);

                // Update Supabase Store
                await updateBooking(session.id, {
                    state: "failed",
                    error: bookingError.message || 'Duffel failed',
                });

                // Mark as failed in Stripe
                await stripe.checkout.sessions.update(session.id, {
                    metadata: {
                        booking_status: 'failed',
                        booking_error: bookingError.message || 'Unknown booking error'
                    }
                });
            }

            return NextResponse.json({ ok: true, message: "Booking processed" });
        }

        return NextResponse.json({ ok: true, ignored: true, type: event.type });

    } catch (err: any) {
        console.error("❌ Webhook handler error:", err.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
