import React, { useState } from 'react';

const CURRENCIES = [
    'AFN', 'ALL', 'AMD', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BDT', 'BGN',
    'BHD', 'BRL', 'BSD', 'BYN', 'BZD', 'CAD', 'DZD', 'EUR', 'GIP', 'HUF',
    'IDR', 'INR', 'JPY', 'RUB', 'USD'
];

const CurrencySwitcher: React.FC = () => {
    const [activeCurrency, setActiveCurrency] = useState('INR');

    return (
        <div className="w-full bg-white border-b border-slate-200 px-6 py-2 shrink-0">
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1">
                {CURRENCIES.map((curr) => (
                    <button
                        key={curr}
                        onClick={() => setActiveCurrency(curr)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all duration-300 whitespace-nowrap select-none ${activeCurrency === curr
                                ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {curr}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CurrencySwitcher;
