import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Acessibilidade | AllTrip',
    description: 'Declaração de Acessibilidade da AllTrip.',
};

export default function AccessibilityPage() {
    return (
        <>
            <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Declaração de Acessibilidade</h1>

            <p className="lead">
                A AllTrip está empenhada em garantir que os seus serviços digitais sejam acessíveis a pessoas com deficiência. Estamos continuamente melhorando a experiência do utilizador para todos e aplicando as normas de acessibilidade relevantes.
            </p>

            <h2>Estado de Conformidade</h2>
            <p>
                As Diretrizes de Acessibilidade para Conteúdo Web (WCAG) definem requisitos para designers e programadores para melhorar a acessibilidade para pessoas com deficiência. Estão definidos três níveis de conformidade: Nível A, Nível AA e Nível AAA.
            </p>
            <p>
                O site da AllTrip está em conformidade parcial com as WCAG 2.1 nível AA. Conformidade parcial significa que algumas partes do conteúdo podem não estar totalmente em conformidade com o padrão de acessibilidade.
            </p>

            <h2>Medidas de suporte à acessibilidade</h2>
            <p>
                A AllTrip toma as seguintes medidas para garantir a acessibilidade do site:
            </p>
            <ul>
                <li>Incluir acessibilidade como parte da nossa declaração de missão interna.</li>
                <li>Integrar acessibilidade nas nossas práticas de aquisição.</li>
                <li>Nomear um responsável de acessibilidade e/ou provedor.</li>
                <li>Fornecer formação contínua em acessibilidade para a nossa equipa.</li>
            </ul>

            <h2>Feedback</h2>
            <p>
                Agradecemos o seu feedback sobre a acessibilidade do site da AllTrip. Por favor, informe-nos se encontrar barreiras de acessibilidade:
            </p>
            <ul>
                <li>E-mail: acessibilidade@alltrip.com</li>
                <li>Telefone: +351 210 000 000</li>
            </ul>
            <p>
                Tentamos responder ao feedback dentro de 2 dias úteis.
            </p>

            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10 text-sm text-slate-500">
                <p>Esta declaração foi atualizada em <strong>Dezembro/2024</strong>.</p>
            </div>
        </>
    );
}
