import { createClient } from "@/lib/supabase/server";
import { getAllBookings } from "@/lib/bookingStore";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

export const runtime = "nodejs";

export default async function AdminPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // STRICT ACCESS CONTROL
    // If not logged in OR email is not the admin email
    if (!user || user.email !== "lira.chefs@gmail.com") {
        redirect("/"); // Redirect unauthorized users to home
    }

    // Fetch Data
    const bookings = await getAllBookings();

    return (
        <main className="min-h-screen bg-background text-slate-900 dark:text-white pt-24 pb-20 px-4 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                            Painel Administrativo
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-gray-400">
                            Bem-vindo de volta, Administrador.
                        </p>
                    </div>
                </div>

                <AdminDashboardClient bookings={bookings} />
            </div>
        </main>
    );
}
