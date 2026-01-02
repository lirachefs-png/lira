# AllTrip Project Context
**Last Updated:** 2026-01-02 22:57

## Current State ✅
- **Login:** Working (Supabase auth fixed)
- **Flight Search:** Working (Duffel API)
- **Chatbot:** REMOVED (Maya/Eden)
- **Build:** Passing

## Recent Changes
- Removed all Maya/Eden chatbot code (6 files deleted)
- Fixed `.env.local` with correct Supabase keys
- Git checkpoint: `af34ea3`

## Environment Variables Required
```
DUFFEL_ACCESS_TOKEN
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL
TAVILY_API_KEY
ZOHO_EMAIL
ZOHO_PASSWORD
```

## Key Files
- `src/components/layout/Header.tsx` - Main navigation
- `src/app/page.tsx` - Homepage
- `src/app/search/page.tsx` - Flight search
- `src/app/checkout/` - Booking flow

## To Run Locally
```bash
npm run dev
# http://localhost:3000
```

## Deploy
- **Railway:** https://lira-production-ef0b.up.railway.app
