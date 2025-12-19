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
    try {
        const res = await fetch(
            `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&content_filter=high`,
            {
                headers: {
                    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                },
                next: { revalidate: 3600 } // Cache for 1 hour
            }
        );

        if (!res.ok) return null;

        const data = await res.json();
        return data.urls?.regular || null;
    } catch (error) {
        console.error('Error fetching Unsplash image:', error);
        return null;
    }
}
