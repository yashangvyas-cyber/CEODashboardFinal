import React from 'react';
import type { DateRangeOption, ModuleOption, BusinessUnitOption } from '../../types';
import { Search, X, Users, Briefcase, UserPlus, FileSpreadsheet } from 'lucide-react';

interface TopControlBarProps {
    selectedModules: ModuleOption[];
    onToggleModule: (module: ModuleOption) => void;
    selectedBU: BusinessUnitOption;
    onChangeBU: (bu: BusinessUnitOption) => void;
    selectedDate: DateRangeOption;
    onChangeDate: (date: DateRangeOption) => void;
    onSearch: () => void;
    onClear: () => void;
}

const MODULE_CONFIG = [
    { id: 'people', label: 'People', icon: Users },
    { id: 'crm', label: 'CRM & Invoice', icon: Briefcase },
    { id: 'recruitment', label: 'Recruitment', icon: UserPlus },
    { id: 'project_management', label: 'Project Management', icon: FileSpreadsheet },
] as const;

export const TopControlBar: React.FC<TopControlBarProps> = ({
    selectedModules,
    onToggleModule,
    selectedBU,
    onChangeBU,
    selectedDate,
    onChangeDate,
    onSearch,
    onClear
}) => {
    return (
        <div className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            {/* Left: Module Toggles */}
            <div className="flex flex-wrap items-center gap-2">
                {MODULE_CONFIG.map((mod) => {
                    const isSelected = selectedModules.includes(mod.id as ModuleOption);
                    const Icon = mod.icon;
                    return (
                        <button
                            key={mod.id}
                            onClick={() => onToggleModule(mod.id as ModuleOption)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            <Icon size={16} className={isSelected ? 'text-indigo-100' : 'text-slate-400'} />
                            {mod.label}
                        </button>
                    );
                })}
            </div>

            {/* Right: Filters and Actions */}
            <div className="flex flex-wrap items-center gap-3">
                {/* BU Dropdown */}
                <select
                    value={selectedBU}
                    onChange={(e) => onChangeBU(e.target.value as BusinessUnitOption)}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                    <option value="all">All Business Units</option>
                    <option value="bu_a">BU A (Web Services)</option>
                    <option value="bu_b">BU B (Mobile Apps)</option>
                    <option value="bu_c">BU C (Cloud Solutions)</option>
                    <option value="bu_d">BU D (AI & Data)</option>
                </select>

                {/* Date Dropdown */}
                <select
                    value={selectedDate}
                    onChange={(e) => onChangeDate(e.target.value as DateRangeOption)}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                    <option value="last_year">Last Year</option>
                    <option value="this_year">This Year</option>
                    <option value="ytd">Year to Date</option>
                    <option value="last_quarter">Last Quarter</option>
                    <option value="this_quarter">This Quarter</option>
                </select>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                    <button
                        onClick={onClear}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={16} />
                        Clear
                    </button>
                    <button
                        onClick={onSearch}
                        className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Search size={16} />
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};
