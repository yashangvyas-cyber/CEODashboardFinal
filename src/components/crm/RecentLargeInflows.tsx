import React from 'react';
import type { DateRangeOption } from '../../types';
import InfoTooltip from '../common/InfoTooltip';

interface RecentCollection {
    clientName: string;
    amount: string;
    date: string;
    invoiceNo: string;
}

interface Props {
    dateRange?: DateRangeOption;
    data?: RecentCollection[];
}

const defaultData: RecentCollection[] = [
    { clientName: "Concept Infoway", amount: "₹6,000.00", date: "26/Feb/2026", invoiceNo: "INV-00000222" },
    { clientName: "TestScenario", amount: "₹3,000.00", date: "26/Feb/2026", invoiceNo: "INV-00000220" },
    { clientName: "BizzAppdev", amount: "₹2,500.00", date: "26/Feb/2026", invoiceNo: "INV-00000218" },
    { clientName: "TechMahindra", amount: "₹2,000.00", date: "26/Feb/2026", invoiceNo: "INV-00000216" },
    { clientName: "Treesha Infotech", amount: "₹1,500.00", date: "26/Feb/2026", invoiceNo: "INV-00000214" },
];

const RecentLargeInflows: React.FC<Props> = ({ data }) => {
    const collections = data || defaultData;

    return (
        <div className="premium-card p-6 flex flex-col h-full hover-scale">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100/80 shrink-0">
                <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Key Recent Collections</h3>
                <InfoTooltip content="Top 5 largest payment inflows received during the selected period." />
            </div>

            <div className="flex-1 overflow-y-auto pr-1 -mr-1 custom-scrollbar">
                <div className="space-y-3">
                    {collections.length === 0 ? (
                        <div className="text-sm font-medium text-slate-400 text-center py-6">No recent collections found.</div>
                    ) : (
                        collections.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-slate-100/50 transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-700">{item.clientName}</span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] font-bold text-slate-400 font-mono">{item.invoiceNo}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                        <span className="text-[10px] font-medium text-slate-400">{item.date}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100/50">
                                        +{item.amount}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecentLargeInflows;
