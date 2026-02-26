import React from 'react';
import type { DateRangeOption, ModuleOption } from '../../types';
import { Search, X } from 'lucide-react';

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

const DATE_OPTIONS: { value: DateRangeOption; label: string }[] = [
    { value: 'this_quarter', label: 'This Quarter' },
    { value: 'last_quarter', label: 'Last Quarter' },
    { value: 'ytd', label: 'Year to Date' },
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
    return (
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center gap-3">
            {/* Multi-select module pills */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
                {MODULES.map((mod) => {
                    const isSelected = selectedTabs.includes(mod.id);
                    const isOnly = selectedTabs.length === 1 && isSelected;
                    return (
                        <button
                            key={mod.id}
                            onClick={() => onToggleTab(mod.id)}
                            disabled={isOnly} // can't deselect the last one
                            title={isOnly ? 'At least one tab must be selected' : undefined}
                            className={`px-3.5 py-1.5 rounded-md text-[11px] font-bold transition-all duration-150 whitespace-nowrap border select-none ${isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400 hover:text-indigo-600'
                                } ${isOnly ? 'opacity-80 cursor-default' : 'cursor-pointer'}`}
                        >
                            {mod.label}
                        </button>
                    );
                })}
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-slate-200 mx-1 flex-shrink-0" />

            {/* Date Range Selector */}
            <div className="relative flex-shrink-0">
                <select
                    value={selectedDate}
                    onChange={(e) => onChangeDate(e.target.value as DateRangeOption)}
                    className="appearance-none pl-3 pr-7 py-1.5 bg-white border border-slate-300 rounded-md text-[11px] font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-400 hover:border-slate-400 transition-colors cursor-pointer"
                >
                    {DATE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
            </div>

            {/* Spacer pushes actions to the right */}
            <div className="flex-1" />

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {isApplied && (
                    <button
                        onClick={onClear}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-500 bg-white border border-slate-300 rounded-md hover:border-rose-400 hover:text-rose-600 transition-all"
                    >
                        <X size={12} />
                        Clear
                    </button>
                )}
                <button
                    onClick={onSearch}
                    className="relative flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-bold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
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
