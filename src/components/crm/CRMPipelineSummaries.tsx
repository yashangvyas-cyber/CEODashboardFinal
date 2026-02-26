import React from 'react';
import { Users, Briefcase, Filter, XCircle, CheckCircle2, Clock } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';
import type { DateRangeOption } from '../../types';

interface Props {
    dateRange?: DateRangeOption;
    data?: {
        leads: { total: number; qualified: number; unqualified: number; qPercent: number; uPercent: number; avgConversionTime: number };
        deals: { total: number; won: number; lost: number; wPercent: number; lPercent: number; avgConversionTime: number };
    };
}

const PipelineCard = ({ title, total, subItems, icon: Icon, colorClass, tooltip }: any) => (
    <div className="bg-white border border-slate-200 p-2 flex flex-col group transition-all hover:shadow-md relative overflow-hidden rounded-lg h-full justify-between">
        <div className={`absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity transform group-hover:rotate-12 duration-500 ${colorClass.text}`}>
            <Icon className="w-16 h-16" />
        </div>

        <div className="flex items-start justify-between mb-1 z-10 relative">
            <div className="flex flex-col">
                <div className="flex items-center mb-1">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-wider leading-none">{title}</span>
                    <div className="ml-1">
                        <InfoTooltip content={tooltip} />
                    </div>
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{total.toLocaleString()}</div>
            </div>
            <div className={`p-1.5 rounded-lg border ${colorClass.bg} ${colorClass.border}`}>
                <Icon className={`w-4 h-4 ${colorClass.text}`} />
            </div>
        </div>

        <div className="flex items-center justify-start gap-2 mt-auto relative z-10">
            {subItems.map((item: any, idx: number) => (
                <div key={idx} className="bg-slate-50/50 p-1.5 px-2 rounded-lg border border-slate-100 flex flex-col min-w-[70px] flex-1">
                    <div className="flex items-center space-x-1 mb-1">
                        <item.icon className={`w-3 h-3 ${item.color}`} />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                    </div>
                    <div className="flex items-baseline space-x-1">
                        <span className="text-sm font-black text-slate-800 tracking-tight">{item.value}</span>
                        <span className="text-[9px] font-bold text-slate-400">({item.percent}%)</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const CRMPipelineSummaries: React.FC<Props> = ({ data }) => {
    const leads = data?.leads || { total: 1240, qualified: 850, unqualified: 390, qPercent: 68, uPercent: 32, avgConversionTime: 12 };
    const deals = data?.deals || { total: 345, won: 142, lost: 203, wPercent: 41, lPercent: 59, avgConversionTime: 18 };

    return (
        <div className="flex flex-col gap-2 w-full h-full min-h-0">
            <div className="flex-1 min-h-0">
                <PipelineCard
                    title="Total Leads"
                    total={leads.total}
                    icon={Users}
                    colorClass={{ bg: 'bg-blue-50/80', text: 'text-blue-600', border: 'border-blue-100/50' }}
                    subItems={[
                        { label: "Qualified", value: leads.qualified, percent: leads.qPercent, icon: Filter, color: 'text-emerald-500' },
                        { label: "Unqualified", value: leads.unqualified, percent: leads.uPercent, icon: XCircle, color: 'text-slate-400' },
                        { label: "Avg Conversion", value: `${leads.avgConversionTime} Days`, percent: null, icon: Clock, color: 'text-amber-500' }
                    ]}
                    tooltip="Total potential customers who have shown interest but haven't been qualified as a deal yet."
                />
            </div>
            <div className="flex-1 min-h-0">
                <PipelineCard
                    title="Total Deals"
                    total={deals.total}
                    icon={Briefcase}
                    colorClass={{ bg: 'bg-indigo-50/80', text: 'text-indigo-600', border: 'border-indigo-100/50' }}
                    subItems={[
                        { label: "Won", value: deals.won, percent: deals.wPercent, icon: CheckCircle2, color: 'text-emerald-500' },
                        { label: "Lost", value: deals.lost, percent: deals.lPercent, icon: XCircle, color: 'text-rose-500' },
                        { label: "Avg Conversion", value: `${deals.avgConversionTime} Days`, percent: null, icon: Clock, color: 'text-amber-500' }
                    ]}
                    tooltip="Number of qualified opportunities currently being pursued or settled in the sales pipeline."
                />
            </div>
        </div>
    );
};

export default CRMPipelineSummaries;
