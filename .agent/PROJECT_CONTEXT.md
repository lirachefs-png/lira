# AllTrip - Project Context

> **Última atualização:** 23/12/2025

## 📋 Visão Geral

**AllTrip** é uma plataforma de reservas de voos com IA integrada (Maya), desenvolvida em Next.js 15 com design moderno de glassmorfismo.

---

## 🔑 Chaves e APIs

### Chaves Disponíveis (em `keys/all_keys.txt`)

| Serviço | Variável de Ambiente | Descrição |
|---------|---------------------|-----------|
| Supabase URL | `NEXT_PUBLIC_SUPABASE_URL` | `https://iewgwfnyityvijpzkamj.supabase.co` |
| Supabase Anon Key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública para frontend |
| Supabase Service Role | `SUPABASE_SERVICE_ROLE_KEY` | Chave secreta para backend |
| Duffel | `DUFFEL_ACCESS_TOKEN` | API de voos (sandbox/test) |
| Groq | `GROQ_API_KEY` | IA para Maya Chat |
| Zoho Email | `ZOHO_USER` / `ZOHO_PASS` | contato@alltripapp.com |

### Chaves Faltantes (necessário configurar)

| Serviço | Variável de Ambiente | Status | Prioridade |
|---------|---------------------|--------|------------|
| Stripe Secret | `STRIPE_SECRET_KEY` | ❌ Faltando | 🔴 Alta |
| Stripe Publishable | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ❌ Faltando | 🔴 Alta |
| Stripe Webhook | `STRIPE_WEBHOOK_SECRET` | ❌ Faltando | 🔴 Alta |
| Unsplash | `UNSPLASH_ACCESS_KEY` | ❌ Opcional | 🟡 Baixa |
| Resend | `RESEND_API_KEY` | ❌ Opcional | 🟡 Baixa |

---

## 🛠️ Stack Tecnológica

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Styling:** TailwindCSS + Glassmorfismo
- **UI:** shadcn/ui components
- **Forms:** react-hook-form + Zod
- **State:** React hooks (useState, useEffect)

### Backend
- **Auth:** Supabase Auth
- **Database:** Supabase PostgreSQL
- **APIs:**
  - Duffel (busca e reserva de voos)
  - Groq (IA - LLaMA para Maya)
  - Stripe (pagamentos - a configurar)

### Deploy
- **Hosting:** Vercel
- **Domain:** alltripapp.com (a confirmar)

---

## 📁 Estrutura do Projeto

```
all-trip/
├── .agent/              # Contexto e workflows do agente
├── keys/                # Credenciais (ignorado pelo git)
├── public/              # Assets estáticos
├── src/
│   ├── app/
│   │   ├── actions/     # Server Actions (maya.ts, clone-voice.ts)
│   │   ├── admin/       # Painel administrativo
│   │   ├── api/         # API Routes
│   │   │   ├── booking/ # Criação de reservas
│   │   │   ├── checkout/# Processo de checkout
│   │   │   ├── locations/# Autocomplete de aeroportos
│   │   │   └── search/  # Busca de voos (Duffel)
│   │   ├── auth/        # Páginas de autenticação
│   │   ├── checkout/    # Página de checkout
│   │   ├── legal/       # Páginas legais (privacy, terms)
│   │   ├── my-trips/    # Minhas viagens
│   │   └── search/      # Resultados de busca
│   ├── components/      # Componentes React
│   │   ├── search/      # SearchEngine, SearchFilters
│   │   ├── ui/          # shadcn components
│   │   └── ...          # Hero, Maya, Footer, etc
│   ├── lib/             # Utilitários e configs
│   └── types/           # TypeScript types
├── env.example          # Template de variáveis
└── package.json
```

---

## 🎯 Funcionalidades Implementadas

### ✅ Concluído
- [x] Homepage com Hero e SearchEngine
- [x] Busca de voos via Duffel API
- [x] Filtros de busca (preço, escalas, horário)
- [x] Maya AI Chat (Groq/LLaMA)
- [x] Autenticação com Supabase
- [x] Sistema de idioma e moeda
- [x] Design responsivo (mobile/desktop)
- [x] Modo claro/escuro (Champagne & Gold / Dark)
- [x] Destinos inspiradores
- [x] Páginas legais (Privacy, Terms)
- [x] Admin panel (Voice Studio)

### 🔄 Em Progresso
- [ ] Checkout com Stripe
- [ ] Formulário de passageiros dinâmico
- [ ] Confirmação de reserva
- [ ] Emails transacionais

### 📋 Pendente
- [ ] Configurar Stripe (chaves faltando)
- [ ] Histórico de reservas (My Trips)
- [ ] Notificações por email
- [ ] Voice cloning para Maya (ElevenLabs)

---

## 🔧 Configuração do Ambiente

### 1. Variáveis de Ambiente
Copie o `env.example` para `.env.local` e preencha:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://iewgwfnyityvijpzkamj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

# Duffel (Flights)
DUFFEL_ACCESS_TOKEN=duffel_test_...

# Groq (AI)
GROQ_API_KEY=gsk_...

# Stripe (Payments) - NECESSÁRIO CONFIGURAR
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Zoho)
ZOHO_USER=contato@alltripapp.com
ZOHO_PASS=Q45z7jzjKBgt
```

### 2. Iniciar Desenvolvimento
```bash
npm install
npm run dev
```

### 3. Deploy (Vercel)
Configurar todas as variáveis de ambiente no painel do Vercel.

---

## 👤 Admin Access

- **Email:** lira.chefs@gmail.com
- **Funcionalidades:** Voice Studio, gerenciamento de voos

---

## 📝 Notas Importantes

1. **Duffel Sandbox:** As buscas usam o ambiente de teste, preços são simulados
2. **Stripe Pendente:** Pagamentos só funcionarão após configurar as chaves
3. **Maya AI:** Usa Groq com modelo LLaMA, responde em português
4. **Zoho Email:** Configurado para contato@alltripapp.com

---

## 🔗 Links Úteis

- [Duffel Dashboard](https://app.duffel.com/)
- [Stripe Dashboard](https://dashboard.stripe.com/)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Groq Console](https://console.groq.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)
