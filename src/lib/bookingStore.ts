import { createClient } from "@/lib/supabase/server";

export type BookingState = "processing" | "confirmed" | "failed";

export async function createBooking(
    sessionId: string,
    state: BookingState = "processing",
    userEmail: string | null = null,
    amount: number = 0,
    currency: string = 'EUR',
    passengerData: any = {}
) {
    const supabase = await createClient();
    await supabase.from("bookings").insert({
        stripe_session_id: sessionId,
        state: state,
        user_email: userEmail,
        amount_total: amount,
        currency: currency,
        passenger_data: passengerData
    });
}

export async function updateBooking(sessionId: string, data: {
    state: BookingState;
    offerId?: string;
    bookingReference?: string;
    error?: string;
    orderId?: string; // Duffel order ID
}) {
    const supabase = await createClient();
    await supabase.from("bookings").update({
        state: data.state,
        offer_id: data.offerId,
        booking_reference: data.bookingReference,
        // error: data.error, // Add error column to DB if needed, currently not in SQL but useful
    }).eq("stripe_session_id", sessionId);
}

export async function getBooking(sessionId: string) {
    const supabase = await createClient();
    const { data } = await supabase.from("bookings").select("*").eq("stripe_session_id", sessionId).single();

    if (!data) return null;

    return {
        state: data.state as BookingState,
        offerId: data.offer_id,
        bookingReference: data.booking_reference,
        updatedAt: new Date(data.created_at).getTime() // Approximation
    };
}

export async function getBookingsByUser(email: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_email", email)
        .order("created_at", { ascending: false });

    return data || [];
}

export async function getAllBookings() {
    const supabase = await createClient();
    const { data } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

    return data || [];
}
