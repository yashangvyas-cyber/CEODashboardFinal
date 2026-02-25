import React from 'react';
import { Briefcase, CheckCircle2, AlertTriangle, Users2 } from 'lucide-react';
import type { DateRangeOption } from '../../types';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    dateRange: DateRangeOption;
    data?: {
        activeProjects: number;
        onTimeDelivery: number;
        budgetVariance: string;
        resourceUtilization: number;
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
    const delivery = data?.onTimeDelivery || (isYear ? 82 : 86);
    const variance = data?.budgetVariance || (isYear ? "+₹1.2Cr" : "+₹15L");
    const utilization = data?.resourceUtilization || (isYear ? 78 : 92);

    const cards = [
        {
            label: "Active Projects",
            value: projects,
            icon: Briefcase,
            colorClass: { bg: 'bg-blue-50/80', text: 'text-blue-600', border: 'border-blue-100/50' },
            subtext: isYear ? "Currently in execution" : "Executed in period",
            tooltip: "Total number of projects that were active or ongoing during this period."
        },
        {
            label: "On-Time Delivery",
            value: `${delivery}%`,
            icon: CheckCircle2,
            colorClass: { bg: 'bg-emerald-50/80', text: 'text-emerald-600', border: 'border-emerald-100/50' },
            subtext: "Milestones met",
            tooltip: "Percentage of project milestones successfully completed by their target date in this window."
        },
        {
            label: "Budget Variance",
            value: variance,
            icon: AlertTriangle,
            colorClass: { bg: 'bg-rose-50/80', text: 'text-rose-600', border: 'border-rose-100/50' },
            subtext: isYear ? "Total YTD Overshoot" : "Total Period Overshoot",
            tooltip: "Aggregate difference between planned budget and actual costs incurred in this period."
        },
        {
            label: "Resource Util.",
            value: `${utilization}%`,
            icon: Users2,
            colorClass: { bg: 'bg-amber-50/80', text: 'text-amber-600', border: 'border-amber-100/50' },
            subtext: isYear ? "Current Efficiency" : "Period Avg. Efficiency",
            tooltip: "Percentage of available staff hours that were logged as billable in the selected period."
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {cards.map((card, idx) => (
                <MetricCard key={idx} {...card} />
            ))}
        </div>
    );
};

export default PMSummaryCards;
