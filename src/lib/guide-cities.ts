// AllTrip Guide - Cities Database

export interface GuideCity {
    slug: string;
    name: string;
    country: string;
    iataCode: string;
    heroImage: string;
    tagline: string;
    rating: 1 | 2 | 3; // AllTrip Guide stars
}

export const GUIDE_CITIES: GuideCity[] = [
    {
        slug: 'dubai',
        name: 'Dubai',
        country: 'Emirados Árabes',
        iataCode: 'DXB',
        heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000',
        tagline: 'Onde o futuro encontra a tradição',
        rating: 3
    },
    {
        slug: 'paris',
        name: 'Paris',
        country: 'França',
        iataCode: 'CDG',
        heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000',
        tagline: 'A cidade das luzes e do romance',
        rating: 3
    },
    {
        slug: 'tokyo',
        name: 'Tóquio',
        country: 'Japão',
        iataCode: 'NRT',
        heroImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000',
        tagline: 'Tradição ancestral e inovação futurista',
        rating: 3
    },
    {
        slug: 'new-york',
        name: 'Nova Iorque',
        country: 'EUA',
        iataCode: 'JFK',
        heroImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2000',
        tagline: 'A cidade que nunca dorme',
        rating: 3
    },
    {
        slug: 'lisbon',
        name: 'Lisboa',
        country: 'Portugal',
        iataCode: 'LIS',
        heroImage: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?q=80&w=2000',
        tagline: 'Saudade, sol e sabores atlânticos',
        rating: 2
    },
    {
        slug: 'bangkok',
        name: 'Bangkok',
        country: 'Tailândia',
        iataCode: 'BKK',
        heroImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=2000',
        tagline: 'Templos dourados e street food lendária',
        rating: 2
    },
    {
        slug: 'rio',
        name: 'Rio de Janeiro',
        country: 'Brasil',
        iataCode: 'GIG',
        heroImage: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2000',
        tagline: 'Praias, samba e o Cristo Redentor',
        rating: 2
    },
    {
        slug: 'barcelona',
        name: 'Barcelona',
        country: 'Espanha',
        iataCode: 'BCN',
        heroImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2000',
        tagline: 'Gaudí, tapas e o Mediterrâneo',
        rating: 2
    }
];

export function getCityBySlug(slug: string): GuideCity | undefined {
    return GUIDE_CITIES.find(city => city.slug === slug);
}

export function getAllCitySlugs(): string[] {
    return GUIDE_CITIES.map(city => city.slug);
}
