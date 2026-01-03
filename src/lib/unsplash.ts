const UNSPLASH_ACCESS_KEY = 'NY59ucdwCzNgNOe0hnqR50324AGg0y3RT76irKRoYFw'; // Hardcoded for now as requested

export interface UnsplashPhoto {
    id: string;
    urls: {
        regular: string;
        full: string;
    };
    user: {
        name: string;
    };
}

export async function getUnsplashImage(query: string): Promise<string | null> {
    // Fallback image (Tropical Beach) if API fails/limits
    const fallbackImage = 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop';

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const res = await fetch(
            `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&content_filter=high`,
            {
                headers: {
                    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                },
                signal: controller.signal,
                cache: 'no-store' // Don't cache to get different random images each time
            }
        );

        clearTimeout(timeoutId);

        if (!res.ok) return fallbackImage;

        const data = await res.json();
        return data.urls?.regular || fallbackImage;
    } catch (_error) {
        console.warn('Unsplash API unavailable, using fallback image');
        return fallbackImage;
    }
}
