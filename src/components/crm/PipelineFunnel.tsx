import React from 'react';
import { ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip, Cell } from 'recharts';
import { Info, Maximize2, MoreHorizontal, AlertCircle } from 'lucide-react';
import type { DateRangeOption } from '../../types';

interface Props {
    dateRange: DateRangeOption;
    data?: any[];
}

const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#10B981'];

const PipelineFunnel: React.FC<Props> = ({ data }) => {
    if (!data) return null;

    // Calculate drop-off for bottleneck detection
    const proposalValue = data.find(d => d.name === 'Proposal')?.value || 0;
    const wonValue = data.find(d => d.name === 'Won')?.value || 0;
    const dropOff = proposalValue > 0 ? ((proposalValue - wonValue) / proposalValue) * 100 : 0;
    const hasBottleneck = dropOff > 60;

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-5 shadow-sm h-full flex flex-col hover:shadow transition-shadow">
            <div className="flex justify-between items-start mb-4 shrink-0">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight">Pipeline Funnel</h3>
                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                    <button className="hover:text-slate-600 transition-colors">
                        <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="hover:text-slate-600 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                    <FunnelChart>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#FFFFFF',
                                borderColor: '#E2E8F0',
                                borderRadius: '8px',
                                fontSize: '11px',
                                fontWeight: '600',
                                color: '#1E293B',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            formatter={(value: any) => [`${value} Deals`]}
                        />
                        <Funnel
                            data={data}
                            dataKey="value"
                            isAnimationActive
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            <LabelList
                                position="right"
                                fill="#64748B"
                                stroke="none"
                                dataKey="name"
                                fontSize={10}
                                fontWeight="bold"
                            />
                            <LabelList
                                position="center"
                                fill="#fff"
                                stroke="none"
                                dataKey="value"
                                fontSize={12}
                                fontWeight="900"
                            />
                        </Funnel>
                    </FunnelChart>
                </ResponsiveContainer>

                {hasBottleneck && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 shadow-sm animate-pulse">
                        <AlertCircle size={14} className="text-rose-500" />
                        <span className="text-[10px] text-rose-700 font-extrabold uppercase tracking-wider">
                            Bottleneck Detected
                        </span>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <span>Total Active Value: ₹4.8Cr</span>
                <span className="text-emerald-500">Avg Conv: 24%</span>
            </div>
        </div>
    );
};

export default PipelineFunnel;
