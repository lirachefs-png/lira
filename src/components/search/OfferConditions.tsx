import { useRegion } from '@/contexts/RegionContext';
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, DollarSign } from 'lucide-react';

interface Condition {
    allowed: boolean;
    penalty_amount?: string | number | null;
    penalty_currency?: string | null;
}

interface OfferConditionsProps {
    conditions: {
        refund_before_departure?: Condition | null;
        change_before_departure?: Condition | null;
    };
    compact?: boolean; // For tighter spaces like mobile or condensed lists
}

export default function OfferConditions({ conditions, compact = false }: OfferConditionsProps) {
    const { language } = useRegion();

    const formatMoney = (amount: string | number | null | undefined, currency: string | null | undefined) => {
        if (!amount || !currency) return '';
        const locale = language === 'pt' ? 'pt-BR' : 'en-US';
        return Number(amount).toLocaleString(locale, { style: 'currency', currency: currency });
    };

    const renderCondition = (type: 'refund' | 'change', condition: Condition | null | undefined) => {
        const isRefund = type === 'refund';
        const label = isRefund
            ? (language === 'pt' ? 'Reembolso' : 'Refund')
            : (language === 'pt' ? 'Alteração' : 'Change');

        if (!condition) {
            // Unknown status
            return (
                <div className="flex items-center gap-1.5 text-gray-500" title={`${label}: Info unavailable`}>
                    <AlertTriangle className="w-4 h-4" />
                    {!compact && <span className="text-xs">{label}: ?</span>}
                </div>
            );
        }

        if (!condition.allowed) {
            return (
                <div className="flex items-center gap-1.5 text-red-500" title={`${label}: Not allowed`}>
                    <XCircle className="w-4 h-4" />
                    {!compact && <span className="text-xs">{label}</span>}
                </div>
            );
        }

        const penalty = formatMoney(condition.penalty_amount, condition.penalty_currency);
        const isFree = !condition.penalty_amount || parseFloat(condition.penalty_amount.toString()) === 0;

        return (
            <div className={`flex items-center gap-1.5 ${isFree ? 'text-green-500' : 'text-amber-500'}`}
                title={`${label}: ${isFree ? 'Free' : penalty}`}>
                {isFree ? <CheckCircle2 className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                {!compact && (
                    <span className="text-xs font-medium">
                        {label}: {isFree ? (language === 'pt' ? 'Grátis' : 'Free') : penalty}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className={`flex ${compact ? 'gap-3' : 'gap-4'} items-center`}>
            {renderCondition('refund', conditions?.refund_before_departure)}
            <div className="w-[1px] h-3 bg-white/10"></div>
            {renderCondition('change', conditions?.change_before_departure)}
        </div>
    );
}
