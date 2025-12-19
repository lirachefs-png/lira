import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Cookies | AllTrip',
    description: 'Política de Cookies da AllTrip.',
};

export default function CookiesPage() {
    return (
        <>
            <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Política de Cookies</h1>

            <h2>O que são cookies?</h2>
            <p>
                Como é prática comum em quase todos os sites profissionais, este site usa cookies, que são pequenos arquivos baixados no seu computador, para melhorar sua experiência. Esta página descreve quais informações eles coletam, como as usamos e por que às vezes precisamos armazenar esses cookies. Também compartilharemos como você pode impedir que esses cookies sejam armazenados, no entanto, isso pode fazer o downgrade ou 'quebrar' certos elementos da funcionalidade do site.
            </p>

            <h2>Como usamos os cookies?</h2>
            <p>
                Utilizamos cookies por vários motivos, detalhados abaixo. Infelizmente, na maioria dos casos, não existem opções padrão do setor para desativar os cookies sem desativar completamente a funcionalidade e os recursos que eles adicionam a este site. É recomendável que você deixe todos os cookies se não tiver certeza se precisa ou não deles, caso sejam usados ​​para fornecer um serviço que você usa.
            </p>

            <h2>Desativar cookies</h2>
            <p>
                Você pode impedir a configuração de cookies ajustando as configurações do seu navegador (consulte a Ajuda do navegador para saber como fazer isso). Esteja ciente de que a desativação de cookies afetará a funcionalidade deste e de muitos outros sites que você visita. A desativação de cookies geralmente resultará na desativação de determinadas funcionalidades e recursos deste site. Portanto, é recomendável que você não desative os cookies.
            </p>

            <h2>Cookies que definimos</h2>
            <ul>
                <li>
                    <strong>Cookies relacionados à conta</strong><br />
                    Se você criar uma conta conosco, usaremos cookies para o gerenciamento do processo de inscrição e administração geral. Esses cookies geralmente serão excluídos quando você sair do sistema, porém, em alguns casos, eles poderão permanecer posteriormente para lembrar as preferências do seu site ao sair.
                </li>
                <li>
                    <strong>Cookies relacionados ao login</strong><br />
                    Utilizamos cookies quando você está logado, para que possamos lembrar dessa ação. Isso evita que você precise fazer login sempre que visitar uma nova página. Esses cookies são normalmente removidos ou limpos quando você efetua logout para garantir que você possa acessar apenas a recursos e áreas restritas ao efetuar login.
                </li>
                <li>
                    <strong>Cookies relacionados a formulários</strong><br />
                    Quando você envia dados por meio de um formulário como os encontrados nas páginas de contacto ou nos formulários de comentários, os cookies podem ser configurados para lembrar os detalhes do usuário para correspondência futura.
                </li>
            </ul>

            <h2>Cookies de Terceiros</h2>
            <p>
                Em alguns casos especiais, também usamos cookies fornecidos por terceiros confiáveis. A seção a seguir detalha quais cookies de terceiros você pode encontrar através deste site.
            </p>
            <ul>
                <li>
                    Este site usa o Google Analytics, que é uma das soluções de análise mais difundidas e confiáveis ​​da Web, para nos ajudar a entender como você usa o site e como podemos melhorar sua experiência. Esses cookies podem rastrear itens como quanto tempo você gasta no site e as páginas visitadas, para que possamos continuar produzindo conteúdo atraente.
                </li>
            </ul>

            <h2>Mais informações</h2>
            <p>
                Esperamos que isso tenha esclarecido as coisas para você e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site.
            </p>
        </>
    );
}
