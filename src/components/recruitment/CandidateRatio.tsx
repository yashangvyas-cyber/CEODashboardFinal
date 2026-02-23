import React from 'react';
import { Info } from 'lucide-react';

interface Props {
    data?: {
        totalCandidates: number;
        totalHires: number;
        hireRatio: number;
    };
}

const CandidateRatio: React.FC<Props> = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-5 shadow-sm h-full flex flex-col hover:shadow transition-shadow">
            <div className="flex justify-between items-center mb-6 shrink-0">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight">Candidates Vs. Hire Ratio</h3>
                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-slate-100 bg-slate-50/50 rounded-xl text-center">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Candidates</div>
                        <div className="text-2xl font-black text-slate-700">{data.totalCandidates}</div>
                    </div>
                    <div className="p-4 border border-slate-100 bg-slate-50/50 rounded-xl text-center">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Hires</div>
                        <div className="text-2xl font-black text-slate-700">{data.totalHires}</div>
                    </div>
                </div>

                <div className="mt-2 p-5 bg-indigo-600 rounded-xl shadow-sm text-white relative overflow-hidden group">
                    <div className="relative z-10 flex justify-between items-end">
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Hire Ratio</div>
                            <div className="text-4xl font-black tracking-tighter">{data.hireRatio}%</div>
                        </div>
                        <div className="text-right">
                            <div className="w-12 h-1 bg-white/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white transition-all duration-1000"
                                    style={{ width: `${data.hireRatio}%` }}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Decorative background circle */}
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-500" />
                </div>
            </div>
        </div>
    );
};

export default CandidateRatio;
