import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Termos e Condições | AllTrip',
    description: 'Termos e Condições de uso da plataforma AllTrip.',
};

export default function TermsPage() {
    return (
        <>
            <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Termos e Condições</h1>

            <div className="prose prose-slate dark:prose-invert max-w-none">

                <h2>1. Papel da Plataforma</h2>
                <p>
                    O AllTrip atua como um <strong>agregador e comparador de ofertas de voos</strong>, utilizando a tecnologia de metabusca para apresentar opções de diversas companhias aéreas e parceiros.
                    Não somos uma agência de viagens própria. Facilitamos a reserva de serviços de transporte aéreo através da infraestrutura da <strong>Duffel</strong>, um agente de registo IATA.
                </p>

                <h2>2. Responsabilidade</h2>
                <p>
                    A <strong>responsabilidade pelo transporte, atrasos, cancelamentos ou qualquer alteração de itinerário é exclusivamente da companhia aérea operadora</strong>.
                    O AllTrip não assume responsabilidade por:
                </p>
                <ul>
                    <li>Alterações de horários ou rotas pelas companhias aéreas</li>
                    <li>Cancelamentos de voos</li>
                    <li>Atrasos operacionais</li>
                    <li>Overbooking ou recusa de embarque</li>
                    <li>Perda ou dano de bagagem</li>
                </ul>
                <p>
                    Em caso de qualquer problema com o voo, o passageiro deve contactar diretamente a companhia aérea operadora.
                </p>

                <h2>3. Pagamentos</h2>
                <p>
                    Os pagamentos são processados via <strong>Duffel Payments</strong>, garantindo conformidade com as normas de segurança internacional (PCI-DSS).
                    Os dados do cartão são tratados de forma segura e nunca armazenados nos nossos servidores.
                </p>
                <p>
                    Os preços apresentados são indicativos e podem variar no momento da reserva devido a flutuações de disponibilidade e tarifas das companhias aéreas.
                </p>

                <h2>4. Cancelamentos e Reembolsos</h2>
                <p>
                    As <strong>regras de reembolso seguem estritamente as políticas de cada companhia aérea</strong>.
                    Antes de efetuar uma reserva, recomendamos verificar as condições tarifárias aplicáveis, incluindo:
                </p>
                <ul>
                    <li>Política de cancelamento</li>
                    <li>Taxas de alteração</li>
                    <li>Elegibilidade para reembolso</li>
                    <li>Prazos aplicáveis</li>
                </ul>
                <p>
                    Para solicitar cancelamentos ou reembolsos, o passageiro deve seguir o procedimento indicado no email de confirmação ou contactar o suporte.
                </p>

                <h2>5. Uso da Plataforma</h2>
                <p>
                    Ao utilizar o AllTrip, o utilizador concorda em:
                </p>
                <ul>
                    <li>Fornecer informações precisas e verdadeiras durante o processo de reserva</li>
                    <li>Não utilizar a plataforma para fins fraudulentos</li>
                    <li>Cumprir todas as leis e regulamentos aplicáveis</li>
                    <li>Aceitar que os preços e disponibilidade estão sujeitos a alterações</li>
                </ul>

                <h2>6. Propriedade Intelectual</h2>
                <p>
                    Todo o conteúdo do site AllTrip, incluindo textos, gráficos, logótipos, ícones e software, é propriedade do AllTrip ou dos seus licenciadores e está protegido por leis de direitos autorais.
                </p>

                <h2>7. Modificações</h2>
                <p>
                    O AllTrip reserva-se o direito de modificar estes termos a qualquer momento.
                    As alterações entram em vigor imediatamente após a publicação no site.
                    O uso continuado da plataforma após alterações constitui aceitação dos novos termos.
                </p>

                <h2>8. Lei Aplicável</h2>
                <p>
                    Estes termos são regidos pelas leis de Portugal.
                    Para qualquer litígio, as partes acordam a jurisdição exclusiva dos tribunais portugueses.
                </p>

                <h2>9. Contacto</h2>
                <p>
                    Para questões relacionadas com estes termos, contacte-nos através de: <a href="mailto:contato@alltripapp.com" className="text-rose-500 hover:text-rose-400">contato@alltripapp.com</a>
                </p>

                <p className="text-sm text-gray-500 mt-8">
                    <em>Última atualização: Dezembro de 2024</em>
                </p>
            </div>
        </>
    );
}
