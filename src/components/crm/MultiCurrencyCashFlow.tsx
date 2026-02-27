import React from 'react';
import type { DateRangeOption } from '../../types';
import InfoTooltip from '../common/InfoTooltip';

interface CurrencyReserve {
    currency: string;
    amountFormatted: string;
    symbol: string;
}

interface Props {
    dateRange?: DateRangeOption;
    data?: CurrencyReserve[];
}

const defaultData: CurrencyReserve[] = [
    { currency: 'INR', amountFormatted: '87.9L', symbol: '₹' },
    { currency: 'USD', amountFormatted: '164.7K', symbol: '$' },
    { currency: 'EUR', amountFormatted: '36.0K', symbol: '€' },
    { currency: 'ALL', amountFormatted: '29.1K', symbol: 'L' },
];

const MultiCurrencyCashFlow: React.FC<Props> = ({ data }) => {
    const reserves = data || defaultData;

    return (
        <div className="premium-card p-4 flex flex-col h-full hover-scale relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/30 rounded-bl-full -z-10 blur-xl"></div>

            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100/80 shrink-0 relative z-10">
                <h3 className="text-[9px] font-black text-slate-400 tracking-widest uppercase">Multi-Currency Cash Flow</h3>
                <InfoTooltip content="Consolidated cash inflows grouped by foreign currency reserves." />
            </div>

            <div className="flex-1 grid grid-cols-2 gap-2 relative z-10">
                {reserves.map((reserve, i) => (
                    <div key={i} className="flex flex-col justify-center p-2 rounded-xl border border-slate-100 bg-white/50 shadow-sm backdrop-blur-sm">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <div className="w-4 h-4 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[9px] font-black border border-indigo-100 shadow-sm">
                                {reserve.symbol}
                            </div>
                            <span className="text-[8px] font-bold text-slate-500 tracking-wider truncate">{reserve.currency}</span>
                        </div>
                        <span className="text-sm font-black text-slate-800 leading-none tracking-tight ml-5">
                            {reserve.amountFormatted}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MultiCurrencyCashFlow;
