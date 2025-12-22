'use client';

import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X, Send, Bot, Volume2, VolumeX, MessageCircle } from 'lucide-react';

// WhatsApp number for human support (configure as needed)
const WHATSAPP_NUMBER = '351964271232';
const WHATSAPP_MESSAGE = 'Olá! Vim do chat da Maya no AllTrip e gostaria de falar com um atendente.';
import { chatWithMaya, ChatMessage } from '@/app/actions/maya-chat';
import { generateSpeech } from '@/app/actions/speak';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';

// Helper prop for parent to tell us if collapsed
type MayaChatProps = {
    isCollapsed?: boolean;
    contextPrompt?: string | null; // New: Proactive context
}

export default function MayaChat({ isCollapsed, contextPrompt }: MayaChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const hasTriggeredContext = useRef(false);

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

    // Proactive Context Trigger - Less intrusive version
    useEffect(() => {
        if (contextPrompt && !hasTriggeredContext.current && messages.length === 0) {
            hasTriggeredContext.current = true;
            // Don't auto-open - just prepare the greeting for when user opens

            setTimeout(async () => {
                setIsLoading(true);
                try {
                    // Generate a subtle, helpful greeting (not pushy)
                    const response = await chatWithMaya([
                        { role: 'system', content: `CONTEXTO: ${contextPrompt}. Ofereça ajuda de forma breve e profissional (1 frase curta). Sem exclamações excessivas.` }
                    ]);
                    const newAiMessage: ChatMessage = { role: 'assistant', content: response };
                    setMessages([newAiMessage]);

                    // Don't auto-play audio - let user control
                } catch (e) {
                    console.error("Maya Context Error", e);
                } finally {
                    setIsLoading(false);
                }
            }, 2000); // Longer delay, less aggressive
        }
    }, [contextPrompt]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const newUserMessage: ChatMessage = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

        // Stop any current speech when sending new message
        if (audioRef.current) {
            audioRef.current.pause();
            setIsSpeaking(false);
        }

        try {
            const response = await chatWithMaya([...messages, newUserMessage]);
            const newAiMessage: ChatMessage = { role: 'assistant', content: response };
            setMessages(prev => [...prev, newAiMessage]);

            // Audio Generation (Auto-play if not muted)
            if (!isMuted) {
                try {
                    const audioBase64 = await generateSpeech(response);
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
                    className="fixed bottom-20 right-4 sm:right-10 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-[#151926] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[99999]"
                >

                    {/* Header (Draggable Handle) */}
                    <div
                        onPointerDown={(e) => dragControls.start(e)}
                        className="p-4 bg-indigo-600 flex items-center justify-between shrink-0 shadow-md z-10 relative cursor-grab active:cursor-grabbing touch-none select-none"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10">
                                <div className={`absolute inset-0 rounded-full border border-white/20 flex items-center justify-center bg-indigo-500/50 transition-all ${isSpeaking ? 'scale-110 border-indigo-300 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : ''}`}>
                                    {isSpeaking ? (
                                        <div className="flex gap-0.5 items-end justify-center h-4 pb-1">
                                            <span className="w-0.5 h-2 bg-white animate-[bounce_0.5s_infinite]"></span>
                                            <span className="w-0.5 h-3 bg-white animate-[bounce_0.6s_infinite]"></span>
                                            <span className="w-0.5 h-1.5 bg-white animate-[bounce_0.4s_infinite]"></span>
                                        </div>
                                    ) : (
                                        <Bot className="w-6 h-6 text-white" />
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg leading-tight flex items-center gap-2">
                                    Maya AI
                                    {isSpeaking && <span className="text-[10px] bg-white/20 px-1.5 rounded text-white animate-pulse">Falando...</span>}
                                </h3>
                                <p className="text-indigo-200 text-xs">Guia Poliglota & Inteligente</p>
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
                                title={isMuted ? "Ativar Voz" : "Mutar Voz"}
                            >
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-black/20">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 p-6 space-y-4">
                                <Sparkles className="w-12 h-12 mb-2 opacity-50" />
                                <p className="text-sm">
                                    "Olá! Sou a Maya. 🌍<br />
                                    Falo várias línguas e adoro viajar.<br />
                                    Me pergunte qualquer coisa!"
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    <button onClick={() => { setInputValue('Sugira uma praia barata no Brasil'); handleSendMessage(); }} className="text-xs bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">🏖️ Praia Barata</button>
                                    <button onClick={() => { setInputValue('Roteiro romântico na Europa'); handleSendMessage(); }} className="text-xs bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">💘 Europa a dois</button>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div
                                        className={`rounded-2xl px-4 py-3 text-sm shadow-sm relative group/msg ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-500/20'
                                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/5 rounded-bl-none'
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{
                                            __html: msg.content
                                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                        }} />
                                    </div>
                                    {/* WhatsApp button - green branded */}
                                    {msg.role === 'assistant' && idx === messages.length - 1 && (
                                        <a
                                            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-medium rounded-full transition-all shadow-lg shadow-green-500/20 hover:scale-105"
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            Falar com Atendente
                                        </a>
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

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Pergunte em qualquer idioma..."
                            className="flex-1 bg-slate-100 dark:bg-black/40 border-none rounded-full px-4 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-400"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isLoading}
                            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-500/20"
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

            {/* --- TRIGGER BUTTON --- */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group ${isCollapsed ? 'justify-center p-2 w-10 h-10 px-0' : ''}`}
            >
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                {!isCollapsed && <span>Maya</span>}
            </button>

            {PortalModal}
        </div>
    );
}
