import React from 'react';
import type { DateRangeOption } from '../../types';
import { AlertTriangle } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';

interface LeakageItem {
    project: string;
    type: 'Fixed Cost' | 'Hourly';
    actual: number;
    target: number;
    amount: number;
}

interface Props {
    dateRange: DateRangeOption;
    data?: LeakageItem[];
}

const typeStyle = {
    'Fixed Cost': {
        badge: 'text-rose-700 bg-rose-50 border-rose-200',
        bar: 'bg-rose-500',
        overflow: 'bg-rose-400',
        overrunBadge: 'bg-rose-100 text-rose-700 border-rose-200',
        dividerBg: 'bg-rose-50 border-rose-100',
        dividerText: 'text-rose-600',
        dividerDot: 'bg-rose-400',
    },
    'Hourly': {
        badge: 'text-amber-700 bg-amber-50 border-amber-200',
        bar: 'bg-amber-500',
        overflow: 'bg-amber-300',
        overrunBadge: 'bg-amber-50 text-amber-700 border-amber-200',
        dividerBg: 'bg-amber-50 border-amber-100',
        dividerText: 'text-amber-600',
        dividerDot: 'bg-amber-400',
    },
};

const LeakageRow = ({ item }: { item: LeakageItem }) => {
    const style = typeStyle[item.type] ?? typeStyle['Fixed Cost'];
    const overrunPct = Math.round((item.actual / item.target) * 100);
    const isOverflow = overrunPct > 100;
    // Bar fill: capped at 100%, overflow shown as animated pulse layer
    const fillPct = Math.min(overrunPct, 100);

    return (
        <div className="flex flex-col p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all duration-200">
            {/* Title row */}
            <div className="flex justify-between items-start mb-1.5">
                <span className="text-xs font-bold text-slate-800 leading-tight w-2/3 truncate">{item.project}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${style.badge}`}>
                    {item.type}
                </span>
            </div>

            {/* Stats row */}
            <div className="flex justify-between items-end mt-0.5">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500">Actual vs {item.type === 'Fixed Cost' ? 'Purchased' : 'Billed'}</span>
                    <span className="text-xs font-semibold text-slate-700">{item.actual} / {item.target} hrs</span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Leakage</span>
                    <span className="text-sm font-extrabold text-rose-500">{item.amount} hrs</span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden relative">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${style.bar}`}
                    style={{ width: `${fillPct}%` }}
                />
                {/* Overflow pulse overlay — shown when actual > target */}
                {isOverflow && (
                    <div className={`absolute inset-0 rounded-full animate-pulse opacity-50 ${style.overflow}`} />
                )}
            </div>

            {/* Overrun badge — only shown when > 100% */}
            {isOverflow && (
                <div className="flex justify-end mt-1.5">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${style.overrunBadge}`}>
                        ⚠ {overrunPct}% of budget consumed
                    </span>
                </div>
            )}
        </div>
    );
};

const RevenueLeakage: React.FC<Props> = ({ data = [] }) => {
    const fixedItems = [...data]
        .filter(d => d.type === 'Fixed Cost')
        .sort((a, b) => b.amount - a.amount);
    const hourlyItems = [...data]
        .filter(d => d.type === 'Hourly')
        .sort((a, b) => b.amount - a.amount);

    const SectionDivider = ({ label, style }: { label: string; style: typeof typeStyle['Fixed Cost'] }) => (
        <div className={`flex items-center gap-2 px-2 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${style.dividerBg} ${style.dividerText}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dividerDot}`} />
            {label}
        </div>
    );

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-full hover:border-rose-100 hover:shadow-md transition-all duration-300">
            {/* Header */}
            <div className="flex justify-between items-start mb-4 shrink-0">
                <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                        Revenue Leakage Risk
                        <InfoTooltip content="Identifies projects where actual hours exceed either the fixed-cost purchased budget or the billed hours on hourly projects. Fixed Cost shown in red, Hourly in amber." />
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Unbilled / Over-Budget Projects</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                    <span className="text-[10px] font-semibold text-rose-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-sm bg-rose-400 inline-block" /> Fixed Cost
                    </span>
                    <span className="text-[10px] font-semibold text-amber-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-sm bg-amber-400 inline-block" /> Hourly
                    </span>
                </div>
            </div>

            {/* Item list */}
            <div className="flex-1 flex flex-col justify-start min-h-0 space-y-2 pb-1 overflow-y-auto custom-scrollbar">
                {fixedItems.length > 0 && (
                    <>
                        <SectionDivider label={`Fixed Cost  ·  ${fixedItems.length} project${fixedItems.length > 1 ? 's' : ''}`} style={typeStyle['Fixed Cost']} />
                        {fixedItems.map((item, idx) => <LeakageRow key={`fc-${idx}`} item={item} />)}
                    </>
                )}
                {hourlyItems.length > 0 && (
                    <>
                        <SectionDivider label={`Hourly  ·  ${hourlyItems.length} project${hourlyItems.length > 1 ? 's' : ''}`} style={typeStyle['Hourly']} />
                        {hourlyItems.map((item, idx) => <LeakageRow key={`hr-${idx}`} item={item} />)}
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-400 bg-slate-50 p-2 rounded italic">
                <strong>Logic:</strong> Tracks Fixed Cost projects where Actual {`>`} Purchased, and Hourly projects where Actual Spent exceeds Billed hours. Bar pulses red when overrun exceeds 100% of budget.
            </div>
        </div>
    );
};

export default RevenueLeakage;
