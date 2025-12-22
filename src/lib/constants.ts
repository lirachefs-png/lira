export const SITE_CONFIG = {
    images: {
        destinations: {
            'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
            'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800&auto=format&fit=crop', // Verified Working URL
            'bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
            'mauritius': 'https://images.unsplash.com/photo-1542359649-31e03cd4d909?q=80&w=800&auto=format&fit=crop', // Verified Working URL
            'zanzibar': 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
            'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        } as Record<string, string>,
        defaults: {
            destination: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=800&q=80'
        }
    },
    stripe: {
        currency: 'eur',
        paymentMethods: ['card', 'mb_way', 'multibanco'] as Array<'card' | 'mb_way' | 'multibanco'>,
    },
    airlines: {
        partners: ['LA', 'AD', 'G3', 'TP', 'AA', 'UA', 'AF']
    }
} as const;
