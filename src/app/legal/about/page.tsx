'use client';

import Link from 'next/link';
import { ArrowLeft, Scale, Shield, Building2, FileText, ExternalLink } from 'lucide-react';

export default function LegalAboutPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-white pt-24 pb-20 transition-colors">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-rose-500 mb-8 text-sm">
                    <ArrowLeft className="w-4 h-4" /> Voltar ao início
                </Link>

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
                            <Scale className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black">Enquadramento Legal</h1>
                            <p className="text-slate-500 dark:text-gray-400 text-sm">Como operamos em conformidade com a lei portuguesa e europeia</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-10">

                    {/* Section 1: O que é a AllTrip */}
                    <section className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-3">O que é a AllTrip?</h2>
                                <p className="text-slate-600 dark:text-gray-300 leading-relaxed mb-4">
                                    A <strong>AllTrip</strong> é uma <strong>plataforma de metabusca</strong> (também conhecida como comparador de preços ou motor de pesquisa de voos).
                                    A nossa função é exclusivamente tecnológica: agregamos e comparamos ofertas de voos de múltiplas companhias aéreas,
                                    apresentando os resultados de forma organizada para facilitar a escolha do consumidor.
                                </p>
                                <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-4">
                                    <p className="text-rose-700 dark:text-rose-300 font-medium text-sm">
                                        ⚠️ <strong>Não somos uma agência de viagens.</strong> Não organizamos viagens, não emitimos bilhetes diretamente,
                                        e não estamos inscritos no RNAVT (Registo Nacional das Agências de Viagens e Turismo).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Base Legal */}
                    <section className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold mb-3">Base Legal em Portugal</h2>

                                {/* Law 1 */}
                                <div className="mb-6 pb-6 border-b border-slate-200 dark:border-white/10">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                                        Decreto-Lei n.º 17/2018, de 8 de março
                                    </h3>
                                    <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                                        Este diploma estabelece o regime de acesso e exercício da atividade das agências de viagens e turismo em Portugal,
                                        transpondo a Diretiva (UE) 2015/2302 para a ordem jurídica nacional.
                                    </p>
                                    <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                                        <strong>Artigo 2.º - Definições:</strong> O diploma define "ponto de venda" como quaisquer instalações de venda a retalho,
                                        fixas ou móveis, ou um <strong>sítio web de venda a retalho ou plataforma similar de venda em linha</strong>.
                                        Esta definição abrange diretamente as plataformas de metabusca como intermediários digitais.
                                    </p>
                                    <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                                        <strong>Distinção importante:</strong> Apenas as entidades que <em>organizam viagens</em> ou vendem <em>viagens organizadas</em>
                                        necessitam de inscrição no RNAVT. Plataformas que apenas <em>comparam preços</em> e redirecionam para agentes autorizados
                                        operam como <strong>intermediários digitais</strong>, não como agências.
                                    </p>
                                    <a
                                        href="https://dre.pt/dre/detalhe/decreto-lei/17-2018-114852628"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm hover:underline"
                                    >
                                        Consultar no Diário da República <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>

                                {/* Law 2 */}
                                <div className="mb-6 pb-6 border-b border-slate-200 dark:border-white/10">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                                        Diretiva (UE) 2015/2302 - Viagens Organizadas
                                    </h3>
                                    <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                                        Esta diretiva europeia, transposta pelo Decreto-Lei 17/2018, estabelece as regras para viagens organizadas
                                        e serviços de viagem conexos no espaço europeu.
                                    </p>
                                    <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                                        <strong>Considerando (18):</strong> A diretiva clarifica que os "meros intermediários" que facilitam a compra de serviços
                                        de viagem individuais não estão sujeitos às mesmas obrigações dos organizadores de viagens, desde que não combinam
                                        serviços de forma a constituir uma viagem organizada.
                                    </p>
                                    <a
                                        href="https://eur-lex.europa.eu/legal-content/PT/TXT/?uri=CELEX%3A32015L2302"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm hover:underline"
                                    >
                                        Consultar no EUR-Lex <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>

                                {/* Law 3 */}
                                <div className="mb-6 pb-6 border-b border-slate-200 dark:border-white/10">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                                        Regulamento (UE) 2019/1150 - Intermediários Online
                                    </h3>
                                    <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                                        Este regulamento (P2B Regulation) estabelece regras para plataformas digitais que intermediam serviços entre empresas e consumidores,
                                        reconhecendo o papel legítimo dos comparadores e motores de pesquisa no ecossistema digital europeu.
                                    </p>
                                    <a
                                        href="https://eur-lex.europa.eu/legal-content/PT/TXT/?uri=CELEX%3A32019R1150"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm hover:underline"
                                    >
                                        Consultar no EUR-Lex <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>

                                {/* Law 4 */}
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                                        Decreto-Lei n.º 7/2004 - Comércio Eletrónico
                                    </h3>
                                    <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                                        Transpõe a Diretiva do Comércio Eletrónico (2000/31/CE) para Portugal.
                                        Estabelece que os <strong>prestadores de serviços de intermediação</strong> (como plataformas de metabusca)
                                        não são responsáveis pelo conteúdo transmitido ou armazenado, desde que não tenham conhecimento efetivo de atividade ilícita.
                                    </p>
                                    <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                                        <strong>Artigo 12.º a 14.º:</strong> Definem as isenções de responsabilidade para intermediários técnicos,
                                        categoria na qual se inserem os comparadores de preços online.
                                    </p>
                                    <a
                                        href="https://dre.pt/dre/detalhe/decreto-lei/7-2004-545035"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm hover:underline"
                                    >
                                        Consultar no Diário da República <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Parceiro de Reservas */}
                    <section className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-3">O Nosso Parceiro de Reservas: Duffel</h2>
                                <p className="text-slate-600 dark:text-gray-300 leading-relaxed mb-4">
                                    Todas as reservas efetuadas através da AllTrip são processadas pela <strong>Duffel</strong>,
                                    uma plataforma tecnológica com sede no Reino Unido, que atua como <strong>agente IATA autorizado</strong>.
                                </p>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-gray-300">
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-500 mt-0.5">✓</span>
                                        <span><strong>Agente IATA:</strong> A Duffel possui número IATA e está autorizada a emitir bilhetes em nome das companhias aéreas</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-500 mt-0.5">✓</span>
                                        <span><strong>PCI-DSS Nível 1:</strong> Certificação máxima de segurança para processamento de pagamentos</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-500 mt-0.5">✓</span>
                                        <span><strong>Proteção ao Consumidor:</strong> Assume a responsabilidade pela emissão de bilhetes nos termos da legislação aplicável</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-500 mt-0.5">✓</span>
                                        <span><strong>Atendimento ao Cliente:</strong> Disponibiliza suporte para alterações, cancelamentos e reembolsos</span>
                                    </li>
                                </ul>
                                <div className="mt-4">
                                    <a
                                        href="https://duffel.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 text-sm hover:underline"
                                    >
                                        Visitar site da Duffel <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Resumo */}
                    <section className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white/10 dark:to-white/5 border border-slate-700 dark:border-white/10 rounded-2xl p-6 text-white dark:text-white">
                        <h2 className="text-xl font-bold mb-4">Em Resumo</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="bg-white/10 rounded-xl p-4">
                                <h3 className="font-bold text-rose-400 mb-2">A AllTrip NÃO é:</h3>
                                <ul className="space-y-1 text-sm text-gray-300">
                                    <li>• Uma agência de viagens (RNAVT)</li>
                                    <li>• Organizadora de viagens</li>
                                    <li>• Emissora de bilhetes</li>
                                    <li>• Processadora de pagamentos</li>
                                </ul>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4">
                                <h3 className="font-bold text-emerald-400 mb-2">A AllTrip É:</h3>
                                <ul className="space-y-1 text-sm text-gray-300">
                                    <li>• Plataforma de metabusca</li>
                                    <li>• Comparador de preços</li>
                                    <li>• Intermediário digital</li>
                                    <li>• Agregador de ofertas aéreas</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Contact for Legal */}
                    <section className="text-center py-8">
                        <p className="text-slate-500 dark:text-gray-500 text-sm mb-4">
                            Para questões legais ou esclarecimentos adicionais, contacte-nos:
                        </p>
                        <a
                            href="mailto:contato@alltripapp.com"
                            className="text-rose-500 hover:text-rose-600 font-medium"
                        >
                            contato@alltripapp.com
                        </a>
                    </section>

                </div>
            </div>
        </main>
    );
}
