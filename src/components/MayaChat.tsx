'use client';

import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X, Send, Bot, Volume2, VolumeX, MessageCircle, Plane, Mic, Square, Maximize2, Minimize2, Globe } from 'lucide-react';
import { chatWithMaya, ChatMessage } from '@/app/actions/maya-chat';
import ItineraryBlock from './ItineraryBlock';
import { generateSpeech } from '@/app/actions/speak';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { useRegion } from '@/contexts/RegionContext';
import { useRouter } from 'next/navigation';

// Helper prop for parent to tell us if collapsed
type MayaChatProps = {
    isCollapsed?: boolean;
    contextPrompt?: string | null;
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    hideTrigger?: boolean;
}

export function EdenTriggerButton({ onClick, isCollapsed = false, className = '' }: { onClick?: () => void, isCollapsed?: boolean, className?: string }) {
    return (
        <button
            onClick={onClick}
            className={`relative flex items-center justify-center gap-2 overflow-hidden rounded-full text-white font-medium text-sm transition-all duration-300 hover:scale-105 group ${isCollapsed ? 'w-10 h-10' : 'w-[120px] py-2'} ${className}`}
            style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 25%, #06b6d4 50%, #c026d3 75%, #7c3aed 100%)',
                backgroundSize: '400% 400%',
                animation: 'globeGradient 4s ease infinite, pulseGlow 3s ease-in-out infinite',
            }}
        >
            {/* Rotating Border Light with Comet Trail */}
            <div
                className="absolute inset-0 rounded-full"
                style={{
                    background: 'conic-gradient(from 0deg, transparent 0%, transparent 60%, rgba(6,182,212,0.3) 70%, rgba(192,38,211,0.6) 85%, rgba(255,255,255,0.9) 95%, transparent 100%)',
                    animation: 'rotateBorder 2.5s linear infinite'
                }}
            />

            {/* Inner Galaxy Background */}
            <div
                className="absolute inset-[2px] rounded-full overflow-hidden"
                style={{
                    background: 'radial-gradient(ellipse at 30% 30%, #4c1d95 0%, #2e1065 30%, #1e1b4b 60%, #0f172a 100%)',
                    boxShadow: 'inset 0 0 15px rgba(167, 139, 250, 0.4), inset 0 0 30px rgba(6, 182, 212, 0.2)'
                }}
            >
                {/* Animated Stars - Refined & Smaller */}
                <div className="absolute inset-0">
                    <div className="absolute w-[2px] h-[2px] bg-white rounded-full top-[20%] left-[15%]" style={{ animation: 'twinkle 2s ease-in-out infinite' }} />
                    <div className="absolute w-[1px] h-[1px] bg-cyan-300 rounded-full top-[60%] left-[25%]" style={{ animation: 'twinkle 3s ease-in-out infinite 0.5s' }} />
                    <div className="absolute w-[2px] h-[2px] bg-purple-300 rounded-full top-[30%] left-[70%]" style={{ animation: 'twinkle 2.5s ease-in-out infinite 1s' }} />
                    <div className="absolute w-[1px] h-[1px] bg-white rounded-full top-[70%] left-[80%]" style={{ animation: 'twinkle 1.8s ease-in-out infinite 0.3s' }} />
                    <div className="absolute w-[1px] h-[1px] bg-fuchsia-300 rounded-full top-[45%] left-[50%]" style={{ animation: 'twinkle 2.2s ease-in-out infinite 0.7s' }} />
                    {/* Extra tiny stars */}
                    <div className="absolute w-[1px] h-[1px] bg-white/70 rounded-full top-[15%] left-[85%]" style={{ animation: 'twinkle 4s ease-in-out infinite 2s' }} />
                    <div className="absolute w-[1px] h-[1px] bg-cyan-200/70 rounded-full top-[85%] left-[40%]" style={{ animation: 'twinkle 3.5s ease-in-out infinite 1.5s' }} />
                </div>
            </div>

            {/* Content - Globe with Float Animation */}
            <Globe
                className="relative z-10 w-5 h-5 text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                style={{ animation: 'spinGlobe 8s linear infinite, floatGlobe 3s ease-in-out infinite' }}
            />

            {/* Text with Gradient */}
            {!isCollapsed && (
                <span
                    className="relative z-10 tracking-wide font-semibold"
                    style={{
                        background: 'linear-gradient(90deg, #ffffff 0%, #67e8f9 50%, #ffffff 100%)',
                        backgroundSize: '200% 100%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        animation: 'textGradient 3s ease infinite'
                    }}
                >
                    Éden
                </span>
            )}

            {/* Shine Effect */}
            <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
                    animation: 'shinePass 2s ease-in-out infinite'
                }}
            />
        </button>
    );
}

