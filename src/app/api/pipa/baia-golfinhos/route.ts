import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const momento = searchParams.get('momento'); // 'manha' | 'tarde' | 'noite'
    const idioma = searchParams.get('lang') || 'pt';

    const content = {
        pt: {
            titulo: "Baía dos Golfinhos",
            subtitulo: "O encontro mágico com a vida marinha",
            categoria: "NATUREZA & VIDA MARINHA",

            introducao: "No topo das falésias vermelhas de Pipa, um mirante revela um dos segredos mais bem guardados do litoral brasileiro: a Baía dos Golfinhos. Aqui, entre 6h e 9h da manhã, a magia acontece.",

            historia: {
                titulo: "Uma Dança Ancestral",
                conteudo: [
                    "Há séculos, golfinhos-rotadores elegem esta baía como lar. As águas calmas e ricas em vida marinha criam o cenário perfeito para suas acrobacias matinais.",
                    "Os pescadores locais contam que os golfinhos guiam os cardumes até a costa, numa parceria silenciosa entre homem e natureza que atravessa gerações.",
                    "O nome 'rotador' vem de seus saltos espetaculares, girando até 7 vezes no ar antes de mergulhar de volta nas águas cristalinas."
                ]
            },

            momentos: {
                ouro: {
                    periodo: "06h00 - 09h00",
                    titulo: "O Horário de Ouro",
                    descricao: "Este é o momento mágico. Com o nascer do sol pintando o céu de tons âmbar e rosa, os golfinhos emergem das profundezas para suas acrobacias matinais.",
                    dica: "Chegue cedo e posicione-se no Mirante do Chapadão. Traga binóculos para não perder nenhum detalhe da dança aquática.",
                    probabilidade: 85,
                    clima_ideal: "Céu limpo, mar calmo, sem chuva nas últimas 24h"
                },
                manha: {
                    periodo: "09h00 - 12h00",
                    titulo: "Manhã Contemplativa",
                    descricao: "Mesmo após o show matinal, a baía permanece mágica. As falésias brilham sob o sol forte, e eventualmente alguns golfinhos curiosos ainda podem ser avistados.",
                    dica: "Aproveite para explorar as trilhas e descobrir ângulos únicos das falésias.",
                    probabilidade: 40
                },
                tarde: {
                    periodo: "14h00 - 18h00",
                    titulo: "Luz Dourada",
                    descricao: "O sol da tarde ilumina as falésias com tons quentes. Embora os golfinhos estejam mais raros, o visual é deslumbrante para fotografia.",
                    dica: "Perfeito para fotos das falésias e pôr do sol. Leve água e protetor solar.",
                    probabilidade: 20
                },
                noite: {
                    periodo: "Após 18h00",
                    titulo: "Céu Estrelado",
                    descricao: "A baía se transforma sob o manto de estrelas. O som das ondas e o brilho da lua criam uma atmosfera etérea.",
                    dica: "Ideal para contemplação e fotografia noturna. Não há golfinhos, mas a experiência é igualmente mágica.",
                    probabilidade: 0
                }
            },

            curiosidades: [
                {
                    emoji: "🌊",
                    titulo: "Águas Transparentes",
                    texto: "A visibilidade pode chegar a 20 metros em dias de mar calmo, revelando um aquário natural."
                },
                {
                    emoji: "🐬",
                    titulo: "Até 200 Golfinhos",
                    texto: "Grupos de até 200 golfinhos-rotadores podem ser avistados durante a alta temporada (dezembro a março)."
                },
                {
                    emoji: "🏖️",
                    titulo: "Praia Protegida",
                    texto: "O acesso à praia é limitado e controlado para preservar o ecossistema marinho."
                },
                {
                    emoji: "📸",
                    titulo: "Fotografia de Vida Selvagem",
                    texto: "Um dos melhores pontos do Brasil para fotografia de golfinhos em habitat natural."
                }
            ],

            como_chegar: {
                chapadao: {
                    nome: "Mirante do Chapadão",
                    descricao: "O ponto mais icônico. Caminhada fácil de 5 minutos do centro de Pipa.",
                    coordenadas: { lat: -6.2298, lng: -35.0584 },
                    dificuldade: "Fácil",
                    tempo: "5 minutos a pé"
                },
                madeiro: {
                    nome: "Praia do Madeiro",
                    descricao: "Vista lateral da baía. Escadaria de 100 degraus, mas permite chegar mais perto da água.",
                    coordenadas: { lat: -6.2251, lng: -35.0621 },
                    dificuldade: "Moderada",
                    tempo: "15 minutos a pé + escadaria"
                }
            },

            regras_ouro: [
                "🤫 Silêncio e respeito: os golfinhos são sensíveis a ruídos",
                "📵 Proibido usar drones sem autorização do ICMBio",
                "🏊 Não nadar na baía durante a presença dos golfinhos",
                "🚫 Não alimentar ou tentar interagir com os animais",
                "♻️ Não deixe lixo - preserve este paraíso natural"
            ],

            galeria: [
                {
                    url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
                    caption: "Golfinho-rotador em salto espetacular ao nascer do sol",
                    categoria: "golfinhos"
                },
                {
                    url: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&q=80",
                    caption: "Vista aérea da Baía dos Golfinhos e suas falésias vermelhas",
                    categoria: "panoramica"
                },
                {
                    url: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1200&q=80",
                    caption: "Grupo de golfinhos nadando em formação",
                    categoria: "golfinhos"
                },
                {
                    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
                    caption: "Mirante do Chapadão iluminado pela luz dourada do amanhecer",
                    categoria: "paisagem"
                }
            ],

            experiencias_complementares: [
                {
                    titulo: "Trilha do Chapadão ao Madeiro",
                    descricao: "Caminhada panorâmica de 2km pelas falésias com vistas de tirar o fôlego",
                    duracao: "45 minutos",
                    icone: "🥾"
                },
                {
                    titulo: "Aula de Fotografia de Natureza",
                    descricao: "Sessões guiadas com fotógrafos locais para capturar o momento perfeito",
                    duracao: "2 horas",
                    icone: "📷"
                },
                {
                    titulo: "Yoga ao Nascer do Sol",
                    descricao: "Sessões matinais no mirante, combinando contemplação e movimento",
                    duracao: "1 hora",
                    icone: "🧘"
                }
            ],

            melhor_epoca: {
                alta: {
                    meses: ["Dezembro", "Janeiro", "Fevereiro", "Março"],
                    descricao: "Maior concentração de golfinhos. Mar mais calmo e quente.",
                    temperatura_agua: "26-28°C",
                    visibilidade: "Excelente"
                },
                media: {
                    meses: ["Setembro", "Outubro", "Novembro", "Abril", "Maio"],
                    descricao: "Boa chance de avistamento. Menos turistas, preços melhores.",
                    temperatura_agua: "24-26°C",
                    visibilidade: "Boa"
                },
                baixa: {
                    meses: ["Junho", "Julho", "Agosto"],
                    descricao: "Período de chuvas. Menos golfinhos, mas paisagem igualmente bela.",
                    temperatura_agua: "22-24°C",
                    visibilidade: "Regular"
                }
            }
        },
        en: {
            titulo: "Dolphin Bay",
            subtitulo: "The magical encounter with marine life",
            categoria: "NATURE & MARINE LIFE",
            introducao: "At the top of Pipa's red cliffs, a lookout reveals one of Brazil's best-kept secrets: Dolphin Bay. Here, between 6am and 9am, magic happens.",
            // ... versão em inglês
        },
        es: {
            titulo: "Bahía de los Delfines",
            subtitulo: "El encuentro mágico con la vida marina",
            categoria: "NATURALEZA & VIDA MARINA",
            introducao: "En la cima de los acantilados rojos de Pipa, un mirador revela uno de los secretos mejor guardados de la costa brasileña: la Bahía de los Delfines.",
            // ... versão em espanhol
        }
    };

    const dados = content[idioma as keyof typeof content] || content.pt;

    // Se momento específico for solicitado
    if (momento && 'momentos' in dados && dados.momentos) {
        const momentoData = (dados.momentos as Record<string, unknown>)[momento];
        return NextResponse.json({
            ...dados,
            momento_atual: momentoData,
            recomendacao: momento === 'ouro' ? 'melhor_horario' : 'alternativo'
        });
    }

    return NextResponse.json(dados);
}
