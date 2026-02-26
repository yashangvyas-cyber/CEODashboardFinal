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
        <div className="premium-card p-6 flex flex-col h-full hover-scale relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -z-10 blur-xl"></div>

            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100/80 shrink-0">
                <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Multi-Currency Cash Flow</h3>
                <InfoTooltip content="Consolidated cash inflows grouped by foreign currency reserves." />
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
                {reserves.map((reserve, i) => (
                    <div key={i} className="flex flex-col justify-center p-3 rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-200/20">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-black border border-indigo-100 shadow-sm shadow-indigo-600/10">
                                {reserve.symbol}
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 tracking-wider w-8">{reserve.currency}</span>
                        </div>
                        <span className="text-lg font-black text-slate-800 leading-none tracking-tight ml-7">
                            {reserve.amountFormatted}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MultiCurrencyCashFlow;
