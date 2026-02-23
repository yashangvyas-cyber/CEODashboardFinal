import React, { useState } from 'react';
import type { DateRangeOption } from '../../types';
import { AlertCircle, Users } from 'lucide-react';

interface Props {
    dateRange: DateRangeOption;
    data?: {
        missingLogs: any[];
        onBench: any[];
    };
}

const MissingAllocations: React.FC<Props> = ({ data = { missingLogs: [], onBench: [] } }) => {
    const [view, setView] = useState<'missing' | 'bench'>('missing');

    const sortedMissing = [...data.missingLogs].sort((a, b) => b.missingCount - a.missingCount);
    const sortedBench = [...data.onBench].sort((a, b) => b.benchCount - a.benchCount);

    const totalMissing = sortedMissing.reduce((sum, dept) => sum + dept.missingCount, 0);
    const totalBench = sortedBench.reduce((sum, dept) => sum + dept.benchCount, 0);

    const isMissingView = view === 'missing';

    return (
        <div className={`bg-white rounded-2xl border p-6 shadow-sm h-full flex flex-col group hover:shadow-md transition-all duration-300 ${isMissingView ? 'border-rose-100 hover:border-rose-200' : 'border-amber-100 hover:border-amber-200'}`}>
            <div className="flex justify-between items-start mb-4 shrink-0">
                <div>
                    <h3 className={`text-sm font-semibold uppercase tracking-wider flex items-center ${isMissingView ? 'text-rose-600' : 'text-amber-600'}`}>
                        {isMissingView ? <AlertCircle className="w-4 h-4 mr-2" /> : <Users className="w-4 h-4 mr-2" />}
                        {isMissingView ? 'Missing Logs' : 'On Bench'}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-[150px] leading-tight">
                        {isMissingView ? 'Staffed on projects but no daily log' : 'Present but completely unassigned'}
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`text-lg font-black leading-none ${isMissingView ? 'text-rose-600' : 'text-amber-600'}`}>
                        {isMissingView ? totalMissing : totalBench}
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${isMissingView ? 'text-rose-400' : 'text-amber-400'}`}>
                        Total
                    </span>
                </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex bg-slate-100 p-1 rounded-lg mb-3 shrink-0">
                <button
                    onClick={() => setView('missing')}
                    className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all ${isMissingView ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Missing ({totalMissing})
                </button>
                <button
                    onClick={() => setView('bench')}
                    className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all ${!isMissingView ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Bench ({totalBench})
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-start min-h-0 space-y-2 pb-1 overflow-y-auto custom-scrollbar">
                {isMissingView ? (
                    sortedMissing.length > 0 ? (
                        sortedMissing.map((dept, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-rose-50/50 border border-rose-100 hover:bg-rose-50 transition-colors">
                                <span className="text-sm font-bold text-slate-800">{dept.department}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-extrabold text-rose-500">{dept.missingCount}</span>
                                    <span className="text-[10px] text-slate-400 font-medium w-12 text-right">missing</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100 min-h-[60px]">
                            100% Logs Complete
                        </div>
                    )
                ) : (
                    sortedBench.length > 0 ? (
                        sortedBench.map((dept, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-amber-50/50 border border-amber-100 hover:bg-amber-50 transition-colors">
                                <span className="text-sm font-bold text-slate-800">{dept.department}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-extrabold text-amber-500">{dept.benchCount}</span>
                                    <span className="text-[10px] text-slate-400 font-medium w-12 text-right">benched</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100 min-h-[60px]">
                            No Bench (100% Staffed)
                        </div>
                    )
                )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 text-[9px] text-slate-400 bg-slate-50 p-2 rounded italic leading-tight">
                <strong>{isMissingView ? 'Compliance:' : 'Utilization:'}</strong> {isMissingView ? 'Call Managers to enforce daily updates.' : 'Call Sales/Resource Mgr to assign projects.'}
            </div>
        </div>
    );
};

export default MissingAllocations;
