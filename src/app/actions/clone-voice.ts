'use server';

export async function cloneVoice(formData: FormData) {
    try {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            throw new Error("Missing ELEVENLABS_API_KEY");
        }

        const file = formData.get('file') as File;
        const name = formData.get('name') as string || "My Cloned Voice";

        if (!file) {
            throw new Error("No file provided");
        }

        // Prepare FormData for external API
        const apiFormData = new FormData();
        apiFormData.append('name', name);
        // Explicitly use 'files' as key, complying with ElevenLabs API
        apiFormData.append('files', file, file.name || 'sample.mp3');
        apiFormData.append('description', 'Cloned via AllTrip Voice Studio');
        apiFormData.append('remove_background_noise', 'true'); // Enhance quality

        console.log("Cloning with Key:", apiKey ? `Present (${apiKey.slice(0, 8)}...)` : "Missing");

        const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
            method: 'POST',
            headers: {
                'xi-api-key': apiKey,
            },
            body: apiFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("ElevenLabs Clone Error Body:", errorText);

            let message = `Erro (${response.status})`;
            try {
                const json = JSON.parse(errorText);
                if (json.detail?.message) message = json.detail.message;
                else if (json.detail && typeof json.detail === 'string') message = json.detail;
                else if (json.message) message = json.message;
            } catch {
                if (errorText.length < 200) message += `: ${errorText}`;
            }

            if (response.status === 401) message = "Chave de API Inválida ou Expirada (401).";
            if (response.status === 403) message = "Acesso Negado (403). Verifique se seu plano permite isolamento de voz.";

            throw new Error(message);
        }

        const data = await response.json();
        return { success: true, voiceId: data.voice_id };

    } catch (error: any) {
        console.error("Clone Voice Action Error:", error);
        return { success: false, error: error.message };
    }
}
