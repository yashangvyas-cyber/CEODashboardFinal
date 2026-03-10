import React from 'react';
import { DollarSign, FileText, CheckCircle, Clock, TrendingUp, Calendar, BarChart2 } from 'lucide-react';
import type { DateRangeOption } from '../../types';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    dateRange: DateRangeOption;
    data?: {
        totalWon: { value: string; count: string };
        invoiced: { value: string; percent: string };
        collected: { value: string; efficiency: string };
        outstanding: { value: string; label: string };
        unbilled: { value: string; label: string };
        avgDealSize: { value: string; label: string };
        salesCycle: { value: string; unit: string };
        collectionPct: number;
    };
}

const MetricCard = ({ label, value, icon: Icon, colorClass, subtext, tooltip, children }: any) => (
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
            {children ? children : (
                <>
                    <div className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</div>
                    {subtext && <div className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">{subtext}</div>}
                </>
            )}
        </div>
    </div>
);

// Mini segmented bar for Collection %
const CollectionPctCard = ({ pct, tooltip }: { pct: number; tooltip: string }) => (
    <div className="bg-white border border-slate-200 p-3 rounded-lg flex flex-col justify-between group hover:shadow-md transition-all relative overflow-hidden">
        <div className="absolute -right-2 -top-2 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity text-emerald-500">
            <BarChart2 className="w-16 h-16" />
        </div>
        <div className="flex items-center justify-between mb-2 z-10 relative">
            <div className="flex items-center">
                <span className="text-slate-400 text-[9px] font-black uppercase tracking-tighter">Collection %</span>
                <InfoTooltip content={tooltip} />
            </div>
            <div className="p-1 rounded bg-emerald-50/80 border border-emerald-100/50">
                <BarChart2 className="w-3 h-3 text-emerald-600" />
            </div>
        </div>
        <div className="z-10 relative">
            <div className={`text-xl font-black tracking-tighter leading-none ${pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>{pct}%</div>
            <div className="flex gap-0.5 h-1 mt-1.5">
                {[25, 50, 75, 95].map(threshold => (
                    <div key={threshold} className={`flex-1 rounded-full ${pct > threshold ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                ))}
            </div>
            <div className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">
                {pct >= 80 ? 'Healthy' : pct >= 60 ? 'At Risk' : 'Critical'}
            </div>
        </div>
    </div>
);

const CRMSummaryCards: React.FC<Props> = ({ data }) => {
    const cards = [
        {
            label: "Total Won",
            value: data?.totalWon.value || "₹4.2Cr",
            icon: CheckCircle,
            colorClass: { bg: 'bg-indigo-50/80', text: 'text-indigo-600', border: 'border-indigo-100/50' },
            subtext: data?.totalWon.count || "142 Deals",
            tooltip: "Total value and volume of deals successfully closed within the selected period."
        },
        {
            label: "Invoiced",
            value: data?.invoiced.value || "₹3.8Cr",
            icon: FileText,
            colorClass: { bg: 'bg-blue-50/80', text: 'text-blue-600', border: 'border-blue-100/50' },
            tooltip: "Total value of all invoices sent out to clients within the selected time range."
        },
        {
            label: "Collected",
            value: data?.collected.value || "₹3.45Cr",
            icon: DollarSign,
            colorClass: { bg: 'bg-emerald-50/80', text: 'text-emerald-600', border: 'border-emerald-100/50' },
            tooltip: "Actual cash received from clients, representing the real liquidity of the business."
        },
        {
            label: "Outstanding",
            value: data?.outstanding.value || "₹35L",
            icon: Clock,
            colorClass: { bg: 'bg-amber-50/80', text: 'text-amber-600', border: 'border-amber-100/50' },
            subtext: data?.outstanding.label || "(Invoiced - Collected)",
            tooltip: "The gap between what has been billed and what has been paid by clients."
        },
        {
            label: "Avg. Deal Size",
            value: data?.avgDealSize.value || "₹1.5L",
            icon: TrendingUp,
            colorClass: { bg: 'bg-violet-50/80', text: 'text-violet-600', border: 'border-violet-100/50' },
            subtext: data?.avgDealSize.label || "Avg per deal",
            tooltip: "The average revenue generated per closed-won deal."
        },
        {
            label: "Sales Cycle",
            value: data?.salesCycle.value || "18",
            icon: Calendar,
            colorClass: { bg: 'bg-orange-50/80', text: 'text-orange-600', border: 'border-orange-100/50' },
            subtext: data?.salesCycle.unit || "Days",
            tooltip: "The average number of days it takes to close a deal from lead creation to closed-won."
        }
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-4">
            {cards.map((card, idx) => (
                <MetricCard key={idx} {...card} />
            ))}
            <CollectionPctCard
                pct={data?.collectionPct ?? 0}
                tooltip="Percentage of invoiced revenue that has been successfully collected in the selected period."
            />
        </div>
    );
};

export default CRMSummaryCards;
