import React from 'react';

interface Props {
    data?: any;
}

const AttritionMetrics: React.FC<Props> = ({ data }) => {
    if (!data) return null;

    const { kpis } = data;

    return (
        <div className="flex flex-col gap-3 h-full">
            <div className="border border-slate-200 rounded-[10px] p-4 flex flex-col justify-center bg-white shadow-sm hover:shadow transition-shadow flex-1">
                <h4 className="text-xs font-bold text-slate-800 mb-3 tracking-tight">Total Exits</h4>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{kpis.totalExits.percent}</span>
                    <span className="text-[11px] font-medium text-slate-400">{kpis.totalExits.count}</span>
                </div>

                {kpis.totalExits.breakdown && kpis.totalExits.breakdown.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100/50 flex flex-col gap-2">
                        {kpis.totalExits.breakdown.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-[11px]">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                    <span className="text-slate-500 font-medium">{item.type}</span>
                                </div>
                                <span className="text-slate-700 font-bold">{item.percent}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="border border-slate-200 rounded-[10px] p-4 flex flex-col justify-center bg-white shadow-sm hover:shadow transition-shadow flex-1">
                <h4 className="text-xs font-bold text-slate-800 mb-3 tracking-tight">Average Monthly Exits</h4>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{kpis.avgMonthly.percent}</span>
                    <span className="text-[11px] font-medium text-slate-400">{kpis.avgMonthly.count}</span>
                </div>
            </div>
        </div>
    );
};

export default AttritionMetrics;
