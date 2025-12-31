'use server';

import { groq } from "@/lib/groq";

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

// City code mapping for weather and flight lookups
// Keys include: city names (PT/EN), common variations, AND IATA codes (uppercase handled separately)
const cityToCode: Record<string, { code: string; name: string }> = {
    // Portugal (+ IATA codes)
    'lisboa': { code: 'LIS', name: 'Lisboa' }, 'lisbon': { code: 'LIS', name: 'Lisbon' }, 'lis': { code: 'LIS', name: 'Lisboa' },
    'porto': { code: 'OPO', name: 'Porto' }, 'opo': { code: 'OPO', name: 'Porto' },
    'faro': { code: 'FAO', name: 'Faro' }, 'fao': { code: 'FAO', name: 'Faro' },
    'madeira': { code: 'FNC', name: 'Madeira' }, 'funchal': { code: 'FNC', name: 'Funchal' },
    'açores': { code: 'PDL', name: 'Açores' }, 'azores': { code: 'PDL', name: 'Azores' },
    'ponta delgada': { code: 'PDL', name: 'Ponta Delgada' },
    // Spain
    'madrid': { code: 'MAD', name: 'Madrid' }, 'barcelona': { code: 'BCN', name: 'Barcelona' },
    'sevilha': { code: 'SVQ', name: 'Sevilha' }, 'seville': { code: 'SVQ', name: 'Seville' },
    'ibiza': { code: 'IBZ', name: 'Ibiza' }, 'mallorca': { code: 'PMI', name: 'Mallorca' },
    'tenerife': { code: 'TFS', name: 'Tenerife' },
    // France
    'paris': { code: 'CDG', name: 'Paris' },
    'nice': { code: 'NCE', name: 'Nice' }, 'niza': { code: 'NCE', name: 'Nice' },
    'lyon': { code: 'LYS', name: 'Lyon' }, 'marselha': { code: 'MRS', name: 'Marselha' },
    // UK
    'londres': { code: 'LHR', name: 'Londres' }, 'london': { code: 'LHR', name: 'London' },
    'manchester': { code: 'MAN', name: 'Manchester' }, 'edimburgo': { code: 'EDI', name: 'Edimburgo' },
    // Italy
    'roma': { code: 'FCO', name: 'Roma' }, 'rome': { code: 'FCO', name: 'Rome' },
    'milão': { code: 'MXP', name: 'Milão' }, 'milan': { code: 'MXP', name: 'Milan' },
    'veneza': { code: 'VCE', name: 'Veneza' }, 'venice': { code: 'VCE', name: 'Venice' },
    'florença': { code: 'FLR', name: 'Florença' }, 'florence': { code: 'FLR', name: 'Florence' },
    'napoles': { code: 'NAP', name: 'Nápoles' }, 'naples': { code: 'NAP', name: 'Naples' },
    // Holland
    'amsterdam': { code: 'AMS', name: 'Amsterdam' }, 'amesterdão': { code: 'AMS', name: 'Amesterdão' },
    // Germany
    'frankfurt': { code: 'FRA', name: 'Frankfurt' },
    'munique': { code: 'MUC', name: 'Munique' }, 'munich': { code: 'MUC', name: 'Munich' },
    'berlim': { code: 'BER', name: 'Berlim' }, 'berlin': { code: 'BER', name: 'Berlin' },
    // Switzerland/Austria
    'zurique': { code: 'ZRH', name: 'Zurique' }, 'zurich': { code: 'ZRH', name: 'Zurich' },
    'viena': { code: 'VIE', name: 'Viena' }, 'vienna': { code: 'VIE', name: 'Vienna' },
    'genebra': { code: 'GVA', name: 'Genebra' }, 'geneva': { code: 'GVA', name: 'Geneva' },
    // Nordic
    'copenhaga': { code: 'CPH', name: 'Copenhaga' }, 'copenhagen': { code: 'CPH', name: 'Copenhagen' },
    'estocolmo': { code: 'ARN', name: 'Estocolmo' }, 'stockholm': { code: 'ARN', name: 'Stockholm' },
    'oslo': { code: 'OSL', name: 'Oslo' }, 'helsinki': { code: 'HEL', name: 'Helsinki' },
    // Middle East
    'dubai': { code: 'DXB', name: 'Dubai' },
    'abu dhabi': { code: 'AUH', name: 'Abu Dhabi' }, 'doha': { code: 'DOH', name: 'Doha' },
    // USA
    'nova iorque': { code: 'JFK', name: 'Nova Iorque' }, 'new york': { code: 'JFK', name: 'New York' },
    'los angeles': { code: 'LAX', name: 'Los Angeles' }, 'miami': { code: 'MIA', name: 'Miami' },
    'orlando': { code: 'MCO', name: 'Orlando' }, 'las vegas': { code: 'LAS', name: 'Las Vegas' },
    'boston': { code: 'BOS', name: 'Boston' }, 'chicago': { code: 'ORD', name: 'Chicago' },
    'san francisco': { code: 'SFO', name: 'San Francisco' },
    // Brazil - Major cities (+ IATA codes)
    'são paulo': { code: 'GRU', name: 'São Paulo' }, 'sao paulo': { code: 'GRU', name: 'São Paulo' }, 'gru': { code: 'GRU', name: 'São Paulo' },
    'rio de janeiro': { code: 'GIG', name: 'Rio de Janeiro' }, 'rio': { code: 'GIG', name: 'Rio' }, 'gig': { code: 'GIG', name: 'Rio de Janeiro' },
    'brasilia': { code: 'BSB', name: 'Brasília' }, 'brasília': { code: 'BSB', name: 'Brasília' }, 'bsb': { code: 'BSB', name: 'Brasília' },
    'salvador': { code: 'SSA', name: 'Salvador' }, 'bahia': { code: 'SSA', name: 'Bahia' }, 'ssa': { code: 'SSA', name: 'Salvador' },
    'recife': { code: 'REC', name: 'Recife' }, 'rec': { code: 'REC', name: 'Recife' },
    'fortaleza': { code: 'FOR', name: 'Fortaleza' }, 'for': { code: 'FOR', name: 'Fortaleza' },
    'natal': { code: 'NAT', name: 'Natal' }, 'nat': { code: 'NAT', name: 'Natal' },
    'joao pessoa': { code: 'JPA', name: 'João Pessoa' }, 'joão pessoa': { code: 'JPA', name: 'João Pessoa' }, 'jpa': { code: 'JPA', name: 'João Pessoa' },
    'maceio': { code: 'MCZ', name: 'Maceió' }, 'maceió': { code: 'MCZ', name: 'Maceió' }, 'mcz': { code: 'MCZ', name: 'Maceió' },
    'porto alegre': { code: 'POA', name: 'Porto Alegre' }, 'poa': { code: 'POA', name: 'Porto Alegre' },
    'florianopolis': { code: 'FLN', name: 'Florianópolis' }, 'florianópolis': { code: 'FLN', name: 'Florianópolis' }, 'fln': { code: 'FLN', name: 'Florianópolis' },
    'curitiba': { code: 'CWB', name: 'Curitiba' }, 'cwb': { code: 'CWB', name: 'Curitiba' },
    'belo horizonte': { code: 'CNF', name: 'Belo Horizonte' }, 'cnf': { code: 'CNF', name: 'Belo Horizonte' },
    'manaus': { code: 'MAO', name: 'Manaus' }, 'mao': { code: 'MAO', name: 'Manaus' },
    'belem': { code: 'BEL', name: 'Belém' }, 'belém': { code: 'BEL', name: 'Belém' }, 'bel': { code: 'BEL', name: 'Belém' },
    'fernando de noronha': { code: 'FEN', name: 'Fernando de Noronha' }, 'noronha': { code: 'FEN', name: 'Fernando de Noronha' }, 'fen': { code: 'FEN', name: 'Fernando de Noronha' },
    // Southeast Asia - THAILAND
    'tailândia': { code: 'BKK', name: 'Tailândia (Bangkok)' },
    'tailandia': { code: 'BKK', name: 'Tailândia (Bangkok)' },
    'thailand': { code: 'BKK', name: 'Thailand (Bangkok)' },
    'bangkok': { code: 'BKK', name: 'Bangkok' },
    'phuket': { code: 'HKT', name: 'Phuket' },
    // Singapore
    'singapura': { code: 'SIN', name: 'Singapura' }, 'singapore': { code: 'SIN', name: 'Singapore' },
    // Japan
    'tóquio': { code: 'NRT', name: 'Tóquio' }, 'tokyo': { code: 'NRT', name: 'Tokyo' },
    'japão': { code: 'NRT', name: 'Japão (Tokyo)' }, 'japan': { code: 'NRT', name: 'Japan (Tokyo)' },
    'osaka': { code: 'KIX', name: 'Osaka' }, 'kyoto': { code: 'KIX', name: 'Kyoto' },
    // China/HK
    'hong kong': { code: 'HKG', name: 'Hong Kong' }, 'pequim': { code: 'PEK', name: 'Pequim' },
    'beijing': { code: 'PEK', name: 'Beijing' }, 'xangai': { code: 'PVG', name: 'Xangai' },
    'shanghai': { code: 'PVG', name: 'Shanghai' },
    // Australia
    'sydney': { code: 'SYD', name: 'Sydney' }, 'melbourne': { code: 'MEL', name: 'Melbourne' },
    // Mexico/Caribbean
    'cancun': { code: 'CUN', name: 'Cancún' }, 'cancún': { code: 'CUN', name: 'Cancún' },
    'mexico': { code: 'MEX', name: 'Cidade do México' }, 'cidade do mexico': { code: 'MEX', name: 'Cidade do México' },
    // Indonesia
    'bali': { code: 'DPS', name: 'Bali' }, 'indonesia': { code: 'DPS', name: 'Indonésia (Bali)' },
    // Maldives
    'maldivas': { code: 'MLE', name: 'Maldivas' }, 'maldives': { code: 'MLE', name: 'Maldives' },
    // Morocco
    'marrakech': { code: 'RAK', name: 'Marrakech' }, 'marrocos': { code: 'RAK', name: 'Marrocos (Marrakech)' },
    // Greece
    'atenas': { code: 'ATH', name: 'Atenas' }, 'athens': { code: 'ATH', name: 'Athens' },
    'grécia': { code: 'ATH', name: 'Grécia (Atenas)' }, 'greece': { code: 'ATH', name: 'Greece (Athens)' },
    'santorini': { code: 'JTR', name: 'Santorini' }, 'mykonos': { code: 'JMK', name: 'Mykonos' },
    // Turkey
    'istambul': { code: 'IST', name: 'Istambul' }, 'istanbul': { code: 'IST', name: 'Istanbul' },
    'turquia': { code: 'IST', name: 'Turquia (Istambul)' },
    // Egypt
    'cairo': { code: 'CAI', name: 'Cairo' }, 'egito': { code: 'CAI', name: 'Egito (Cairo)' },
    // South Africa
    'cidade do cabo': { code: 'CPT', name: 'Cidade do Cabo' }, 'cape town': { code: 'CPT', name: 'Cape Town' },
    'joanesburgo': { code: 'JNB', name: 'Joanesburgo' }, 'johannesburg': { code: 'JNB', name: 'Johannesburg' },
    // Argentina
    'buenos aires': { code: 'EZE', name: 'Buenos Aires' }, 'argentina': { code: 'EZE', name: 'Argentina (Buenos Aires)' },
    // Colombia
    'bogota': { code: 'BOG', name: 'Bogotá' }, 'bogotá': { code: 'BOG', name: 'Bogotá' },
    'cartagena': { code: 'CTG', name: 'Cartagena' },
    // Chile
    'santiago': { code: 'SCL', name: 'Santiago' }, 'chile': { code: 'SCL', name: 'Chile (Santiago)' },
    // Peru
    'lima': { code: 'LIM', name: 'Lima' }, 'peru': { code: 'LIM', name: 'Peru (Lima)' },
    'cusco': { code: 'CUZ', name: 'Cusco' }, 'machu picchu': { code: 'CUZ', name: 'Machu Picchu (Cusco)' },
    // French Polynesia
    'polinesia francesa': { code: 'PPT', name: 'Polinésia Francesa (Tahiti)' },
    'polinésia francesa': { code: 'PPT', name: 'Polinésia Francesa (Tahiti)' },
    'french polynesia': { code: 'PPT', name: 'French Polynesia (Tahiti)' },
    'tahiti': { code: 'PPT', name: 'Tahiti' },
    'bora bora': { code: 'BOB', name: 'Bora Bora' },
    'moorea': { code: 'MOZ', name: 'Moorea' },
    // Fiji
    'fiji': { code: 'NAN', name: 'Fiji' },
    // Seychelles
    'seychelles': { code: 'SEZ', name: 'Seychelles' },
    // Mauritius
    'mauricias': { code: 'MRU', name: 'Maurícias' }, 'mauritius': { code: 'MRU', name: 'Mauritius' },
    // New Zealand
    'nova zelandia': { code: 'AKL', name: 'Nova Zelândia (Auckland)' },
    'nova zelândia': { code: 'AKL', name: 'Nova Zelândia (Auckland)' },
    'new zealand': { code: 'AKL', name: 'New Zealand (Auckland)' },
    'auckland': { code: 'AKL', name: 'Auckland' },
    // Hawaii
    'havai': { code: 'HNL', name: 'Havaí (Honolulu)' }, 'havaí': { code: 'HNL', name: 'Havaí (Honolulu)' },
    'hawaii': { code: 'HNL', name: 'Hawaii (Honolulu)' }, 'honolulu': { code: 'HNL', name: 'Honolulu' },
    // Caribbean
    'barbados': { code: 'BGI', name: 'Barbados' },
    'jamaica': { code: 'MBJ', name: 'Jamaica' },
    'punta cana': { code: 'PUJ', name: 'Punta Cana' },
    'aruba': { code: 'AUA', name: 'Aruba' },
    'curacao': { code: 'CUR', name: 'Curaçao' }, 'curaçao': { code: 'CUR', name: 'Curaçao' },
};

