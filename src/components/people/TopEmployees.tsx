import React from 'react';
import type { DateRangeOption } from '../../types';
import { Maximize2, MoreHorizontal, Trophy } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    dateRange?: DateRangeOption;
    data?: any;
}

const TopEmployees: React.FC<Props> = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-5 shadow-sm h-full flex flex-col hover:shadow transition-shadow">
            <div className="flex justify-between items-center mb-4 shrink-0 border-b border-slate-100 pb-4">
                <div className="flex items-center">
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight">Top Recognized</h3>
                    <div className="ml-1.5 flex items-center">
                        <InfoTooltip content="Recognition of top-performing employees based on contribution, peer recognition, and key performance indicators." />
                    </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                    <button className="hover:text-slate-600 transition-colors"><Maximize2 className="w-3.5 h-3.5" /></button>
                    <button className="hover:text-slate-600 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="flex-1 flex flex-col space-y-2 overflow-y-auto pr-2">
                {data.map((e: any, idx: number) => (
                    <div key={e.id || idx} className="flex items-center space-x-3 p-2 bg-white rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                        <div className={`font-mono text-xs w-4 font-bold ${idx < 3 ? 'text-amber-500' : 'text-slate-400'}`}>#{idx + 1}</div>
                        <img src={e.avatarUrl} alt={e.name} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-slate-800 truncate">{e.name}</div>
                            <div className="text-[10px] text-slate-500 truncate">{e.role}</div>
                        </div>
                        <div className="flex items-center space-x-1 px-1.5 py-0.5 bg-amber-50 rounded-full border border-amber-100 shrink-0">
                            <Trophy size={10} className="text-amber-500" />
                            <span className="text-[10px] font-bold text-amber-700">{e.badges}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopEmployees;
