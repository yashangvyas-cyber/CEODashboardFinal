import React from 'react';
import type { DateRangeOption } from '../../types';
import InfoTooltip from '../common/InfoTooltip';

interface CustomerData {
    name: string;
    invoiced: string;
    percent: number;
    status: 'GOOD' | 'PARTIAL' | 'COMPLETED' | 'LATE';
}

interface Props {
    dateRange?: DateRangeOption;
    data?: CustomerData[];
}

const TopRevenueContributors: React.FC<Props> = ({ data }) => {
    const customers: CustomerData[] = data || [
        { name: "Acme Corp Global", invoiced: "₹12.5L", percent: 88, status: 'GOOD' },
        { name: "TechStart Systems", invoiced: "₹8.5L", percent: 50, status: 'PARTIAL' },
        { name: "Global Dynamics", invoiced: "₹6.2L", percent: 100, status: 'COMPLETED' },
        { name: "Sirius Cybernetics", invoiced: "₹4.5L", percent: 22, status: 'LATE' },
        { name: "Massive Dynamic", invoiced: "₹3.8L", percent: 89, status: 'GOOD' },
    ];

    const getStatusStyles = (status: CustomerData['status']) => {
        switch (status) {
            case 'GOOD': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'PARTIAL': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'COMPLETED': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'LATE': return 'text-rose-600 bg-rose-50 border-rose-100';
            default: return 'text-slate-600 bg-slate-50 border-slate-100';
        }
    };

    const getBarColor = (status: CustomerData['status']) => {
        switch (status) {
            case 'GOOD': return 'bg-emerald-500';
            case 'PARTIAL': return 'bg-amber-500';
            case 'COMPLETED': return 'bg-blue-500';
            case 'LATE': return 'bg-rose-500 shadow-rose-500/20';
            default: return 'bg-slate-400';
        }
    };

    return (
        <div className="bg-white border border-slate-200 p-4 h-full flex flex-col group transition-all hover:shadow-md relative overflow-hidden rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center mb-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Top Revenue Contributors</h3>
                    <InfoTooltip content="A list of the highest revenue-generating customers, showing their invoiced amounts and collection progression status." />
                </div>
                <button className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter hover:text-indigo-700 transition-colors">View All</button>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-[10px]">
                    <thead className="text-slate-400 uppercase tracking-tighter font-black border-b border-slate-100">
                        <tr>
                            <th className="text-left py-2 px-1">Customer</th>
                            <th className="text-center py-2 px-1">Invoiced</th>
                            <th className="text-left py-2 px-1 w-1/3">Progress</th>
                            <th className="text-right py-2 px-1">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {customers.map((customer, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors group/row">
                                <td className="py-2.5 px-1 font-black text-slate-700">{customer.name}</td>
                                <td className="py-2.5 px-1 text-center text-slate-500 font-bold">{customer.invoiced}</td>
                                <td className="py-2.5 px-1">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ease-out ${getBarColor(customer.status)}`}
                                                style={{ width: `${customer.percent}%` }}
                                            />
                                        </div>
                                        <span className="text-[9px] font-black text-slate-400 group-hover/row:text-slate-600 transition-colors w-6 text-right">{customer.percent}%</span>
                                    </div>
                                </td>
                                <td className="py-2.5 px-1 text-right">
                                    <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded shadow-sm ${getStatusStyles(customer.status)}`}>
                                        {customer.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopRevenueContributors;
