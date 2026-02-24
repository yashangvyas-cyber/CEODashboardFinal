import React from 'react';
import { Briefcase, Users, UserCheck, Timer, CheckCircle, TrendingUp } from 'lucide-react';
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
}

const MetricCard = ({ label, value, icon: Icon, colorClass, subtitle, tooltip }: any) => (
    <div className="bg-white border border-slate-200 px-3 py-2 rounded-xl flex items-center group hover:shadow-md transition-all min-h-[60px] w-fit">
        <div className={`p-1.5 rounded-lg ${colorClass.bg} ${colorClass.text} shrink-0 mr-3 shadow-sm`}>
            <Icon className="w-4 h-4" />
        </div>
        <div className="flex flex-col justify-center">
            <div className="flex items-center">
                <span className="text-slate-400 text-[9px] font-black uppercase tracking-[0.12em] block leading-tight mb-0.5 whitespace-nowrap">{label}</span>
                <InfoTooltip content={tooltip} />
            </div>
            <div className="flex items-baseline gap-1.5">
                <div className="text-lg font-black text-slate-900 tracking-tighter leading-none whitespace-nowrap">{value}</div>
                {subtitle && (
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight opacity-80 whitespace-nowrap">{subtitle}</span>
                )}
            </div>
        </div>
    </div>
);

const RecruitmentSummaryCards: React.FC<Props> = ({ data }) => {
    const cards = [
        {
            label: "Total Candidates",
            value: data?.candidateRatio.totalCandidates || "399",
            icon: Users,
            colorClass: { bg: 'bg-blue-50', text: 'text-blue-600' },
            tooltip: "Total number of unique candidates currently in the recruitment pipeline."
        },
        {
            label: "Total Hires",
            value: data?.candidateRatio.totalHires || "36",
            icon: UserCheck,
            colorClass: { bg: 'bg-amber-50', text: 'text-amber-600' },
            tooltip: "Total number of candidates who have successfully accepted offers and joined."
        },
        {
            label: "Open Roles",
            value: "14",
            icon: Briefcase,
            colorClass: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
            tooltip: "Current number of active job openings across all departments."
        },
        {
            label: "Time-to-Hire",
            value: `${data?.hiringEfficiency.timeToHire || 50} Days`,
            icon: Timer,
            colorClass: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
            tooltip: "Average time taken to fill a role, from initial job posting to candidate acceptance."
        },
        {
            label: "Accept Rate",
            value: "88%",
            icon: CheckCircle,
            colorClass: { bg: 'bg-cyan-50', text: 'text-cyan-600' },
            tooltip: "Percentage of candidates who accepted an offer out of the total offers extended."
        },
        {
            label: "Hire Ratio",
            value: "9%",
            subtitle: "8:1 Ratio",
            icon: TrendingUp,
            colorClass: { bg: 'bg-slate-50', text: 'text-slate-600' },
            tooltip: "The efficiency ratio showing how many candidates were screened vs. how many were hired."
        }
    ];

    return (
        // flex row wrapping — cards only as wide as content, not grid-stretched
        <div className="col-span-12 flex flex-row flex-wrap gap-3">
            {cards.map((card, idx) => (
                <MetricCard key={idx} {...card} />
            ))}
        </div>
    );
};

export default RecruitmentSummaryCards;
