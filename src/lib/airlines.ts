// Enhanced Premium Airline Partners Data with Cabin Classes
// NDC-enabled carriers with rich content and detailed cabin information

export interface CabinClass {
    name: 'First Class' | 'Business Class' | 'Premium Economy' | 'Economy';
    features: string[];
    highlights: string;
    image?: string;
}

export interface PremiumRoute {
    from: string;
    to: string;
    highlight: string;
}

export interface Airline {
    code: string;
    name: string;
    logo: string;
    category: 'luxury' | 'european' | 'latam' | 'lowcost';
    ndc: boolean;
    features: string[];
    description: string;
    homeBase: string;
    cabinClasses?: CabinClass[];
    premiumRoutes?: PremiumRoute[];
    fleetHighlight?: string;
}

export const PREMIUM_AIRLINES: Airline[] = [
    // 🌟 Luxury Tier
    {
        code: 'EK',
        name: 'Emirates',
        logo: '/airlines/emirates.svg',
        category: 'luxury',
        ndc: true,
        features: ['A380 Shower Spa', 'Primeira Classe com Suite Privada', 'Lounge Premium'],
        description: 'Experiência de luxo incomparável em rotas internacionais',
        homeBase: 'Dubai (DXB)',
        fleetHighlight: 'A380 com Shower Spa • Boeing 777 Premium',
        cabinClasses: [
            {
                name: 'First Class',
                highlights: 'Suite privada com portas deslizantes, Shower Spa no A380',
                features: [
                    'Suite privada totalmente fechada',
                    'Shower Spa e amenities Bulgari',
                    'Caviar e champagne Dom Pérignon',
                    'Chauffeur service completo',
                    'Entertainment 32" screen'
                ]
            },
            {
                name: 'Business Class',
                highlights: 'Lie-flat seats com acesso direto ao corredor',
                features: [
                    'Seats em configuração 1-2-1',
                    'Acesso direto ao corredor',
                    'Dining on demand',
                    'Lounge e Bar no A380',
                    'Amenity kit premium'
                ]
            },
            {
                name: 'Premium Economy',
                highlights: 'Extra conforto com upgrade de serviço',
                features: [
                    '40" de pitch entre assentos',
                    'Telas de 13.3"',
                    'Meals aprimoradas',
                    'Priority check-in',
                    'Bagagem extra incluída'
                ]
            }
        ],
        premiumRoutes: [
            { from: 'DXB', to: 'JFK', highlight: 'A380 Daily - First Class Suites' },
            { from: 'DXB', to: 'LHR', highlight: '6x Daily - Premium Service' },
            { from: 'DXB', to: 'SYD', highlight: 'World\'s longest A380 route' }
        ]
    },
    {
        code: 'QR',
        name: 'Qatar Airways',
        logo: '/airlines/qatar.svg',
        category: 'luxury',
        ndc: true,
        features: ['QSuites Business Class', 'Hamad International Lounge', '5-Star Skytrax'],
        description: 'Conectividade global premium via Doha',
        homeBase: 'Doha (DOH)',
        fleetHighlight: 'A350-1000 QSuites • B787 Dreamliner',
        cabinClasses: [
            {
                name: 'First Class',
                highlights: 'Award-winning service com suites privadas',
                features: [
                    'Suite privada com porta',
                    'Seats em couro premium',
                    'Dining by chef a bordo',
                    'Amenities by Diptyque',
                    'Al Mourjan Lounge access'
                ]
            },
            {
                name: 'Business Class',
                highlights: 'QSuites - World\'s Best Business Class',
                features: [
                    'Quad configuration disponível',
                    'Portas de privacidade deslizantes',
                    'Double bed option',
                    'Entertainment 21.5"',
                    'Premium dining experience'
                ]
            }
        ],
        premiumRoutes: [
            { from: 'DOH', to: 'JFK', highlight: 'QSuites Daily' },
            { from: 'DOH', to: 'SYD', highlight: 'A350-1000 Premium' },
            { from: 'DOH', to: 'LHR', highlight: '5x Daily QSuites' }
        ]
    },
    {
        code: 'SQ',
        name: 'Singapore Airlines',
        logo: '/airlines/singapore.svg',
        category: 'luxury',
        ndc: true,
        features: ['Suítes A380', 'Book the Cook', 'KrisFlyer Miles'],
        description: 'Referência mundial em serviço de bordo',
        homeBase: 'Singapore (SIN)',
        fleetHighlight: 'A380 Suites • A350 ULR',
        cabinClasses: [
            {
                name: 'First Class',
                highlights: 'Suites com cama separada e poltrona',
                features: [
                    'Suite com cama dupla disponível',
                    'Espaço privativo de 50 sq ft',
                    'Lalique amenities',
                    'Dom Pérignon e Krug',
                    'Book the Cook menu'
                ]
            },
            {
                name: 'Business Class',
                highlights: 'Award-winning seats e serviço',
                features: [
                    'Lie-flat 78" beds',
                    'Seats de couro italiano',
                    'Dining on demand 24h',
                    'Largest IFE screens',
                    'Priority everything'
                ]
            }
        ],
        premiumRoutes: [
            { from: 'SIN', to: 'JFK', highlight: 'A350 ULR Non-stop 18h' },
            { from: 'SIN', to: 'LHR', highlight: 'A380 Suites Daily' },
            { from: 'SIN', to: 'SYD', highlight: 'Multiple daily A380' }
        ]
    },
    {
        code: 'JL',
        name: 'Japan Airlines',
        logo: '/airlines/jal.svg',
        category: 'luxury',
        ndc: true,
        features: ['Sky Suite Business', 'JAL Lounge', 'Cuisine by Chefs'],
        description: 'Hospitalidade japonesa em rotas para Ásia',
        homeBase: 'Tokyo (NRT/HND)',
        fleetHighlight: 'B777-300ER Sky Suite • B787 Premium',
        cabinClasses: [
            {
                name: 'First Class',
                highlights: 'Omotenashi - Hospitalidade japonesa suprema',
                features: [
                    'JAL Suite totalmente privativa',
                    'Japanese kaiseki cuisine',
                    'Sake premium selection',
                    'Shiseido amenities',
                    'JAL First Lounge access'
                ]
            },
            {
                name: 'Business Class',
                highlights: 'Sky Suite III - Privacy e conforto',
                features: [
                    'JAL Shell flat neo seats',
                    'Full privacy dividers',
                    'Japanese + Western dining',
                    'Personal storage space',
                    'Exclusive JAL Lounge'
                ]
            }
        ],
        premiumRoutes: [
            { from: 'NRT', to: 'JFK', highlight: 'B777 Sky Suite' },
            { from: 'HND', to: 'LHR', highlight: 'Daily non-stop' },
            { from: 'NRT', to: 'SIN', highlight: 'Premium Asia connection' }
        ]
    },

    // 🇪🇺 European Leaders
    {
        code: 'TP',
        name: 'TAP Air Portugal',
        logo: '/airlines/tap.svg',
        category: 'european',
        ndc: true,
        features: ['Stopover em Lisboa Grátis', 'Miles&Go', 'Rotas para Brasil'],
        description: 'Parceiro essencial para o mercado lusófono',
        homeBase: 'Lisboa (LIS)',
        fleetHighlight: 'A330neo • A321LR',
        cabinClasses: [
            {
                name: 'Business Class',
                highlights: 'Executive Class com stopover grátis',
                features: [
                    'Lie-flat seats A330neo',
                    'Priority tudo incluído',
                    'Stopover Lisboa até 5 dias',
                    'Lounge TAP Premium',
                    'Portuguese wine selection'
                ]
            },
            {
                name: 'Economy',
                highlights: 'Stopover program único',
                features: [
                    'Stopover grátis em Lisboa',
                    'IFE completo',
                    'Meals inclusas',
                    'Miles&Go acúmulo',
                    'Conexões para Brasil'
                ]
            }
        ],
        premiumRoutes: [
            { from: 'LIS', to: 'GRU', highlight: 'A330neo Daily' },
            { from: 'LIS', to: 'JFK', highlight: 'Multiple daily' },
            { from: 'LIS', to: 'EWR', highlight: 'Business Class' }
        ]
    },
    {
        code: 'LH',
        name: 'Lufthansa',
        logo: '/airlines/lufthansa.svg',
        category: 'european',
        ndc: true,
        features: ['Star Alliance', 'First Class Terminal', 'Miles & More'],
        description: 'Líder europeu com hub em Frankfurt e Munique',
        homeBase: 'Frankfurt (FRA)',
        fleetHighlight: 'A380 First Class • B747-8',
        cabinClasses: [
            {
                name: 'First Class',
                highlights: 'First Class Terminal exclusivo em FRA',
                features: [
                    'Private terminal e transfer',
                    'Suites individuais',
                    'Caviar e champagne service',
                    'Lufthansa lounge exclusivo',
                    'Porcelain tableware'
                ]
            },
            {
                name: 'Business Class',
                highlights: 'Premium service através da Europa',
                features: [
                    'Lie-flat seats',
                    'Senator lounge access',
                    'Priority boarding',
                    'Gourmet dining',
                    'Miles & More status'
                ]
            }
        ],
        premiumRoutes: [
            { from: 'FRA', to: 'JFK', highlight: 'A380 First Class' },
            { from: 'MUC', to: 'SFO', highlight: 'Premium B747-8' },
            { from: 'FRA', to: 'SIN', highlight: 'Long-haul First' }
        ]
    },
    {
        code: 'AF',
        name: 'Air France',
        logo: '/airlines/airfrance.svg',
        category: 'european',
        ndc: true,
        features: ['La Première', 'SkyTeam', 'Flying Blue'],
        description: 'Elegância francesa em rotas globais',
        homeBase: 'Paris (CDG)',
        fleetHighlight: 'A350-900 • B777-300ER',
        cabinClasses: [
            {
                name: 'First Class',
                highlights: 'La Première - Luxury francesa suprema',
                features: [
                    'Suite privada com cama 2m',
                    'Michelin-star dining',
                    'Champagne Krug',
                    'Givenchy amenities',
                    'La Première Lounge CDG'
                ]
            },
            {
                name: 'Business Class',
                highlights: 'Seats full-flat em espinha de peixe',
                features: [
                    'Full-flat 2m beds',
                    'Direct aisle access',
                    'French gastronomy',
                    'Premium entertainment',
                    'Business lounge'
                ]
            }
        ],
        premiumRoutes: [
            { from: 'CDG', to: 'JFK', highlight: 'La Première A350' },
            { from: 'CDG', to: 'SIN', highlight: 'Daily Premium' },
            { from: 'CDG', to: 'DXB', highlight: 'Business Class' }
        ]
    },
    {
        code: 'BA',
        name: 'British Airways',
        logo: '/airlines/britishairways.svg',
        category: 'european',
        ndc: true,
        features: ['Club World', 'Avios', 'Oneworld Alliance'],
        description: 'Conectividade transatlântica e europeia',
        homeBase: 'London (LHR)',
        fleetHighlight: 'A350-1000 • B787 Dreamliner',
        cabinClasses: [
            {
                name: 'First Class',
                highlights: 'British luxury com elegância clássica',
                features: [
                    'Suite privada',
                    'Sleeper seats com colchão',
                    'Laurent-Perrier Champagne',
                    'The White Company amenities',
                    'Concorde Room lounge'
                ]
            },
            {
                name: 'Business Class',
                highlights: 'Club World com novo suite design',
                features: [
                    'Club Suite com porta',
                    'Direct aisle access',
                    'Do & Co catering',
                    'Galleries Club lounge',
                    'Priority boarding'
                ]
            }
        ],
        premiumRoutes: [
            { from: 'LHR', to: 'JFK', highlight: 'Multiple daily A350' },
            { from: 'LHR', to: 'SIN', highlight: 'A350-1000 Premium' },
            { from: 'LHR', to: 'DXB', highlight: 'First Class service' }
        ]
    },
    {
        code: 'IB',
        name: 'Iberia',
        logo: '/airlines/iberia.svg',
        category: 'european',
        ndc: true,
        features: ['Iberia Plus', 'Rotas para América Latina', 'Business Class'],
        description: 'Ponte entre Europa e América Latina',
        homeBase: 'Madrid (MAD)',
        fleetHighlight: 'A350-900 • A330-300',
        cabinClasses: [
            {
                name: 'Business Class',
                highlights: 'Premium comfort para América Latina',
                features: [
                    'Lie-flat seats',
                    'Spanish gastronomy',
                    'Dali VIP lounge',
                    'Priority services',
                    'Iberia Plus Avios'
                ]
            }
        ],
        premiumRoutes: [
            { from: 'MAD', to: 'GRU', highlight: 'A350 Premium' },
            { from: 'MAD', to: 'EZE', highlight: 'Daily non-stop' },
            { from: 'MAD', to: 'JFK', highlight: 'Business Class' }
        ]
    },

    // 🌎 Latin America
    {
        code: 'LA',
        name: 'LATAM Airlines',
        logo: '/airlines/latam.svg',
        category: 'latam',
        ndc: true,
        features: ['LATAM Pass', 'Maior rede da América do Sul', 'Premium Business'],
        description: 'Líder absoluto na América Latina',
        homeBase: 'Santiago (SCL) / São Paulo (GRU)',
        fleetHighlight: 'B787-9 • A350-900',
        cabinClasses: [
            {
                name: 'Business Class',
                highlights: 'Premium Business com culinária regional',
                features: [
                    'Lie-flat 180° seats',
                    'Latin American cuisine',
                    'Priority em toda rede',
                    'LATAM Lounge access',
                    'Oneworld benefits'
                ]
            },
            {
                name: 'Premium Economy',
                highlights: 'Conforto extra em voos longos',
                features: [
                    'Reclínio ampliado',
                    'Refeições premium',
                    'Priority check-in',
                    'Extra bagagem',
                    'LATAM Pass acúmulo'
                ]
            }
        ],
        premiumRoutes: [
            { from: 'GRU', to: 'JFK', highlight: 'B787 Premium' },
            { from: 'SCL', to: 'MAD', highlight: 'Daily A350' },
            { from: 'GRU', to: 'CDG', highlight: 'Business Class' }
        ]
    },

    // 💰 Low-Cost (High Tech)
    {
        code: 'VY',
        name: 'Vueling',
        logo: '/airlines/vueling.svg',
        category: 'lowcost',
        ndc: true,
        features: ['Preços Baixos Europa', 'App Mobile', 'Flexibilidade'],
        description: 'Low-cost com tecnologia NDC para tarifas transparentes',
        homeBase: 'Barcelona (BCN)',
        fleetHighlight: 'A320neo family',
        premiumRoutes: [
            { from: 'BCN', to: 'LIS', highlight: 'Multiple daily' },
            { from: 'BCN', to: 'CDG', highlight: 'Low-cost NDC' }
        ]
    },
];

// Helper functions
export const getAirlineByCode = (code: string): Airline | undefined => {
    return PREMIUM_AIRLINES.find(airline => airline.code === code);
};

export const getAirlinesByCategory = (category: Airline['category']): Airline[] => {
    return PREMIUM_AIRLINES.filter(airline => airline.category === category);
};

export const getNDCAirlines = (): Airline[] => {
    return PREMIUM_AIRLINES.filter(airline => airline.ndc);
};

export const getAirlinesWithFirstClass = (): Airline[] => {
    return PREMIUM_AIRLINES.filter(airline =>
        airline.cabinClasses?.some(cabin => cabin.name === 'First Class')
    );
};
