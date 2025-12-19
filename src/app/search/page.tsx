import { Suspense } from 'react';
import SearchContent from './SearchContent';
import { Metadata } from 'next';
import { Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
    title: "Resultados da Pesquisa - AllTrip",
    description: "Confira as melhores opções de voos encontradas para o seu destino.",
};

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
                    <p className="text-sm font-medium text-slate-400">Carregando busca...</p>
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}

