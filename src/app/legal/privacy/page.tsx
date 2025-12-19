import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Privacidade | AllTrip',
    description: 'Política de Privacidade e Proteção de Dados da AllTrip.',
};

export default function PrivacyPage() {
    return (
        <>
            <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Política de Privacidade</h1>

            <p className="lead">
                A sua privacidade é importante para nós. É política da AllTrip respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site <a href="https://alltrip.com">AllTrip</a>, e outros sites que possuímos e operamos.
            </p>

            <h2>1. Informações que coletamos</h2>
            <p>
                Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
            </p>

            <h2>2. Uso de Dados</h2>
            <p>
                Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
            </p>

            <h2>3. Compartilhamento de Dados</h2>
            <p>
                Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
            </p>

            <h2>4. Seus Direitos (RGPD)</h2>
            <p>
                Como titular dos dados, você tem o direito de acessar, retificar, cancelar e opor-se ao processamento dos seus dados pessoais. Para exercer esses direitos, entre em contato conosco através dos nossos canais de suporte.
            </p>

            <h2>5. Compromisso do Usuário</h2>
            <p>
                O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o AllTrip oferece no site e com caráter enunciativo, mas não limitativo:
            </p>
            <ul>
                <li>A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé a à ordem pública;</li>
                <li>B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, ou azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;</li>
                <li>C) Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do AllTrip, de seus fornecedores ou terceiros, para introduzir ou disseminar vírus informáticos ou quaisquer outros sistemas de hardware ou software que sejam capazes de causar danos anteriormente mencionados.</li>
            </ul>

            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10 text-sm text-slate-500">
                <p>Esta política é efetiva a partir de <strong>Dezembro/2024</strong>.</p>
            </div>
        </>
    );
}
