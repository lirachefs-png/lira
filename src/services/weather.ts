
interface WeatherData {
    location: string;
    temperature: number;
    temperatureMax: number;
    temperatureMin: number;
    weatherCode: number;
    weatherDescription: string;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    suggestion: string;
}

// Weather code to description mapping (WMO codes)
export const weatherCodeToDescription: Record<number, { description: string; emoji: string }> = {
    0: { description: 'Céu limpo', emoji: '☀️' },
    1: { description: 'Predominantemente limpo', emoji: '🌤️' },
    2: { description: 'Parcialmente nublado', emoji: '⛅' },
    3: { description: 'Nublado', emoji: '☁️' },
    45: { description: 'Nevoeiro', emoji: '🌫️' },
    48: { description: 'Nevoeiro com geada', emoji: '🌫️' },
    51: { description: 'Chuvisco leve', emoji: '🌧️' },
    53: { description: 'Chuvisco moderado', emoji: '🌧️' },
    55: { description: 'Chuvisco denso', emoji: '🌧️' },
    61: { description: 'Chuva leve', emoji: '🌧️' },
    63: { description: 'Chuva moderada', emoji: '🌧️' },
    65: { description: 'Chuva forte', emoji: '🌧️' },
    71: { description: 'Neve leve', emoji: '❄️' },
    73: { description: 'Neve moderada', emoji: '❄️' },
    75: { description: 'Neve forte', emoji: '❄️' },
    80: { description: 'Pancadas de chuva', emoji: '🌦️' },
    81: { description: 'Pancadas moderadas', emoji: '🌦️' },
    82: { description: 'Pancadas fortes', emoji: '⛈️' },
    95: { description: 'Tempestade', emoji: '⛈️' },
    96: { description: 'Tempestade com granizo', emoji: '⛈️' },
    99: { description: 'Tempestade forte com granizo', emoji: '⛈️' },
};

// City to coordinates mapping (common destinations)
export const cityCoordinates: Record<string, { lat: number; lon: number; name: string }> = {
    // Portugal
    'LIS': { lat: 38.7223, lon: -9.1393, name: 'Lisboa' },
    'OPO': { lat: 41.1579, lon: -8.6291, name: 'Porto' },
    'FAO': { lat: 37.0144, lon: -7.9659, name: 'Faro' },
    // Spain
    'MAD': { lat: 40.4168, lon: -3.7038, name: 'Madrid' },
    'BCN': { lat: 41.3851, lon: 2.1734, name: 'Barcelona' },
    // France
    'CDG': { lat: 48.8566, lon: 2.3522, name: 'Paris' },
    'ORY': { lat: 48.8566, lon: 2.3522, name: 'Paris' },
    // UK
    'LHR': { lat: 51.5074, lon: -0.1278, name: 'Londres' },
    'LGW': { lat: 51.5074, lon: -0.1278, name: 'Londres' },
    // Italy
    'FCO': { lat: 41.9028, lon: 12.4964, name: 'Roma' },
    'MXP': { lat: 45.4642, lon: 9.1900, name: 'Milão' },
    // Holland
    'AMS': { lat: 52.3676, lon: 4.9041, name: 'Amesterdão' },
    // Germany
    'FRA': { lat: 50.1109, lon: 8.6821, name: 'Frankfurt' },
    'MUC': { lat: 48.1351, lon: 11.5820, name: 'Munique' },
    'BER': { lat: 52.5200, lon: 13.4050, name: 'Berlim' },
    // Switzerland/Austria
    'ZRH': { lat: 47.3769, lon: 8.5417, name: 'Zurique' },
    'VIE': { lat: 48.2082, lon: 16.3738, name: 'Viena' },
    // Middle East
    'DXB': { lat: 25.2048, lon: 55.2708, name: 'Dubai' },
    // USA
    'JFK': { lat: 40.7128, lon: -74.0060, name: 'Nova Iorque' },
    'LAX': { lat: 34.0522, lon: -118.2437, name: 'Los Angeles' },
    'MIA': { lat: 25.7617, lon: -80.1918, name: 'Miami' },
    'MCO': { lat: 28.5383, lon: -81.3792, name: 'Orlando' },
    // Brazil
    'GRU': { lat: -23.5505, lon: -46.6333, name: 'São Paulo' },
    'GIG': { lat: -22.9068, lon: -43.1729, name: 'Rio de Janeiro' },
    'MCZ': { lat: -9.6658, lon: -35.7350, name: 'Maceió' },
    'NAT': { lat: -5.7945, lon: -35.2110, name: 'Natal' },
    'JPA': { lat: -7.115, lon: -34.863, name: 'João Pessoa' },
    // Southeast Asia - Thailand
    'BKK': { lat: 13.7563, lon: 100.5018, name: 'Bangkok' },
    'HKT': { lat: 7.8804, lon: 98.3923, name: 'Phuket' },
    // Singapore
    'SIN': { lat: 1.3521, lon: 103.8198, name: 'Singapura' },
    // Japan
    'HND': { lat: 35.6762, lon: 139.6503, name: 'Tóquio' },
    'NRT': { lat: 35.6762, lon: 139.6503, name: 'Tóquio' },
    // Australia
    'SYD': { lat: -33.8688, lon: 151.2093, name: 'Sydney' },
    'BNE': { lat: -27.4698, lon: 153.0251, name: 'Brisbane' },
    // Mexico/Caribbean
    'CUN': { lat: 21.1619, lon: -86.8515, name: 'Cancún' },
    // Indonesia
    'DPS': { lat: -8.3405, lon: 115.0920, name: 'Bali' },
    // Maldives
    'MLE': { lat: 4.1755, lon: 73.5093, name: 'Maldivas' },
    // Morocco
    'RAK': { lat: 31.6295, lon: -7.9811, name: 'Marrakech' },
    // Greece
    'ATH': { lat: 37.9838, lon: 23.7275, name: 'Atenas' },
};

