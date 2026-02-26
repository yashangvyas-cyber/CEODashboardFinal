import React, { useState, useMemo } from 'react';
import type { DateRangeOption } from '../../types';
import { Maximize2, Search, ChevronDown, ChevronUp } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';

interface SkillLevelData {
    skill: string;
    domain: string;
    levels: {
        beginner: number;
        intermediate: number;
        experienced: number;
    };
}

interface Props {
    dateRange?: DateRangeOption;
    data?: SkillLevelData[];
}

const SkillsGap: React.FC<Props> = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAll, setShowAll] = useState(false);

    if (!data) return null;

    // Filter logic for search
    const filteredData = useMemo(() => {
        return data.filter(item =>
            item.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.domain.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    // Priority logic: Sort by lowest Experienced count (most critical gap)
    const sortedData = useMemo(() => {
        return [...filteredData].sort((a, b) => {
            const aTotal = a.levels.beginner + a.levels.intermediate + a.levels.experienced;
            const bTotal = b.levels.beginner + b.levels.intermediate + b.levels.experienced;
            const aExpPct = (a.levels.experienced / aTotal);
            const bExpPct = (b.levels.experienced / bTotal);
            return aExpPct - bExpPct;
        });
    }, [filteredData]);

    const displayData = showAll ? sortedData : sortedData.slice(0, 5);

    const renderLevelBar = (levels: SkillLevelData['levels']) => {
        const total = levels.beginner + levels.intermediate + levels.experienced;
        const bPct = (levels.beginner / total) * 100;
        const iPct = (levels.intermediate / total) * 100;
        const ePct = (levels.experienced / total) * 100;

        return (
            <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-slate-100/50 shadow-inner">
                <div style={{ width: `${bPct}%` }} className="bg-red-500 transition-all duration-500 ease-out" />
                <div style={{ width: `${iPct}%` }} className="bg-amber-400 transition-all duration-500 ease-out" />
                <div style={{ width: `${ePct}%` }} className="bg-emerald-500 transition-all duration-500 ease-out" />
            </div>
        );
    };

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-6 shadow-sm flex flex-col h-full group hover:shadow-md hover:border-rose-100 transition-all duration-300 relative overflow-hidden">
            {/* Header Content */}
            <div className="shrink-0">
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100/80 w-full shrink-0">
                    <div className="flex items-center">
                        <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Skill Proficiency Distribution</h3>
                        <InfoTooltip content="Analysis of skill proficiency across the organization, highlighting areas where demand for expertise exceeds availability." />
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Compact Search Bar */}
                        <div className="relative group">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Filter skills..."
                                className="pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-100 focus:border-slate-200 rounded-lg text-[11px] focus:outline-none focus:ring-2 focus:ring-slate-100 w-36 transition-all placeholder:text-slate-400 font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-50 rounded-md">
                            <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Simplified Table Header */}
                <div className="grid grid-cols-12 gap-5 px-3 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    <div className="col-span-4">Skill Profile</div>
                    <div className="col-span-8 text-center">Proficiency Mix</div>
                </div>
            </div>

            {/* Scrollable List Body */}
            <div className="flex-1 overflow-y-auto pr-1 overflow-x-hidden transition-all duration-500">
                <div className="space-y-2 py-1">
                    {displayData.map((item, idx) => {
                        const total = item.levels.beginner + item.levels.intermediate + item.levels.experienced;
                        const bPct = Math.round((item.levels.beginner / total) * 100);
                        const iPct = Math.round((item.levels.intermediate / total) * 100);
                        const ePct = Math.round((item.levels.experienced / total) * 100);

                        return (
                            <div key={idx} className="grid grid-cols-12 gap-5 items-center group px-3 py-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200 cursor-default">
                                <div className="col-span-4 flex flex-col min-w-0 pr-2">
                                    <span className="text-[12px] font-bold text-slate-700 truncate group-hover:text-slate-900 transition-colors">{item.skill}</span>
                                </div>
                                <div className="col-span-8 flex flex-col gap-1.5">
                                    {renderLevelBar(item.levels)}
                                    <div className="flex justify-between text-[9px] font-black tracking-tight opacity-40 group-hover:opacity-100 transition-opacity">
                                        <span className="text-red-500 font-bold">{bPct}%</span>
                                        <span className="text-amber-500 font-bold">{iPct}%</span>
                                        <span className="text-emerald-500 font-bold">{ePct}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {filteredData.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                <Search className="w-5 h-5 text-slate-200" />
                            </div>
                            <p className="text-[11px] text-slate-400 italic font-bold uppercase tracking-widest">
                                No skills matching "{searchTerm}"
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer / Controls */}
            <div className="shrink-0 pt-4 mt-3 border-t border-slate-100">
                <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-[10px] text-slate-500 font-black uppercase tracking-widest bg-slate-50/50 px-3 py-1.5 rounded-lg border border-slate-50">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-red-500 rounded-sm"></div>
                            <span className="text-slate-400">Beg.</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-amber-400 rounded-sm"></div>
                            <span className="text-slate-400">Int.</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-emerald-500 rounded-sm"></div>
                            <span className="text-slate-400">Exp.</span>
                        </div>
                    </div>

                    {filteredData.length > 5 && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-slate-900 transition-all uppercase tracking-[0.12em] bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
                        >
                            {showAll ? 'Collapse' : `View All Skills (${filteredData.length})`}
                            {showAll ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SkillsGap;
