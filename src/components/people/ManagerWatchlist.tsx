import React from 'react';
import type { DateRangeOption } from '../../types';
import { UserMinus } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    dateRange?: DateRangeOption;
    data?: any[];
}

const ManagerWatchlist: React.FC<Props> = ({ data = [] }) => {
    const topManagers = [...data]
        .sort((a, b) => b.exits - a.exits)
        .slice(0, 5);

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-6 shadow-sm flex flex-col h-full group hover:shadow-md hover:border-rose-100 transition-all duration-300 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6 shrink-0 z-10">
                <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase"><UserMinus className="w-4 h-4 mr-2 text-rose-500 group-hover:scale-110 transition-transform" />
                        Exit by Reporting Manager
                        <InfoTooltip content="Overview of employee exits grouped by their reporting manager." /></h3>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-medium">Exits by Manager (Top 5)</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar my-2 z-10">
                {topManagers.map((manager, idx) => (
                    <div key={manager.id || idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-sm cursor-pointer transition-all duration-200 group/item">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-xs font-black text-slate-700 group-hover/item:border-indigo-200 transition-colors">
                                {manager.avatar}
                            </div>
                            <div className="flex flex-col">
                                <div className="text-sm font-black text-slate-800 leading-tight">{manager.name}</div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-medium mt-0.5">{manager.dept}</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex flex-col items-end">
                                <span className="text-lg font-black text-slate-800 leading-none">{manager.exits}</span>
                                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1">Exits</span>
                            </div>
                            <div className={`w-2 h-10 rounded-full shadow-inner ${manager.severity === 'danger' ? 'bg-gradient-to-b from-rose-400 to-rose-500' : 'bg-gradient-to-b from-amber-400 to-amber-500'}`}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagerWatchlist;
