import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria'); // 'bar' | 'clube' | 'lounge' | 'praia'
    const idioma = searchParams.get('lang') || 'pt';

    const content = {
        pt: {
            titulo: "Noites na Baía",
            subtitulo: "O charme rústico da noite de Pipa",
            descricao: "Onde o forró pé-de-serra encontra os lounges exclusivos sob o céu estrelado do Rio Grande do Norte.",

            introducao: "Quando o sol se põe sobre as falésias de Pipa, a vila se transforma. Das areias da Praia do Centro aos lounges sofisticados com vista para o mar, a noite pipense é uma fusão única de tradição nordestina e cosmopolitismo praiano.",

            categorias: {
                bares_praia: {
                    nome: "Bares de Praia",
                    icone: "🏖️",
                    descricao: "Pé na areia, drink na mão, forró ao vivo",
                    estabelecimentos: [
                        {
                            nome: "Creperia Marinas",
                            tipo: "Bar de Praia & Creperia",
                            ambiente: "Casual elegante com vista panorâmica",
                            especialidade: "Crepes artesanais e coquetéis tropicais",
                            destaque: "Melhor pôr do sol de Pipa, direto da varanda suspensa",
                            horario: "17h - 01h (todos os dias)",
                            musica: "MPB ao vivo quintas e sábados",
                            preco_medio: "R$ 80-120 por pessoa",
                            localizacao: "Av. Baía dos Golfinhos, mirante",
                            coordenadas: { lat: -6.2297, lng: -35.0586 },
                            instagram: "@crperiamarinas",
                            imagem: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
                            tags: ["sunset", "romantico", "instagram_worthy", "crepes"],
                            capacidade: "80 pessoas",
                            reserva_recomendada: true
                        },
                        {
                            nome: "Camarão na Fazenda",
                            tipo: "Beach Club & Restaurante",
                            ambiente: "Rústico chique com pegada nordestina",
                            especialidade: "Camarões e frutos do mar ao vivo",
                            destaque: "Forró tradicional todas as quartas à noite",
                            horario: "12h - 23h (fecha segunda)",
                            musica: "Forró pé-de-serra e música regional",
                            preco_medio: "R$ 100-150 por pessoa",
                            localizacao: "Praia do Centro, pé na areia",
                            coordenadas: { lat: -6.2241, lng: -35.0571 },
                            instagram: "@camaraonafazendapipa",
                            imagem: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
                            tags: ["frutos_do_mar", "forro", "tradicional", "familia"],
                            capacidade: "120 pessoas"
                        }
                    ]
                },

                lounges: {
                    nome: "Lounges & Rooftops",
                    icone: "🌃",
                    descricao: "Sofisticação com vista para as estrelas",
                    estabelecimentos: [
                        {
                            nome: "Barraca do Joca",
                            tipo: "Lounge de Praia Premium",
                            ambiente: "Chique despojado com decoração boho",
                            especialidade: "Mixologia autoral e petiscos gourmet",
                            destaque: "DJ sets ao vivo sextas e sábados, vista privilegiada das falésias",
                            horario: "16h - 02h (quinta a domingo)",
                            musica: "Deep house, nu-disco, lounge",
                            preco_medio: "R$ 150-250 por pessoa",
                            localizacao: "Praia do Centro, deck elevado",
                            coordenadas: { lat: -6.2243, lng: -35.0569 },
                            instagram: "@barracadojoca",
                            imagem: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80",
                            tags: ["premium", "dj", "sunset", "mixologia"],
                            dress_code: "Smart casual",
                            capacidade: "150 pessoas",
                            reserva_recomendada: true,
                            age_minima: 21
                        },
                        {
                            nome: "Oca Toca",
                            tipo: "Sky Lounge & Bar",
                            ambiente: "Vista 360° das falésias e oceano",
                            especialidade: "Coquetéis autorais inspirados no Nordeste",
                            destaque: "Terraço panorâmico com piscina infinity e música eletrônica",
                            horario: "18h - 03h (quarta a domingo)",
                            musica: "House, techno, música eletrônica alternativa",
                            preco_medio: "R$ 180-300 por pessoa",
                            localizacao: "Centro de Pipa, cobertura",
                            coordenadas: { lat: -6.2250, lng: -35.0575 },
                            instagram: "@ocatocapipa",
                            imagem: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80",
                            tags: ["rooftop", "piscina", "premium", "techno", "vista_mar"],
                            dress_code: "Elegante esporte fino",
                            capacidade: "200 pessoas",
                            reserva_recomendada: true,
                            age_minima: 23
                        }
                    ]
                },

                clubes: {
                    nome: "Casas Noturnas",
                    icone: "🎵",
                    descricao: "Onde a festa vai até o amanhecer",
                    estabelecimentos: [
                        {
                            nome: "Calangos Bar",
                            tipo: "Club & Live Music",
                            ambiente: "Energético com palco profissional",
                            especialidade: "Shows ao vivo de bandas regionais e nacionais",
                            destaque: "Festas temáticas mensais e festival de música independente",
                            horario: "22h - 05h (quinta a sábado)",
                            musica: "Rock, reggae, música brasileira, festas temáticas",
                            preco_medio: "R$ 60-100 (entrada + consumação)",
                            localizacao: "Rua Principal, centro histórico",
                            coordenadas: { lat: -6.2256, lng: -35.0580 },
                            instagram: "@calangosbar",
                            imagem: "https://images.unsplash.com/photo-1571266028243-d220c6a4e28c?w=800&q=80",
                            tags: ["shows_ao_vivo", "rock", "alternativo", "energia"],
                            capacidade: "300 pessoas",
                            eventos_especiais: [
                                {
                                    nome: "Forró do Calangos",
                                    dia_semana: "Quinta",
                                    descricao: "Forró tradicional com bandas locais"
                                },
                                {
                                    nome: "Rock'n'Praia",
                                    dia_semana: "Sexta",
                                    descricao: "Noite de rock nacional e internacional"
                                },
                                {
                                    nome: "Festival Calangos",
                                    periodo: "Janeiro",
                                    descricao: "3 dias de música independente com bandas de todo Brasil"
                                }
                            ]
                        },
                        {
                            nome: "Zé Maria",
                            tipo: "Restaurante & Night Club",
                            ambiente: "Sofisticado com jardim tropical",
                            especialidade: "Jantar fino + after party com DJs internacionais",
                            destaque: "Menu degustação seguido de pista de dança em jardim iluminado",
                            horario: "19h - 03h (todos os dias)",
                            musica: "Jazz no jantar, house e techno após 23h",
                            preco_medio: "R$ 200-400 (jantar + festa)",
                            localizacao: "Praia do Centro, área reservada",
                            coordenadas: { lat: -6.2239, lng: -35.0573 },
                            instagram: "@zemariapipa",
                            imagem: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
                            tags: ["gastronomia", "premium", "dj_internacional", "jardim"],
                            dress_code: "Elegante",
                            capacidade: "180 pessoas",
                            reserva_recomendada: true,
                            observacao: "Jantar obrigatório para acesso à festa"
                        }
                    ]
                },

                bares_rusticos: {
                    nome: "Bares Tradicionais",
                    icone: "🍺",
                    descricao: "Autenticidade nordestina em cada esquina",
                    estabelecimentos: [
                        {
                            nome: "Bar do Amor",
                            tipo: "Boteco Tradicional",
                            ambiente: "Pé no chão com mesas na calçada",
                            especialidade: "Cerveja gelada e petiscos locais",
                            destaque: "Ponto de encontro dos locais, forró espontâneo ao som do sanfoneiro",
                            horario: "17h - 02h (todos os dias)",
                            musica: "Forró ao vivo esporádico, música nordestina no som",
                            preco_medio: "R$ 40-70 por pessoa",
                            localizacao: "Travessa da Praia do Amor",
                            coordenadas: { lat: -6.2264, lng: -35.0592 },
                            imagem: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80",
                            tags: ["autêntico", "barato", "forró", "locais"],
                            capacidade: "50 pessoas"
                        },
                        {
                            nome: "Tapas Bar",
                            tipo: "Wine Bar & Tapas",
                            ambiente: "Intimista com decoração vintage",
                            especialidade: "Vinhos selecionados e tapas espanholas",
                            destaque: "Carta de vinhos com mais de 100 rótulos, ambiente acolhedor",
                            horario: "18h - 01h (fecha terça)",
                            musica: "Bossa nova, jazz suave, música ambiente",
                            preco_medio: "R$ 120-180 por pessoa",
                            localizacao: "Rua dos Pescadores, centro",
                            coordenadas: { lat: -6.2253, lng: -35.0578 },
                            instagram: "@tapasbar_pipa",
                            imagem: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80",
                            tags: ["vinhos", "romantico", "tapas", "intimista"],
                            capacidade: "40 pessoas",
                            reserva_recomendada: true
                        }
                    ]
                }
            },

            roteiros_noturnos: [
                {
                    nome: "Noite Romântica",
                    emoji: "💕",
                    descricao: "Do pôr do sol ao jantar à luz de velas",
                    paradas: [
                        { ordem: 1, local: "Creperia Marinas", atividade: "Sunset drink e crepes", duracao: "18h - 20h" },
                        { ordem: 2, local: "Tapas Bar", atividade: "Vinho e tapas", duracao: "20h30 - 23h" },
                        { ordem: 3, local: "Caminhada na praia", atividade: "Lua cheia no mar", duracao: "23h - 00h" }
                    ],
                    budget: "R$ 400-600 casal",
                    melhor_dia: "Quinta ou sexta"
                },
                {
                    nome: "Festa até o Amanhecer",
                    emoji: "🎉",
                    descricao: "Energia total da noite ao nascer do sol",
                    paradas: [
                        { ordem: 1, local: "Barraca do Joca", atividade: "Sunset + DJ", duracao: "17h - 21h" },
                        { ordem: 2, local: "Calangos Bar", atividade: "Show ao vivo", duracao: "22h - 02h" },
                        { ordem: 3, local: "Oca Toca", atividade: "After party rooftop", duracao: "02h - 05h" },
                        { ordem: 4, local: "Praia do Madeiro", atividade: "Assistir o nascer do sol", duracao: "05h30" }
                    ],
                    budget: "R$ 350-500 por pessoa",
                    melhor_dia: "Sábado"
                },
                {
                    nome: "Autêntico Nordeste",
                    emoji: "🪕",
                    descricao: "Imersão na cultura local",
                    paradas: [
                        { ordem: 1, local: "Camarão na Fazenda", atividade: "Jantar com forró", duracao: "19h - 22h" },
                        { ordem: 2, local: "Bar do Amor", atividade: "Forró pé-de-serra", duracao: "23h - 01h" },
                        { ordem: 3, local: "Calangos Bar", atividade: "Fechar a noite", duracao: "01h - 03h" }
                    ],
                    budget: "R$ 200-300 por pessoa",
                    melhor_dia: "Quarta ou quinta"
                }
            ],

            dicas_essenciais: [
                {
                    icone: "💰",
                    titulo: "Dinheiro e Pagamentos",
                    texto: "A maioria aceita cartão, mas tenha sempre dinheiro para bares menores e gorjetas."
                },
                {
                    icone: "🚗",
                    titulo: "Transporte",
                    texto: "Pipa é pequena e caminhável. Para voltar tarde, combine táxi/uber antes (sinal é fraco à noite)."
                },
                {
                    icone: "🌙",
                    titulo: "Melhor Época",
                    texto: "Alta temporada (Dez-Mar): mais agitada. Baixa (Jun-Ago): vibe intimista com promoções."
                },
                {
                    icone: "👕",
                    titulo: "Dress Code",
                    texto: "Pipa é descontraída, mas lounges premium pedem smart casual. Chinelo de dedo ok em bares de praia."
                },
                {
                    icone: "📱",
                    titulo: "Reservas",
                    texto: "Essenciais para fins de semana e feriados, especialmente em lugares pequenos como Tapas Bar."
                }
            ],

            eventos_2025: [
                {
                    nome: "Réveillon na Praia",
                    data: "31 de dezembro - 01 de janeiro",
                    descricao: "Festa na areia com DJs, queima de fogos e celebrações em todos os bares principais",
                    destaque: "Oca Toca realiza festa VIP com open bar e vista privilegiada dos fogos"
                },
                {
                    nome: "Carnaval de Pipa",
                    data: "28 de fevereiro - 04 de março",
                    descricao: "Blocos de rua, festas temáticas e muito forró. Calangos vira point do carnaval alternativo.",
                    destaque: "Bloco 'Pipafolia' reúne milhares na avenida principal"
                },
                {
                    nome: "Festival Gastronômico de Outono",
                    data: "Abril",
                    descricao: "Semana especial com menus degustação nos principais restaurantes e bares",
                    destaque: "Creperia Marinas lança drinks exclusivos do festival"
                },
                {
                    nome: "Pipa Music Fest",
                    data: "Julho",
                    descricao: "Festival de música independente de 3 dias no Calangos Bar",
                    destaque: "Bandas nacionais e internacionais + DJs brasileiros"
                },
                {
                    nome: "Réveillon Antecipado",
                    data: "15 de dezembro",
                    descricao: "Festa de pré-réveillon para quem quer fugir da muvuca do dia 31",
                    destaque: "Barraca do Joca promove 'NYE Preview' com DJ internacional"
                }
            ]
        }
    };

    const dados = content[idioma as keyof typeof content] || content.pt;

    // Filtrar por categoria se solicitado
    if (categoria && dados.categorias) {
        const categoriaData = dados.categorias[categoria as keyof typeof dados.categorias];
        if (categoriaData) {
            return NextResponse.json({
                titulo: dados.titulo,
                categoria: categoriaData,
                dicas: dados.dicas_essenciais
            });
        }
    }

    return NextResponse.json(dados);
}
