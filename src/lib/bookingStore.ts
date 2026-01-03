
export type BookingState = "processing" | "confirmed" | "failed";

// Mock implementation since we removed Supabase
// In a real app without Supabase, this would connect to another DB (Postgres, Prisma, etc.)

export async function createBooking(
    sessionId: string,
    state: BookingState = "processing",
    userEmail: string | null = null,
    amount: number = 0,
    currency: string = 'EUR',
    passengerData: any = {},
    bookingReference: string | null = null
) {
    console.log("MOCK CREATE BOOKING", { sessionId, state, amount });
    return { error: null, data: { id: 'mock-id' } };
}

export async function updateBooking(sessionId: string, data: {
    state: BookingState;
    offerId?: string;
    bookingReference?: string;
    error?: string;
    orderId?: string;
}) {
    console.log("MOCK UPDATE BOOKING", { sessionId, data });
    return { error: null };
}

export async function getBooking(sessionId: string) {
    console.log("MOCK GET BOOKING", sessionId);
    // Return a dummy booking so checkout completion flow doesn't crash
    return {
        state: 'confirmed' as BookingState,
        offerId: 'mock-offer-id',
        bookingReference: 'MOCK-REF',
        updatedAt: Date.now()
    };
}

export async function getBookingsByUser(email: string) {
    console.log("MOCK GET BOOKINGS BY USER", email);
    return [];
}

export async function getAllBookings() {
    return [];
}
