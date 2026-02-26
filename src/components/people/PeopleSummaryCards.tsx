import React from 'react';
import { Users, UserMinus } from 'lucide-react';
import type { DateRangeOption } from '../../types';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    dateRange: DateRangeOption;
    data?: {
        totalHeadcount: number;
        newJoins: number;
        exits: number;
        attritionRate: number;
        shadows?: number;
        experts?: number;
        totalManagers?: number;
        headcountTrend?: { value: number, percent: number };
    };
}

const MetricCard = ({ label, value, icon: Icon, colorClass, subtext, tooltip, trend }: any) => (
    <div className="bg-white border border-slate-200 p-3 rounded-lg flex flex-col justify-between group hover:shadow-md transition-all relative overflow-hidden">
        <div className={`absolute -right-2 -top-2 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity transform group-hover:rotate-12 duration-500 ${colorClass.text}`}>
            <Icon className="w-16 h-16" />
        </div>

        <div className="flex items-center justify-between mb-2 z-10 relative">
            <div className="flex items-center">
                <span className="text-slate-400 text-[9px] font-black uppercase tracking-tighter">{label}</span>
                <InfoTooltip content={tooltip} />
            </div>
            <div className={`p-1 rounded ${colorClass.bg} border ${colorClass.border}`}>
                <Icon className={`w-3 h-3 ${colorClass.text}`} />
            </div>
        </div>
        <div className="z-10 relative">
            <div className="flex items-baseline justify-between w-full pr-1">
                <div className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</div>
                {trend && (
                    <div className={`text-[10px] font-bold ${trend.value > 0 ? 'text-emerald-500' : trend.value < 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                        {trend.value > 0 ? '+' : ''}{trend.value} ({trend.value > 0 ? '+' : ''}{trend.percent}%)
                    </div>
                )}
            </div>
            {subtext && <div className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">{subtext}</div>}
        </div>
    </div>
);

const PeopleSummaryCards: React.FC<Props> = ({ dateRange, data }) => {
    // Simulated date-aware logic for demo
    const isYear = dateRange === 'this_year';
    const headcount = data?.totalHeadcount || (isYear ? 1240 : 1245);
    const exits = data?.exits || (isYear ? 42 : 5);
    const attrition = data?.attritionRate || (isYear ? 3.4 : 0.4);



    const cards = [
        {
            label: "Total Headcount",
            value: headcount.toLocaleString(),
            icon: Users,
            colorClass: { bg: 'bg-indigo-50/80', text: 'text-indigo-600', border: 'border-indigo-100/50' },
            subtext: "Headcount at Period End",
            tooltip: "Total number of active employees at the end of the selected period.",
            trend: data?.headcountTrend
        },

        {
            label: "Attrition Rate",
            value: `${attrition}%`,
            icon: UserMinus,
            colorClass: { bg: 'bg-rose-50/80', text: 'text-rose-600', border: 'border-rose-100/50' },
            subtext: `${exits} Total Exits`,
            tooltip: "The percentage and count of employees who left the organization during this period."
        },

    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-4">
            {cards.map((card, idx) => (
                <MetricCard key={idx} {...card} />
            ))}
        </div>
    );
};

export default PeopleSummaryCards;
