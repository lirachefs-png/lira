'use client';

import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X, Send, Bot, Volume2, VolumeX } from 'lucide-react';
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

    // Proactive Context Trigger
    useEffect(() => {
        if (contextPrompt && !hasTriggeredContext.current && messages.length === 0) {
            hasTriggeredContext.current = true;
            setIsOpen(true); // Open chat automatically (optional, maybe just show badge?)

            // Artificial delay for better UX
            setTimeout(async () => {
                setIsLoading(true);
                try {
                    // Send hidden system context to generate the greeting
                    const response = await chatWithMaya([
                        { role: 'system', content: `CONTEXTO ATUAL: ${contextPrompt}. Crie uma saudação ultra-curta (1 frase) e empolgante sobre isso.` }
                    ]);
                    const newAiMessage: ChatMessage = { role: 'assistant', content: response };
                    setMessages([newAiMessage]);

                    // Auto-play audio for the proactive message? Maybe intrusive, let's keep it muted by default unless user unmuted.
                    if (!isMuted) {
                        const audioBase64 = await generateSpeech(response);
                        if (audioBase64 && audioRef.current) {
                            audioRef.current.src = audioBase64;
                            audioRef.current.play().catch(() => { });
                            setIsSpeaking(true);
                        }
                    }

                } catch (e) {
                    console.error("Maya Context Error", e);
                } finally {
                    setIsLoading(false);
                }
            }, 1000);
        }
    }, [contextPrompt, isMuted]);

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
