import type { DateRangeOption } from '../../types';

interface Props {
    dateRange?: DateRangeOption;
    data?: {
        total: string;
        items: {
            range: string;
            amount: string;
            value: number;
            color: string;
        }[];
    };
}

const ReceivablesAging: React.FC<Props> = ({ data }) => {
    const total = data?.total || "₹19.5L";
    const items = data?.items || [
        { range: '1-15 Days', amount: '₹12.0L', value: 100, color: 'bg-slate-300' },
        { range: '16-30 Days', amount: '₹4.5L', value: 37.5, color: 'bg-slate-400' },
        { range: '31-45 Days', amount: '₹2.0L', value: 16.6, color: 'bg-slate-600' },
        { range: '45+ Days', amount: '₹1.0L', value: 8.3, color: 'bg-rose-500 shadow-sm shadow-rose-500/30' },
    ];

    return (
        <div className="premium-card p-6 h-full flex flex-col group hover-scale h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Receivables Aging</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded border border-slate-100">
                    Total: {total}
                </span>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-5">
                {items.map((item, idx) => (
                    <div key={idx} className="group/bar">
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="font-bold text-slate-600 group-hover/bar:text-indigo-600 transition-colors uppercase tracking-wider text-[10px]">{item.range}</span>
                            <span className="font-black text-slate-900 tracking-tight">{item.amount}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                            <div
                                className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                                style={{ width: `${item.value}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ReceivablesAging;
