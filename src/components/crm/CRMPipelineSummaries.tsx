import React from 'react';
import { Users, Briefcase, Filter, XCircle, CheckCircle2 } from 'lucide-react';
import type { DateRangeOption } from '../../types';

interface Props {
    dateRange?: DateRangeOption;
    data?: {
        leads: { total: number; qualified: number; unqualified: number; qPercent: number; uPercent: number };
        deals: { total: number; won: number; lost: number; wPercent: number; lPercent: number };
    };
}

const PipelineCard = ({ title, total, subItems, icon: Icon, colorClass }: any) => (
    <div className="premium-card p-6 flex flex-col h-full group hover-scale relative overflow-hidden">
        <div className={`absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 duration-500 ${colorClass.text}`}>
            <Icon className="w-24 h-24" />
        </div>

        <div className="flex items-center justify-between mb-4 z-10 relative">
            <div className="flex flex-col">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">{title}</span>
                <div className="text-3xl font-black text-slate-900 tracking-tight leading-none">{total.toLocaleString()}</div>
            </div>
            <div className={`p-2 rounded-xl shadow-sm ${colorClass.bg} border ${colorClass.border}`}>
                <Icon className={`w-5 h-5 ${colorClass.text}`} />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto relative z-10">
            {subItems.map((item: any, idx: number) => (
                <div key={idx} className="bg-slate-50/50 backdrop-blur-sm p-3 rounded-xl border border-slate-100 flex flex-col">
                    <div className="flex items-center space-x-2 mb-1">
                        <item.icon className={`w-3 h-3 ${item.color}`} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                    </div>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-sm font-black text-slate-800">{item.value}</span>
                        <span className="text-[10px] font-bold text-slate-400">({item.percent}%)</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const CRMPipelineSummaries: React.FC<Props> = ({ data }) => {
    const leads = data?.leads || { total: 1240, qualified: 850, unqualified: 390, qPercent: 68, uPercent: 32 };
    const deals = data?.deals || { total: 345, won: 142, lost: 203, wPercent: 41, lPercent: 59 };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <PipelineCard
                title="Total Leads"
                total={leads.total}
                icon={Users}
                colorClass={{ bg: 'bg-blue-50/80', text: 'text-blue-600', border: 'border-blue-100/50' }}
                subItems={[
                    { label: "Qualified", value: leads.qualified, percent: leads.qPercent, icon: Filter, color: 'text-emerald-500' },
                    { label: "Unqualified", value: leads.unqualified, percent: leads.uPercent, icon: XCircle, color: 'text-slate-400' }
                ]}
            />
            <PipelineCard
                title="Total Deals"
                total={deals.total}
                icon={Briefcase}
                colorClass={{ bg: 'bg-indigo-50/80', text: 'text-indigo-600', border: 'border-indigo-100/50' }}
                subItems={[
                    { label: "Won", value: deals.won, percent: deals.wPercent, icon: CheckCircle2, color: 'text-emerald-500' },
                    { label: "Lost", value: deals.lost, percent: deals.lPercent, icon: XCircle, color: 'text-rose-500' }
                ]}
            />
        </div>
    );
};

export default CRMPipelineSummaries;
