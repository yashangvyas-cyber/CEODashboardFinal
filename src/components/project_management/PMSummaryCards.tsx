import React from 'react';
import { Briefcase, FolderCheck, Users2 } from 'lucide-react';
import type { DateRangeOption } from '../../types';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    dateRange: DateRangeOption;
    data?: {
        activeProjects: number;
        projectsClosed: number;
        resourceUtilization: number;
        hireVsExpire?: {
            newlyHired: number;
            expired: number;
            netChange: number;
        };
    };
}

const MetricCard = ({ label, value, icon: Icon, colorClass, subtext, tooltip }: any) => (
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
            <div className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</div>
            {subtext && <div className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">{subtext}</div>}
        </div>
    </div>
);

const PMSummaryCards: React.FC<Props> = ({ dateRange, data }) => {
    // Simulated date-aware logic for demo
    const isYear = dateRange === 'this_year';

    const projects = data?.activeProjects || (isYear ? 48 : 32);
    const closed = data?.projectsClosed || (isYear ? 21 : 14);
    const utilization = data?.resourceUtilization || (isYear ? 78 : 92);

    const cards = [
        {
            label: "Active Projects",
            value: projects,
            icon: Briefcase,
            colorClass: { bg: 'bg-blue-50/80', text: 'text-blue-600', border: 'border-blue-100/50' },
            tooltip: "Total number of projects that were active or ongoing during this period."
        },
        {
            label: "Projects Closed",
            value: closed,
            icon: FolderCheck,
            colorClass: { bg: 'bg-emerald-50/80', text: 'text-emerald-600', border: 'border-emerald-100/50' },
            tooltip: "Number of projects that moved to a completed or signed-off status during the selected period."
        },
        {
            label: "Contract Adjustments",
            value: null,
            icon: Users2,
            colorClass: { bg: 'bg-indigo-50/80', text: 'text-indigo-600', border: 'border-indigo-100/50' },
            tooltip: "Summary of resource contract changes: Hired and Expired.",
            customContent: data?.hireVsExpire && (
                <div className="flex items-center gap-6 mt-1">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Hired</span>
                        <div className="text-xl font-black text-emerald-600 tracking-tighter leading-none">+{data.hireVsExpire.newlyHired}</div>
                    </div>
                    <div className="h-8 w-px bg-slate-200 mx-1" />
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-rose-600 uppercase tracking-tighter">Expired</span>
                        <div className="text-xl font-black text-rose-600 tracking-tighter leading-none">-{data.hireVsExpire.expired}</div>
                    </div>
                </div>
            )
        },
        {
            label: "Billability %",
            value: `${utilization}%`,
            icon: Users2,
            colorClass: { bg: 'bg-amber-50/80', text: 'text-amber-600', border: 'border-amber-100/50' },
            tooltip: "Percentage of available staff hours that were logged as billable in the selected period."
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {cards.map((card, idx) => (
                card.customContent ? (
                    <div key={idx} className="bg-white border border-slate-200 p-3 rounded-lg flex flex-col justify-between group hover:shadow-md transition-all relative overflow-hidden">
                        <div className={`absolute -right-2 -top-2 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity transform group-hover:rotate-12 duration-500 ${card.colorClass.text}`}>
                            <card.icon className="w-16 h-16" />
                        </div>
                        <div className="flex items-center justify-between mb-2 z-10 relative">
                            <div className="flex items-center">
                                <span className="text-slate-400 text-[9px] font-black uppercase tracking-tighter">{card.label}</span>
                                <InfoTooltip content={card.tooltip} />
                            </div>
                            <div className={`p-1 rounded ${card.colorClass.bg} border ${card.colorClass.border}`}>
                                <card.icon className={`w-3 h-3 ${card.colorClass.text}`} />
                            </div>
                        </div>
                        <div className="z-10 relative">
                            {card.customContent}
                        </div>
                    </div>
                ) : (
                    <MetricCard key={idx} {...card} />
                )
            ))}
        </div>
    );
};

export default PMSummaryCards;
