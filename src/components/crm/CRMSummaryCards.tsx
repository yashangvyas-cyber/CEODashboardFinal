import React from 'react';
import { DollarSign, FileText, CheckCircle, Clock, AlertOctagon } from 'lucide-react';
import type { DateRangeOption } from '../../types';

interface Props {
    dateRange: DateRangeOption;
    data?: {
        totalWon: { value: string; count: string };
        invoiced: { value: string; percent: string };
        collected: { value: string; efficiency: string };
        outstanding: { value: string; label: string };
        unbilled: { value: string; label: string };
    };
}

const MetricCard = ({ label, value, icon: Icon, colorClass, subtext }: any) => (
    <div className="premium-card p-5 flex flex-col justify-between h-full group hover-scale shadow-sm relative overflow-hidden">
        <div className={`absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 duration-500 ${colorClass.text}`}>
            <Icon className="w-24 h-24" />
        </div>

        <div className="flex items-center justify-between mb-3 z-10 relative">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{label}</span>
            <div className={`p-1.5 rounded-lg shadow-sm ${colorClass.bg} border ${colorClass.border}`}>
                <Icon className={`w-4 h-4 ${colorClass.text}`} />
            </div>
        </div>
        <div className="z-10 relative">
            <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
            {subtext && <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{subtext}</div>}
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
            subtext: data?.totalWon.count || "142 Deals"
        },
        {
            label: "Invoiced",
            value: data?.invoiced.value || "₹3.8Cr",
            icon: FileText,
            colorClass: { bg: 'bg-blue-50/80', text: 'text-blue-600', border: 'border-blue-100/50' },
            subtext: data?.invoiced.percent || "90% of Won"
        },
        {
            label: "Collected",
            value: data?.collected.value || "₹3.45Cr",
            icon: DollarSign,
            colorClass: { bg: 'bg-emerald-50/80', text: 'text-emerald-600', border: 'border-emerald-100/50' },
            subtext: data?.collected.efficiency || "90.8% Efficiency"
        },
        {
            label: "Outstanding",
            value: data?.outstanding.value || "₹35L",
            icon: Clock,
            colorClass: { bg: 'bg-amber-50/80', text: 'text-amber-600', border: 'border-amber-100/50' },
            subtext: data?.outstanding.label || "(Invoiced - Collected)"
        },
        {
            label: "Unbilled",
            value: data?.unbilled.value || "₹40L",
            icon: AlertOctagon,
            colorClass: { bg: 'bg-slate-50/80', text: 'text-slate-600', border: 'border-slate-200/50' },
            subtext: data?.unbilled.label || "Won but not Invoiced"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {cards.map((card, idx) => (
                <MetricCard key={idx} {...card} />
            ))}
        </div>
    );
};

export default CRMSummaryCards;