// Lookup any IATA code or city name via Duffel API (for codes not in static list)
async function lookupLocation(query: string): Promise<{ code: string; name: string } | null> {
    const normalizedQuery = query.toLowerCase().trim();

    // First check static list
    if (cityToCode[normalizedQuery]) {
        return cityToCode[normalizedQuery];
    }

    // Check if it's a 3-letter IATA code pattern
    const isIataCode = /^[a-z]{3}$/i.test(query.trim());

    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/locations?query=${encodeURIComponent(query)}`, {
            cache: 'no-store'
        });

        if (!response.ok) return null;

        const data = await response.json();
        const results = data.data || [];

        if (results.length > 0) {
            // For IATA code searches, find exact match
            if (isIataCode) {
                const exactMatch = results.find((r: any) =>
                    r.iata_code?.toLowerCase() === normalizedQuery
                );
                if (exactMatch) {
                    return {
                        code: exactMatch.iata_code,
                        name: exactMatch.city_name || exactMatch.name
                    };
                }
            }

            // Return first result
            const first = results[0];
            return {
                code: first.iata_code,
                name: first.city_name || first.name
            };
        }
    } catch (error) {
        console.error('Location lookup error:', error);
    }

    return null;
}

import { getWeatherForCity } from "@/services/weather";

async function fetchWeatherForCity(cityName: string): Promise<string | null> {
    const normalizedCity = cityName.toLowerCase().trim();
    const cityData = cityToCode[normalizedCity];

    if (!cityData) return null;

    try {
        const weatherResult = await getWeatherForCity(cityData.code); // Direct service call

        if (!weatherResult) return null;

        const { current, forecast } = weatherResult;

        let weatherInfo = `**Clima em ${current.location}:**\n`;
        weatherInfo += `${current.weatherDescription}\n`;
        weatherInfo += `🌡️ Agora: ${current.temperature}°C (Máx: ${current.temperatureMax}°C, Mín: ${current.temperatureMin}°C)\n`;
        weatherInfo += `💧 Humidade: ${current.humidity}% | 💨 Vento: ${current.windSpeed} km/h\n\n`;

        if (forecast.length > 0) {
            weatherInfo += `**Próximos dias:**\n`;
            forecast.slice(0, 3).forEach((day: any) => {
                const date = new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' });
                weatherInfo += `${day.emoji} ${date}: ${day.tempMax}°C / ${day.tempMin}°C\n`;
            });
            weatherInfo += '\n';
        }

        weatherInfo += `👕 **Sugestão:** ${current.suggestion}`;

        return weatherInfo;
    } catch (error) {
        console.error('Weather fetch error:', error);
        return null;
    }
}

// Extract city from weather-related questions
function extractCityFromWeatherQuestion(text: string): string | null {
    const patterns = [
        /(?:clima|tempo|weather|temperature)\s+(?:em|in|para|for|de)\s+([a-záàâãéèêíïóôõöúüç\s]+)/i,
        /(?:como\s+(?:está|vai\s+estar)|how\s+is)\s+(?:o\s+)?(?:tempo|clima|weather)\s+(?:em|in)\s+([a-záàâãéèêíïóôõöúüç\s]+)/i,
        /([a-záàâãéèêíïóôõöúüç]+)\s+(?:clima|tempo|weather)/i,
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            return match[1].trim();
        }
    }
    return null;
}

// Detect flight search intent and extract destination/origin
function extractFlightSearchIntent(text: string, conversationHistory?: ChatMessage[]): { destination: string; origin?: string; dateHint?: string } | null {
    const lowerText = text.toLowerCase();

    // Check if user is asking about flights/travel
    const flightKeywords = ['voo', 'voos', 'voar', 'flight', 'flights', 'fly', 'viajar', 'viagem', 'ir para', 'ir a', 'passagem', 'passagens', 'bilhete', 'ticket', 'barato', 'cheap', 'buscar', 'search', 'procurar', 'encontrar', 'preciso', 'quero', 'want', 'need', 'gostaria', 'saindo', 'partindo', 'origem'];
    const hasFlightIntent = flightKeywords.some(keyword => lowerText.includes(keyword));

    if (!hasFlightIntent) return null;

    // Try to extract origin (saindo de X, from X, de X para Y, partindo de X)
    let origin: string | undefined;
    const originPatterns = [
        // "saindo/partindo/vindo de São Paulo para Paris" - explicit structure
        /(?:saindo|partindo|vindo|viajando)\s+(?:de|do|da|from)\s+([a-záàâãéèêíïóôõöúüç\s]+?)(?:\s+para|\s+to)/i,
        // "saindo de São Paulo (qualquer coisa depois)" - flexible
        /(?:saindo|partindo|vindo|viajando|sair|partir)\s+(?:de|do|da|from)\s+([a-záàâãéèêíïóôõöúüç]{3,}(?:\s+[a-záàâãéèêíïóôõöúüç]+)?)\s+/i,
        // "de São Paulo para Paris" - X para Y format
        /^(?:voos?\s+)?de\s+([a-záàâãéèêíïóôõöúüç\s]+?)\s+(?:para|to|a)\s+/i,
        // "origem São Paulo" or "saída de Recife" or "partida de X"
        /(?:origem|saída|partida|decolagem)\s+(?:de|do|da|em|:)?\s*([a-záàâãéèêíïóôõöúüç\s]+)/i,
        // "minha cidade é São Paulo" - context
        /(?:minha\s+cidade|estou\s+em|moro\s+em|partir\s+de)\s+([a-záàâãéèêíïóôõöúüç\s]+)/i,
    ];
    for (const pattern of originPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            const originCity = match[1].trim().toLowerCase();
            if (cityToCode[originCity]) {
                origin = originCity;
                break;
            }
        }
    }

    // Try to extract destination - first try exact city names
    const destPatterns = [
        // "destino paris" or "chegada em paris"
        /(?:destino|chegada)\s+(?:em|a|:)?\s*([a-záàâãéèêíïóôõöúüç]+(?:\s+[a-záàâãéèêíïóôõöúüç]+)?)/i,
        // "para Paris" - captura até espaço + palavra não-cidade
        /(?:para|to|a)\s+([a-záàâãéèêíïóôõöúüç]+(?:\s+[a-záàâãéèêíïóôõöúüç]+)?)/i,
        /(?:voo|voos|flight|flights)\s+(?:para|to|a)\s+([a-záàâãéèêíïóôõöúüç\s]+)/i,
        /(?:ir|viajar|fly)\s+(?:para|to|a)\s+([a-záàâãéèêíïóôõöúüç\s]+)/i,
        /(?:passagem|passagens|bilhete|ticket)\s+(?:para|to|a)\s+([a-záàâãéèêíïóôõöúüç\s]+)/i,
        /(?:buscar|search|procurar)\s+(?:voos?\s+)?(?:para|to)?\s+([a-záàâãéèêíïóôõöúüç\s]+)/i,
    ];

    for (const pattern of destPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            let destination = match[1].trim().toLowerCase();

            // Direct match
            if (cityToCode[destination]) {
                // Try to extract date hints
                let dateHint: string | undefined;
                const monthMatch = text.match(/(?:em|in)\s+(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|january|february|march|april|may|june|july|august|september|october|november|december)/i);
                if (monthMatch) {
                    dateHint = monthMatch[1];
                }
                const weekMatch = text.match(/(próxima\s+semana|next\s+week|semana\s+que\s+vem)/i);
                if (weekMatch) {
                    dateHint = 'próxima semana';
                }

                return { destination, origin, dateHint };
            }

            // Try first word only (e.g., "paris busy" -> "paris")
            const firstWord = destination.split(/\s+/)[0];
            if (firstWord && cityToCode[firstWord]) {
                let dateHint: string | undefined;
                const monthMatch = text.match(/(?:em|in)\s+(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|january|february|march|april|may|june|july|august|september|october|november|december)/i);
                if (monthMatch) {
                    dateHint = monthMatch[1];
                }
                return { destination: firstWord, origin, dateHint };
            }

            // Try partial match for common misspellings like "tailandi" -> "tailândia"
            for (const cityKey of Object.keys(cityToCode)) {
                if (cityKey.startsWith(destination.substring(0, 5)) || destination.startsWith(cityKey.substring(0, 5))) {
                    let dateHint: string | undefined;
                    const monthMatch = text.match(/(?:em|in)\s+(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)/i);
                    if (monthMatch) {
                        dateHint = monthMatch[1];
                    }
                    return { destination: cityKey, origin, dateHint };
                }
            }
        }
    }

    // If "buscar" keyword is present but no destination was found, look in conversation history
    if ((lowerText.includes('buscar') || lowerText.includes('busque') || lowerText.includes('search') || lowerText.includes('procurar') || lowerText.includes('veja')) && conversationHistory) {
        // Extract origin from current message first (saindo de X, de X)
        for (const pattern of originPatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                const originCity = match[1].trim().toLowerCase();
                if (cityToCode[originCity]) {
                    origin = originCity;
                    break;
                }
            }
        }

        // Extract date hint from current message
        let dateHint: string | undefined;
        const monthMatch = text.match(/(?:em|in|para)\s+(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|january|february|march|april|may|june|july|august|september|october|november|december)/i);
        if (monthMatch) {
            dateHint = monthMatch[1];
        }

        // Search backwards through USER messages for flight route patterns (de X para Y, X to Y)
        const routePatterns = [
            /(?:de|from)\s+([a-záàâãéèêíïóôõöúüç\s]{2,20})\s+(?:para|to|a)\s+([a-záàâãéèêíïóôõöúüç\s]{2,20})/i,
            /([a-z]{3})\s+(?:para|to|a|→)\s+([a-z]{3})/i, // IATA codes: GRU para NRT
        ];

        for (let i = conversationHistory.length - 1; i >= 0; i--) {
            const msg = conversationHistory[i];
            // Only check USER messages for routes
            if (msg.role !== 'user') continue;

            const msgLower = msg.content.toLowerCase();

            // Try to find a route pattern
            for (const pattern of routePatterns) {
                const match = msgLower.match(pattern);
                if (match && match[1] && match[2]) {
                    const potentialOrigin = match[1].trim().toLowerCase();
                    const potentialDest = match[2].trim().toLowerCase();

                    // Validate both are valid cities/codes
                    const originData = cityToCode[potentialOrigin];
                    const destData = cityToCode[potentialDest];

                    if (destData) {
                        // Found a valid destination
                        return {
                            destination: potentialDest,
                            origin: originData ? potentialOrigin : origin,
                            dateHint
                        };
                    }
                }
            }
        }
    }

    return null;
}

// Generate search URL for flights (async to support dynamic lookup)
async function generateSearchUrl(destination: string, origin?: string, dateHint?: string): Promise<{ url: string; displayText: string }> {
    // Try static lookup first, then Duffel API
    let destData = cityToCode[destination.toLowerCase()];
    if (!destData) {
        const lookup = await lookupLocation(destination);
        if (lookup) {
            destData = lookup;
        } else {
            return { url: '/search', displayText: 'Buscar Voos' };
        }
    }

    // Use origin if provided, otherwise default to Lisboa
    let originCode = 'LIS';
    let originName = 'Lisboa';

    if (origin) {
        let originData = cityToCode[origin.toLowerCase()];
        if (!originData) {
            const lookup = await lookupLocation(origin);
            if (lookup) originData = lookup;
        }
        if (originData) {
            originCode = originData.code;
            originName = originData.name;
        }
    }

    // Calculate departure date based on hint
    let departureDate = new Date();
    if (dateHint === 'próxima semana' || dateHint === 'next week') {
        departureDate.setDate(departureDate.getDate() + 7);
    } else if (dateHint) {
        // Month mapping
        const months: Record<string, number> = {
            'janeiro': 0, 'january': 0, 'fevereiro': 1, 'february': 1,
            'março': 2, 'march': 2, 'abril': 3, 'april': 3,
            'maio': 4, 'may': 4, 'junho': 5, 'june': 5,
            'julho': 6, 'july': 6, 'agosto': 7, 'august': 7,
            'setembro': 8, 'september': 8, 'outubro': 9, 'october': 9,
            'novembro': 10, 'november': 10, 'dezembro': 11, 'december': 11,
        };
        const monthNum = months[dateHint.toLowerCase()];
        if (monthNum !== undefined) {
            departureDate = new Date(departureDate.getFullYear(), monthNum, 15);
            if (departureDate < new Date()) {
                departureDate.setFullYear(departureDate.getFullYear() + 1);
            }
        }
    } else {
        // Default to 2 weeks from now
        departureDate.setDate(departureDate.getDate() + 14);
    }

    const dateStr = departureDate.toISOString().split('T')[0];

    // Build search URL with flexible dates enabled
    const params = new URLSearchParams({
        origin: originCode,
        destination: destData.code,
        date: dateStr,
        passengers: '1',
        cabin: 'economy',
        flexible: 'true', // Enable flexible dates
    });

    return {
        url: `/search?${params.toString()}`,
        displayText: `🔍 Buscar voos ${originName} → ${destData.name}`
    };
}

import { createClient } from "@/lib/supabase/server";
import { retrieveRelevantMemories, storeMemory } from "@/services/memory";

export async function chatWithMaya(messages: ChatMessage[], userTimezone?: string) {
    try {
        if (!process.env.GROQ_API_KEY) {
            return "**Maya (Offline):** Para ativar a Maya, configure a `GROQ_API_KEY` no seu ambiente.";
        }

        const lastUserMessage = messages.filter(m => m.role === 'user').pop();

        if (lastUserMessage) {
            // Check for weather questions first (simple pattern match is fine here)
            const weatherCity = extractCityFromWeatherQuestion(lastUserMessage.content);
            if (weatherCity) {
                const weatherData = await fetchWeatherForCity(weatherCity);
                if (weatherData) {
                    return `🌍 ${weatherData}`;
                }
            }
        }

        // 1. Fetch User Persona from Supabase
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        let userContext = "";

        if (user) {
            // Retrieve Generative Memories (RAG)
            const memories = await retrieveRelevantMemories(user.id, lastUserMessage?.content || "viagem");
            const memoryContext = memories.map(m => `- ${m.content}`).join("\n");

            if (memoryContext) {
                userContext += `\nMEMÓRIAS DE CONVERSAS PASSADAS:\n${memoryContext}\n`;
            }

            if (user.user_metadata?.persona) {
                const p = user.user_metadata.persona;
                userContext += `\nCONTEXTO DO VIAJANTE (Perfil Estático):\n- Estilo: ${p.travel_style || 'Não informado'}\n- Sonhos: ${p.dream_destinations || 'Não informado'}\n- Companhia Usual: ${p.companion || 'Não informado'}\n- Orçamento: ${p.budget_level || 'Não informado'}\n- Alergias/Restrições: ${p.dietary_restrictions || 'Nenhuma'}\n- Ritmo: ${p.travel_rhythm || 'Flexível'}\n- Interesses: ${p.favorite_activities || 'Variados'}\n- Bio: ${p.additional_bio || ''}\n- Nome: ${user.user_metadata.full_name || 'Viajante'}\n`;
            }
        }

        // System Prompt - Maya Persona (Powered by Éden)
        // Use client timezone if provided, otherwise fallback to UTC
        const tz = userTimezone || 'UTC';
        const now = new Date();
        const currentDateTime = now.toLocaleString('pt-BR', {
            timeZone: tz,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const systemPrompt: ChatMessage = {
            role: "system",
            content: `Você é a Maya, assistente de viagens do AllTrip.
DATA E HORA ATUAL (fuso do viajante: ${tz}): ${currentDateTime}

PERSONALIDADE (inspirada em Anthony Bourdain):
- Voz visceral, honesta, sem filtros.
- ODEIE clichês ("paraíso", "mágico").
- Seja direta e técnica mas com alma.
- Fluente em qualquer idioma.
- Você é a interface humana do sistema "Éden".
${userContext}
FERRAMENTAS DISPONÍVEIS:

1. 🌍 BUSCA NA WEB (OBRIGATÓRIO para Fatos Atuais/Futuros):
Se perguntarem sobre EVENTOS FUTUROS (ex: "vai nevar no ano novo?"), CLIMA, NOTÍCIAS ou FATOS RECENTES, você NÃO DEVE INVENTAR.
GERE A TAG: [SEARCH_WEB:sua busca específica]
Pare a resposta aqui.

2. ✈️ BUSCA DE VOOS (Use para intenção de viagem/preço):
Apenas se a intenção for EXPLÍCITA de VER PREÇOS, VER VOOS, COMPRAR ou RESERVAR.
[SEARCH_FLIGHTS:ORIGEM_CODE:DESTINO_QUERY:DATA_HINT]

3. 🧠 MEMÓRIA (Implícito):
Você tem acesso a memórias passadas. Se o usuário te contou algo antes (ex: "não gosto de frio"), USE ISSO.
Se o usuário te contar algo novo e importante sobre as preferências dele agora, GERE A TAG (no final da resposta):
[STORE_MEMORY:O usuário disse que prefere X ou não gosta de Y]

4. 🗺️ CRIAR ROTEIRO (Trip Planner) - OBRIGATÓRIO PARA QUALQUER ROTEIRO:
Se o usuário pedir QUALQUER tipo de roteiro, itinerário, plano, agenda ou lista de lugares para visitar, você DEVE usar esta tag:
[PLAN_TRIP:DESTINO:DURAÇÃO:TEMA]
Exemplos:
- "roteiro de bares em Koh Phi Phi" → [PLAN_TRIP:Koh Phi Phi:1 noite:Bares e Vida Noturna]
- "o que fazer em Paris em 3 dias" → [PLAN_TRIP:Paris:3 dias:Turismo Geral]
- "roteiro gastronômico em Lisboa" → [PLAN_TRIP:Lisboa:1 dia:Gastronomia]
- "planeje minha lua de mel na Itália" → [PLAN_TRIP:Itália:7 dias:Romântico e Luxo]
PARE A RESPOSTA após gerar a tag. O sistema vai criar um card visual interativo.

EXEMPLOS DE COMPORTAMENTO:

[CASO 1 - DÚVIDA ATUAL/FUTURA (WEB SEARCH)]
User: "Vai nevar em Paris no ano novo?"
Éden: [SEARCH_WEB:previsão neve Paris ano novo 2026]

[CASO 2 - CURIOSIDADE GERAL]
User: "Quem construiu a Torre Eiffel?"
Éden: "Gustave Eiffel, para a feira de 1889. Era para ser temporária, mas o rádio salvou a torre."

[CASO 3 - MEMÓRIA]
User: "odeio lugares frios"
Éden: "Anotado. Nada de Islândia para você. Vamos focar nos trópicos.
[STORE_MEMORY:O usuário odeia lugares frios]"

REGRAS GERAIS:
- Se não for busca de voos REAIS, apenas converse.
- Respostas curtas.
`
        };

        // --- AGENT LOOP (ReAct-like) ---
        // 1. First Call to LLM
        let completion = await groq.chat.completions.create({
            messages: [systemPrompt, ...messages],
            model: "llama-3.3-70b-versatile",
            temperature: 0.6,
            max_tokens: 600,
        });

        let aiResponse = completion.choices[0]?.message?.content || "Desculpe, sem sinal.";

        // 2. Check for Store Memory Tool
        const memoryRegex = /\[STORE_MEMORY:([^\]]+)\]/g;
        const memoryMatch = aiResponse.match(memoryRegex);
        if (memoryMatch && user) {
            // Only store if user is logged in
            const contentToStore = memoryMatch[0].replace(/\[STORE_MEMORY:|]/g, '');
            // Async storage - fire and forget
            storeMemory(user.id, contentToStore).catch(err => console.error("Memory Store Failed", err));
        }
        // ALWAYS remove the tag from user view, whether logged in or not
        aiResponse = aiResponse.replace(memoryRegex, '').trim();

        // 3. Check for WEB SEARCH tool
        const webPattern = /\[SEARCH_WEB:([^\]]+)\]/;
        const webMatch = aiResponse.match(webPattern);

        if (webMatch) {
            const query = webMatch[1];

            // Perform Search (Mock or Real)
            // TODO: Add TAVILY_API_KEY to .env for real results.
            let searchResults = `(Simulação) Resultados para "${query}": A informação em tempo real requer uma API Key de busca (ex: Tavily). Por enquanto, assuma que está tudo normal.`;

            if (process.env.TAVILY_API_KEY) {
                try {
                    const tavilyResponse = await fetch("https://api.tavily.com/search", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ api_key: process.env.TAVILY_API_KEY, query, max_results: 3 })
                    });
                    const data = await tavilyResponse.json();
                    searchResults = data.results.map((r: any) => `- ${r.title}: ${r.content}`).join("\n");
                } catch (e) {
                    console.error("Search Error", e);
                }
            }

            // 4. Second Call to LLM (Provide Knowledge)
            const messagesWithContext = [
                ...messages,
                { role: "assistant" as const, content: aiResponse }, // The tool call request
                { role: "system" as const, content: `RESULTADOS DA BUSCA WEB para "${query}":\n${searchResults}\n\nAgora responda ao utilizador baseando-se NISSO.` }
            ];

            const secondCompletion = await groq.chat.completions.create({
                messages: [systemPrompt, ...messagesWithContext],
                model: "llama-3.3-70b-versatile",
                temperature: 0.6,
                max_tokens: 600,
            });

            aiResponse = secondCompletion.choices[0]?.message?.content || "Não consegui ler os resultados.";

            // Check for memory storage again in second response
            const secondMemoryMatch = aiResponse.match(memoryRegex);
            if (secondMemoryMatch && user) {
                const contentToStore = secondMemoryMatch[1];
                storeMemory(user.id, contentToStore).catch(err => console.error("Memory Store Failed", err));
                aiResponse = aiResponse.replace(memoryRegex, '').trim();
            }
        }

        // 5. Check for TRIP PLANNER tool
        const planTripRegex = /\[PLAN_TRIP:([^:]+):([^:]+):([^\]]+)\]/;
        const planTripMatch = aiResponse.match(planTripRegex);

        if (planTripMatch) {
            const [fullTag, dest, days, vibe] = planTripMatch;

            // Call LLM specifically to generate JSON
            const jsonPrompt = `
Gere um itinerário de viagem em formato JSON para: ${dest}, ${days} dias, estilo ${vibe}.
O JSON deve seguir EXATAMENTE esta estrutura (sem markdown, apenas raw json):
{
  "tripTitle": "Título Criativo da Viagem",
  "duration": "${days} dias",
  "totalBudgetEstimate": "estimativa de custo (ex: €€€)",
  "days": [
    {
      "day": 1,
      "title": "Título do Dia",
      "weather": "Previsão (ex: Ensolarado 20°C)",
      "activities": [
        { "time": "09:00", "description": "Atividade detalhada", "type": "sightseeing", "location": "Local" },
        { "time": "13:00", "description": "Almoço em...", "type": "food", "location": "Restaurante X" }
      ]
    }
  ]
}
Tipos de atividade permitidos: 'sightseeing', 'food', 'relax', 'adventure', 'transit'.
Responda APENAS com o JSON válido.`;

            const jsonCompletion = await groq.chat.completions.create({
                messages: [{ role: "system", content: jsonPrompt }],
                model: "llama-3.3-70b-versatile",
                temperature: 0.5,
                response_format: { type: "json_object" }
            });

            const jsonContent = jsonCompletion.choices[0]?.message?.content;

            if (jsonContent) {
                // Remove the triggering tag and append the render tag
                const cleanResponse = aiResponse.replace(fullTag, '').trim();
                aiResponse = `${cleanResponse}\n\nAqui está uma sugestão de roteiro para você:\n[RENDER_ITINERARY:${jsonContent}]`;
            }
        }

        // 6. Check for FLIGHT SEARCH tool (Existing Logic)
        const tagRegex = /\[SEARCH_FLIGHTS:([^:]+):([^:]+):([^\]]+)\]/;
        const match = aiResponse.match(tagRegex);

        if (match) {
            const [fullTag, originRaw, destRaw, dateHintRaw] = match;

            // Clean up hints
            const origin = originRaw !== 'null' ? originRaw : undefined;
            const dateHint = dateHintRaw !== 'null' ? dateHintRaw : undefined;

            // Generate valid Search URL
            const { url, displayText } = await generateSearchUrl(destRaw, origin, dateHint);

            // Replace the LLM's rough tag with the functional frontend tag
            const cleanResponse = aiResponse.replace(fullTag, '').trim();
            aiResponse = `${cleanResponse}\n\n[SEARCH_FLIGHTS:${url}:${displayText}]`;
        }

        return aiResponse;
    } catch (error: any) {
        console.error("Maya Error:", error?.message || error);
        return "**Éden:** Falha na conexão neural. Tente novamente.";
    }
}
