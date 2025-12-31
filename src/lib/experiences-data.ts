// Experience data for cabin class pages
// Contains top airlines and bottom airlines for comparison

export type ContentLanguage = 'pt' | 'en' | 'es';

export interface LocalizedString {
    pt: string;
    en: string;
    es: string;
}

export interface LocalizedList {
    pt: string[];
    en: string[];
    es: string[];
}

export interface AirlineExperience {
    code: string;
    name: string;
    country: LocalizedString;
    skytraxRating: number;
    slogan: LocalizedString;
    highlights: LocalizedList;
    hospitality: {
        crew: LocalizedString;
        dining: LocalizedString;
        lounge: LocalizedString;
        service: LocalizedString;
    };
    whyBest: LocalizedString;
    image: string;
}

export interface CabinClassData {
    slug: string;
    title: LocalizedString;
    subtitle: LocalizedString;
    description: LocalizedString;
    heroImage: string;
    accentColor: string;
    topAirlines: AirlineExperience[];
    worstAirlines: AirlineExperience[];
}

export const EXPERIENCES_DATA: Record<string, CabinClassData> = {
    'first-class': {
        slug: 'first-class',
        title: {
            pt: 'Primeira Classe',
            en: 'First Class',
            es: 'Primera Clase'
        },
        subtitle: {
            pt: 'O Máximo em Luxo',
            en: 'The Ultimate in Luxury',
            es: 'Lo Último en Lujo'
        },
        description: {
            pt: 'Experimente o auge das viagens áreas com suítes privativas, gastronomia gourmet e serviço inigualável. A Primeira Classe não é apenas um assento — é um destino em si.',
            en: 'Experience the pinnacle of air travel with private suites, gourmet dining, and unparalleled service. First Class isn\'t just a seat—it\'s a destination in itself.',
            es: 'Experimente la cumbre de los viajes aéreos con suites privadas, cena gourmet y un servicio sin igual. La Primera Clase no es solo un asiento — es un destino en sí mismo.'
        },
        heroImage: '/images/cabins/first-class.png',
        accentColor: 'amber',
        topAirlines: [
            {
                code: 'EK',
                name: 'Emirates',
                country: {
                    pt: 'Emirados Árabes Unidos',
                    en: 'United Arab Emirates',
                    es: 'Emiratos Árabes Unidos'
                },
                skytraxRating: 5,
                slogan: {
                    pt: 'Voe Melhor',
                    en: 'Fly Better',
                    es: 'Vuele Mejor'
                },
                highlights: {
                    pt: [
                        'Suítes Privativas com portas de correr',
                        'Shower Spa a bordo',
                        'Lounge e Bar a bordo',
                        'Transfers com motorista particular'
                    ],
                    en: [
                        'Private Suites with closing doors',
                        'Onboard Shower Spa',
                        'Onboard Lounge & Bar',
                        'Chauffeur-driven transfers'
                    ],
                    es: [
                        'Suites Privadas con puertas de cierre',
                        'Shower Spa a bordo',
                        'Lounge y Bar a bordo',
                        'Traslados con chófer'
                    ]
                },
                hospitality: {
                    crew: {
                        pt: 'Tripulação multilíngue treinada na Emirates Academy',
                        en: 'Multi-lingual cabin crew trained at Emirates Academy',
                        es: 'Tripulación multilingüe entrenada en la Emirates Academy'
                    },
                    dining: {
                        pt: 'Caviar ilimitado e refeições gourmet preparadas por chefs',
                        en: 'Unlimited caviar and gourmet meals prepared by chefs',
                        es: 'Caviar ilimitado y comidas gourmet preparadas por chefs'
                    },
                    lounge: {
                        pt: 'Lounges exclusivos com tratamentos de spa',
                        en: 'Exclusive lounges with spa treatments',
                        es: 'Lounges exclusivos con tratamientos de spa'
                    },
                    service: {
                        pt: 'Mordomo pessoal e kits Bulgari',
                        en: 'Personal butler and Bulgari kits',
                        es: 'Mayordomo personal y kits Bulgari'
                    }
                },
                whyBest: {
                    pt: 'Suítes privativas e chuveiro a bordo transformam a viagem.',
                    en: 'Private suites and onboard shower transform the journey.',
                    es: 'Suites privadas y ducha a bordo transforman el viaje.'
                },
                image: '/images/airlines/emirates-first.png?v=2'
            },
            {
                code: 'SQ',
                name: 'Singapore Airlines',
                country: {
                    pt: 'Singapura',
                    en: 'Singapore',
                    es: 'Singapur'
                },
                skytraxRating: 5,
                slogan: {
                    pt: 'Uma Ótima Maneira de Voar',
                    en: 'A Great Way to Fly',
                    es: 'Una Gran Forma de Volar'
                },
                highlights: {
                    pt: [
                        'Suíte Privativa com cama de casal',
                        'Seleção de menu "Book the Cook"',
                        'Assentos de couro feitos à mão',
                        'Acesso ao SilverKris Lounge'
                    ],
                    en: [
                        'Private Suite with double bed',
                        'Book the Cook menu selection',
                        'Handcrafted leather seats',
                        'SilverKris Lounge access'
                    ],
                    es: [
                        'Suite Privada con cama doble',
                        'Selección de menú "Book the Cook"',
                        'Asientos de cuero hechos a mano',
                        'Acceso al SilverKris Lounge'
                    ]
                },
                hospitality: {
                    crew: {
                        pt: 'A lendária "Singapore Girl" — tripulação conhecida pelo serviço impecável',
                        en: 'The legendary "Singapore Girl"—cabin crew known for impeccable service',
                        es: 'La legendaria "Singapore Girl": tripulación conocida por su servicio impecable'
                    },
                    dining: {
                        pt: '"Book the Cook" permite encomendar pratos de chefs celebridades',
                        en: '"Book the Cook" allows you to pre-order from celebrity chef menus',
                        es: '"Book the Cook" le permite reservar platos de chefs famosos'
                    },
                    lounge: {
                        pt: 'SilverKris First Class Lounge com salas de jantar privativas',
                        en: 'SilverKris First Class Lounge with private dining rooms',
                        es: 'SilverKris First Class Lounge con comedores privados'
                    },
                    service: {
                        pt: 'Serviço de abertura de cama com pijamas e telas HD de 24"',
                        en: 'Turn-down service with pajamas and 24" HD screens',
                        es: 'Servicio de preparación de cama con pijamas y pantallas HD de 24"'
                    }
                },
                whyBest: {
                    pt: 'Pioneira em camas de casal e serviço gracioso.',
                    en: 'Pioneer in double beds and gracious service.',
                    es: 'Pionera en camas dobles y un servicio elegante.'
                },
                image: '/images/airlines/singapore-first.png?v=2'
            },
            {
                code: 'EY',
                name: 'Etihad Airways',
                country: {
                    pt: 'Emirados Árabes Unidos',
                    en: 'United Arab Emirates',
                    es: 'Emiratos Árabes Unidos'
                },
                skytraxRating: 5,
                slogan: {
                    pt: 'Escolha Bem',
                    en: 'Choose Well',
                    es: 'Elija Bien'
                },
                highlights: {
                    pt: [
                        'The Residence — Suíte de 3 cômodos',
                        'Serviço de Mordomo pessoal',
                        'Refeições preparadas por chefs na suíte',
                        'Chauffeur e concierge'
                    ],
                    en: [
                        'The Residence—3-room suite',
                        'Personal Butler service',
                        'In-suite chef-prepared meals',
                        'Chauffeur and concierge'
                    ],
                    es: [
                        'The Residence: suite de 3 habitaciones',
                        'Servicio de mayordomo personal',
                        'Comidas preparadas por el chef en la suite',
                        'Chófer y conserje'
                    ]
                },
                hospitality: {
                    crew: {
                        pt: 'Mordomo dedicado treinado pela Savoy',
                        en: 'Dedicated Butler trained by Savoy butlers',
                        es: 'Mayordomo dedicado entrenado por los mayordomos de Savoy'
                    },
                    dining: {
                        pt: 'Jantar privativo na suíte com chef pessoal',
                        en: 'Private in-suite dining with your personal chef',
                        es: 'Cena privada en la suite con su chef personal'
                    },
                    lounge: {
                        pt: 'Hóspedes do Residence têm coleta de carro direta para a aeronave',
                        en: 'The Residence guests have exclusive car pickup directly to the aircraft',
                        es: 'Los huéspedes de The Residence tienen recogida exclusiva en coche directo al avión'
                    },
                    service: {
                        pt: 'Única companhia aérea com suíte de 3 quartos (quarto, banheiro e sala)',
                        en: 'The only airline with a 3-room suite featuring bedroom, bathroom, and living room',
                        es: 'La única aerolínea con una suite de 3 habitaciones con dormitorio, baño y sala de estar'
                    }
                },
                whyBest: {
                    pt: 'The Residence é o produto mais exclusivo já criado, um apartamento no céu.',
                    en: 'The Residence is the most exclusive airline product ever created, an apartment in the sky.',
                    es: 'The Residence es el producto de aerolínea más exclusivo jamás creado, un apartamento en el cielo.'
                },
                image: '/images/airlines/etihad-first.png?v=2'
            }
        ],
        worstAirlines: []
    },
    'business-class': {
        slug: 'business-class',
        title: {
            pt: 'Classe Executiva',
            en: 'Business Class',
            es: 'Clase Ejecutiva'
        },
        subtitle: {
            pt: 'Conforto de Classe Mundial',
            en: 'World-Class Comfort',
            es: 'Confort de Clase Mundial'
        },
        description: {
            pt: 'Experimente conforto premium com assentos que viram cama, serviços prioritários e gastronomia gourmet. A Classe Executiva oferece o equilíbrio perfeito entre produtividade e relaxamento.',
            en: 'Experience premium comfort with lie-flat seats, priority services, and gourmet dining. Business Class offers the perfect balance of productivity and relaxation.',
            es: 'Experimente el confort premium con asientos cama, servicios prioritarios y cena gourmet. La Clase Ejecutiva ofrece el equilibrio perfecto entre productividad y relajación.'
        },
        heroImage: '/images/cabins/business-class.png',
        accentColor: 'blue',
        topAirlines: [
            {
                code: 'QR',
                name: 'Qatar Airways',
                country: {
                    pt: 'Catar',
                    en: 'Qatar',
                    es: 'Catar'
                },
                skytraxRating: 5,
                slogan: {
                    pt: 'Indo a Lugares Juntos',
                    en: 'Going Places Together',
                    es: 'Yendo a Lugares Juntos'
                },
                highlights: {
                    pt: [
                        'Qsuite com portas de correr',
                        'Primeira cama de casal em Executiva',
                        'Jantar à la carte sob demanda',
                        'Al Mourjan Lounge'
                    ],
                    en: [
                        'Qsuite with closing doors',
                        'First double bed in Business',
                        'À la carte dining on demand',
                        'Al Mourjan Lounge'
                    ],
                    es: [
                        'Qsuite con puertas de cierre',
                        'Primera cama doble en Ejecutiva',
                        'Cena a la carta bajo demanda',
                        'Al Mourjan Lounge'
                    ]
                },
                hospitality: {
                    crew: {
                        pt: 'Tripulação de mais de 100 nacionalidades',
                        en: 'Cabin crew from over 100 nationalities providing personalized service',
                        es: 'Tripulación de más de 100 nacionalidades que brinda un servicio personalizado'
                    },
                    dining: {
                        pt: 'Menu "Dine on Demand" com pratos de chefs 5 estrelas',
                        en: 'À la carte "Dine on Demand" menu with dishes from 5-star chefs',
                        es: 'Menú a la carta "Dine on Demand" con platos de chefs de 5 estrellas'
                    },
                    lounge: {
                        pt: 'Al Mourjan Business Lounge — o maior do mundo',
                        en: 'Al Mourjan Business Lounge—largest in the world with spa and dining',
                        es: 'Al Mourjan Business Lounge: el más grande del mundo con spa y restaurante'
                    },
                    service: {
                        pt: 'Qsuite oferece privacidade sem precedentes',
                        en: 'Qsuite offers unprecedented privacy with closing doors',
                        es: 'Qsuite ofrece una privacidad sin precedentes con puertas de cierre'
                    }
                },
                whyBest: {
                    pt: 'Revolucionou a Classe Executiva com a Qsuite.',
                    en: 'Qatar revolutionized Business Class with the Qsuite—the first Business seat with closing doors.',
                    es: 'Qatar revolucionó la Clase Ejecutiva con la Qsuite: el primer asiento de Business con puertas de cierre.'
                },
                image: '/images/airlines/qatar-business.png?v=2'
            },
            {
                code: 'NH',
                name: 'ANA All Nippon Airways',
                country: {
                    pt: 'Japão',
                    en: 'Japan',
                    es: 'Japón'
                },
                skytraxRating: 5,
                slogan: {
                    pt: 'Inspiração do Japão',
                    en: 'Inspiration of Japan',
                    es: 'Inspiración de Japón'
                },
                highlights: {
                    pt: [
                        'THE Room — suíte privativa',
                        'Serviço "Omotenashi" japonês',
                        'Refeições estilo Kaiseki',
                        'ANA Lounge com sushi bar'
                    ],
                    en: [
                        'THE Room—private suite',
                        'Japanese omotenashi service',
                        'Kaiseki-style dining',
                        'ANA Lounge with sushi bar'
                    ],
                    es: [
                        'THE Room: suite privada',
                        'Servicio "Omotenashi" japonés',
                        'Cena estilo Kaiseki',
                        'ANA Lounge con barra de sushi'
                    ]
                },
                hospitality: {
                    crew: {
                        pt: '"Omotenashi" — a arte japonesa da hospitalidade',
                        en: '"Omotenashi"—the Japanese art of hospitality with anticipatory service',
                        es: '"Omotenashi": el arte japonés de la hospitalidad'
                    },
                    dining: {
                        pt: 'Refeições kaiseki tradicionais e seleção de saquê',
                        en: 'Traditional kaiseki multi-course meals and premium Japanese sake selection',
                        es: 'Comidas kaiseki tradicionales y selección de sake premium'
                    },
                    lounge: {
                        pt: 'ANA SUITE LOUNGE com sushi e noodle bar',
                        en: 'ANA SUITE LOUNGE with sushi bar, noodle bar, and Japanese bath amenities',
                        es: 'ANA SUITE LOUNGE con barra de sushi, fideos y amenidades japonesas'
                    },
                    service: {
                        pt: 'Atenção meticulosa aos detalhes e pijamas',
                        en: 'Meticulous attention to detail, from hot towel service to pajamas',
                        es: 'Atención meticulosa a los detalles y pijamas'
                    }
                },
                whyBest: {
                    pt: 'ANA traz precisão e hospitalidade japonesa ao céu com a "THE Room".',
                    en: 'ANA brings Japanese precision and hospitality to the sky. Their "THE Room" is a fully enclosed suite rivaling many First Class products, with impeccable service.',
                    es: 'ANA lleva el hospitalidad y la precisión japonesa al cielo con su suite "THE Room".'
                },
                image: '/images/airlines/ana-business.png?v=2'
            },
            {
                code: 'CX',
                name: 'Cathay Pacific',
                country: {
                    pt: 'Hong Kong',
                    en: 'Hong Kong',
                    es: 'Hong Kong'
                },
                skytraxRating: 5,
                slogan: {
                    pt: 'Vá Além',
                    en: 'Move Beyond',
                    es: 'Vaya Más Allá'
                },
                highlights: {
                    pt: [
                        'Aria Suite — maior da indústria',
                        'Acesso direto ao corredor para todos',
                        'The Pier First Class Lounge',
                        'Gastronomia estilo Hong Kong'
                    ],
                    en: [
                        'Aria Suite—largest in industry',
                        'Direct aisle access for all',
                        'The Pier First Class Lounge',
                        'Hong Kong style dining'
                    ],
                    es: [
                        'Aria Suite: la más grande de la industria',
                        'Acceso directo al pasillo para todos',
                        'The Pier First Class Lounge',
                        'Cena estilo Hong Kong'
                    ]
                },
                hospitality: {
                    crew: {
                        pt: 'Hospitalidade de Hong Kong com fluência em Cantonês e Mandarim',
                        en: 'Warm Hong Kong hospitality with Cantonese and Mandarin fluency',
                        es: 'Cálida hospitalidad de Hong Kong con fluidez en cantonés y mandarín'
                    },
                    dining: {
                        pt: 'Menu inspirado em Hong Kong com dim sum e opções internacionais',
                        en: 'Hong Kong-inspired menu with dim sum and international options',
                        es: 'Menú inspirado en Hong Kong con dim sum y opciones internacionales'
                    },
                    lounge: {
                        pt: 'The Pier Business Class Lounge — um dos mais premiados do mundo',
                        en: 'The Pier Business Class Lounge—one of the most awarded lounges globally',
                        es: 'The Pier Business Class Lounge: uno de los salones más premiados a nivel mundial'
                    },
                    service: {
                        pt: 'Serviço de abertura de cama com kits Bamford e fones redutores de ruído',
                        en: 'Turn-down service with Bamford amenity kits and noise-cancelling headphones',
                        es: 'Servicio de preparación de cama con kits Bamford y auriculares con cancelación de ruido'
                    }
                },
                whyBest: {
                    pt: 'A nova Aria Suite oferece 24 pés quadrados de espaço pessoal — o maior da Classe Executiva.',
                    en: 'Cathay\'s new Aria Suite offers 24 square feet of personal space—the largest in Business Class.',
                    es: 'La nueva Aria Suite de Cathay ofrece 24 pies cuadrados de espacio personal.'
                },
                image: '/images/airlines/cathay-business.png?v=2'
            },
        ],
        worstAirlines: []
    },
    'premium-economy': {
        slug: 'premium-economy',
        title: {
            pt: 'Econômica Premium',
            en: 'Premium Economy',
            es: 'Turista Premium'
        },
        subtitle: {
            pt: 'O Melhor Valor em Viagem',
            en: 'Best Value Travel',
            es: 'El Mejor Valor de Viaje'
        },
        description: {
            pt: 'Mais espaço, melhores refeições e serviços prioritários sem o preço da Primeira Classe. A Econômica Premium oferece o melhor valor para viajantes que buscam conforto.',
            en: 'More space, better meals, and priority services without the First Class price tag. Premium Economy offers the best value for comfort-conscious travelers.',
            es: 'Más espacio, mejores comidas y servicios prioritarios sin el precio de la Primera Clase. La Turista Premium ofrece el mejor valor para viajeros que buscan comodidad.'
        },
        heroImage: '/images/cabins/premium-economy.png',
        accentColor: 'rose',
        topAirlines: [
            {
                code: 'LH',
                name: 'Lufthansa',
                country: {
                    pt: 'Alemanha',
                    en: 'Germany',
                    es: 'Alemania'
                },
                skytraxRating: 5,
                slogan: {
                    pt: 'Diga Sim ao Mundo',
                    en: 'Say Yes to the World',
                    es: 'Di Sí al Mundo'
                },
                highlights: {
                    pt: [
                        'Allegris — assentos de nova geração',
                        '50% mais espaço pessoal',
                        'Fones redutores de ruído',
                        'Bebida de boas-vindas e kit'
                    ],
                    en: [
                        'Allegris—new generation seats',
                        '50% more personal space',
                        'Noise-cancelling headphones',
                        'Welcome drink & amenity kit'
                    ],
                    es: [
                        'Allegris: asientos de nueva generación',
                        '50% más espacio personal',
                        'Auriculares con cancelación de ruido',
                        'Bebida de bienvenida y kit'
                    ]
                },
                hospitality: {
                    crew: {
                        pt: 'Precisão e eficiência alemã com hospitalidade bávara',
                        en: 'German precision and efficiency combined with warm Bavarian hospitality',
                        es: 'Precisión y eficiencia alemana con hospitalidad bávara'
                    },
                    dining: {
                        pt: 'Menu estilo restaurante com vinhos alemães',
                        en: 'Restaurant-style menu with German wines and regional specialties',
                        es: 'Menú estilo restaurante con vinos alemanes'
                    },
                    lounge: {
                        pt: 'Acesso ao Business Lounge em aeroportos selecionados',
                        en: 'Business Lounge access at select airports',
                        es: 'Acceso a Business Lounge en aeroportos seleccionados'
                    },
                    service: {
                        pt: 'Kit de sustentabilidade e tela de entretenimento maior',
                        en: 'Sustainability kit, premium blanket, larger entertainment screen',
                        es: 'Kit de sostenibilidad y pantalla de entretenimiento más grande'
                    }
                },
                whyBest: {
                    pt: 'A nova Allegris oferece um dos espaços mais generosos da indústria.',
                    en: 'Lufthansa\'s new Allegris Premium Economy offers the most generous seat pitch in the industry—50% more space than Economy.',
                    es: 'La nueva Allegris de Lufthansa ofrece uno de los espacios más generosos de la industria.'
                },
                image: '/images/airlines/lufthansa-premium.png?v=2'
            },
            {
                code: 'AF',
                name: 'Air France',
                country: {
                    pt: 'França',
                    en: 'France',
                    es: 'Francia'
                },
                skytraxRating: 4,
                slogan: {
                    pt: 'A França está no Ar',
                    en: 'France is in the Air',
                    es: 'Francia está en el Aire'
                },
                highlights: {
                    pt: [
                        'Distância entre assentos de 40"',
                        'Gastronomia francesa',
                        'Check-in e embarque prioritários',
                        'Franquia de bagagem extra'
                    ],
                    en: [
                        '40" seat pitch',
                        'French gastronomy',
                        'Priority check-in & boarding',
                        'Extra baggage allowance'
                    ],
                    es: [
                        'Distancia entre asientos de 40"',
                        'Gastronomía francesa',
                        'Check-in y embarque prioritarios',
                        'Franquicia de equipaje extra'
                    ]
                },
                hospitality: {
                    crew: {
                        pt: 'Elegância francesa com tripulação multilíngue',
                        en: 'French elegance with multilingual crew',
                        es: 'Elegancia francesa con tripulación multilingüe'
                    },
                    dining: {
                        pt: 'Boas-vindas com champanhe e culinária francesa de chefs renomados',
                        en: 'Champagne welcome, French cuisine by acclaimed chefs',
                        es: 'Bienvenida con champán y cocina francesa de chefs aclamados'
                    },
                    lounge: {
                        pt: 'Acesso SkyPriority em todos os hubs da Air France',
                        en: 'SkyPriority access at all Air France hubs',
                        es: 'Acceso SkyPriority en todos los hubs de Air France'
                    },
                    service: {
                        pt: 'Kit de amenidades Clarins e sistema de entretenimento premium',
                        en: 'Clarins amenity kit, premium entertainment system',
                        es: 'Kit de amenidades Clarins y sistema de entretenimiento premium'
                    }
                },
                whyBest: {
                    pt: 'Air France traz sofisticação francesa à Econômica Premium.',
                    en: 'Air France brings French sophistication to Premium Economy with champagne welcome and gourmet French cuisine.',
                    es: 'Air France aporta sofisticación francesa a la Turista Premium con bienvenida de champán.'
                },
                image: '/images/airlines/airfrance-premium.png?v=2'
            },
            {
                code: 'VS',
                name: 'Virgin Atlantic',
                country: {
                    pt: 'Reino Unido',
                    en: 'United Kingdom',
                    es: 'Reino Unido'
                },
                skytraxRating: 4,
                slogan: {
                    pt: 'Desafie o Comum',
                    en: 'Defy Ordinary',
                    es: 'Desafía lo Ordinario'
                },
                highlights: {
                    pt: [
                        'Configuração de assentos sociais',
                        'Serviço de refeição premium',
                        'Bar cortesia',
                        'Acesso ao Clubhouse (em upgrade)'
                    ],
                    en: [
                        'Social seating configuration',
                        'Premium meal service',
                        'Complimentary bar',
                        'The Clubhouse access (at upgrade)'
                    ],
                    es: [
                        'Configuración de asientos sociales',
                        'Servicio de comida premium',
                        'Bar de cortesía',
                        'Acceso a Clubhouse (en ascenso)'
                    ]
                },
                hospitality: {
                    crew: {
                        pt: 'Chancela britânica com o espírito rebelde da Virgin',
                        en: 'British charm with Virgin\'s rebellious spirit',
                        es: 'Encanto británico con el espíritu rebelde de Virgin'
                    },
                    dining: {
                        pt: 'Bebidas cortesia durante todo o voo e serviço de refeição aprimorado',
                        en: 'Complimentary drinks throughout flight, enhanced meal service',
                        es: 'Bebidas de cortesía durante todo el vuelo y servicio de comida mejorado'
                    },
                    lounge: {
                        pt: 'Acesso ao Clubhouse disponível para upgrade',
                        en: 'Clubhouse access available for upgrade',
                        es: 'Acceso a Clubhouse disponible para ascenso'
                    },
                    service: {
                        pt: 'Tomadas elétricas, espaço extra para pernas e entretenimento premium',
                        en: 'Power outlets, extra legroom, premium entertainment',
                        es: 'Tomas de corriente, espacio extra para las piernas y entretenimiento premium'
                    }
                },
                whyBest: {
                    pt: 'Virgin Atlantic oferece um dos melhores produtos de Econômica Premium com um layout social único.',
                    en: 'Virgin Atlantic offers one of the best Premium Economy products with a unique social seating layout.',
                    es: 'Virgin Atlantic ofrece uno de los mejores productos de Turista Premium con un diseño social único.'
                },
                image: '/images/airlines/virgin-premium.png?v=2'
            },
        ],
        worstAirlines: []
    },
    'economy-class': {
        slug: 'economy-class',
        title: {
            pt: 'Classe Econômica',
            en: 'Economy Class',
            es: 'Clase Turista'
        },
        subtitle: {
            pt: 'O Melhor Valor em Viagem',
            en: 'Best Value Travel',
            es: 'El Mejor Valor de Viaje'
        },
        description: {
            pt: 'Valor excepcional não significa comprometer o conforto. As melhores Classes Econômicas oferecem espaço generoso, entretenimento e refeições gratuitas.',
            en: 'Exceptional value doesn\'t mean compromising on comfort. The world\'s best Economy Classes offer generous legroom, great entertainment, and complimentary meals.',
            es: 'Un valor excepcional no significa comprometer la comodidad. Las mejores clases económicas ofrecen amplio espacio, entretenimiento y comidas de cortesía.'
        },
        heroImage: '/images/cabins/economy-class.png',
        accentColor: 'emerald',
        topAirlines: [
            {
                code: 'QR',
                name: 'Qatar Airways',
                country: {
                    pt: 'Catar',
                    en: 'Qatar',
                    es: 'Catar'
                },
                skytraxRating: 5,
                slogan: {
                    pt: 'Indo a Lugares Juntos',
                    en: 'Going Places Together',
                    es: 'Yendo a Lugares Juntos'
                },
                highlights: {
                    pt: [
                        'Melhor Classe Econômica do Mundo',
                        'Entretenimento Oryx One',
                        'Espaço entre assentos de 32"',
                        'Refeições premium cortesia'
                    ],
                    en: [
                        'World\'s Best Economy Class',
                        'Oryx One entertainment',
                        '32" seat pitch',
                        'Complimentary premium meals'
                    ],
                    es: [
                        'La Mejor Clase Económica del Mundo',
                        'Entretenimiento Oryx One',
                        'Distancia entre asientos de 32"',
                        'Comidas premium de cortesía'
                    ]
                },
                hospitality: {
                    crew: {
                        pt: 'Comissários premiados com hospitalidade genuína',
                        en: 'Award-winning cabin crew with genuine hospitality',
                        es: 'Tripulación premiada con hospitalidad genuina'
                    },
                    dining: {
                        pt: 'Refeições multi-pratos cortesia com bebidas e cerveja/vinho',
                        en: 'Complimentary multi-course meals with soft drinks and beer/wine',
                        es: 'Comidas de varios platos gratuitas con refrescos y cerveza/vino'
                    },
                    lounge: {
                        pt: 'Passageiros da Econômica podem comprar acesso ao lounge',
                        en: 'Qatar Economy passengers can purchase lounge access',
                        es: 'Los pasajeros de Turista pueden comprar acceso a la sala VIP'
                    },
                    service: {
                        pt: 'Carregamento USB, WiFi disponível, manta e travesseiro premium',
                        en: 'USB charging, WiFi available, premium blanket and pillow',
                        es: 'Carga USB, WiFi disponible, manta y almohada premium'
                    }
                },
                whyBest: {
                    pt: 'A Qatar Airways venceu diversas vezes como a "Melhor Classe Econômica do Mundo".',
                    en: 'Qatar Airways has won "World\'s Best Economy Class" multiple times at Skytrax.',
                    es: 'Qatar Airways ha ganado "La Mejor Clase Económica del Mundo" varias veces.'
                },
                image: '/images/airlines/qatar-economy.png?v=2'
            },
            {
                code: 'EK',
                name: 'Emirates',
                country: {
                    pt: 'Emirados Árabes Unidos',
                    en: 'United Arab Emirates',
                    es: 'Emiratos Árabes Unidos'
                },
                skytraxRating: 5,
                slogan: {
                    pt: 'Voe Melhor',
                    en: 'Fly Better',
                    es: 'Vuele Mejor'
                },
                highlights: {
                    pt: [
                        'Sistema de entretenimento ICE',
                        'Mais de 3500 canais',
                        'Bebidas cortesia incluindo vinho',
                        'Refeições inspiradas regionalmente'
                    ],
                    en: [
                        'ICE entertainment system',
                        '3500+ channels',
                        'Complimentary drinks including wine',
                        'Regionally inspired meals'
                    ],
                    es: [
                        'Sistema de entretenimiento ICE',
                        'Más de 3500 canales',
                        'Bebidas de cortesía incluyendo vino',
                        'Comidas inspiradas regionalmente'
                    ]
                },
                hospitality: {
                    crew: {
                        pt: 'Tripulação multicultural fornecendo serviço caloroso',
                        en: 'Multi-cultural crew providing warm service',
                        es: 'Tripulación multicultural que brinda un servicio cálido'
                    },
                    dining: {
                        pt: 'Refeições e lanches cortesia, cerveja/vinho grátis em rotas internacionais',
                        en: 'Complimentary meals and snacks, free beer/wine on international routes',
                        es: 'Comidas y snacks gratuitos, cerveza/vino gratis en rutas internacionales'
                    },
                    lounge: {
                        pt: 'Passageiros da Econômica podem comprar acesso ao lounge',
                        en: 'Economy passengers can purchase lounge access',
                        es: 'Los pasajeros de Turista pueden comprar acceso a la sala VIP'
                    },
                    service: {
                        pt: 'Sistema ICE com mais de 5000 opções de entretenimento',
                        en: 'ICE system with 5000+ entertainment options, blanket and pillow',
                        es: 'Sistema ICE con más de 5000 opciones de entretenimiento'
                    }
                },
                whyBest: {
                    pt: 'O sistema ICE da Emirates é o sistema de entretenimento a bordo mais premiado.',
                    en: 'Emirates ICE is the most awarded inflight entertainment system with over 5000 channels.',
                    es: 'El sistema ICE de Emirates es el sistema de entretenimiento a bordo más premiado.'
                },
                image: '/images/airlines/emirates-economy.png?v=2'
            },
            {
                code: 'JL',
                name: 'Japan Airlines',
                country: {
                    pt: 'Japão',
                    en: 'Japan',
                    es: 'Japón'
                },
                skytraxRating: 5,
                slogan: {
                    pt: 'Voe para o Amanhã',
                    en: 'Fly into Tomorrow',
                    es: 'Vuela hacia el Mañana'
                },
                highlights: {
                    pt: [
                        'Hospitalidade japonesa',
                        'Espaço para as pernas tipo Econômica Premium',
                        'Culinária japonesa',
                        'Entretenimento com tela touch'
                    ],
                    en: [
                        'Japanese hospitality',
                        'Premium Economy-like legroom',
                        'Japanese cuisine',
                        'Touch-screen entertainment'
                    ],
                    es: [
                        'Hospitalidad japonesa',
                        'Espacio para las piernas similar a Turista Premium',
                        'Cocina japonesa',
                        'Entretenimiento con pantalla táctil'
                    ]
                },
                hospitality: {
                    crew: {
                        pt: 'Genuíno omotenashi japonês (hospitalidade)',
                        en: 'Genuine Japanese omotenashi (hospitality)',
                        es: 'Genuino omotenashi japonés (hospitalidad)'
                    },
                    dining: {
                        pt: 'Refeições japonesas e ocidentais cortesia com chá verde',
                        en: 'Complimentary Japanese and Western meals with green tea',
                        es: 'Comidas japonesas y occidentales de cortesía con té verde'
                    },
                    lounge: {
                        pt: 'Acesso ao lounge Oneworld para passageiros frequentes',
                        en: 'Oneworld lounge access for frequent flyers',
                        es: 'Acceso a la sala VIP de Oneworld para viajeros frecuentes'
                    },
                    service: {
                        pt: 'Toalhas quentes, chinelos em voos longos, energia USB',
                        en: 'Hot towels, slippers on long-haul, USB power',
                        es: 'Toallas calientes, pantuflas en vuelos largos, energía USB'
                    }
                },
                whyBest: {
                    pt: 'A JAL oferece um dos produtos de Econômica mais generosos.',
                    en: 'JAL offers one of the most generous Economy products with more legroom than competitors.',
                    es: 'JAL ofrece uno de los productos de Turista más generosos.'
                },
                image: '/images/airlines/jal-economy.png?v=2'
            },
        ],
        worstAirlines: []
    }
};

export function getExperienceBySlug(slug: string): CabinClassData | undefined {
    return EXPERIENCES_DATA[slug];
}

export function getAllExperiences(): CabinClassData[] {
    return Object.values(EXPERIENCES_DATA);
}
