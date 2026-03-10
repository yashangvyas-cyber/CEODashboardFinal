import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, DollarSign } from 'lucide-react';

export const CURRENCIES = [
    'ALL', 'AFN', 'AMD', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BDT', 'BGN',
    'BHD', 'BRL', 'BSD', 'BYN', 'BZD', 'CAD', 'DZD', 'EUR', 'GIP', 'HUF',
    'IDR', 'INR', 'JPY', 'RUB', 'USD'
];

interface Props {
    activeCurrency: string;
    onCurrencyChange: (currency: string) => void;
}

const CurrencySwitcher: React.FC<Props> = ({ activeCurrency, onCurrencyChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
            >
                <DollarSign className="w-3 h-3 text-slate-400" />
                {activeCurrency}
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-2 w-56">
                    <div className="text-[10px] font-bold text-slate-400 px-2 pb-1.5">CRM Currency</div>
                    <div className="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto">
                        {CURRENCIES.map(curr => (
                            <button
                                key={curr}
                                onClick={() => { onCurrencyChange(curr); setIsOpen(false); }}
                                className={`px-2 py-1.5 rounded-md text-[10px] font-bold tracking-wide transition-all ${activeCurrency === curr
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                    }`}
                            >
                                {curr}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrencySwitcher;
