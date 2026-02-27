import React, { useState, useRef, useEffect } from 'react';
import type { DateRangeOption, ModuleOption } from '../../types';
import { Search, X, Calendar, ChevronDown } from 'lucide-react';

interface DashboardControlsProps {
    selectedTabs: ModuleOption[];
    onToggleTab: (tab: ModuleOption) => void;
    selectedDate: DateRangeOption;
    onChangeDate: (date: DateRangeOption) => void;
    onSearch: () => void;
    onClear: () => void;
    isApplied: boolean;
    isDirty: boolean;
}

const MODULES: { id: ModuleOption; label: string }[] = [
    { id: 'people', label: 'People' },
    { id: 'crm', label: 'CRM & Invoice' },
    { id: 'recruitment', label: 'Recruitment' },
    { id: 'project_management', label: 'Project Management' },
];

const PRESET_DATES: { value: DateRangeOption; label: string }[] = [
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'this_quarter', label: 'This Quarter' },
    { value: 'last_quarter', label: 'Last Quarter' },
    { value: 'this_year', label: 'This Year' },
    { value: 'last_year', label: 'Last Year' },
];

export const DashboardControls: React.FC<DashboardControlsProps> = ({
    selectedTabs,
    onToggleTab,
    selectedDate,
    onChangeDate,
    onSearch,
    onClear,
    isApplied,
    isDirty,
}) => {
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [pendingDate, setPendingDate] = useState<DateRangeOption>(selectedDate);
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

    // Only sync pendingDate when selectedDate externally changes (e.g. Clear button)
    // DO NOT add isDateOpen here — closing the popover must NOT reset pending selection!
    useEffect(() => {
        setPendingDate(selectedDate);
    }, [selectedDate]);

    const handleApplyDate = () => {
        onChangeDate(pendingDate);
        setIsDateOpen(false);
    };

    return (
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                {/* Multi-select module pills in a grey track */}
                <div className="bg-slate-100/80 p-1.5 rounded-lg flex items-center gap-1.5 flex-shrink-0">
                    {MODULES.map((mod) => {
                        const isSelected = selectedTabs.includes(mod.id);
                        return (
                            <button
                                key={mod.id}
                                onClick={() => onToggleTab(mod.id)}
                                className={`px-4 py-1.5 rounded-md text-[12px] font-bold transition-all duration-150 whitespace-nowrap select-none border ${isSelected
                                    ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                                    : 'bg-white text-slate-700 border-transparent shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-200'
                                    } cursor-pointer`}
                            >
                                {mod.label}
                            </button>
                        );
                    })}
                </div>

                {/* Date Popover in its own track or part of a group */}
                <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 flex-shrink-0" ref={dateRef}>
                    <button
                        onClick={() => setIsDateOpen(!isDateOpen)}
                        className="flex flex-row items-center gap-2 px-4 py-1.5 bg-white rounded-lg text-[11px] font-bold text-slate-600 hover:text-indigo-600 transition-colors shadow-sm"
                    >
                        {(PRESET_DATES.find(d => d.value === selectedDate)?.label) || 'Custom Date'}
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDateOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDateOpen && (
                        <div className="absolute top-12 left-0 z-50 bg-white border border-slate-200 rounded-lg shadow-xl p-3 w-80 mt-1 cursor-default">
                            <div className="text-[11px] font-bold text-slate-700 mb-2.5">Date Range</div>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                {PRESET_DATES.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            setPendingDate(opt.value);
                                            onChangeDate(opt.value);
                                            setIsDateOpen(false);
                                        }}
                                        className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all border outline-none ${pendingDate === opt.value
                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 flex justify-between items-center border border-slate-200 rounded px-2.5 py-1.5 bg-white text-[11px] text-slate-400 font-medium hover:border-slate-300 outline-none">
                                    Select custom range
                                    <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                </button>
                                <button
                                    onClick={handleApplyDate}
                                    className={`px-4 py-1.5 rounded text-[11px] font-bold transition-all ${pendingDate !== selectedDate
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions in a grey track */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 flex-shrink-0">
                {isApplied && (
                    <button
                        onClick={onClear}
                        className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-bold text-slate-500 bg-white rounded-lg hover:text-rose-600 transition-all shadow-sm"
                    >
                        <X size={12} />
                        Clear
                    </button>
                )}
                <button
                    onClick={onSearch}
                    className="relative flex items-center gap-1.5 px-5 py-1.5 text-[11px] font-bold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
                >
                    <Search size={12} strokeWidth={2.5} />
                    Search
                    {isDirty && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 border border-white"></span>
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

