'use server';

export async function saveUserPersona(personaData: any) {
    try {
        console.log("💾 Mock Save Persona (Auth Removed):", personaData);
        // Previously saved to Supabase. Now no-op.

        return { success: true };
    } catch (error: any) {
        console.error("❌ Error saving user persona:", error.message);
        return { success: false, error: error.message };
    }
}
