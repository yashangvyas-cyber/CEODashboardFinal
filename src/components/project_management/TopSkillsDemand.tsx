import React from 'react';
import { Zap } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';

interface SkillEntry {
    skill: string;
    count: number;
}

interface Props {
    data?: SkillEntry[];
}

const SKILL_COLORS = [
    { bar: 'bg-indigo-500', text: 'text-indigo-600', badge: 'bg-indigo-50 border-indigo-100' },
    { bar: 'bg-violet-500', text: 'text-violet-600', badge: 'bg-violet-50 border-violet-100' },
    { bar: 'bg-sky-500', text: 'text-sky-600', badge: 'bg-sky-50 border-sky-100' },
    { bar: 'bg-emerald-500', text: 'text-emerald-600', badge: 'bg-emerald-50 border-emerald-100' },
    { bar: 'bg-amber-500', text: 'text-amber-600', badge: 'bg-amber-50 border-amber-100' },
    { bar: 'bg-rose-500', text: 'text-rose-600', badge: 'bg-rose-50 border-rose-100' },
    { bar: 'bg-teal-500', text: 'text-teal-600', badge: 'bg-teal-50 border-teal-100' },
    { bar: 'bg-fuchsia-500', text: 'text-fuchsia-600', badge: 'bg-fuchsia-50 border-fuchsia-100' },
    { bar: 'bg-orange-500', text: 'text-orange-600', badge: 'bg-orange-50 border-orange-100' },
    { bar: 'bg-slate-400', text: 'text-slate-500', badge: 'bg-slate-50 border-slate-200' },
];

const TopSkillsDemand: React.FC<Props> = ({ data = [] }) => {
    if (!data || data.length === 0) return null;

    const totalContracts = data.reduce((sum, d) => sum + d.count, 0);
    const maxCount = Math.max(...data.map(d => d.count));
    const sorted = [...data].sort((a, b) => b.count - a.count);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-5 shrink-0">
                <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase flex items-center gap-2">
                        <Zap className="w-4 h-4 text-indigo-500" />
                        Top Skills Demand
                        <InfoTooltip content="Ranked by how many active Hirebase contracts list this skill in their 'Hired For' field. Comma-separated multi-skill entries are each counted individually. Source: Hirebase Report → Hired For column." />
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1">Most requested skills from Hirebase contracts</p>
                </div>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100 shrink-0">
                    {totalContracts} Contracts
                </span>
            </div>

            {/* Skill Bars */}
            <div className="flex-1 flex flex-col justify-center gap-3 min-h-0 overflow-y-auto custom-scrollbar pr-0.5">
                {sorted.map((entry, idx) => {
                    const pct = Math.round((entry.count / totalContracts) * 100);
                    const barWidth = Math.round((entry.count / maxCount) * 100);
                    const color = SKILL_COLORS[idx % SKILL_COLORS.length];

                    return (
                        <div key={entry.skill} className="group">
                            {/* Label row */}
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className={`text-[9px] font-black w-4 text-center shrink-0 ${color.text}`}>
                                        #{idx + 1}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-700 truncate">{entry.skill}</span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border ${color.badge} ${color.text}`}>
                                        {entry.count} contracts
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-400 w-7 text-right">{pct}%</span>
                                </div>
                            </div>
                            {/* Bar */}
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ease-out ${color.bar}`}
                                    style={{ width: `${barWidth}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 bg-slate-50/50 p-2 rounded-lg italic leading-tight shrink-0">
                <strong>Logic:</strong> Each skill tag in the <em>Hired For</em> column is split and counted individually. Multi-skill entries (e.g. "React JS, Node JS") contribute to each skill's tally.
            </div>
        </div>
    );
};

export default TopSkillsDemand;
