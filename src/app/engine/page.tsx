'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plane, Globe2, Zap, X } from 'lucide-react';
import Link from 'next/link';
import MayaChat from '@/components/MayaChat';

// Dynamic import to avoid SSR issues with Three.js
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

// Hot deals data with coordinates
const HOT_DEALS = [
    { id: 1, city: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393, price: 450, currency: '€', color: '#FF2E6C', iata: 'LIS' },
    { id: 2, city: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, price: 680, currency: '€', color: '#FF6B35', iata: 'GRU' },
    { id: 3, city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, price: 290, currency: '€', color: '#FF2E6C', iata: 'DXB' },
    { id: 4, city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, price: 840, currency: '€', color: '#FF6B35', iata: 'NRT' },
    { id: 5, city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, price: 320, currency: '€', color: '#FF2E6C', iata: 'JFK' },
    { id: 6, city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, price: 120, currency: '€', color: '#00D4AA', iata: 'CDG' },
    { id: 7, city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, price: 550, currency: '€', color: '#FF6B35', iata: 'SIN' },
    { id: 8, city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, price: 980, currency: '€', color: '#FF6B35', iata: 'SYD' },
    { id: 9, city: 'Bali', country: 'Indonesia', lat: -8.4095, lng: 115.1889, price: 720, currency: '€', color: '#FF2E6C', iata: 'DPS' },
    { id: 10, city: 'Maldives', country: 'Maldives', lat: 3.2028, lng: 73.2207, price: 890, currency: '€', color: '#00D4AA', iata: 'MLE' },
    { id: 11, city: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241, price: 560, currency: '€', color: '#FF6B35', iata: 'CPT' },
    { id: 12, city: 'Reykjavik', country: 'Iceland', lat: 64.1466, lng: -21.9426, price: 280, currency: '€', color: '#00D4AA', iata: 'KEF' },
];

const STATS = [
    { label: 'Airlines', value: '728+', icon: Plane },
    { label: 'Routes', value: '12.4K', icon: Globe2 },
    { label: 'Deals', value: HOT_DEALS.length.toString(), icon: Zap },
];

interface DealType {
    id: number;
    city: string;
    country: string;
    lat: number;
    lng: number;
    price: number;
    currency: string;
    color: string;
    iata: string;
}

