'use server';

import { createClient } from "@/lib/supabase/server";

export async function saveUserPersona(personaData: any) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error("Usuário não autenticado");
        }

        // Update user_metadata in Supabase Auth
        const { data, error } = await supabase.auth.updateUser({
            data: {
                persona: {
                    ...user.user_metadata.persona,
                    ...personaData,
                    last_interview_at: new Date().toISOString()
                }
            }
        });

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        console.error("❌ Error saving user persona:", error.message);
        return { success: false, error: error.message };
    }
}