function EdenExperienceCard({ title, image, onClick }: { title: string, image: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="group relative w-full h-24 overflow-hidden rounded-xl border border-white/10 shadow-lg hover:shadow-cyan-500/20 transition-all duration-500 hover:scale-[1.02]"
        >
            {/* Background Image with Parallax Effect */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${image})` }}
            />

            {/* Glass Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent backdrop-blur-[1px] group-hover:backdrop-blur-none transition-all duration-500" />

            {/* Content */}
            <div className="relative h-full flex items-center px-5 transform transition-transform duration-500 group-hover:translate-x-2">
                <div className="flex flex-col items-start gap-1">
                    <span className="text-xs font-medium text-cyan-300 tracking-wider uppercase opacity-80 group-hover:opacity-100 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        Explorar
                    </span>
                    <h3 className="text-lg font-bold text-white leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-200 transition-all">
                        {title}
                    </h3>
                </div>

                {/* Arrow Icon that appears on hover */}
                <div className="absolute right-4 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                    <Globe className="w-5 h-5 text-cyan-300" />
                </div>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </button>
    );
}


function DealCard({ data, onClick }: { data: any, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full relative overflow-hidden rounded-2xl border border-rose-500/30 shadow-xl shadow-rose-900/20 group hover:scale-[1.02] transition-transform duration-300 mt-2"
        >
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop)` }}>
                {/* Image fallback - in real implementation use data.image */}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            <div className="relative p-5 flex flex-col items-start gap-1">
                <div className="flex justify-between w-full items-start">
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse shadow-lg shadow-rose-500/40">
                        🔥 PROMOÇÃO RELÂMPAGO
                    </span>
                    {data.drop > 5 && (
                        <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-lg border border-white/10">
                            -{data.drop}% OFF
                        </span>
                    )}
                </div>

                <div className="mt-8 space-y-1 text-left">
                    <p className="text-white/80 text-xs font-medium uppercase tracking-wider">{data.origin} ➔ {data.destination}</p>
                    <h3 className="text-2xl font-black text-white leading-none">
                        {data.destinationName || data.destination}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                            €{data.price}
                        </span>
                        {data.previous > 0 && (
                            <span className="text-white/40 text-sm line-through decoration-rose-500/50">
                                €{data.previous}
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-4 w-full py-2 bg-white text-rose-600 font-bold text-sm rounded-xl hover:bg-rose-50 transition-colors flex items-center justify-center gap-2">
                    Ver Oferta <Plane className="w-4 h-4" />
                </div>
            </div>
        </button>
    );
}

