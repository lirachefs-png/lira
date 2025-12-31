'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt' | 'en' | 'es';
type Currency = 'EUR' | 'USD' | 'BRL';

interface RegionContextType {
    language: Language;
    currency: Currency;
    setLanguage: (lang: Language) => void;
    setCurrency: (curr: Currency) => void;
    labels: {
        flights: string;
        experiences: string;
        myAccount: string;
        login: string;
        partners_link: string;
        hero: {
            badge: string;
            headline_1: string;
            headline_2: string;
            subheadline: string;
            search: string;
            roundtrip: string;
            passenger: string;
        };
        search_results: {
            round_trip: string;
            passenger: string;
            total_price: string;
            select: string;
            direct: string;
            stops: string;
            no_flights: string;
            no_flights_desc: string;
            reset_filters: string;
            error_title: string;
            try_again: string;
        };
        checkout: {
            title: string;
            step: string;
            flight_details: string;
            passenger_details: string;
            first_name: string;
            last_name: string;
            dob: string;
            gender: string;
            male: string;
            female: string;
            email: string;
            phone: string;
            seat_selection: string;
            select_seat: string;
            change_seat: string;
            no_seat: string;
            baggage: string;
            checked_bag: string;
            total_due: string;
            flight_fare: string;
            base_fare: string;
            taxes_fees: string;
            extras: string;
            total: string;
            pay_button: string;
            redirecting: string;
            secure_text: string;
            pay_now: string;
            hold_price: string;
            instant_desc: string;
            hold_desc: string;
            confirm_reservation: string;
            price_guaranteed: string;
            fly_modern: string;
            loading_offer: string;
            offer_expired: string;
            search_again: string;
            select_seat_modal_title: string;
            close: string;
            front_aircraft: string;
            seats_not_available: string;
            finalize_payment: string;
            secure_environment: string;
            data_encrypted: string;
            promotional_fare_warning: string;
            payment_options: string;
            ssl_secure: string;
            data_protected: string;
        };
        common: {
            economy: string;
            one_way: string;
            back_to_home: string;
            search_flights: string;
        };
        nav: {
            new_search: string;
        };
        dashboard: {
            greeting_morning: string;
            greeting_afternoon: string;
            greeting_evening: string;
            total_trips: string;
            confirmed: string;
            unique_destinations: string;
            total_invested: string;
            your_boarding_passes: string;
            journey_starts_here: string;
            no_trips_yet: string;
            search_flights: string;
            need_help: string;
            help_description: string;
            talk_to_support: string;
        };
        experience: {
            top_airlines: string;
            top_airlines_desc: string;
            airlines_to_avoid: string;
            airlines_to_avoid_desc: string;
            top_rated: string;
            low_rated: string;
            highlights: string;
            crew: string;
            dining: string;
            why_best: string;
            why_avoid: string;
            ready_to_experience: string;
            search_with_best: string;
            vs: string;
        };
        search_widget: {
            from: string;
            to: string;
            departure: string;
            return_date: string;
            city: string;
            oneway: string;
            roundtrip: string;
            multicity: string;
            add_flight: string;
            remove: string;
            origin: string;
            destination: string;
            date: string;
            advanced_options: string;
            hide_options: string;
            flexible_dates: string;
            flexible_desc: string;
            corporate_code: string;
            private_fare: string;
            airline_placeholder: string;
            code_placeholder: string;
            corporate_desc: string;
            fill_all_fields: string;
            select_origin_dest_date: string;
        };
        ads: {
            limited_time: string;
            view_offer: string;
            summer_paris: string;
            summer_paris_desc: string;
            business_upgrade: string;
            business_upgrade_desc: string;
            tokyo_adventure: string;
            tokyo_adventure_desc: string;
        };
        destinations: {
            discover: string;
            australia: string;
            brazil: string;
            thailand: string;
            gastronomy: string;
            nightlife: string;
            accommodation: string;
            culture: string;
        };
        experience_grid: {
            byron: {
                tagline: string;
                description: string;
                farm_title: string;
                farm_desc: string;
                nightlife_title: string;
                nightlife_desc: string;
                culture_title: string;
                culture_desc: string;
                accommodation_title: string;
                accommodation_desc: string;
            };
            pipa: {
                tagline: string;
                description: string;
                gastro_title: string;
                gastro_desc: string;
                nightlife_title: string;
                nightlife_desc: string;
                culture_title: string;
                culture_desc: string;
                accommodation_title: string;
                accommodation_desc: string;
            };
            phiphi: {
                tagline: string;
                description: string;
                gastro_title: string;
                gastro_desc: string;
                nightlife_title: string;
                nightlife_desc: string;
                culture_title: string;
                culture_desc: string;
                accommodation_title: string;
                accommodation_desc: string;
            };
            alagoas: {
                tagline: string;
                description: string;
                gastro_title: string;
                gastro_desc: string;
                nightlife_title: string;
                nightlife_desc: string;
                culture_title: string;
                culture_desc: string;
                accommodation_title: string;
                accommodation_desc: string;
            };
        };
        featured_destinations: {
            title: string;
            uae: string;
            dubai: string;
            singapore: string;
            thailand: string;
            bangkok: string;
            mauritius: string;
            tanzania: string;
            zanzibar: string;
            indonesia: string;
            bali: string;
            view_all: string;
            best_price: string;
            from: string;
            economy_return: string;
        };
        premium_experiences: {
            title: string;
            description: string;
            first_class: string;
            business_class: string;
            premium_economy: string;
            economy_class: string;
            first_subtitle: string;
            business_subtitle: string;
            premium_subtitle: string;
            economy_subtitle: string;
            cta_first: string;
            cta_business: string;
            cta_premium: string;
            cta_economy: string;
            features: {
                first: string[];
                business: string[];
                premium: string[];
                economy: string[];
            };
        };
        footer: {
            navigation: string;
            flights: string;
            experiences: string;
            my_trips: string;
            support: string;
            help_center: string;
            faq: string;
            contact: string;
            legal: string;
            privacy: string;
            terms: string;
            cookies: string;
            subscribe_title: string;
            subscribe_desc: string;
            email_placeholder: string;
            subscribe_btn: string;
            app_title: string;
            connect_title: string;
            disclaimer: string;
            learn_more: string;
            copyright: string;
        };
        partners: {
            title: string;
            view_all: string;
            disclaimer: string;
        };
        passenger_selector: {
            traveler: string;
            travelers: string;
            cabin: {
                economy: string;
                premium_economy: string;
                business: string;
                first: string;
            };
            label: string;
            adults: string;
            adults_desc: string;
            children: string;
            children_desc: string;
            infants: string;
            infants_desc: string;
            infant_warning: string;
            max_passengers_warning: string;
            infant_per_adult: string;
        };
        boarding_pass: {
            electronic_ticket: string;
            confirmed: string;
            cancelled: string;
            processing: string;
            origin: string;
            destination: string;
            passenger: string;
            date: string;
            time: string;
            booking_ref: string;
            total_paid: string;
            smart_packer: string;
        };
        maya_chat: {
            speaking: string;
            subtitle: string;
            greeting: string;
            greeting_line2: string;
            greeting_line3: string;
            placeholder: string;
            manage_trip: string;
            beach_cheap: string;
            europe_romantic: string;
            activate_voice: string;
            mute_voice: string;
        };
        smart_packer: {
            title: string;
            loading: string;
            loading_desc: string;
            clothing: string;
            gadgets: string;
            toiletries: string;
            documents: string;
            weather_forecast: string;
            weather_desc: string;
            maya_tip: string;
            items_packed: string;
            save_list: string;
            failed: string;
        };
        help: {
            title: string;
            subtitle: string;
            bookings: string;
            payments: string;
            changes: string;
            about: string;
            not_found: string;
            contact_team: string;
            contact_us: string;
            whatsapp: string;
        };
        contact: {
            title: string;
            subtitle: string;
            email_title: string;
            email_desc: string;
            response_time_title: string;
            response_time_desc: string;
            ask_maya: string;
            maya_desc: string;
            maya_hint: string;
            disclaimer: string;
        };
    };
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

const LABELS = {
    pt: {
        flights: 'Voos',
        experiences: 'Experiências',
        myAccount: 'Minha Conta',
        login: 'Entrar',
        partners_link: 'Parceiros',
        hero: {
            badge: 'Pesquisando em 728+ companhias aéreas',
            headline_1: 'Viaje perto. Viaje longe.',
            headline_2: 'Viaje Barato.',
            subheadline: 'Desbloqueie ofertas secretas que as companhias aéreas não mostram. Encontramos os menores preços em segundos.',
            search: 'BUSCAR',
            roundtrip: 'Ida e volta',
            passenger: '1 Viajante, Econômica'
        },
        search_results: {
            round_trip: 'Ida e volta',
            passenger: '1 Viajante',
            total_price: 'Preço total',
            select: 'Selecionar',
            direct: 'Direto',
            stops: 'Parada(s)',
            no_flights: 'Nenhum voo encontrado',
            no_flights_desc: 'Não encontramos voos para estas datas. Tente outro dia ou aeroporto.',
            reset_filters: 'Limpar Filtros',
            error_title: 'Ops! Algo deu errado.',
            try_again: 'Tentar Novamente'
        },
        checkout: {
            title: 'Revisar e Pagar',
            step: 'Passo 2 de 3',
            flight_details: 'Detalhes do Voo',
            passenger_details: 'Passageiro Principal',
            first_name: 'Nome',
            last_name: 'Sobrenome',
            dob: 'Data de Nascimento',
            gender: 'Gênero',
            male: 'Masculino',
            female: 'Feminino',
            email: 'Email',
            phone: 'Telefone',
            seat_selection: 'Seleção de Assentos',
            select_seat: 'Selecionar Assento',
            change_seat: 'Alterar',
            no_seat: 'Nenhum assento selecionado',
            baggage: 'Bagagem',
            checked_bag: 'Bagagem Despachada',
            total_due: 'Total a Pagar',
            flight_fare: 'Tarifa do Voo',
            base_fare: 'Tarifa Base',
            taxes_fees: 'Taxas e Impostos',
            extras: 'Extras (Bagagem/Assento)',
            total: 'Total',
            pay_button: 'Ir para Pagamento',
            redirecting: 'Redirecionando...',
            secure_text: 'Pagamento Seguro via Duffel',
            pay_now: 'Pagar Agora',
            hold_price: 'Reservar Preço',
            instant_desc: 'Confirmação imediata',
            hold_desc: 'Pague depois',
            confirm_reservation: 'Confirmar Reserva',
            price_guaranteed: 'Preço garantido até',
            fly_modern: 'Voe no moderno',
            loading_offer: 'Carregando detalhes da oferta...',
            offer_expired: 'Se demorar muito, a oferta pode ter expirado.',
            search_again: 'Buscar novamente',
            select_seat_modal_title: 'Selecionar Assento',
            close: 'Fechar',
            front_aircraft: 'Frente da Aeronave ▲',
            seats_not_available: 'Assentos não disponíveis para este voo.',
            finalize_payment: 'Finalizar Pagamento',
            secure_environment: 'Ambiente seguro',
            data_encrypted: 'Dados encriptados',
            promotional_fare_warning: '⚠️ Esta tarifa promocional exige pagamento imediato',
            payment_options: 'Opções de Pagamento',
            ssl_secure: 'SSL 256-bit',
            data_protected: 'Dados protegidos'
        },
        common: {
            economy: 'Econômica',
            one_way: 'Só ida',
            back_to_home: 'Voltar ao Início',
            search_flights: 'Pesquisar Voos'
        },
        nav: {
            new_search: 'Nova Pesquisa'
        },
        dashboard: {
            greeting_morning: 'Bom dia',
            greeting_afternoon: 'Boa tarde',
            greeting_evening: 'Boa noite',
            total_trips: 'Total de viagens',
            confirmed: 'Confirmadas',
            unique_destinations: 'Destinos únicos',
            total_invested: 'Total investido',
            your_boarding_passes: 'Seus cartões de embarque',
            journey_starts_here: 'Sua jornada começa aqui!',
            no_trips_yet: 'Você ainda não tem viagens. Que tal explorar nossos destinos?',
            search_flights: 'Pesquisar Voos',
            need_help: 'Precisa de ajuda?',
            help_description: 'Nossa equipe está pronta para ajudar com suas reservas.',
            talk_to_support: 'Falar com Suporte'
        },
        experience: {
            top_airlines: 'Melhores Companhias para',
            top_airlines_desc: 'As melhores experiências que o dinheiro pode comprar',
            airlines_to_avoid: 'Companhias a Evitar',
            airlines_to_avoid_desc: 'Piores avaliações Skytrax e críticas de passageiros',
            top_rated: '⭐ BEM AVALIADA',
            low_rated: '⚠️ MAL AVALIADA',
            highlights: 'Destaques',
            crew: 'Tripulação',
            dining: 'Gastronomia',
            why_best: '✨ Porque São as Melhores',
            why_avoid: '⚠️ Porque Evitar',
            ready_to_experience: 'Pronto para Experienciar',
            search_with_best: 'Pesquisar voos com as melhores companhias',
            vs: 'vs'
        },
        search_widget: {
            from: 'De onde?',
            to: 'Para onde?',
            departure: 'Partida',
            return_date: 'Volta',
            city: 'Cidade',
            oneway: 'Só Ida',
            roundtrip: 'Ida e Volta',
            multicity: 'Multitrecho',
            add_flight: 'Adicionar Trecho',
            remove: 'Remover',
            origin: 'Origem',
            destination: 'Destino',
            date: 'Data',
            advanced_options: 'Opções avançadas',
            hide_options: 'Ocultar opções',
            flexible_dates: 'Datas Flexíveis (±3 dias)',
            flexible_desc: 'Encontrar melhores preços em datas próximas',
            corporate_code: 'Código Corporativo',
            private_fare: 'Private Fare',
            airline_placeholder: 'Companhia (ex: TP)',
            code_placeholder: 'Código (ex: ABC123)',
            corporate_desc: 'Tarifas exclusivas para empresas conveniadas',
            fill_all_fields: 'Por favor, preencha todos os campos dos trechos.',
            select_origin_dest_date: 'Por favor, selecione origem, destino e data.'
        },
        ads: {
            limited_time: 'Tempo Limitado',
            view_offer: 'Ver Oferta',
            summer_paris: 'Verão em Paris',
            summer_paris_desc: 'Ganhe 2x Milhas em voos para França',
            business_upgrade: 'Upgrade Executiva',
            business_upgrade_desc: 'Upgrade a partir de €199 em rotas selecionadas',
            tokyo_adventure: 'Aventura em Tóquio',
            tokyo_adventure_desc: 'Voos diretos agora disponíveis'
        },
        destinations: {
            discover: 'Descobrir',
            australia: 'Austrália',
            brazil: 'Brasil',
            thailand: 'Tailândia',
            gastronomy: 'Gastronomia',
            nightlife: 'Vida Noturna',
            accommodation: 'Hospedagem',
            culture: 'Cultura'
        },
        experience_grid: {
            byron: {
                tagline: 'Onde o Sol Nasce Primeiro',
                description: 'Barefoot Luxury: Entre no último refúgio da autenticidade, onde a alma do surfe e o bem-estar radical se encontram sob o sol nascente.',
                farm_title: 'Farm to Table',
                farm_desc: 'Cafés orgânicos, brunchs infinitos e a fusão perfeita entre wellness e gastronomia australiana.',
                nightlife_title: 'Byron After Dark',
                nightlife_desc: 'Live music, rooftops com vista para o mar e a vibe relaxada que só Byron sabe proporcionar.',
                culture_title: 'Arte & Surf Culture',
                culture_desc: 'Galerias de arte, mercados hippies e a cultura do surf em seu estado mais puro.',
                accommodation_title: 'Coastal Retreats',
                accommodation_desc: 'De eco-lodges sustentáveis a resorts boutique frente ao mar.'
            },
            pipa: {
                tagline: 'O Santuário Selvagem',
                description: 'Onde falésias vermelhas sangram no mar esmeralda. Um vilarejo cosmopolita que recusa a domesticação.',
                gastro_title: 'Oceano à Mesa',
                gastro_desc: 'A brutalidade fresca do mar. Sem intermediários, do barco ao prato.',
                nightlife_title: 'Boemia Sem Filtro',
                nightlife_desc: 'Sem áreas VIP. A mistura caótica e perfeita do mundo inteiro nos paralelepípedos.',
                culture_title: 'Alma de Pescador',
                culture_desc: 'Histórias antigas e novos começos. A essência de quem vive do mar.',
                accommodation_title: 'Refúgios Naturais',
                accommodation_desc: 'Luxo descalço. Dormir ouvindo o som da mata e acordar com o mar.'
            },
            phiphi: {
                tagline: 'O Segredo do Mar de Andaman',
                description: 'Águas cristalinas, formações rochosas dramáticas e a energia vibrante das ilhas tailandesas.',
                gastro_title: 'Thai Street Food',
                gastro_desc: 'Pad Thai à beira-mar, curry aromático e frutas tropicais que explodem de sabor.',
                nightlife_title: 'Fire Shows & Beach Parties',
                nightlife_desc: 'Dançarinos de fogo, festas na areia e cocktails de balde. A noite tailandesa é lendária.',
                culture_title: 'Templos e Tradições',
                culture_desc: 'A espiritualidade budista encontra a hospitalidade tailandesa única.',
                accommodation_title: 'Beach Resorts',
                accommodation_desc: 'Bangalôs sobre a água e resorts de luxo em praias paradisíacas.'
            },
            alagoas: {
                tagline: 'Caribe Brasileiro',
                description: 'Águas turquesa, piscinas naturais e recifes de corais infinitos. O paraíso tropical no coração do Nordeste.',
                gastro_title: 'Frutos do Mar e Sururu',
                gastro_desc: 'O autêntico sabor alagoano: do sururu de capote ao Chiclete de Camarão.',
                nightlife_title: 'Maceió by Night',
                nightlife_desc: 'Bares de praia premium, música ao vivo na orla e a brisa do mar como companhia.',
                culture_title: 'Rendas e Tradições',
                culture_desc: 'O artesanato Filé e a riqueza cultural de um povo que respira história.',
                accommodation_title: 'Resorts & Pousadas de Charme',
                accommodation_desc: 'De resorts imponentes a refúgios exclusivos na Rota Ecológica.'
            }
        },
        featured_destinations: {
            title: 'Destinos em destaque saindo de',
            uae: 'Emirados Árabes',
            dubai: 'Dubai',
            singapore: 'Singapura',
            thailand: 'Tailândia',
            bangkok: 'Bangkok',
            mauritius: 'Maurício',
            tanzania: 'Tanzânia',
            zanzibar: 'Zanzibar',
            indonesia: 'Indonésia',
            bali: 'Bali',
            view_all: 'Ver Todos os Destinos',
            best_price: 'Melhor Preço',
            from: 'a partir de',
            economy_return: 'Econômica Ida e Volta'
        },
        premium_experiences: {
            title: 'Explore Nossas Classes de Cabine',
            description: 'Experiencie conforto e serviço excepcionais em todas as classes',
            first_class: 'Primeira Classe',
            business_class: 'Classe Executiva',
            premium_economy: 'Premium Economy',
            economy_class: 'Classe Econômica',
            first_subtitle: 'O Máximo em Luxo',
            business_subtitle: 'Conforto de Classe Mundial',
            premium_subtitle: 'O Upgrade Inteligente',
            economy_subtitle: 'Melhor Custo-Benefício',
            cta_first: 'Discover First Class',
            cta_business: 'Discover Business',
            cta_premium: 'Discover Premium',
            cta_economy: 'Discover Economy',
            features: {
                first: ['Suítes Privativas & Spa', 'Lounge Bar a Bordo', 'Serviço de Mordomo'],
                business: ['Camas Lie-flat 180°', 'Acesso a Lounge Premium', 'Refeições Gourmet'],
                premium: ['50% Mais Espaço', 'Fones Cancelamento Ruído', 'Check-in Prioritário'],
                economy: ['Entretenimento Premiado', 'Espaço Amplo', 'Refeições Cortesia']
            }
        },
        footer: {
            navigation: 'Navegação',
            flights: 'Voos',
            experiences: 'Experiências',
            my_trips: 'Minhas Viagens',
            support: 'Suporte',
            help_center: 'Central de Ajuda',
            faq: 'Perguntas Frequentes',
            contact: 'Fale Conosco',
            legal: 'Legal',
            privacy: 'Política de Privacidade',
            terms: 'Termos de Uso',
            cookies: 'Cookies',
            subscribe_title: 'Cadastre-se para ofertas especiais',
            subscribe_desc: 'Economize com nossas últimas tarifas e ofertas.',
            email_placeholder: 'Endereço de e-mail',
            subscribe_btn: 'Inscrever',
            app_title: 'AllTrip App',
            connect_title: 'Conecte-se conosco',
            disclaimer: 'Todas as reservas são processadas diretamente pela Duffel, agente IATA autorizado e licenciado.',
            learn_more: 'Saiba mais',
            copyright: '© 2025 AllTrip. Todos os direitos reservados.'
        },
        partners: {
            title: 'Parceiros Oficiais',
            view_all: 'Ver Todos os Parceiros',
            disclaimer: 'Bilhetes emitidos diretamente nos sistemas oficiais das companhias aéreas'
        },
        passenger_selector: {
            traveler: 'Viajante',
            travelers: 'Viajantes',
            cabin: {
                economy: 'Econômica',
                premium_economy: 'Premium Econ.',
                business: 'Executiva',
                first: 'Primeira'
            },
            label: 'Passageiros e Classe',
            adults: 'Adultos',
            adults_desc: '12+ anos',
            children: 'Crianças',
            children_desc: '2-11 anos',
            infants: 'Bebês',
            infants_desc: '0-23 meses (no colo)',
            infant_warning: '⚠️ Bebês viajam no colo de um adulto responsável',
            max_passengers_warning: 'Máximo de 9 passageiros por reserva',
            infant_per_adult: 'Máximo 1 bebê por adulto'
        },
        boarding_pass: {
            electronic_ticket: 'Bilhete Eletrónico',
            confirmed: '✓ CONFIRMADO',
            cancelled: '✗ CANCELADO',
            processing: '⏳ PROCESSANDO',
            origin: 'ORIGEM',
            destination: 'DESTINO',
            passenger: 'Passageiro',
            date: 'Data',
            time: 'Hora',
            booking_ref: 'Ref. Reserva',
            total_paid: 'Total Pago',
            smart_packer: '🎒 Smart Packer'
        },
        maya_chat: {
            speaking: 'Falando...',
            subtitle: 'Guia Poliglota & Inteligente',
            greeting: 'Olá! Sou a Maya. 🌍',
            greeting_line2: 'Falo várias línguas e adoro viajar.',
            greeting_line3: 'Me pergunte qualquer coisa!',
            placeholder: 'Pergunte em qualquer idioma...',
            manage_trip: 'Gerir Viagem / Suporte',
            beach_cheap: '🏖️ Praia Barata',
            europe_romantic: '💘 Europa a dois',
            activate_voice: 'Ativar Voz',
            mute_voice: 'Mutar Voz'
        },
        smart_packer: {
            title: 'O que levar para',
            loading: 'Analisando clima em',
            loading_desc: 'Maya está verificando a previsão e o clima local.',
            clothing: 'Roupas',
            gadgets: 'Gadgets',
            toiletries: 'Higiene',
            documents: 'Documentos',
            weather_forecast: 'Previsão do Tempo',
            weather_desc: 'Verificando previsão real... Espere condições variadas.',
            maya_tip: 'Dica da Maya',
            items_packed: 'itens na mala',
            save_list: 'Salvar Lista',
            failed: 'Falha ao gerar lista. Por favor tente novamente.'
        },
        help: {
            title: 'Central de Ajuda',
            subtitle: 'Encontre respostas rápidas para as perguntas mais frequentes.',
            bookings: 'Reservas',
            payments: 'Pagamentos',
            changes: 'Alterações e Cancelamentos',
            about: 'Sobre a AllTrip',
            not_found: 'Não encontrou o que procura?',
            contact_team: 'A nossa equipa está pronta para ajudar.',
            contact_us: 'Fale Conosco',
            whatsapp: 'WhatsApp'
        },
        contact: {
            title: 'Fale Conosco',
            subtitle: 'Tem alguma dúvida ou sugestão? A nossa equipa está aqui para ajudar.',
            email_title: 'E-mail',
            email_desc: 'Para questões gerais, suporte ou parcerias.',
            response_time_title: 'Tempo de Resposta',
            response_time_desc: 'Respondemos normalmente em até 24 horas úteis.',
            ask_maya: 'Pergunte à Maya',
            maya_desc: 'A nossa assistente de IA pode ajudar com dúvidas sobre destinos, roteiros e dicas de viagem.',
            maya_hint: 'Clique no botão "Maya" no menu para iniciar uma conversa.',
            disclaimer: 'AllTrip é uma plataforma tecnológica de metabusca. Não somos uma agência de viagens.'
        }
    },
    en: {
        flights: 'Flights',
        experiences: 'Experiences',
        myAccount: 'My Account',
        login: 'Login',
        partners_link: 'Partners',
        hero: {
            badge: 'Searching 728+ airlines',
            headline_1: 'Go near. Go far.',
            headline_2: 'Go Cheap.',
            subheadline: "Unlock secret flight deals airlines don't want you to see. We find the cheapest prices in seconds.",
            search: 'SEARCH',
            roundtrip: 'Round trip',
            passenger: '1 Traveler, Economy'
        },
        search_results: {
            round_trip: 'Round Trip',
            passenger: '1 Passenger',
            total_price: 'Total price',
            select: 'Select',
            direct: 'Direct Flight',
            stops: 'Stop(s)',
            no_flights: 'No flights found',
            no_flights_desc: "We couldn't find any flights for these dates. Try searching for a different day or airport.",
            reset_filters: 'Reset Filters',
            error_title: 'Oops! Something went wrong.',
            try_again: 'Try Again'
        },
        checkout: {
            title: 'Review & Pay',
            step: 'Step 2 of 3',
            flight_details: 'Flight Details',
            passenger_details: 'Primary Passenger',
            first_name: 'First Name',
            last_name: 'Last Name',
            dob: 'Date of Birth',
            gender: 'Gender',
            male: 'Male',
            female: 'Female',
            email: 'Email',
            phone: 'Phone',
            seat_selection: 'Seat Selection',
            select_seat: 'Select Seat',
            change_seat: 'Change',
            no_seat: 'No Seat Selected',
            baggage: 'Baggage',
            checked_bag: 'Checked Bag',
            total_due: 'Total Due',
            flight_fare: 'Flight Fare',
            base_fare: 'Base Fare',
            taxes_fees: 'Taxes & Fees',
            extras: 'Extras (Baggage/Seat)',
            total: 'Total',
            pay_button: 'Proceed to Payment',
            redirecting: 'Redirecting...',
            secure_text: 'Secure Checkout via Duffel',
            pay_now: 'Pay Now',
            hold_price: 'Hold Price',
            instant_desc: 'Instant confirmation',
            hold_desc: 'Pay later',
            confirm_reservation: 'Confirm Reservation',
            price_guaranteed: 'Price guaranteed until',
            fly_modern: 'Fly the modern',
            loading_offer: 'Loading offer details...',
            offer_expired: 'If this takes too long, the offer may have expired.',
            search_again: 'Search again',
            select_seat_modal_title: 'Select Seat',
            close: 'Close',
            front_aircraft: 'Front of Aircraft ▲',
            seats_not_available: 'Seats not available for this flight.',
            finalize_payment: 'Finalize Payment',
            secure_environment: 'Secure environment',
            data_encrypted: 'Encrypted data',
            promotional_fare_warning: '⚠️ This promotional fare requires immediate payment',
            payment_options: 'Payment Options',
            ssl_secure: 'SSL 256-bit',
            data_protected: 'Protected data'
        },
        common: {
            economy: 'Economy',
            one_way: 'One-way',
            back_to_home: 'Back to Home',
            search_flights: 'Search Flights'
        },
        nav: {
            new_search: 'New Search'
        },
        dashboard: {
            greeting_morning: 'Good morning',
            greeting_afternoon: 'Good afternoon',
            greeting_evening: 'Good evening',
            total_trips: 'Total trips',
            confirmed: 'Confirmed',
            unique_destinations: 'Unique destinations',
            total_invested: 'Total invested',
            your_boarding_passes: 'Your boarding passes',
            journey_starts_here: 'Your journey starts here!',
            no_trips_yet: "You don't have any trips yet. How about exploring our destinations?",
            search_flights: 'Search Flights',
            need_help: 'Need help?',
            help_description: 'Our team is ready to help with your bookings.',
            talk_to_support: 'Talk to Support'
        },
        experience: {
            top_airlines: 'Top Airlines for',
            top_airlines_desc: 'The best experiences money can buy',
            airlines_to_avoid: 'Airlines to Avoid',
            airlines_to_avoid_desc: 'Lowest Skytrax ratings and poor passenger reviews',
            top_rated: '⭐ TOP RATED',
            low_rated: '⚠️ LOW RATED',
            highlights: 'Highlights',
            crew: 'Crew',
            dining: 'Dining',
            why_best: "✨ Why They're The Best",
            why_avoid: '⚠️ Why to Avoid',
            ready_to_experience: 'Ready to Experience',
            search_with_best: "Search for flights with the world's best airlines",
            vs: 'vs'
        },
        search_widget: {
            from: 'From?',
            to: 'To?',
            departure: 'Departure',
            return_date: 'Return',
            city: 'City',
            oneway: 'One Way',
            roundtrip: 'Round Trip',
            multicity: 'Multi-City',
            add_flight: 'Add Flight',
            remove: 'Remove',
            origin: 'Origin',
            destination: 'Destination',
            date: 'Date',
            advanced_options: 'Advanced Options',
            hide_options: 'Hide Options',
            flexible_dates: 'Flexible Dates (±3 days)',
            flexible_desc: 'Find better prices on nearby dates',
            corporate_code: 'Corporate Code',
            private_fare: 'Private Fare',
            airline_placeholder: 'Airline (e.g. TP)',
            code_placeholder: 'Code (e.g. ABC123)',
            corporate_desc: 'Exclusive fares for partner companies',
            fill_all_fields: 'Please fill all flight segment fields.',
            select_origin_dest_date: 'Please select origin, destination and date.'
        },
        ads: {
            limited_time: 'Limited Time',
            view_offer: 'View Offer',
            summer_paris: 'Summer in Paris',
            summer_paris_desc: 'Earn 2x Miles on all flights to France',
            business_upgrade: 'Business Class Upgrade',
            business_upgrade_desc: 'Upgrade starting from $199 on selected routes',
            tokyo_adventure: 'Tokyo Adventure',
            tokyo_adventure_desc: 'Direct flights now available from major hubs'
        },
        destinations: {
            discover: 'Discover',
            australia: 'Australia',
            brazil: 'Brazil',
            thailand: 'Thailand',
            gastronomy: 'Gastronomy',
            nightlife: 'Nightlife',
            accommodation: 'Accommodation',
            culture: 'Culture'
        },
        experience_grid: {
            byron: {
                tagline: 'Where the Sun Rises First',
                description: 'Barefoot Luxury: Step into the last refuge of authenticity, where surf soul and radical wellness meet under the rising sun.',
                farm_title: 'Farm to Table',
                farm_desc: 'Organic cafés, endless brunches and the perfect fusion of wellness and Australian gastronomy.',
                nightlife_title: 'Byron After Dark',
                nightlife_desc: 'Live music, rooftops with ocean views and the laid-back vibe that only Byron can provide.',
                culture_title: 'Art & Surf Culture',
                culture_desc: 'Art galleries, hippie markets and surf culture in its purest form.',
                accommodation_title: 'Coastal Retreats',
                accommodation_desc: 'From sustainable eco-lodges to boutique beachfront resorts.'
            },
            pipa: {
                tagline: 'Tropical Paradise',
                description: 'Wild beaches, golden cliffs and dolphins at dawn. A refuge where nature meets bohemian soul.',
                gastro_title: 'Northeastern Flavors',
                gastro_desc: 'Fresh seafood, artisan tapiocas and tropical drinks at sunset.',
                nightlife_title: 'Pipa Nights',
                nightlife_desc: 'From barefoot beach bars to open-air parties. The beach energy transforms.',
                culture_title: 'Local Traditions',
                culture_desc: 'Art, music and the authenticity of the northeastern people at every corner.',
                accommodation_title: 'Premium Retreats',
                accommodation_desc: 'From charming guesthouses to beachfront resorts with every comfort.'
            },
            phiphi: {
                tagline: 'The Secret of the Andaman Sea',
                description: 'Crystal clear waters, dramatic rock formations and the vibrant energy of the Thai islands.',
                gastro_title: 'Thai Street Food',
                gastro_desc: 'Pad Thai by the sea, aromatic curry and tropical fruits bursting with flavor.',
                nightlife_title: 'Fire Shows & Beach Parties',
                nightlife_desc: 'Fire dancers, beach parties and bucket cocktails. Thai nightlife is legendary.',
                culture_title: 'Temples & Traditions',
                culture_desc: 'Buddhist spirituality meets unique Thai hospitality.',
                accommodation_title: 'Beach Resorts',
                accommodation_desc: 'Overwater bungalows and luxury resorts on paradise beaches.'
            },
            alagoas: {
                tagline: 'The Brazilian Caribbean',
                description: 'Turquoise waters, natural pools and endless coral reefs. Tropical paradise in the heart of the Northeast.',
                gastro_title: 'Seafood & Local Flavors',
                gastro_desc: 'Authentic Alagoan taste: from fresh mussels to the iconic "Chiclete de Camarão".',
                nightlife_title: 'Maceió by Night',
                nightlife_desc: 'Premium beach bars, live music on the promenade and the sea breeze for company.',
                culture_title: 'Lace & Traditions',
                culture_desc: 'The unique Filé lace and cultural richness of a people that breathe history.',
                accommodation_title: 'Resorts & Charming Inns',
                accommodation_desc: 'From grand resorts to exclusive retreats on the Ecological Route.'
            }
        },
        featured_destinations: {
            title: 'Featured destinations from',
            uae: 'United Arab Emirates',
            dubai: 'Dubai',
            singapore: 'Singapore',
            thailand: 'Thailand',
            bangkok: 'Bangkok',
            mauritius: 'Mauritius',
            tanzania: 'Tanzania',
            zanzibar: 'Zanzibar',
            indonesia: 'Indonesia',
            bali: 'Bali',
            view_all: 'View All Destinations',
            best_price: 'Best Price',
            from: 'from',
            economy_return: 'Economy Return'
        },
        premium_experiences: {
            title: 'Explore Our Cabin Classes',
            description: 'Experience exceptional comfort and service across all cabin classes',
            first_class: 'First Class',
            business_class: 'Business Class',
            premium_economy: 'Premium Economy',
            economy_class: 'Economy Class',
            first_subtitle: 'The Ultimate in Luxury',
            business_subtitle: 'World-Class Comfort',
            premium_subtitle: 'The Smart Upgrade',
            economy_subtitle: 'Best Value Travel',
            cta_first: 'Discover First',
            cta_business: 'Explore Business',
            cta_premium: 'View Premium',
            cta_economy: 'Find Flights',
            features: {
                first: ['Private Suites & Shower Spa', 'Onboard Lounge Bar', 'Personal Butler Service'],
                business: ['180° Lie-flat Beds', 'Premium Lounge Access', 'Fine Dining & Wine Pairing'],
                premium: ['50% More Personal Space', 'Noise-Cancelling Headphones', 'Priority Check-in'],
                economy: ['Award-Winning Entertainment', 'Spacious Legroom', 'Complimentary Meals']
            }
        },
        footer: {
            navigation: 'Navigation',
            flights: 'Flights',
            experiences: 'Experiences',
            my_trips: 'My Trips',
            support: 'Support',
            help_center: 'Help Center',
            faq: 'FAQ',
            contact: 'Contact Us',
            legal: 'Legal',
            privacy: 'Privacy Policy',
            terms: 'Terms of Use',
            cookies: 'Cookies',
            subscribe_title: 'Subscribe for special offers',
            subscribe_desc: 'Save with our latest fares and offers.',
            email_placeholder: 'Email address',
            subscribe_btn: 'Subscribe',
            app_title: 'AllTrip App',
            connect_title: 'Connect with us',
            disclaimer: 'All bookings are processed directly by Duffel, an authorized and licensed IATA agent.',
            learn_more: 'Learn more',
            copyright: '© 2025 AllTrip. All rights reserved.'
        },
        partners: {
            title: 'Official Partners',
            view_all: 'View All Partners',
            disclaimer: 'Tickets issued directly in official airline systems'
        },
        passenger_selector: {
            traveler: 'Traveler',
            travelers: 'Travelers',
            cabin: {
                economy: 'Economy',
                premium_economy: 'Premium Econ.',
                business: 'Business',
                first: 'First Class'
            },
            label: 'Passengers & Class',
            adults: 'Adults',
            adults_desc: '12+ years',
            children: 'Children',
            children_desc: '2-11 years',
            infants: 'Infants',
            infants_desc: '0-23 months (on lap)',
            infant_warning: '⚠️ Infants travel on the lap of a responsible adult',
            max_passengers_warning: 'Maximum of 9 passengers per booking',
            infant_per_adult: 'Maximum 1 infant per adult'
        },
        boarding_pass: {
            electronic_ticket: 'Electronic Ticket',
            confirmed: '✓ CONFIRMED',
            cancelled: '✗ CANCELLED',
            processing: '⏳ PROCESSING',
            origin: 'ORIGIN',
            destination: 'DESTINATION',
            passenger: 'Passenger',
            date: 'Date',
            time: 'Time',
            booking_ref: 'Booking Ref',
            total_paid: 'Total Paid',
            smart_packer: '🎒 Smart Packer'
        },
        maya_chat: {
            speaking: 'Speaking...',
            subtitle: 'Polyglot & Smart Guide',
            greeting: 'Hi! I\'m Maya. 🌍',
            greeting_line2: 'I speak many languages and love to travel.',
            greeting_line3: 'Ask me anything!',
            placeholder: 'Ask in any language...',
            manage_trip: 'Manage Trip / Support',
            beach_cheap: '🏖️ Cheap Beach',
            europe_romantic: '💘 Romantic Europe',
            activate_voice: 'Activate Voice',
            mute_voice: 'Mute Voice'
        },
        smart_packer: {
            title: 'Packing for',
            loading: 'Analyzing weather in',
            loading_desc: 'Maya is checking the forecast and local vibe.',
            clothing: 'Clothing',
            gadgets: 'Gadgets',
            toiletries: 'Toiletries',
            documents: 'Documents',
            weather_forecast: 'Weather Forecast',
            weather_desc: 'Checking real forecast... Expect varied conditions.',
            maya_tip: 'Maya\'s Tip',
            items_packed: 'items packed',
            save_list: 'Save List',
            failed: 'Failed to generate list. Please try again.'
        },
        help: {
            title: 'Help Center',
            subtitle: 'Find quick answers to the most frequently asked questions.',
            bookings: 'Bookings',
            payments: 'Payments',
            changes: 'Changes & Cancellations',
            about: 'About AllTrip',
            not_found: 'Didn\'t find what you were looking for?',
            contact_team: 'Our team is ready to help.',
            contact_us: 'Contact Us',
            whatsapp: 'WhatsApp'
        },
        contact: {
            title: 'Contact Us',
            subtitle: 'Have any questions or suggestions? Our team is here to help.',
            email_title: 'Email',
            email_desc: 'For general inquiries, support or partnerships.',
            response_time_title: 'Response Time',
            response_time_desc: 'We usually respond within 24 business hours.',
            ask_maya: 'Ask Maya',
            maya_desc: 'Our AI assistant can help with questions about destinations, itineraries and travel tips.',
            maya_hint: 'Click the "Maya" button in the menu to start a conversation.',
            disclaimer: 'AllTrip is a metasearch technology platform. We are not a travel agency.'
        }
    },
    es: {
        flights: 'Vuelos',
        experiences: 'Experiencias',
        myAccount: 'Mi Cuenta',
        login: 'Entrar',
        partners_link: 'Socios',
        hero: {
            badge: 'Buscando en 728+ aerolíneas',
            headline_1: 'Viaja cerca. Viaja lejos.',
            headline_2: 'Viaja Barato.',
            subheadline: 'Desbloquea ofertas secretas que las aerolíneas no muestran. Encontramos los precios más bajos en segundos.',
            search: 'BUSCAR',
            roundtrip: 'Ida y vuelta',
            passenger: '1 Viajero, Económica'
        },
        search_results: {
            round_trip: 'Ida y vuelta',
            passenger: '1 Viajero',
            total_price: 'Precio total',
            select: 'Seleccionar',
            direct: 'Vuelo Directo',
            stops: 'Escala(s)',
            no_flights: 'No se encontraron vuelos',
            no_flights_desc: 'No encontramos vuelos para estas fechas. Intenta otro día o aeropuerto.',
            reset_filters: 'Restablecer Filtros',
            error_title: '¡Ups! Algo salió mal.',
            try_again: 'Intentar De Nuevo'
        },
        checkout: {
            title: 'Revisar y Pagar',
            step: 'Paso 2 de 3',
            flight_details: 'Detalles del Vuelo',
            passenger_details: 'Pasajero Principal',
            first_name: 'Nombre',
            last_name: 'Apellido',
            dob: 'Fecha de Nacimiento',
            gender: 'Género',
            male: 'Masculino',
            female: 'Femenino',
            email: 'Email',
            phone: 'Teléfono',
            seat_selection: 'Selección de Asiento',
            select_seat: 'Seleccionar Asiento',
            change_seat: 'Cambiar',
            no_seat: 'Ningún asiento seleccionado',
            baggage: 'Equipaje',
            checked_bag: 'Maleta Facturada',
            total_due: 'Total a Pagar',
            flight_fare: 'Tarifa de Vuelo',
            base_fare: 'Tarifa Base',
            taxes_fees: 'Tasas e Impuestos',
            extras: 'Extras (Equipaje/Asiento)',
            total: 'Total',
            pay_button: 'Proceder al Pago',
            redirecting: 'Redirigiendo...',
            secure_text: 'Pago Seguro vía Duffel',
            pay_now: 'Pagar Ahora',
            hold_price: 'Reservar Precio',
            instant_desc: 'Confirmación inmediata',
            hold_desc: 'Pagar después',
            confirm_reservation: 'Confirmar Reserva',
            price_guaranteed: 'Precio garantizado hasta',
            fly_modern: 'Vuela en el moderno',
            loading_offer: 'Cargando detalles de la oferta...',
            offer_expired: 'Si esto tarda mucho, la oferta puede haber expirado.',
            search_again: 'Buscar de nuevo',
            select_seat_modal_title: 'Seleccionar Asiento',
            close: 'Cerrar',
            front_aircraft: 'Frente del Avión ▲',
            seats_not_available: 'Asientos no disponibles para este vuelo.',
            finalize_payment: 'Finalizar Pago',
            secure_environment: 'Ambiente seguro',
            data_encrypted: 'Datos encriptados',
            promotional_fare_warning: '⚠️ Esta tarifa promocional requiere pago inmediato',
            payment_options: 'Opciones de Pago',
            ssl_secure: 'SSL 256-bit',
            data_protected: 'Datos protegidos'
        },
        common: {
            economy: 'Económica',
            one_way: 'Solo ida',
            back_to_home: 'Volver al Inicio',
            search_flights: 'Buscar Vuelos'
        },
        nav: {
            new_search: 'Nueva Búsqueda'
        },
        dashboard: {
            greeting_morning: 'Buenos días',
            greeting_afternoon: 'Buenas tardes',
            greeting_evening: 'Buenas noches',
            total_trips: 'Total de viajes',
            confirmed: 'Confirmados',
            unique_destinations: 'Destinos únicos',
            total_invested: 'Total invertido',
            your_boarding_passes: 'Tus pases de embarque',
            journey_starts_here: '¡Tu viaje comienza aquí!',
            no_trips_yet: 'Aún no tienes viajes. ¿Qué tal explorar nuestros destinos?',
            search_flights: 'Buscar Vuelos',
            need_help: '¿Necesitas ayuda?',
            help_description: 'Nuestro equipo está listo para ayudar con tus reservas.',
            talk_to_support: 'Hablar con Soporte'
        },
        experience: {
            top_airlines: 'Mejores Aerolíneas para',
            top_airlines_desc: 'Las mejores experiencias que el dinero puede comprar',
            airlines_to_avoid: 'Aerolíneas a Evitar',
            airlines_to_avoid_desc: 'Peores calificaciones Skytrax y malas críticas de pasajeros',
            top_rated: '⭐ BIEN VALORADA',
            low_rated: '⚠️ MAL VALORADA',
            highlights: 'Destacados',
            crew: 'Tripulación',
            dining: 'Gastronomía',
            why_best: '✨ Por Qué Son Las Mejores',
            why_avoid: '⚠️ Por Qué Evitar',
            ready_to_experience: 'Listo para Experimentar',
            search_with_best: 'Buscar vuelos con las mejores aerolíneas del mundo',
            vs: 'vs'
        },
        search_widget: {
            from: '¿De dónde?',
            to: '¿A dónde?',
            departure: 'Salida',
            return_date: 'Regreso',
            city: 'Ciudad',
            oneway: 'Solo Ida',
            roundtrip: 'Ida y Vuelta',
            multicity: 'Multi-tramo',
            add_flight: 'Añadir Tramo',
            remove: 'Eliminar',
            origin: 'Origen',
            destination: 'Destino',
            date: 'Fecha',
            advanced_options: 'Opciones avanzadas',
            hide_options: 'Ocultar opciones',
            flexible_dates: 'Fechas Flexibles (±3 días)',
            flexible_desc: 'Encontrar mejores precios en fechas cercanas',
            corporate_code: 'Código Corporativo',
            private_fare: 'Tarifa Privada',
            airline_placeholder: 'Aerolínea (ej: TP)',
            code_placeholder: 'Código (ej: ABC123)',
            corporate_desc: 'Tarifas exclusivas para empresas asociadas',
            fill_all_fields: 'Por favor, complete todos los campos de los tramos.',
            select_origin_dest_date: 'Por favor, seleccione origen, destino y fecha.'
        },
        ads: {
            limited_time: 'Tiempo Limitado',
            view_offer: 'Ver Oferta',
            summer_paris: 'Verano en París',
            summer_paris_desc: 'Gana 2x Millas en vuelos a Francia',
            business_upgrade: 'Upgrade Ejecutiva',
            business_upgrade_desc: 'Upgrade desde €199 en rutas seleccionadas',
            tokyo_adventure: 'Aventura en Tokio',
            tokyo_adventure_desc: 'Vuelos directos ahora disponibles'
        },
        destinations: {
            discover: 'Descubrir',
            australia: 'Australia',
            brazil: 'Brasil',
            thailand: 'Tailandia',
            gastronomy: 'Gastronomía',
            nightlife: 'Vida Nocturna',
            accommodation: 'Alojamiento',
            culture: 'Cultura'
        },
        experience_grid: {
            byron: {
                tagline: 'Donde Nace el Sol Primero',
                description: 'Barefoot Luxury: Entra en el último refugio de la autenticidad, donde el alma del surf y el bienestar radical se encuentran bajo el sol naciente.',
                farm_title: 'De la Granja a la Mesa',
                farm_desc: 'Cafés orgánicos, brunchs infinitos y la fusión perfecta entre bienestar y gastronomía australiana.',
                nightlife_title: 'Byron de Noche',
                nightlife_desc: 'Música en vivo, azoteas con vistas al mar y la vibra relajada que solo Byron puede ofrecer.',
                culture_title: 'Arte y Cultura Surf',
                culture_desc: 'Galerías de arte, mercados hippies y la cultura del surf en su forma más pura.',
                accommodation_title: 'Retiros Costeros',
                accommodation_desc: 'Desde eco-lodges sostenibles hasta resorts boutique frente al mar.'
            },
            pipa: {
                tagline: 'Paraíso Tropical',
                description: 'Playas salvajes, acantilados dorados y delfines al amanecer. Un refugio donde la naturaleza encuentra el alma bohemia.',
                gastro_title: 'Sabores del Nordeste',
                gastro_desc: 'Mariscos frescos, tapiocas artesanales y bebidas tropicales al atardecer.',
                nightlife_title: 'Noches de Pipa',
                nightlife_desc: 'Desde bares con los pies en la arena hasta fiestas al aire libre. La energía de la playa se transforma.',
                culture_title: 'Tradiciones Locales',
                culture_desc: 'Arte, música y la autenticidad del pueblo nordestino en cada esquina.',
                accommodation_title: 'Refugios Premium',
                accommodation_desc: 'Desde posadas encantadoras hasta resorts frente al mar con todo el confort.'
            },
            phiphi: {
                tagline: 'El Secreto del Mar de Andamán',
                description: 'Aguas cristalinas, formaciones rocosas dramáticas y la energía vibrante de las islas tailandesas.',
                gastro_title: 'Comida Callejera Tailandesa',
                gastro_desc: 'Pad Thai junto al mar, curry aromático y frutas tropicales que explotan de sabor.',
                nightlife_title: 'Shows de Fuego y Fiestas en la Playa',
                nightlife_desc: 'Bailarines de fuego, fiestas en la arena y cócteles de cubo. La noche tailandesa es legendaria.',
                culture_title: 'Templos y Tradiciones',
                culture_desc: 'La espiritualidad budista se encuentra con la hospitalidad tailandesa única.',
                accommodation_title: 'Resorts de Playa',
                accommodation_desc: 'Bungalows sobre el agua y resorts de lujo en playas paradisíacas.'
            },
            alagoas: {
                tagline: 'El Caribe Brasileño',
                description: 'Aguas turquesas, piscinas naturales e infinitos arrecifes de coral. El paraíso tropical en el corazón del Noreste.',
                gastro_title: 'Mariscos y Sabores Locales',
                gastro_desc: 'Auténtico sabor de Alagoas: desde mejillones frescos hasta el icónico "Chiclete de Camarão".',
                nightlife_title: 'Maceió de Noche',
                nightlife_desc: 'Bares de playa premium, música en vivo en la rambla y la brisa marina como compañía.',
                culture_title: 'Encajes y Tradiciones',
                culture_desc: 'El encaje Filé y la riqueza cultural de un pueblo que respira historia.',
                accommodation_title: 'Resorts y Posadas con Encanto',
                accommodation_desc: 'Desde imponentes resorts hasta refugios exclusivos en la Ruta Ecológica.'
            }
        },
        featured_destinations: {
            title: 'Destinos destacados desde',
            uae: 'Emiratos Árabes',
            dubai: 'Dubái',
            singapore: 'Singapur',
            thailand: 'Tailandia',
            bangkok: 'Bangkok',
            mauritius: 'Mauricio',
            tanzania: 'Tanzania',
            zanzibar: 'Zanzíbar',
            indonesia: 'Indonesia',
            bali: 'Bali',
            view_all: 'Ver Todos los Destinos',
            best_price: 'Mejor Precio',
            from: 'desde',
            economy_return: 'Económica Ida y Vuelta'
        },
        premium_experiences: {
            title: 'Explore Nuestras Clases de Cabina',
            description: 'Experimente un confort y servicio excepcionales en todas las clases',
            first_class: 'Primera Clase',
            business_class: 'Business Class',
            premium_economy: 'Premium Economy',
            economy_class: 'Clase Económica',
            first_subtitle: 'Lo Último en Lujo',
            business_subtitle: 'Confort de Clase Mundial',
            premium_subtitle: 'La Mejora Inteligente',
            economy_subtitle: 'Mejor Valor para Viajar',
            cta_first: 'Descubrir Primera',
            cta_business: 'Explorar Business',
            cta_premium: 'Ver Premium',
            cta_economy: 'Buscar Vuelos',
            features: {
                first: ['Suites Privadas y Spa', 'Lounge Bar a Bordo', 'Servicio de Mayordomo Personal'],
                business: ['Camas Inclinables 180°', 'Acceso a Lounge Premium', 'Cena Gourmet'],
                premium: ['50% Más Espacio Personal', 'Auriculares con Cancelación de Ruido', 'Check-in Prioritario'],
                economy: ['Entretenimiento Galardonado', 'Espacio Amplio', 'Comidas de Cortesía']
            }
        },
        footer: {
            navigation: 'Navegación',
            flights: 'Vuelos',
            experiences: 'Experiencias',
            my_trips: 'Mis Viajes',
            support: 'Soporte',
            help_center: 'Centro de Ayuda',
            faq: 'Preguntas Frecuentes',
            contact: 'Contáctanos',
            legal: 'Legal',
            privacy: 'Política de Privacidad',
            terms: 'Términos de Uso',
            cookies: 'Cookies',
            subscribe_title: 'Regístrate para ofertas especiales',
            subscribe_desc: 'Ahorra con nuestras últimas tarifas y ofertas.',
            email_placeholder: 'Dirección de correo electrónico',
            subscribe_btn: 'Suscribirse',
            app_title: 'AllTrip App',
            connect_title: 'Conéctate con nosotros',
            disclaimer: 'Todas las reservas son procesadas directamente por Duffel, un agente IATA autorizado y con licencia.',
            learn_more: 'Saber más',
            copyright: '© 2025 AllTrip. Todos los derechos reservados.'
        },
        partners: {
            title: 'Socios Oficiales',
            view_all: 'Ver Todos los Socios',
            disclaimer: 'Billetes emitidos directamente en los sistemas oficiales de las aerolíneas'
        },
        passenger_selector: {
            traveler: 'Viajero',
            travelers: 'Viajeros',
            cabin: {
                economy: 'Económica',
                premium_economy: 'Premium Econ.',
                business: 'Ejecutiva',
                first: 'Primera Clase'
            },
            label: 'Pasajeros y Clase',
            adults: 'Adultos',
            adults_desc: '12+ años',
            children: 'Niños',
            children_desc: '2-11 años',
            infants: 'Bebés',
            infants_desc: '0-23 meses (en regazo)',
            infant_warning: '⚠️ Los bebés viajan en el regazo de un adulto responsable',
            max_passengers_warning: 'Máximo de 9 pasajeros por reserva',
            infant_per_adult: 'Máximo 1 bebé por adulto'
        },
        boarding_pass: {
            electronic_ticket: 'Billete Electrónico',
            confirmed: '✓ CONFIRMADO',
            cancelled: '✗ CANCELADO',
            processing: '⏳ PROCESANDO',
            origin: 'ORIGEN',
            destination: 'DESTINO',
            passenger: 'Pasajero',
            date: 'Fecha',
            time: 'Hora',
            booking_ref: 'Ref. Reserva',
            total_paid: 'Total Pagado',
            smart_packer: '🎒 Smart Packer'
        },
        maya_chat: {
            speaking: 'Hablando...',
            subtitle: 'Guía Polígota e Inteligente',
            greeting: '¡Hola! Soy Maya. 🌍',
            greeting_line2: 'Hablo varios idiomas y me encanta viajar.',
            greeting_line3: '¡Pregúntame lo que quieras!',
            placeholder: 'Pregunta en cualquier idioma...',
            manage_trip: 'Gestionar Viaje / Soporte',
            beach_cheap: '🏖️ Playa Barata',
            europe_romantic: '💘 Europa Romántica',
            activate_voice: 'Activar Voz',
            mute_voice: 'Silenciar Voz'
        },
        smart_packer: {
            title: 'Qué llevar a',
            loading: 'Analizando clima en',
            loading_desc: 'Maya está verificando el pronóstico y el clima local.',
            clothing: 'Ropa',
            gadgets: 'Dispositivos',
            toiletries: 'Higiene',
            documents: 'Documentos',
            weather_forecast: 'Pronóstico del Tiempo',
            weather_desc: 'Verificando pronóstico real... Espere condiciones variadas.',
            maya_tip: 'Consejo de Maya',
            items_packed: 'artículos empacados',
            save_list: 'Guardar Lista',
            failed: 'Error al generar lista. Por favor intente de nuevo.'
        },
        help: {
            title: 'Centro de Ayuda',
            subtitle: 'Encuentra respuestas rápidas a las preguntas más frecuentes.',
            bookings: 'Reservas',
            payments: 'Pagos',
            changes: 'Cambios y Cancelaciones',
            about: 'Sobre AllTrip',
            not_found: '¿No encontraste lo que buscabas?',
            contact_team: 'Nuestro equipo está listo para ayudar.',
            contact_us: 'Contáctanos',
            whatsapp: 'WhatsApp'
        },
        contact: {
            title: 'Contáctanos',
            subtitle: '¿Tienes alguna pregunta o sugerencia? Nuestro equipo está aquí para ayudar.',
            email_title: 'Email',
            email_desc: 'Para consultas generales, soporte o asociaciones.',
            response_time_title: 'Tiempo de Respuesta',
            response_time_desc: 'Normalmente respondemos en 24 horas hábiles.',
            ask_maya: 'Pregunta a Maya',
            maya_desc: 'Nuestra asistente de IA puede ayudar con preguntas sobre destinos, itinerarios y consejos de viaje.',
            maya_hint: 'Haz clic en el botón "Maya" en el menú para iniciar una conversación.',
            disclaimer: 'AllTrip es una plataforma tecnológica de metabúsqueda. No somos una agencia de viajes.'
        }
    },
};

export function RegionProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('pt');
    const [currency, setCurrencyState] = useState<Currency>('EUR');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load persistency
        const savedLang = localStorage.getItem('alltrip-lang') as Language;
        const savedCurr = localStorage.getItem('alltrip-curr') as Currency;
        if (savedLang) setLanguageState(savedLang);
        if (savedCurr) setCurrencyState(savedCurr);
        setMounted(true);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('alltrip-lang', lang);
    };

    const setCurrency = (curr: Currency) => {
        setCurrencyState(curr);
        localStorage.setItem('alltrip-curr', curr);
    };

    if (!mounted) {
        // Return null or a loader to avoid mismatch during hydration, 
        // OR just render children with default state for SEO.
        // Let's render children to avoid white flash, assuming 'pt' default is fine.
    }

    return (
        <RegionContext.Provider value={{
            language,
            currency,
            setLanguage,
            setCurrency,
            labels: LABELS[language]
        }}>
            {children}
        </RegionContext.Provider>
    );
}

export function useRegion() {
    const context = useContext(RegionContext);
    if (!context) {
        throw new Error('useRegion must be used within a RegionProvider');
    }
    return context;
}
