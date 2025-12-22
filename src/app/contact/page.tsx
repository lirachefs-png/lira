import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import { Mail, MessageCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contacto | AllTrip',
    description: 'Entre em contacto com a equipa AllTrip.',
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#0B0F19]">
            <Header />

            <section className="pt-32 pb-20 px-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 text-center">
                        Fale Conosco
                    </h1>
                    <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
                        Tem alguma dúvida ou sugestão? A nossa equipa está aqui para ajudar.
                    </p>

                    {/* Contact Cards */}
                    <div className="grid gap-6">
                        {/* Email Card */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-rose-500/20 rounded-xl">
                                    <Mail className="w-6 h-6 text-rose-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">E-mail</h3>
                                    <p className="text-gray-400 text-sm mb-3">
                                        Para questões gerais, suporte ou parcerias.
                                    </p>
                                    <a
                                        href="mailto:contato@alltripapp.com"
                                        className="text-rose-400 font-medium hover:text-rose-300 transition-colors"
                                    >
                                        contato@alltripapp.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Response Time Card */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-purple-500/20 rounded-xl">
                                    <Clock className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Tempo de Resposta</h3>
                                    <p className="text-gray-400 text-sm">
                                        Respondemos normalmente em até 24 horas úteis.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Maya Card */}
                        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl p-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-indigo-500/30 rounded-xl">
                                    <MessageCircle className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Pergunte à Maya</h3>
                                    <p className="text-gray-400 text-sm mb-3">
                                        A nossa assistente de IA pode ajudar com dúvidas sobre destinos, roteiros e dicas de viagem.
                                    </p>
                                    <span className="text-indigo-400 text-sm">
                                        Clique no botão "Maya" no menu para iniciar uma conversa.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="mt-12 text-center">
                        <p className="text-xs text-gray-600">
                            AllTrip é uma plataforma tecnológica de metabusca. Não somos uma agência de viagens.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
