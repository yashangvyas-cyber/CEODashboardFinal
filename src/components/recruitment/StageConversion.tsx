import React from 'react';
import { ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip, Cell } from 'recharts';
import { Info } from 'lucide-react';

interface Props {
    data?: {
        name: string;
        value: number;
        color: string;
    }[];
}

const StageConversion: React.FC<Props> = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-5 shadow-sm h-full flex flex-col hover:shadow transition-shadow">
            <div className="flex justify-between items-center mb-6 shrink-0">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight">Stage Conversion Rate</h3>
                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                </div>
            </div>

            <div className="flex-1 min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%">
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
                            formatter={(value: any) => [`${value} Candidates`]}
                        />
                        <Funnel
                            data={data}
                            dataKey="value"
                            isAnimationActive
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
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
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap justify-center gap-x-4 gap-y-2">
                {data.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StageConversion;
