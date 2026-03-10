import React from 'react';
import { Users, UserCheck, Timer, CheckCircle, TrendingUp } from 'lucide-react';
import type { DateRangeOption } from '../../types';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    data?: {
        hiringEfficiency: {
            interviewToHire: string;
            timeToHire: number;
        };
        candidateRatio: {
            totalCandidates: number;
            totalHires: number;
        };
    };
    dateRange?: DateRangeOption;
}

// Matches CRMSummaryCards MetricCard exactly — vertical layout, label top, value below
const MetricCard = ({ label, value, icon: Icon, colorClass, subtext, tooltip }: any) => (
    <div className="bg-white border border-slate-200 p-3 rounded-lg flex flex-col justify-between group hover:shadow-md transition-all relative overflow-hidden">
        {/* Ghost icon background */}
        <div className={`absolute -right-2 -top-2 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity transform group-hover:rotate-12 duration-500 ${colorClass.text}`}>
            <Icon className="w-16 h-16" />
        </div>

        {/* Label row */}
        <div className="flex items-center justify-between mb-2 z-10 relative">
            <div className="flex items-center">
                <span className="text-slate-400 text-[9px] font-black uppercase tracking-tighter">{label}</span>
                <InfoTooltip content={tooltip} />
            </div>
            <div className={`p-1 rounded ${colorClass.bg} border ${colorClass.border}`}>
                <Icon className={`w-3 h-3 ${colorClass.text}`} />
            </div>
        </div>

        {/* Value row */}
        <div className="z-10 relative">
            <div className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</div>
            {subtext && <div className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">{subtext}</div>}
        </div>
    </div>
);

const RecruitmentSummaryCards: React.FC<Props> = ({ data }) => {
    const cards = [
        {
            label: "Total Candidates",
            value: data?.candidateRatio.totalCandidates ?? 399,
            icon: Users,
            colorClass: { bg: 'bg-blue-50/80', text: 'text-blue-600', border: 'border-blue-100/50' },
            tooltip: "Total number of unique candidates recorded in the recruitment pipeline during the selected period."
        },
        {
            label: "Total Hires",
            value: data?.candidateRatio.totalHires ?? 36,
            icon: UserCheck,
            colorClass: { bg: 'bg-amber-50/80', text: 'text-amber-600', border: 'border-amber-100/50' },
            tooltip: "Total number of candidates who have successfully accepted offers and joined."
        },
        {
            label: "Time-to-Hire",
            value: `${data?.hiringEfficiency.timeToHire ?? 50}`,
            subtext: "Days avg.",
            icon: Timer,
            colorClass: { bg: 'bg-emerald-50/80', text: 'text-emerald-600', border: 'border-emerald-100/50' },
            tooltip: "Average time taken to fill a role, from initial job posting to candidate acceptance."
        },
        {
            label: "Accept Rate",
            value: "88%",
            icon: CheckCircle,
            colorClass: { bg: 'bg-cyan-50/80', text: 'text-cyan-600', border: 'border-cyan-100/50' },
            tooltip: "Percentage of candidates who accepted an offer out of the total offers extended."
        },
        {
            label: "Hire Ratio",
            value: "9%",
            subtext: "8:1 Ratio",
            icon: TrendingUp,
            colorClass: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
            tooltip: "The efficiency ratio showing how many candidates were screened vs. how many were hired."
        }
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {cards.map((card, idx) => (
                <MetricCard key={idx} {...card} />
            ))}
        </div>
    );
};

export default RecruitmentSummaryCards;