export default function MayaChat({ isCollapsed, contextPrompt, isOpen: controlledIsOpen, onOpenChange, hideTrigger }: MayaChatProps) {
    const { labels, language } = useRegion();
    const router = useRouter();

    // Internal state for when uncontrolled
    const [internalIsOpen, setInternalIsOpen] = useState(isCollapsed === false);

    // Resolve effectively open state
    const isChatOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

    const handleOpenChange = (open: boolean) => {
        if (onOpenChange) {
            onOpenChange(open);
        } else {
            setInternalIsOpen(open);
        }
    };

    const isOpen = isChatOpen;
    const setIsOpen = handleOpenChange;

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);
    const hasTriggeredContext = useRef(false);

    // Pending search state for auto-navigation
    const [pendingSearch, setPendingSearch] = useState<{ url: string; displayText: string; destination: string } | null>(null);

    // Expanded/Fullscreen state - starts expanded
    const [isExpanded, setIsExpanded] = useState(true);

    // Drag Controls
    const dragControls = useDragControls();

    // Audio State
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setMounted(true);
        scrollToBottom();
    }, [messages, isOpen]);

    // Check for Hot Deals on Mount
    useEffect(() => {
        const checkDeals = async () => {
            if (messages.length > 0) return; // Only if empty

            try {
                const hasSeenAlert = sessionStorage.getItem('maya_deal_alert_v1');
                if (hasSeenAlert) return;

                const { createClient } = await import('@/lib/supabase/client');
                const supabase = createClient();
                const { data } = await supabase.from('flight_cache')
                    .select('*')
                    .gt('drop_percentage', 0)
                    .order('drop_percentage', { ascending: false })
                    .limit(1)
                    .single();

                if (data) {
                    sessionStorage.setItem('maya_deal_alert_v1', 'true');

                    const cityMap: Record<string, string> = { 'CDG': 'Paris', 'LHR': 'Londres', 'FCO': 'Roma', 'JFK': 'Nova York' };
                    const destName = cityMap[data.destination] || data.destination;

                    const dealJson = JSON.stringify({
                        origin: data.origin,
                        destination: data.destination,
                        destinationName: destName,
                        price: data.price,
                        previous: data.previous_price,
                        drop: data.drop_percentage
                    });

                    setTimeout(() => {
                        setIsOpen(true);
                        const alertMsg: ChatMessage = {
                            role: 'assistant',
                            content: `🚨 **Alerta de Oportunidade!**\n\nEncontrei uma queda de preço para **${destName}**. Olha isso:\n\n[RENDER_DEAL:${dealJson}]`
                        };
                        setMessages(prev => [...prev, alertMsg]);

                        // Optional: Play sound
                        if (!isMuted && audioRef.current) {
                            // Could generate speech here "Encontrei uma oferta..."
                        }
                    }, 1500);
                }
            } catch (e) {
                console.error("Deal check failed", e);
            }
        };
        checkDeals();
    }, []);

    // Initialize Web Speech API
    useEffect(() => {
        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'pt-BR'; // Portuguese Brazilian as default

            recognitionRef.current.onresult = (event: any) => {
                let interimTranscript = '';

                // Build the complete transcript from all results
                let fullTranscript = '';
                for (let i = 0; i < event.results.length; ++i) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        fullTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                // Show accumulated final + current interim, appending to what was there before
                const currentSpeech = (fullTranscript + interimTranscript).trim();
                const prefix = textBeforeRecording.current ? textBeforeRecording.current + ' ' : '';
                setInputValue(prefix + currentSpeech);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty deps - speech recognition initializes once, browser auto-detects language

    const textBeforeRecording = useRef('');

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
        } else {
            // Save current input value to append to it
            textBeforeRecording.current = inputValue;
            recognitionRef.current?.start();
            setIsRecording(true);
        }
    };

    // Proactive Context Trigger - Show context message immediately
    useEffect(() => {
        if (contextPrompt && !hasTriggeredContext.current && messages.length === 0) {
            hasTriggeredContext.current = true;

            // Show the context message immediately without API call
            setTimeout(() => {
                const welcomeMessage: ChatMessage = {
                    role: 'assistant',
                    content: contextPrompt // Use the exact context as the first message
                };
                setMessages([welcomeMessage]);
            }, 500); // Short delay for smooth appearance
        }
    }, [contextPrompt]);

    // Check if user message is a confirmation
    const isConfirmation = (text: string): boolean => {
        const confirmWords = ['sim', 'yes', 'ok', 'va', 'vai', 'buscar', 'busca', 'procura', 'procurar', 'pode', 'claro', 'bora', 'vamos', 'confirma', 'confirmo', 'isso', 'exato', 'perfeito', 'sure', 'go', 'search', 'find'];
        const lowerText = text.toLowerCase().trim();
        return confirmWords.some(word => lowerText.includes(word)) || lowerText.length <= 5;
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userText = inputValue.trim();
        const newUserMessage: ChatMessage = { role: 'user', content: userText };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

        // Stop any current speech when sending new message
        if (audioRef.current) {
            audioRef.current.pause();
            setIsSpeaking(false);
        }

        // Stop and reset voice recording if active
        if (isRecording && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsRecording(false);
        }

        // Check if there's a pending search and user confirmed
        if (pendingSearch && isConfirmation(userText)) {
            // User confirmed! Navigate to search
            const confirmMessage: ChatMessage = {
                role: 'assistant',
                content: `✈️ A abrir busca para **${pendingSearch.destination}**... Boa viagem!`
            };
            setMessages(prev => [...prev, confirmMessage]);
            setIsLoading(false);

            // Navigate after brief delay for smooth UX
            setTimeout(() => {
                router.push(pendingSearch.url);
                setIsOpen(false);
                setPendingSearch(null);
            }, 800);
            return;
        }

        // Clear pending search if user sends something else
        if (pendingSearch && !isConfirmation(userText)) {
            setPendingSearch(null);
        }

        try {
            // Get user's timezone from browser
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            let response = await chatWithMaya([...messages, newUserMessage], userTimezone);

            // Check for Duffel Assistant trigger
            const DUFFEL_TRIGGER = '[OPEN_DUFFEL_ASSISTANT]';
            const hasSupportTrigger = response.includes(DUFFEL_TRIGGER);

            // Check for Flight Search trigger - format: [SEARCH_FLIGHTS:url:displayText]
            const SEARCH_TRIGGER_REGEX = /\[SEARCH_FLIGHTS:([^:]+):([^\]]+)\]/;
            const searchMatch = response.match(SEARCH_TRIGGER_REGEX);

            // Remove trigger from visible message
            if (hasSupportTrigger) {
                response = response.replace(DUFFEL_TRIGGER, '').trim();
                response += '\n\n🎧 **Clique abaixo para abrir o Assistente de Viagens:**';
            }

            // Handle search trigger - save as pending and ask for confirmation
            if (searchMatch) {
                const [fullMatch, searchUrl, displayText] = searchMatch;
                response = response.replace(fullMatch, '').trim();

                // Extract destination from displayText (format: "🔍 Buscar voos Origin → Destination")
                const destMatch = displayText.match(/→\s*(.+)$/);
                const destination = destMatch ? destMatch[1].trim() : 'destino';

                // Save pending search
                setPendingSearch({ url: searchUrl, displayText, destination });

                // Direct Search Button (No confirmation needed per user request)
                response += `\n\n[FLIGHT_SEARCH_BUTTON:${searchUrl}:${displayText}]`;
            }

            const newAiMessage: ChatMessage = {
                role: 'assistant',
                content: response,
            };
            setMessages(prev => [...prev, newAiMessage]);

            // Audio Generation (Auto-play if not muted)
            if (!isMuted) {
                try {
                    const audioBase64 = await generateSpeech(response.replace(/\[.*?\]/g, ''));
                    if (audioBase64 && audioRef.current) {
                        audioRef.current.src = audioBase64;
                        audioRef.current.play().catch(e => console.warn("Audio play blocked by browser:", e));
                        setIsSpeaking(true);
                    }
                } catch (audioErr) {
                    console.error("Audio generation failed:", audioErr);
                }
            }

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Use Portal to render the chat modal outside the sidebar's stacking context
    const ChatModal = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2 }}
                    drag
                    dragListener={false}
                    dragMomentum={false}
                    dragControls={dragControls}
                    className={`fixed backdrop-blur-xl bg-black/70 border-0 sm:border border-white/10 rounded-none sm:rounded-3xl shadow-2xl shadow-purple-500/20 flex flex-col overflow-hidden z-[99999] transition-all duration-300
                    ${isExpanded
                            ? 'inset-0 h-[100dvh] w-full sm:inset-8 sm:w-auto sm:h-auto'
                            : 'inset-0 h-[100dvh] w-full sm:inset-auto sm:bottom-20 sm:right-10 sm:w-[420px] sm:h-[550px]'
                        }`}
                    style={{
                        background: 'linear-gradient(135deg, rgba(15,15,25,0.95) 0%, rgba(25,20,40,0.9) 100%)'
                    }}
                >

                    {/* Header (Draggable Handle) - Éden Glass Style */}
                    <div
                        onPointerDown={(e) => dragControls.start(e)}
                        className="p-4 bg-gradient-to-r from-purple-600/80 via-fuchsia-600/80 to-cyan-500/80 backdrop-blur-md flex items-center justify-between shrink-0 shadow-lg z-10 relative cursor-grab active:cursor-grabbing touch-none select-none border-b border-white/10"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10">
                                <div className={`absolute inset-0 rounded-full border border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm transition-all ${isSpeaking ? 'scale-110 border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]' : ''}`}>
                                    {isSpeaking ? (
                                        <div className="flex gap-0.5 items-end justify-center h-4 pb-1">
                                            <span className="w-0.5 h-2 bg-white animate-[bounce_0.5s_infinite]"></span>
                                            <span className="w-0.5 h-3 bg-white animate-[bounce_0.6s_infinite]"></span>
                                            <span className="w-0.5 h-1.5 bg-white animate-[bounce_0.4s_infinite]"></span>
                                        </div>
                                    ) : (
                                        <Globe className="w-5 h-5 text-cyan-300 animate-[spinGlobe_10s_linear_infinite]" />
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg leading-tight flex items-center gap-2">
                                    Éden Experiências
                                    {isSpeaking && <span className="text-[10px] bg-white/20 px-1.5 rounded text-white animate-pulse">{labels.maya_chat.speaking}</span>}
                                </h3>
                                <p className="text-white/60 text-xs">Chat Oficial do AllTrip</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => {
                                    if (isSpeaking && audioRef.current) {
                                        audioRef.current.pause();
                                        setIsSpeaking(false);
                                        setIsMuted(true);
                                    } else {
                                        setIsMuted(!isMuted);
                                    }
                                }}
                                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                                title={isMuted ? labels.maya_chat.activate_voice : labels.maya_chat.mute_voice}
                            >
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                                title={isExpanded ? 'Minimizar' : 'Expandir'}
                            >
                                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area - Glass Style */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center p-6 space-y-8">
                                <div className="text-center space-y-2">
                                    <div className="inline-block relative">
                                        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
                                        <Globe className="relative w-12 h-12 text-white/90 animate-[spinGlobe_20s_linear_infinite]" />
                                    </div>
                                    <p className="text-sm text-white/70 max-w-[280px] mx-auto leading-relaxed">
                                        Qual dimensão vamos explorar hoje?<br />
                                        <span className="text-white/40 text-xs">A escolha é sua.</span>
                                    </p>
                                </div>

                                <div className="w-full max-w-sm flex flex-col gap-3">
                                    <EdenExperienceCard
                                        title="Jóias Ocultas"
                                        image="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=600&auto=format&fit=crop"
                                        onClick={() => { setInputValue('Quero descobrir jóias ocultas e destinos pouco explorados'); handleSendMessage(); }}
                                    />
                                    <EdenExperienceCard
                                        title="Oásis Privados"
                                        image="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=600&auto=format&fit=crop"
                                        onClick={() => { setInputValue('Procuro oásis privados e experiências de puro luxo'); handleSendMessage(); }}
                                    />
                                    <EdenExperienceCard
                                        title="Rotas Selvagens"
                                        image="https://images.unsplash.com/photo-1533692328991-0815989768f5?q=80&w=600&auto=format&fit=crop"
                                        onClick={() => { setInputValue('Quero aventura e rotas selvagens na natureza'); handleSendMessage(); }}
                                    />
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div
                                        className={`rounded-2xl px-4 py-3 text-sm shadow-lg relative group/msg ${msg.role === 'user'
                                            ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-br-none shadow-purple-500/30'
                                            : 'bg-white/10 backdrop-blur-sm text-white border border-white/10 rounded-bl-none'
                                            }`}
                                    >
                                        <div>
                                            {/* Parse and render message content */}
                                            {/* Parse and render message content */}
                                            {(() => {
                                                const searchButtonMatch = msg.content.match(/\[FLIGHT_SEARCH_BUTTON:([^:]+):([^\]]+)\]/);

                                                // Check for Deal Card Tag
                                                let dealData = null;
                                                const dealTagStartIndex = msg.content.indexOf('[RENDER_DEAL:');
                                                let displayContent = msg.content;

                                                if (dealTagStartIndex !== -1) {
                                                    const jsonStart = msg.content.indexOf('{', dealTagStartIndex);
                                                    if (jsonStart !== -1) {
                                                        // Find balanced end or simple } for now
                                                        // Using simple index for safety in prompt, assuming JSON doesn't contain nested braces for this simple object
                                                        const jsonEnd = msg.content.indexOf('}]', jsonStart);
                                                        if (jsonEnd !== -1) {
                                                            try {
                                                                const jsonStr = msg.content.substring(jsonStart, jsonEnd + 2); // Include }]? No, object ends at }
                                                                // Actually let's just grab the substring carefully
                                                                // The tag is [RENDER_DEAL:{...}]
                                                                // jsonStart is first {
                                                                // We need to find the matching }
                                                                // Let's assume the tag closes with ]
                                                                const tagEnd = msg.content.indexOf(']', jsonStart);
                                                                if (tagEnd !== -1) {
                                                                    const jsonStr = msg.content.substring(jsonStart, tagEnd); // Check if clean
                                                                    dealData = JSON.parse(jsonStr);
                                                                }
                                                            } catch (e) { console.error(e); }
                                                        }
                                                    }
                                                    displayContent = msg.content.substring(0, dealTagStartIndex).trim();
                                                }

                                                // Check for Itinerary Render Tag - Using balanced extraction
                                                let itineraryData = null;
                                                const itineraryTagStart = msg.content.indexOf('[RENDER_ITINERARY:');
                                                if (itineraryTagStart !== -1) {
                                                    // Find the JSON start (first { after the tag)
                                                    const jsonStart = msg.content.indexOf('{', itineraryTagStart);
                                                    if (jsonStart !== -1) {
                                                        // Count braces to find balanced end
                                                        let braceCount = 0;
                                                        let jsonEnd = jsonStart;
                                                        for (let i = jsonStart; i < msg.content.length; i++) {
                                                            if (msg.content[i] === '{') braceCount++;
                                                            if (msg.content[i] === '}') braceCount--;
                                                            if (braceCount === 0) {
                                                                jsonEnd = i + 1;
                                                                break;
                                                            }
                                                        }
                                                        try {
                                                            const jsonStr = msg.content.substring(jsonStart, jsonEnd);
                                                            itineraryData = JSON.parse(jsonStr);
                                                        } catch (e) {
                                                            console.error("Failed to parse itinerary JSON", e);
                                                        }
                                                    }
                                                }

                                                // Clean content - remove the entire itinerary tag block
                                                let cleanContent = msg.content;
                                                if (itineraryTagStart !== -1) {
                                                    // Find the closing ] after the JSON
                                                    const closingBracket = msg.content.indexOf(']', msg.content.lastIndexOf('}'));
                                                    if (closingBracket !== -1) {
                                                        cleanContent = msg.content.substring(0, itineraryTagStart) + msg.content.substring(closingBracket + 1);
                                                    }
                                                }
                                                cleanContent = cleanContent
                                                    .replace(/\[FLIGHT_SEARCH_BUTTON:[^\]]+\]/g, '')
                                                    .trim();

                                                if (dealTagStartIndex !== -1) {
                                                    cleanContent = displayContent;
                                                }

                                                return (
                                                    <>
                                                        <p className="whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{
                                                            __html: cleanContent
                                                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                                        }} />

                                                        {searchButtonMatch && (
                                                            <button
                                                                onClick={() => {
                                                                    router.push(searchButtonMatch[1]);
                                                                    setIsOpen(false);
                                                                }}
                                                                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]"
                                                            >
                                                                <Plane className="w-4 h-4" />
                                                                {searchButtonMatch[2]}
                                                            </button>
                                                        )}

                                                        {itineraryData && (
                                                            <div className="mt-4">
                                                                <ItineraryBlock data={itineraryData} />
                                                            </div>
                                                        )}

                                                        {dealData && (
                                                            <div className="mt-4 w-full">
                                                                <DealCard
                                                                    data={dealData}
                                                                    onClick={() => {
                                                                        const date = new Date(); date.setDate(date.getDate() + 30);
                                                                        const dateStr = date.toISOString().split('T')[0];
                                                                        router.push(`/search?origin=${dealData.origin}&destination=${dealData.destination}&date=${dateStr}&flexible=true`);
                                                                        setIsOpen(false);
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                    {/* Duffel Assistant button - trip support */}
                                    {msg.role === 'assistant' && idx === messages.length - 1 && (
                                        <button
                                            onClick={() => {
                                                // Redirect to my-trips where DuffelAssistantButton can properly handle authentication
                                                window.location.href = '/my-trips';
                                            }}
                                            className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-medium rounded-full transition-all shadow-lg shadow-orange-500/20 hover:scale-105"
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                                                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                                            </svg>
                                            {labels.maya_chat.manage_trip}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-slate-200 dark:border-white/5">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area - Glass Style */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-black/30 backdrop-blur-md border-t border-white/10 flex gap-2 items-center">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={isRecording ? "Éden está ouvindo..." : "Diz o que você quer..."}
                                className={`w-full bg-white/10 border border-white/10 rounded-full px-4 py-3 text-sm text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:outline-none placeholder-white/40 pr-10 transition-all ${isRecording ? 'ring-2 ring-rose-500/50 border-rose-500/50' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={toggleRecording}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${isRecording
                                    ? 'text-rose-400 animate-pulse bg-rose-500/20'
                                    : 'text-white/50 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isLoading}
                            className="p-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-full hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/30"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Only render portal when mounted on client
    const PortalModal = mounted && typeof document !== 'undefined'
        ? createPortal(ChatModal, document.body)
        : null;

    return (
        <div className="relative font-sans">
            {/* Hidden Audio Player */}
            <audio
                ref={audioRef}
                className="hidden"
                onEnded={() => setIsSpeaking(false)}
                onError={() => setIsSpeaking(false)}
            />

            {/* --- TRIGGER BUTTON - Éden Animated Globe --- */}
            {!hideTrigger && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`relative flex items-center justify-center gap-2 overflow-hidden rounded-full text-white font-medium text-sm transition-all duration-300 hover:scale-105 group ${isCollapsed ? 'w-10 h-10' : 'w-[120px] py-2'}`}
                    style={{
                        background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 25%, #06b6d4 50%, #c026d3 75%, #7c3aed 100%)',
                        backgroundSize: '400% 400%',
                        animation: 'globeGradient 4s ease infinite, pulseGlow 3s ease-in-out infinite',
                    }}
                >
                    {/* Rotating Border Light with Comet Trail */}
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background: 'conic-gradient(from 0deg, transparent 0%, transparent 60%, rgba(6,182,212,0.3) 70%, rgba(192,38,211,0.6) 85%, rgba(255,255,255,0.9) 95%, transparent 100%)',
                            animation: 'rotateBorder 2.5s linear infinite'
                        }}
                    />

                    {/* Inner Galaxy Background */}
                    <div
                        className="absolute inset-[2px] rounded-full overflow-hidden"
                        style={{
                            background: 'radial-gradient(ellipse at 30% 30%, #4c1d95 0%, #2e1065 30%, #1e1b4b 60%, #0f172a 100%)',
                            boxShadow: 'inset 0 0 15px rgba(167, 139, 250, 0.4), inset 0 0 30px rgba(6, 182, 212, 0.2)'
                        }}
                    >
                        {/* Animated Stars */}
                        <div className="absolute inset-0">
                            <div className="absolute w-1 h-1 bg-white rounded-full top-[20%] left-[15%]" style={{ animation: 'twinkle 2s ease-in-out infinite' }} />
                            <div className="absolute w-0.5 h-0.5 bg-cyan-300 rounded-full top-[60%] left-[25%]" style={{ animation: 'twinkle 3s ease-in-out infinite 0.5s' }} />
                            <div className="absolute w-1 h-1 bg-purple-300 rounded-full top-[30%] left-[70%]" style={{ animation: 'twinkle 2.5s ease-in-out infinite 1s' }} />
                            <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[70%] left-[80%]" style={{ animation: 'twinkle 1.8s ease-in-out infinite 0.3s' }} />
                            <div className="absolute w-0.5 h-0.5 bg-fuchsia-300 rounded-full top-[45%] left-[50%]" style={{ animation: 'twinkle 2.2s ease-in-out infinite 0.7s' }} />
                        </div>
                    </div>

                    {/* Content - Globe with Float Animation */}
                    <Globe
                        className="relative z-10 w-5 h-5 text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                        style={{ animation: 'spinGlobe 8s linear infinite, floatGlobe 3s ease-in-out infinite' }}
                    />

                    {/* Text with Gradient */}
                    {!isCollapsed && (
                        <span
                            className="relative z-10 tracking-wide font-semibold"
                            style={{
                                background: 'linear-gradient(90deg, #ffffff 0%, #67e8f9 50%, #ffffff 100%)',
                                backgroundSize: '200% 100%',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                animation: 'textGradient 3s ease infinite'
                            }}
                        >
                            Éden
                        </span>
                    )}

                    {/* Shine Effect */}
                    <div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
                            animation: 'shinePass 2s ease-in-out infinite'
                        }}
                    />
                </button>
            )}

            {/* CSS Animations */}
            <style jsx global>{`
                @keyframes globeGradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes rotateBorder {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes shinePass {
                    0%, 100% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                }
                @keyframes spinGlobe {
                    from { transform: rotateY(0deg); }
                    to { transform: rotateY(360deg); }
                }
                @keyframes floatGlobe {
                    0%, 100% { transform: rotateY(0deg) translateY(0px); }
                    50% { transform: rotateY(180deg) translateY(-2px); }
                }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 20px rgba(192, 38, 211, 0.5), 0 0 40px rgba(124, 58, 237, 0.3); }
                    50% { box-shadow: 0 0 30px rgba(192, 38, 211, 0.7), 0 0 60px rgba(124, 58, 237, 0.5), 0 0 80px rgba(6, 182, 212, 0.3); }
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                @keyframes textGradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
            `}</style>

            {PortalModal}
        </div>
    );
}
