import { NextResponse } from "next/server";
import { getBooking } from "@/lib/bookingStore";

export const runtime = "nodejs";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("session_id") || "";

    // Fetch from Supabase via helper
    const data = await getBooking(sessionId);

    if (!data) {
        return NextResponse.json({ state: "processing" }); // default/fallback
    }
    return NextResponse.json(data);
}
