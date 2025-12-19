import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import VoiceStudio from "../components/VoiceStudio";

export default async function VoiceStudioPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== 'lira.chefs@gmail.com') {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                            Voice Studio
                        </h1>
                        <p className="text-slate-400 mt-2">
                            Clone e gerencie as vozes da Maya.
                        </p>
                    </div>
                </div>

                <div className="bg-[#151926] rounded-2xl border border-white/5 p-8 shadow-2xl">
                    <VoiceStudio />
                </div>
            </div>
        </div>
    );
}