export default function EnginePage() {
    const globeRef = useRef<any>(null);
    const isMountedRef = useRef(false);
    const [selectedDeal, setSelectedDeal] = useState<DealType | null>(null);
    const [globeReady, setGlobeReady] = useState(false);

    // Search states
    const [originCode, setOriginCode] = useState('');
    const [destCode, setDestCode] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [flightArc, setFlightArc] = useState<any[]>([]);
    const [planePosition, setPlanePosition] = useState<number>(0);

    // Airport coordinates lookup (extended from HOT_DEALS + common airports)
    const AIRPORT_COORDS: Record<string, { lat: number; lng: number; name: string }> = useMemo(() => ({
        // From HOT_DEALS
        'LIS': { lat: 38.7223, lng: -9.1393, name: 'Lisbon' },
        'GRU': { lat: -23.5505, lng: -46.6333, name: 'São Paulo' },
        'DXB': { lat: 25.2048, lng: 55.2708, name: 'Dubai' },
        'NRT': { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
        'JFK': { lat: 40.7128, lng: -74.0060, name: 'New York' },
        'CDG': { lat: 48.8566, lng: 2.3522, name: 'Paris' },
        'SIN': { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
        'SYD': { lat: -33.8688, lng: 151.2093, name: 'Sydney' },
        'DPS': { lat: -8.4095, lng: 115.1889, name: 'Bali' },
        'MLE': { lat: 3.2028, lng: 73.2207, name: 'Maldives' },
        'CPT': { lat: -33.9249, lng: 18.4241, name: 'Cape Town' },
        'KEF': { lat: 64.1466, lng: -21.9426, name: 'Reykjavik' },
        // Additional common airports
        'LAX': { lat: 33.9425, lng: -118.4081, name: 'Los Angeles' },
        'LHR': { lat: 51.4700, lng: -0.4543, name: 'London' },
        'FRA': { lat: 50.0379, lng: 8.5622, name: 'Frankfurt' },
        'OPO': { lat: 41.2481, lng: -8.6813, name: 'Porto' },
        'MAD': { lat: 40.4983, lng: -3.5676, name: 'Madrid' },
        'BCN': { lat: 41.2974, lng: 2.0833, name: 'Barcelona' },
        'MIA': { lat: 25.7959, lng: -80.2870, name: 'Miami' },
        'EWR': { lat: 40.6895, lng: -74.1745, name: 'Newark' },
        'ORD': { lat: 41.9742, lng: -87.9073, name: 'Chicago' },
        'ATL': { lat: 33.6407, lng: -84.4277, name: 'Atlanta' },
        'DFW': { lat: 32.8998, lng: -97.0403, name: 'Dallas' },
        'HND': { lat: 35.5494, lng: 139.7798, name: 'Tokyo Haneda' },
        'ICN': { lat: 37.4602, lng: 126.4407, name: 'Seoul' },
        'HKG': { lat: 22.3080, lng: 113.9185, name: 'Hong Kong' },
        'BKK': { lat: 13.6900, lng: 100.7501, name: 'Bangkok' },
        'AMS': { lat: 52.3105, lng: 4.7683, name: 'Amsterdam' },
        'MUC': { lat: 48.3537, lng: 11.7750, name: 'Munich' },
        'FCO': { lat: 41.8003, lng: 12.2389, name: 'Rome' },
        'VCP': { lat: -23.0074, lng: -47.1345, name: 'Campinas' },
        'JPA': { lat: -7.1453, lng: -34.9486, name: 'João Pessoa' },
        'REC': { lat: -8.1264, lng: -34.9236, name: 'Recife' },
        'SSA': { lat: -12.9086, lng: -38.3225, name: 'Salvador' },
        'CNF': { lat: -19.6244, lng: -43.9719, name: 'Belo Horizonte' },
        'GIG': { lat: -22.8099, lng: -43.2505, name: 'Rio de Janeiro' },
        'BSB': { lat: -15.8711, lng: -47.9186, name: 'Brasília' },
        'POA': { lat: -29.9944, lng: -51.1711, name: 'Porto Alegre' },
        'CWB': { lat: -25.5285, lng: -49.1758, name: 'Curitiba' },
        'FOR': { lat: -3.7763, lng: -38.5326, name: 'Fortaleza' },
        'NAT': { lat: -5.9111, lng: -35.2478, name: 'Natal' },
    }), []);

    // Live flights state
    const [liveFlights, setLiveFlights] = useState<any[]>([]);
    const [selectedAircraft, setSelectedAircraft] = useState<any>(null);
    const [flightsLoading, setFlightsLoading] = useState(false);

    // Flight search by callsign
    const [flightSearch, setFlightSearch] = useState('');
    const [highlightedFlight, setHighlightedFlight] = useState<string | null>(null);

    // Aircraft trajectory (for selected aircraft)
    const [aircraftTrack, setAircraftTrack] = useState<any[]>([]);

    // Track component mount state
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Fetch live flights
    useEffect(() => {
        if (!globeReady) return;

        const fetchLiveFlights = async () => {
            try {
                setFlightsLoading(true);
                console.log('🛫 Fetching live flights...');
                const res = await fetch('/api/live-flights');

                if (res.ok) {
                    const data = await res.json();
                    console.log(`✅ Got ${data.count || 0} flights`);
                    if (isMountedRef.current) {
                        setLiveFlights(data.flights || []);
                        if (data.count > 0) {
                            console.log(`🛫 ${data.count} aircraft flying right now!`);
                        } else {
                            console.log('⏳ Loading live flights... (OpenSky may be slow)');
                        }
                    }
                } else if (res.status === 429) {
                    console.warn('⚠️ OpenSky rate limit hit');
                } else {
                    console.error('❌ API error:', res.status);
                }
            } catch (err) {
                console.error('Live flights error:', err);
            } finally {
                if (isMountedRef.current) setFlightsLoading(false);
            }
        };

        // Initial fetch
        fetchLiveFlights();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchLiveFlights, 30000);
        return () => clearInterval(interval);
    }, [globeReady]);

    // Set initial globe position
    useEffect(() => {
        if (globeRef.current && globeReady) {
            // Auto-rotate
            globeRef.current.controls().autoRotate = true;
            globeRef.current.controls().autoRotateSpeed = 0.3;

            // Set initial point of view
            globeRef.current.pointOfView({ lat: 30, lng: 0, altitude: 2.5 });
        }
    }, [globeReady]);

    const handleDealClick = useCallback((deal: DealType) => {
        setSelectedDeal(deal);

        if (globeRef.current) {
            // Fly to destination
            globeRef.current.pointOfView(
                { lat: deal.lat, lng: deal.lng, altitude: 1.5 },
                1000 // Animation duration
            );
            // Stop auto-rotate when selecting
            globeRef.current.controls().autoRotate = false;
        }
    }, []);

    const closeDealPanel = useCallback(() => {
        setSelectedDeal(null);
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = true;
        }
    }, []);

    // Handle flight route search
    const handleFlightSearch = useCallback(() => {
        const origin = originCode.toUpperCase().trim();
        const dest = destCode.toUpperCase().trim();

        if (!origin || !dest) {
            return;
        }

        const originAirport = AIRPORT_COORDS[origin];
        const destAirport = AIRPORT_COORDS[dest];

        if (!originAirport || !destAirport) {
            return;
        }

        // Stop auto-rotate
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = false;
        }

        setIsSearching(true);

        // Create arc data
        const arcData = [{
            startLat: originAirport.lat,
            startLng: originAirport.lng,
            endLat: destAirport.lat,
            endLng: destAirport.lng,
            color: ['#FF2E6C', '#00D4AA'],
            origin: origin,
            dest: dest,
            originName: originAirport.name,
            destName: destAirport.name
        }];

        setFlightArc(arcData);

        // Animate to show both endpoints
        const midLat = (originAirport.lat + destAirport.lat) / 2;
        const midLng = (originAirport.lng + destAirport.lng) / 2;

        if (globeRef.current) {
            globeRef.current.pointOfView(
                { lat: midLat, lng: midLng, altitude: 2.2 },
                1500
            );
        }

        // Animate plane along arc
        setPlanePosition(0);
        let pos = 0;
        const animateInterval = setInterval(() => {
            pos += 0.015;
            if (pos >= 1) {
                clearInterval(animateInterval);
                setPlanePosition(1);
                setIsSearching(false);
            } else {
                setPlanePosition(pos);
            }
        }, 30);

    }, [originCode, destCode, AIRPORT_COORDS]);

    // Search flight by callsign (e.g., TAP123, UA456)
    const searchFlightByCallsign = useCallback((callsign: string) => {
        const search = callsign.toUpperCase().trim();
        if (!search) return;

        const found = liveFlights.find(f =>
            f.callsign?.toUpperCase().includes(search)
        );

        if (found) {
            setSelectedAircraft(found);
            setHighlightedFlight(found.icao24);
            fetchAircraftTrack(found.icao24); // Fetch trajectory

            if (globeRef.current) {
                globeRef.current.pointOfView({ lat: found.latitude, lng: found.longitude, altitude: 0.5 }, 1500);
                globeRef.current.controls().autoRotate = false;
            }
        }
    }, [liveFlights]);

    // Fetch aircraft trajectory from OpenSky
    const fetchAircraftTrack = useCallback(async (icao24: string) => {
        try {
            console.log(`📍 Fetching track for ${icao24}...`);
            setAircraftTrack([]); // Clear previous

            const res = await fetch(`/api/opensky/track?icao24=${icao24}`);
            if (res.ok) {
                const data = await res.json();
                if (data.waypoints && data.waypoints.length > 1) {
                    // Convert waypoints to arcs
                    const trackArcs = [];
                    for (let i = 0; i < data.waypoints.length - 1; i++) {
                        const wp1 = data.waypoints[i];
                        const wp2 = data.waypoints[i + 1];
                        trackArcs.push({
                            startLat: wp1.latitude,
                            startLng: wp1.longitude,
                            endLat: wp2.latitude,
                            endLng: wp2.longitude,
                            color: '#FF2E6C' // Rose track (AllTrip color)
                        });
                    }
                    setAircraftTrack(trackArcs);
                    console.log(`✅ Loaded ${trackArcs.length} track segments`);
                }
            } else {
                console.warn('❌ Track not available for this aircraft');
            }
        } catch (err) {
            console.error('Track fetch error:', err);
        }
    }, []);

    // Label renderer with click handler
    const labelContent = useCallback((d: object) => {
        const deal = d as DealType;
        const isSelected = selectedDeal?.id === deal.id;
        const el = document.createElement('div');
        el.innerHTML = `
            <div class="price-badge ${isSelected ? 'selected' : ''}" data-deal-id="${deal.id}">
                <div class="badge-content">
                    <span class="price">${deal.currency}${deal.price}</span>
                    <span class="city">${deal.city}</span>
                </div>
                <div class="badge-pulse"></div>
            </div>
        `;
        el.style.cursor = 'pointer';
        el.onclick = () => handleDealClick(deal);
        return el;
    }, [selectedDeal, handleDealClick]);

    // Aircraft element renderer - SVG airplane icons in AllTrip colors
    const aircraftElement = useCallback((d: object) => {
        const flight = d as any;
        const heading = (flight.heading || 0) + 90; // Adjust for SVG orientation
        const isSelected = selectedAircraft?.icao24 === flight.icao24;
        const isHighlighted = highlightedFlight === flight.icao24;

        // AllTrip colors: rose (#FF2E6C), teal (#00D4AA)
        const color = isSelected || isHighlighted ? '#00D4AA' : flight.onGround ? '#888888' : '#FF2E6C';

        const el = document.createElement('div');
        el.className = 'aircraft-marker';
        el.innerHTML = `
            <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                style="transform: rotate(${heading}deg); filter: drop-shadow(0 0 3px ${color});"
            >
                <path 
                    fill="${color}" 
                    d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                />
            </svg>
        `;
        el.style.cursor = 'pointer';
        el.onclick = (e) => {
            e.stopPropagation();
            setSelectedAircraft(flight);
            setHighlightedFlight(flight.icao24);
            fetchAircraftTrack(flight.icao24);
            if (globeRef.current) {
                globeRef.current.pointOfView({ lat: flight.latitude, lng: flight.longitude, altitude: 0.8 }, 1000);
                globeRef.current.controls().autoRotate = false;
            }
        };
        return el;
    }, [selectedAircraft, highlightedFlight, fetchAircraftTrack]);

    return (
        <div className="min-h-screen bg-[#050510] text-white overflow-hidden relative">
            {/* Custom CSS for price badges */}
            <style jsx global>{`
                .price-badge {
                    cursor: pointer;
                    transform-origin: center bottom;
                    transition: transform 0.3s ease;
                }
                .price-badge:hover {
                    transform: scale(1.2);
                }
                .price-badge.selected {
                    transform: scale(1.3);
                }
                .badge-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: linear-gradient(135deg, rgba(255,46,108,0.9), rgba(255,107,53,0.9));
                    padding: 6px 12px;
                    border-radius: 20px;
                    box-shadow: 0 4px 20px rgba(255,46,108,0.5);
                    border: 2px solid rgba(255,255,255,0.3);
                    backdrop-filter: blur(10px);
                }
                .price-badge.selected .badge-content {
                    background: linear-gradient(135deg, rgba(0,212,170,0.9), rgba(0,180,150,0.9));
                    box-shadow: 0 4px 30px rgba(0,212,170,0.7);
                }
                .price {
                    font-size: 14px;
                    font-weight: 800;
                    color: white;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                .city {
                    font-size: 9px;
                    font-weight: 600;
                    color: rgba(255,255,255,0.9);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .badge-pulse {
                    position: absolute;
                    bottom: -4px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 8px;
                    height: 8px;
                    background: white;
                    border-radius: 50%;
                    box-shadow: 0 0 10px rgba(255,255,255,0.8);
                    animation: pulse 2s ease-in-out infinite;
                }
                /* Floating animation for price badges */
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; box-shadow: 0 0 10px rgba(255,255,255,0.8); }
                    50% { opacity: 0.6; box-shadow: 0 0 20px rgba(255,255,255,1); }
                }
                .price-badge {
                    animation: float 3s ease-in-out infinite;
                }
                .price-badge:nth-child(odd) {
                    animation-delay: 0.5s;
                }
                .price-badge:nth-child(even) {
                    animation-delay: 1s;
                }
                /* Aircraft markers */
                .aircraft-marker {
                    pointer-events: auto;
                    transition: transform 0.2s ease;
                }
                .aircraft-marker:hover {
                    transform: scale(1.5);
                    z-index: 100 !important;
                }
                .aircraft-icon {
                    filter: drop-shadow(0 0 4px rgba(255,215,0,0.8));
                    transition: all 0.3s ease;
                }
                .aircraft-icon.selected {
                    filter: drop-shadow(0 0 8px rgba(0,255,150,1));
                    transform: scale(1.3);
                }
            `}</style>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium hidden md:inline">Back</span>
                </Link>

                {/* SEARCH BAR - Center of Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: globeReady ? 1 : 0.5, scale: 1 }}
                    className="flex items-center"
                >
                    <div className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-black/70 border border-white/20 rounded-full backdrop-blur-xl">
                        {/* Origin */}
                        <Plane className="w-3 h-3 md:w-4 md:h-4 text-rose-400" />
                        <input
                            type="text"
                            value={originCode}
                            onChange={(e) => setOriginCode(e.target.value.toUpperCase())}
                            placeholder="GRU"
                            maxLength={3}
                            className="w-10 md:w-12 bg-transparent text-white text-center text-sm font-bold uppercase placeholder:text-white/30 focus:outline-none"
                        />

                        <span className="text-white/40 text-xs">→</span>

                        {/* Destination */}
                        <Globe2 className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" />
                        <input
                            type="text"
                            value={destCode}
                            onChange={(e) => setDestCode(e.target.value.toUpperCase())}
                            placeholder="JFK"
                            maxLength={3}
                            className="w-10 md:w-12 bg-transparent text-white text-center text-sm font-bold uppercase placeholder:text-white/30 focus:outline-none"
                        />

                        {/* Search Button */}
                        <button
                            onClick={handleFlightSearch}
                            disabled={isSearching}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-xs hover:scale-105 transition-transform disabled:opacity-50"
                        >
                            {isSearching ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                    <Plane className="w-3 h-3" />
                                </motion.div>
                            ) : (
                                <>
                                    <Zap className="w-3 h-3" />
                                    <span className="hidden md:inline">Route</span>
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="w-px h-6 bg-white/20 mx-1" />

                        {/* Flight Search by Callsign */}
                        <input
                            type="text"
                            value={flightSearch}
                            onChange={(e) => setFlightSearch(e.target.value.toUpperCase())}
                            onKeyDown={(e) => e.key === 'Enter' && searchFlightByCallsign(flightSearch)}
                            placeholder="TAP123"
                            maxLength={7}
                            className="w-16 md:w-20 bg-transparent text-white text-center text-xs font-bold uppercase placeholder:text-white/30 focus:outline-none"
                        />
                        <button
                            onClick={() => searchFlightByCallsign(flightSearch)}
                            className="px-2 py-1.5 rounded-full bg-emerald-500/80 text-white text-xs hover:bg-emerald-500 transition-colors"
                        >
                            🔍
                        </button>
                    </div>
                </motion.div>

                {/* Stats with Live Count */}
                <div className="flex items-center gap-2">
                    {/* Live aircraft count */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 backdrop-blur-xl">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-emerald-400">{liveFlights.length}</span>
                        <span className="text-[10px] text-emerald-400/70 hidden md:inline">LIVE</span>
                    </div>

                    {/* Other stats - Hidden on mobile */}
                    <div className="hidden md:flex items-center gap-2">
                        {STATS.slice(0, 2).map((stat, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl"
                            >
                                <stat.icon className="w-3 h-3 text-rose-400" />
                                <span className="text-xs font-bold">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* Title Overlay */}
            <div className="fixed top-20 left-0 right-0 z-40 text-center pointer-events-none">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black"
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400">
                        THE ENGINE
                    </span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/40 text-sm mt-2"
                >
                    Search a route or click destinations to explore deals
                </motion.p>
            </div>

            {/* Book Now button (appears after search) */}
            <AnimatePresence>
                {flightArc.length > 0 && !isSearching && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed top-32 left-1/2 -translate-x-1/2 z-40"
                    >
                        <Link
                            href={`/search?origin=${originCode}&destination=${destCode}&departDate=${new Date().toISOString().split('T')[0]}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-emerald-500/30"
                        >
                            <Plane className="w-4 h-4" />
                            Book Now
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Interactive Globe - Full Screen */}
            <div className="fixed inset-0 z-0">
                {/* Loading Placeholder - Shows while globe initializes */}
                <AnimatePresence>
                    {!globeReady && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050510]"
                        >
                            {/* Animated Loading Globe */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="w-32 h-32 rounded-full border-4 border-rose-500/30 border-t-rose-500 mb-6"
                            />
                            <motion.p
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-white/60 text-sm"
                            >
                                Initializing The Engine...
                            </motion.p>
                            <p className="text-white/30 text-xs mt-2">
                                Loading 728+ airlines data
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Actual Globe - Fades in when ready */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: globeReady ? 1 : 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-full"
                >
                    <Globe
                        ref={globeRef}
                        // NASA Blue Marble HD (8K satellite imagery)
                        globeImageUrl="https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg"
                        bumpImageUrl="https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png"
                        backgroundImageUrl="https://unpkg.com/three-globe@2.31.0/example/img/night-sky.png"

                        // Combined: Price labels + Live aircraft SVG icons
                        htmlElementsData={[
                            ...HOT_DEALS.map(d => ({ ...d, _type: 'deal' })),
                            ...liveFlights.map(f => ({ ...f, _type: 'aircraft' }))
                        ]}
                        htmlElement={(d: any) => d._type === 'deal' ? labelContent(d) : aircraftElement(d)}
                        htmlLat={(d: any) => d._type === 'deal' ? d.lat : d.latitude}
                        htmlLng={(d: any) => d._type === 'deal' ? d.lng : d.longitude}
                        htmlAltitude={(d: any) => d._type === 'deal' ? 0.02 : (d.onGround ? 0.005 : 0.02)}
                        htmlTransitionDuration={300}

                        // Appearance - realistic atmosphere like Google Earth
                        atmosphereColor="lightskyblue"
                        atmosphereAltitude={0.25}

                        // FLIGHT PATH ARCS + AIRCRAFT TRAJECTORY
                        arcsData={[...flightArc, ...aircraftTrack]}
                        arcStartLat={(d: any) => d.startLat}
                        arcStartLng={(d: any) => d.startLng}
                        arcEndLat={(d: any) => d.endLat}
                        arcEndLng={(d: any) => d.endLng}
                        arcColor={(d: any) => d.color || '#FF2E6C'}
                        arcStroke={(d: any) => d.color === '#FF2E6C' ? 1.5 : 2}
                        arcDashLength={0.4}
                        arcDashGap={0.2}
                        arcDashAnimateTime={1500}
                        arcAltitude={(d: any) => d.color === '#FF2E6C' ? 0.05 : 0.3}
                        arcAltitudeAutoScale={0.5}
                        arcsTransitionDuration={500}

                        // Interactivity
                        enablePointerInteraction={true}
                        animateIn={true}

                        onGlobeReady={() => {
                            if (isMountedRef.current) {
                                setGlobeReady(true);
                            }
                        }}
                    />
                </motion.div>
            </div>
            {/* Maya Chat - Dynamic Context */}
            {(() => {
                const mayaContextPrompt = (() => {
                    if (selectedAircraft) {
                        return `🛫 Você está vendo o voo ${selectedAircraft.callsign || 'desconhecido'} de ${selectedAircraft.country}. Altitude: ${Math.round(selectedAircraft.altitude)}m, Velocidade: ${selectedAircraft.velocity || '?'} km/h.\n\nQuer saber mais sobre esta rota ou destino?`;
                    }
                    if (selectedDeal) {
                        return `✨ ${selectedDeal.city}, ${selectedDeal.country} por apenas ${selectedDeal.currency}${selectedDeal.price}!\n\nPosso ajudar com:\n• Melhor época para visitar\n• O que fazer em ${selectedDeal.city}\n• Dicas de viagem`;
                    }
                    if (flightArc.length > 0 && !isSearching) {
                        return `✈️ Rota ${originCode} → ${destCode} traçada!\n\nQuer dicas sobre este destino ou ajuda para planejar sua viagem?`;
                    }
                    return `🌍 Bem-vindo ao The Engine!\n\nExplore destinos no globo ou me pergunte sobre:\n• Destinos económicos\n• Melhor época para viajar\n• Dicas de viagem`;
                })();

                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50"
                    >
                        <MayaChat contextPrompt={mayaContextPrompt} />
                    </motion.div>
                );
            })()}

            {/* Selected Aircraft Info Panel - Left Side */}
            <AnimatePresence>
                {selectedAircraft && (
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="fixed left-4 md:left-6 top-24 z-50 w-80"
                    >
                        <div className="p-5 rounded-2xl bg-black/80 border border-rose-500/30 backdrop-blur-xl">
                            <button
                                onClick={() => {
                                    setSelectedAircraft(null);
                                    setAircraftTrack([]);
                                    setHighlightedFlight(null);
                                    if (globeRef.current) {
                                        globeRef.current.controls().autoRotate = true;
                                    }
                                }}
                                className="absolute top-3 right-3 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Flight Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
                                    <Plane className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white">
                                        {selectedAircraft.callsign || 'N/A'}
                                    </h3>
                                    <p className="text-sm text-white/60">{selectedAircraft.country}</p>
                                </div>
                            </div>

                            {/* Flight Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="p-3 rounded-xl bg-white/5">
                                    <p className="text-[10px] text-white/40 uppercase mb-1">Altitude</p>
                                    <p className="text-lg font-bold text-white">{Math.round(selectedAircraft.altitude).toLocaleString()}m</p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5">
                                    <p className="text-[10px] text-white/40 uppercase mb-1">Velocidade</p>
                                    <p className="text-lg font-bold text-white">{selectedAircraft.velocity || '?'} km/h</p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5">
                                    <p className="text-[10px] text-white/40 uppercase mb-1">Heading</p>
                                    <p className="text-lg font-bold text-white">{Math.round(selectedAircraft.heading || 0)}°</p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5">
                                    <p className="text-[10px] text-white/40 uppercase mb-1">Status</p>
                                    <p className="text-lg font-bold text-emerald-400">
                                        {selectedAircraft.onGround ? 'No Solo' : 'Em Voo'}
                                    </p>
                                </div>
                            </div>

                            {/* Aircraft ID */}
                            <div className="p-3 rounded-xl bg-white/5 mb-4">
                                <p className="text-[10px] text-white/40 uppercase mb-1">ICAO24 Identifier</p>
                                <p className="text-sm font-mono font-bold text-rose-400">{selectedAircraft.icao24}</p>
                            </div>

                            {/* Track Status */}
                            {aircraftTrack.length > 0 && (
                                <div className="flex items-center gap-2 text-xs text-emerald-400">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    <span>{aircraftTrack.length} pontos de trajetória</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Selected Deal Panel */}
            <AnimatePresence>
                {selectedDeal && (
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="fixed left-4 md:left-6 top-1/2 -translate-y-1/2 z-50 w-72"
                    >
                        <div className="p-5 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-xl">
                            <button
                                onClick={closeDealPanel}
                                className="absolute top-3 right-3 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="mb-4">
                                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                                    {selectedDeal.iata} • {selectedDeal.country}
                                </span>
                                <h3 className="text-2xl font-black text-white mt-1">
                                    {selectedDeal.city}
                                </h3>
                            </div>

                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                                    {selectedDeal.currency}{selectedDeal.price}
                                </span>
                                <span className="text-white/40 text-sm">round trip</span>
                            </div>

                            <div className="space-y-2 mb-5 text-sm">
                                <div className="flex justify-between text-white/60">
                                    <span>Average</span>
                                    <span className="line-through">{selectedDeal.currency}{Math.round(selectedDeal.price * 1.3)}</span>
                                </div>
                                <div className="flex justify-between text-green-400">
                                    <span>Your savings</span>
                                    <span className="font-bold">-{Math.round((1 - selectedDeal.price / (selectedDeal.price * 1.3)) * 100)}%</span>
                                </div>
                            </div>

                            <Link
                                href={`/search?destination=${selectedDeal.iata}`}
                                className="block w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-center hover:shadow-lg hover:shadow-rose-500/25 transition-all"
                            >
                                Book This Deal
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Instructions Tooltip */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 md:hidden"
            >
                <div className="px-4 py-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl">
                    <span className="text-xs text-white/50">Pinch to zoom • Swipe to rotate</span>
                </div>
            </motion.div>
        </div>
    );
}
