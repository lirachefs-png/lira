'use client';

import { useState, useRef } from 'react';
import { Upload, Mic, Loader2, CheckCircle, AlertCircle, StopCircle, Trash2, Play } from 'lucide-react';
import { cloneVoice } from '@/app/actions/clone-voice';
import { motion } from 'framer-motion';

export default function VoiceStudio() {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; voiceId?: string; error?: string } | null>(null);

    // Recording State
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                // ElevenLabs works well with mp3/webm. Browser creates webm/ogg usually.
                const recordedFile = new File([blob], "gravacao_mic.webm", { type: 'audio/webm' });
                setFile(recordedFile);
                setResult(null);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Mic Error:", err);
            alert("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            // Stop all tracks to release mic
            if (mediaRecorderRef.current.stream) {
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !name) return;

        setIsLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);

        const res = await cloneVoice(formData);
        setResult(res);
        setIsLoading(false);
    };

    return (
        <div className="bg-white dark:bg-[#151926] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <Mic className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Estúdio de Voz</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Grave ou envie um áudio para clonar.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Voice Name Input */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome da Voz</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Minha Voz, Voz do Chefe..."
                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-900 dark:text-white"
                        required
                    />
                </div>

                {/* RECORDING / UPLOAD AREA */}
                <div className="flex flex-col gap-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Captura de Áudio</label>

                    {!file && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Option 1: Record */}
                            <div
                                onClick={isRecording ? stopRecording : startRecording}
                                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all select-none ${isRecording
                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/10 animate-pulse'
                                        : 'border-slate-200 dark:border-white/10 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-white/5'
                                    }`}
                            >
                                {isRecording ? (
                                    <>
                                        <StopCircle className="w-10 h-10 text-red-500 mb-2" />
                                        <span className="font-bold text-red-600 dark:text-red-400">Gravando...</span>
                                        <span className="text-xs text-red-400">Clique para parar</span>
                                    </>
                                ) : (
                                    <>
                                        <Mic className="w-8 h-8 text-slate-400 mb-2" />
                                        <span className="font-medium text-slate-700 dark:text-slate-300">Gravar Agora</span>
                                        <span className="text-xs text-slate-400 mt-1">Clique para começar</span>
                                    </>
                                )}
                            </div>

                            {/* Option 2: Upload */}
                            <div className="relative border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    id="file-upload-input"
                                />
                                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                <span className="font-medium text-slate-700 dark:text-slate-300">Upload Arquivo</span>
                                <span className="text-xs text-slate-400 mt-1">MP3, WAV, M4A</span>
                            </div>
                        </div>
                    )}

                    {file && (
                        <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-xl p-4 flex items-center justify-between animate-in fade-in zoom-in-95">
                            <div className="flex items-center gap-3">
                                <div onClick={() => {
                                    const audio = new Audio(URL.createObjectURL(file));
                                    audio.play();
                                }} className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400 cursor-pointer hover:bg-indigo-200 transition-colors" title="Preview Audio">
                                    <Play className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden">
                                    {/* Show filename or proper label for recording */}
                                    <p className="font-bold text-sm text-indigo-900 dark:text-indigo-200 truncate max-w-[200px]">
                                        {file.name === 'gravacao_mic.webm' ? 'Gravação de Voz' : file.name}
                                    </p>
                                    <p className="text-xs text-indigo-600 dark:text-indigo-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setFile(null); setResult(null); }}
                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!file || !name || isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Clonando... (Aguarde)</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            <span>Confirmar e Clonar Voz</span>
                        </>
                    )}
                </button>
            </form>

            {/* Result Display */}
            {result?.success && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl p-4 flex items-start gap-3"
                >
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-green-700 dark:text-green-400 text-sm">Sucesso! Voz Criada.</h4>
                        <p className="text-xs text-green-600 dark:text-green-300 mt-1">ID da Voz: <code className="bg-white/50 dark:bg-black/20 px-1 py-0.5 rounded font-mono select-all text-[10px]">{result.voiceId}</code></p>
                        <p className="text-xs text-green-600 dark:text-green-300 mt-2 italic">Envie esse ID no chat para eu ativar como a voz da Maya!</p>
                    </div>
                </motion.div>
            )}

            {result?.error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex items-start gap-3"
                >
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-red-700 dark:text-red-400 text-sm">Erro ao clonar</h4>
                        <p className="text-xs text-red-600 dark:text-red-300 mt-1">{result.error}</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
