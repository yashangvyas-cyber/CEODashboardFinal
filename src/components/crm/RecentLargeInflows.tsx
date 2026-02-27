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
        <div className="premium-card p-4 flex flex-col h-full hover-scale relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/20 rounded-bl-full -z-10 blur-xl"></div>

            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100/80 shrink-0 relative z-10">
                <h3 className="text-[9px] font-black text-slate-400 tracking-widest uppercase">Key Collections</h3>
                <InfoTooltip content="Top largest payment inflows received during the selected period." />
            </div>

            <div className="flex-1 overflow-y-auto pr-1 -mr-1 custom-scrollbar relative z-10">
                <div className="space-y-1.5">
                    {collections.length === 0 ? (
                        <div className="text-[10px] font-medium text-slate-400 text-center py-4">No collections found.</div>
                    ) : (
                        collections.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:shadow-sm transition-all">
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-[10px] font-black text-slate-700 truncate">{item.clientName}</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[8px] font-bold text-slate-400 font-mono">{item.invoiceNo}</span>
                                        <span className="w-0.5 h-0.5 rounded-full bg-slate-300"></span>
                                        <span className="text-[8px] font-medium text-slate-400">{item.date}</span>
                                    </div>
                                </div>
                                <div className="flex items-center ml-2 shrink-0">
                                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50/80 px-1.5 py-0.5 rounded border border-emerald-100/30 leading-none">
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
