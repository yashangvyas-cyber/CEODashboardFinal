import React, { useState, useRef, useEffect } from 'react';
import type { DateRangeOption } from '../../types';
import { Calendar, ChevronDown } from 'lucide-react';

interface DashboardControlsProps {
    selectedDate: DateRangeOption;
    onChangeDate: (date: DateRangeOption) => void;
}

const PRESET_DATES: { value: DateRangeOption; label: string }[] = [
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'this_quarter', label: 'This Quarter' },
    { value: 'last_quarter', label: 'Last Quarter' },
    { value: 'this_year', label: 'This Year' },
    { value: 'last_year', label: 'Last Year' },
];

export const DashboardControls: React.FC<DashboardControlsProps> = ({
    selectedDate,
    onChangeDate,
}) => {
    const [isDateOpen, setIsDateOpen] = useState(false);
    const dateRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
                setIsDateOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center gap-4">
            {/* Date Picker */}
            <div className="relative bg-slate-100 p-1 rounded-xl flex items-center gap-1 flex-shrink-0" ref={dateRef}>
                <button
                    onClick={() => setIsDateOpen(!isDateOpen)}
                    className="flex flex-row items-center gap-2 px-4 py-1.5 bg-white rounded-lg text-[11px] font-bold text-slate-600 hover:text-indigo-600 transition-colors shadow-sm"
                >
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {(PRESET_DATES.find(d => d.value === selectedDate)?.label) || 'Select Period'}
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDateOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDateOpen && (
                    <div className="absolute top-12 left-0 z-50 bg-white border border-slate-200 rounded-lg shadow-xl p-3 w-72 mt-1 cursor-default">
                        <div className="text-[11px] font-bold text-slate-700 mb-2.5">Select Period</div>
                        <div className="grid grid-cols-2 gap-2">
                            {PRESET_DATES.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        onChangeDate(opt.value);
                                        setIsDateOpen(false);
                                    }}
                                    className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all border outline-none ${selectedDate === opt.value
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
