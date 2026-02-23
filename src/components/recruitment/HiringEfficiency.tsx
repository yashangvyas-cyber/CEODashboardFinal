import React from 'react';
import { Briefcase, Calendar, Info } from 'lucide-react';

interface Props {
    data?: {
        interviewToHire: string;
        timeToHire: number;
    };
}

const HiringEfficiency: React.FC<Props> = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-5 shadow-sm h-full flex flex-col hover:shadow transition-shadow">
            <div className="flex justify-between items-center mb-6 shrink-0">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight">Hiring Efficiency</h3>
                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-6">
                <div className="flex items-center gap-6 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                        <Briefcase className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900 leading-none">{data.interviewToHire}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Interview-to-Hire Ratio</div>
                    </div>
                </div>

                <div className="flex items-center gap-6 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                        <Calendar className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900 leading-none">{data.timeToHire}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Time-to-Hire (Days)</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HiringEfficiency;
