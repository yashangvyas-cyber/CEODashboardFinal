import React from 'react';
import type { BusinessUnitOption } from '../../types';
import { ChevronDown } from 'lucide-react';

interface DashboardHeaderProps {
    selectedBU: BusinessUnitOption;
    onChangeBU: (bu: BusinessUnitOption) => void;
}

const BU_OPTIONS: { value: BusinessUnitOption; label: string }[] = [
    { value: 'all', label: 'All Business Units' },
    { value: 'bu_a', label: 'Engineering' },
    { value: 'bu_b', label: 'Sales & Marketing' },
    { value: 'bu_c', label: 'Finance & Admin' },
    { value: 'bu_d', label: 'Legal & HR' },
];

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ selectedBU, onChangeBU }) => {

    return (
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
            {/* Left: Dashboard Identity */}
            <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-indigo-600 rounded-full" />
                <div>
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.18em] leading-none">CollabCRM</p>
                    <h1 className="text-base font-black text-slate-900 tracking-tight leading-tight mt-0.5">CEO Dashboard</h1>
                </div>
            </div>

            {/* Right: Business Unit Filter */}
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Unit:</span>
                <div className="relative">
                    <select
                        value={selectedBU}
                        onChange={(e) => onChangeBU(e.target.value as BusinessUnitOption)}
                        className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-300 rounded-md text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-400 transition-colors cursor-pointer"
                    >
                        {BU_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>
        </div>
    );
};
