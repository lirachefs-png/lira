'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Square, CheckCircle2, Bot, Sparkles, ChevronRight, Save } from 'lucide-react';
import { saveUserPersona } from '@/app/actions/user-profile';

interface MayaInterviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const QUESTIONS = [
    {
        id: 'travel_style',
        text: 'Como você descreveria seu estilo de viagem? (Ex: Luxo, Aventura, Econômico, Familiar)',
        placeholder: 'Fale sobre como você gosta de viajar...'
    },
    {
        id: 'dream_destinations',
        text: 'Quais são os destinos dos seus sonhos para as próximas férias?',
        placeholder: 'Ex: Maldivas, Japão, Alagoas...'
    },
    {
        id: 'companion',
        text: 'Com quem você costuma viajar na maioria das vezes?',
        placeholder: 'Ex: Sozinho, em casal, com amigos...'
    },
    {
        id: 'budget_level',
        text: 'Qual seu orçamento médio habitual para viagens?',
        placeholder: 'Ex: Econômico (Mochilão), Conforto (3-4 estrelas), ou Luxo total?'
    },
    {
        id: 'dietary_restrictions',
        text: 'Você possui alguma alergia alimentar ou restrição dietética importante?',
        placeholder: 'Ex: Alérgico a camarão, Vegetariano, Intolerante a glúten...'
    },
    {
        id: 'travel_rhythm',
        text: 'Como é seu ritmo ideal de viagem?',
        placeholder: 'Ex: Acordar cedo para ver tudo ou dormir até tarde e relaxar?'
    },
    {
        id: 'favorite_activities',
        text: 'O que não pode faltar no seu roteiro? (Interesses)',
        placeholder: 'Ex: Gastronomia, Museus, Trilhas, Compras...'
    },
    {
        id: 'additional_bio',
        text: 'Algo mais que a Maya deva saber sobre você?',
        placeholder: 'Espaço livre para contar mais sobre sua personalidade viajante...'
    }
];

export default function MayaInterviewModal({ isOpen, onClose }: MayaInterviewModalProps) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isRecording, setIsRecording] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [transcription, setTranscription] = useState('');
    const recognitionRef = useRef<any>(null);

    // Initialize Web Speech API
    useEffect(() => {
        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'pt-BR';

            recognitionRef.current.onresult = (event: any) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                setTranscription(finalTranscript || interimTranscript);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }
    }, []);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
        } else {
            setTranscription('');
            recognitionRef.current?.start();
            setIsRecording(true);
        }
    };

    const handleNext = () => {
        const currentQuestion = QUESTIONS[step];
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: transcription || prev[currentQuestion.id] || '' }));
        setTranscription('');

        if (step < QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            handleSave();
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        const result = await saveUserPersona(answers);
        setIsSaving(false);
        if (result.success) {
            onClose();
            // Optional: Show success toast
        }
    };

    const progress = ((step + 1) / QUESTIONS.length) * 100;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/10"
                    >
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-white">
                                    <h3 className="font-bold flex items-center gap-2 italic">
                                        Entrevista Maya
                                        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                                    </h3>
                                    <p className="text-xs text-indigo-100">Conte-nos sobre seus sonhos de viagem</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1 bg-slate-100 dark:bg-white/5 w-full">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            />
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                        {QUESTIONS[step].text}
                                    </h2>

                                    <div className="relative group">
                                        <textarea
                                            value={transcription || answers[QUESTIONS[step].id] || ''}
                                            onChange={(e) => setTranscription(e.target.value)}
                                            placeholder={QUESTIONS[step].placeholder}
                                            className="w-full h-32 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm"
                                        />

                                        {isRecording && (
                                            <div className="absolute top-4 right-4 flex items-center gap-2">
                                                <div className="flex gap-1 items-end h-3">
                                                    <span className="w-0.5 h-2 bg-rose-500 animate-[bounce_0.5s_infinite]"></span>
                                                    <span className="w-0.5 h-3 bg-rose-500 animate-[bounce_0.6s_infinite]"></span>
                                                    <span className="w-0.5 h-1.5 bg-rose-500 animate-[bounce_0.4s_infinite]"></span>
                                                </div>
                                                <span className="text-[10px] text-rose-500 font-bold animate-pulse">Gravando...</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={toggleRecording}
                                            className={`p-4 rounded-full transition-all shadow-lg ${isRecording
                                                ? 'bg-rose-500 text-white shadow-rose-500/20'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20 hover:scale-110 active:scale-95'
                                                }`}
                                        >
                                            {isRecording ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-6 h-6" />}
                                        </button>

                                        <div className="flex-1 text-xs text-slate-500 dark:text-gray-400">
                                            {isRecording
                                                ? "A Maya está ouvindo... Fale com naturalidade."
                                                : "Clique no microfone e fale sua resposta para a Maya."}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400">
                                Passagem {step + 1} de {QUESTIONS.length}
                            </span>

                            <button
                                onClick={handleNext}
                                disabled={isSaving}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <>Ouvindo...</>
                                ) : step === QUESTIONS.length - 1 ? (
                                    <>Finalizar <CheckCircle2 className="w-4 h-4" /></>
                                ) : (
                                    <>Próximo <ChevronRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