function getClothingSuggestion(temp: number, weatherCode: number): string {
    const isRainy = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode);
    const isSnowy = [71, 73, 75].includes(weatherCode);

    if (isSnowy || temp < 5) {
        return '🧥 Leve casaco pesado, gorro, luvas e cachecol. Prepare-se para o frio!';
    } else if (temp < 12) {
        return '🧥 Leve casaco médio e camadas. Noites podem ser frias.';
    } else if (temp < 18) {
        const rain = isRainy ? ' Não esqueça o guarda-chuva!' : '';
        return `🧥 Um casaco leve ou jaqueta é recomendado.${rain}`;
    } else if (temp < 25) {
        const rain = isRainy ? ' Leve guarda-chuva compacto.' : '';
        return `👕 Roupas leves, mas leve um casaco fino para a noite.${rain}`;
    } else {
        return '👕 Roupas leves, protetor solar e óculos de sol. Hidrate-se!';
    }
}

export type FetchWeatherResult = {
    current: WeatherData;
    forecast: {
        date: string;
        tempMax: number;
        tempMin: number;
        weatherCode: number;
        weatherDescription: string;
        emoji: string;
        precipitation: number;
    }[];
} | null;

export async function getWeatherForCity(cityCodeOrName: string): Promise<FetchWeatherResult> {
    const city = cityCodeOrName.toUpperCase();

    let latitude: number;
    let longitude: number;
    let locationName: string;

    if (cityCoordinates[city]) {
        latitude = cityCoordinates[city].lat;
        longitude = cityCoordinates[city].lon;
        locationName = cityCoordinates[city].name;
    } else {
        // Fallback: try to find by name within our list if a full name was passed (less reliable but useful)
        const entry = Object.entries(cityCoordinates).find(([, val]) =>
            val.name.toUpperCase() === city ||
            val.name.toUpperCase().includes(city)
        );

        if (entry) {
            latitude = entry[1].lat;
            longitude = entry[1].lon;
            locationName = entry[1].name;
        } else {
            return null;
        }
    }

    try {
        // Fetch from Open-Meteo API
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto&forecast_days=7`;

        const response = await fetch(apiUrl, { next: { revalidate: 3600 } }); // Cache for 1 hour

        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        const current = data.current;
        const daily = data.daily;

        const weatherInfo = weatherCodeToDescription[current.weather_code] || { description: 'Condições variadas', emoji: '🌡️' };

        const weatherData: WeatherData = {
            location: locationName,
            temperature: Math.round(current.temperature_2m),
            temperatureMax: Math.round(daily.temperature_2m_max[0]),
            temperatureMin: Math.round(daily.temperature_2m_min[0]),
            weatherCode: current.weather_code,
            weatherDescription: `${weatherInfo.emoji} ${weatherInfo.description}`,
            humidity: current.relative_humidity_2m,
            windSpeed: Math.round(current.wind_speed_10m),
            precipitation: daily.precipitation_sum[0] || 0,
            suggestion: getClothingSuggestion(current.temperature_2m, current.weather_code),
        };

        // Include 7-day forecast
        const forecast = daily.time.map((date: string, i: number) => ({
            date,
            tempMax: Math.round(daily.temperature_2m_max[i]),
            tempMin: Math.round(daily.temperature_2m_min[i]),
            weatherCode: daily.weather_code[i],
            weatherDescription: weatherCodeToDescription[daily.weather_code[i]]?.description || 'Variado',
            emoji: weatherCodeToDescription[daily.weather_code[i]]?.emoji || '🌡️',
            precipitation: daily.precipitation_sum[i] || 0,
        }));

        return {
            current: weatherData,
            forecast,
        };
    } catch (error) {
        console.error('Weather Service Error:', error);
        return null;
    }
}

export interface WeatherSummary {
    description: string;
    avgTemp: number;
    minTemp: number;
    maxTemp: number;
    rainProbability: number;
}

export async function getWeatherForecast(
    lat: number,
    lon: number,
    startDate: Date,
    endDate: Date
): Promise<WeatherSummary> {
    try {
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

        // Fetch from Open-Meteo API
        // Using daily variables for summary
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_mean,weather_code&timezone=auto&forecast_days=${Math.min(diffDays + 1, 14)}`;

        const response = await fetch(apiUrl, { next: { revalidate: 3600 } });

        if (!response.ok) {
            throw new Error('Failed to fetch forecast data');
        }

        const data = await response.json();
        const daily = data.daily;

        if (!daily || !daily.time || daily.time.length === 0) {
            throw new Error('No forecast data available');
        }

        // Calculate averages
        const tempsMax = daily.temperature_2m_max as number[];
        const tempsMin = daily.temperature_2m_min as number[];
        const rainProbs = daily.precipitation_probability_mean as number[];
        const weatherCodes = daily.weather_code as number[];

        const avgMax = tempsMax.reduce((a, b) => a + b, 0) / tempsMax.length;
        const avgMin = tempsMin.reduce((a, b) => a + b, 0) / tempsMin.length;
        const avgTemp = (avgMax + avgMin) / 2;
        const maxTemp = Math.max(...tempsMax);
        const minTemp = Math.min(...tempsMin);
        const avgRainProb = rainProbs.reduce((a, b) => a + b, 0) / rainProbs.length;

        // Get most frequent weather code
        const frequency: Record<number, number> = {};
        let maxFreq = 0;
        let dominantCode = weatherCodes[0];

        for (const code of weatherCodes) {
            frequency[code] = (frequency[code] || 0) + 1;
            if (frequency[code] > maxFreq) {
                maxFreq = frequency[code];
                dominantCode = code;
            }
        }

        const description = weatherCodeToDescription[dominantCode]?.description || 'Variável';

        return {
            description,
            avgTemp: Math.round(avgTemp),
            minTemp: Math.round(minTemp),
            maxTemp: Math.round(maxTemp),
            rainProbability: Math.round(avgRainProb)
        };
    } catch (error) {
        console.error("getWeatherForecast Error:", error);
        // Fallback
        return {
            description: "Não disponível",
            avgTemp: 20,
            minTemp: 15,
            maxTemp: 25,
            rainProbability: 0
        };
    }
}
