import React, { useState } from 'react';
import InfoTooltip from '../common/InfoTooltip';
import type { RecruiterFunnel } from '../../hooks/useRecruitmentMetrics';

interface Props {
    data?: RecruiterFunnel[];
    dateRange?: string;
}

const FUNNEL_COLORS = ['#CBD5E1', '#6366F1', '#10B981', '#F59E0B', '#6366F1'];
const FUNNEL_STAGE_NAMES = ['Candidates', 'Interviews', 'Offered', 'Offer Accepted', 'Joined'];

// Reusable mini funnel (5 stages) matching the existing StageConversion SVG style
const MiniFunnel: React.FC<{ stages: RecruiterFunnel['stages'] }> = ({ stages }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const SVG_WIDTH = 300;
    const SVG_HEIGHT = 260;
    const FUNNEL_TOP_WIDTH = 240;
    const FUNNEL_BOTTOM_WIDTH = 70;
    const GAP = 4;
    const SEGMENT_COUNT = stages.length;
    const SEG_HEIGHT = (SVG_HEIGHT - (SEGMENT_COUNT - 1) * GAP) / SEGMENT_COUNT;
    const taperHeight = (SEG_HEIGHT + GAP) * (SEGMENT_COUNT - 1) - GAP;

    return (
        <div className="relative w-full flex-1 flex items-center justify-center min-h-0">
            <svg
                viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full overflow-visible select-none"
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setMousePos({
                        x: (e.clientX - rect.left) * (SVG_WIDTH / rect.width),
                        y: (e.clientY - rect.top) * (SVG_HEIGHT / rect.height),
                    });
                }}
            >
                {/* Right-side stage % labels */}
                {stages.map((seg, i) => {
                    const yStart = i * (SEG_HEIGHT + GAP);
                    const yEnd = yStart + SEG_HEIGHT;
                    const pct = stages[0].value > 0
                        ? Math.round((seg.value / stages[0].value) * 100)
                        : 0;

                    let w1 = FUNNEL_TOP_WIDTH - (yStart / taperHeight) * (FUNNEL_TOP_WIDTH - FUNNEL_BOTTOM_WIDTH);
                    const isLast = i === SEGMENT_COUNT - 1;
                    if (isLast) w1 = FUNNEL_BOTTOM_WIDTH;
                    const x1 = (SVG_WIDTH - w1) / 2;

                    return (
                        <g key={i}>
                            {/* Dashed bracket */}
                            <path
                                d={`M ${x1 + w1 + 4},${yStart} L ${x1 + w1 + 16},${yStart} L ${x1 + w1 + 16},${yEnd} L ${x1 + w1 + 4},${yEnd}`}
                                fill="none"
                                stroke="#CBD5E1"
                                strokeWidth="1"
                                strokeDasharray="3,2"
                            />
                            <text
                                x={x1 + w1 + 22}
                                y={(yStart + yEnd) / 2}
                                textAnchor="start"
                                dominantBaseline="middle"
                                className="fill-slate-400 font-black"
                                style={{ fontSize: '8px' }}
                            >
                                {pct}%
                            </text>

                            {/* Funnel segment */}
                            {(() => {
                                let w2 = FUNNEL_TOP_WIDTH - (yEnd / taperHeight) * (FUNNEL_TOP_WIDTH - FUNNEL_BOTTOM_WIDTH);
                                if (isLast) w2 = FUNNEL_BOTTOM_WIDTH;
                                const xA = (SVG_WIDTH - w1) / 2;
                                const xB = (SVG_WIDTH - w2) / 2;
                                const points = `${xA},${yStart} ${xB},${yEnd} ${xB + w2},${yEnd} ${xA + w1},${yStart}`;
                                return (
                                    <polygon
                                        points={points}
                                        fill={FUNNEL_COLORS[i] || seg.color}
                                        className="transition-all duration-300 cursor-pointer hover:brightness-95"
                                        onMouseEnter={() => setHoveredIndex(i)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    />
                                );
                            })()}

                            {/* Value label inside segment */}
                            <text
                                x={SVG_WIDTH / 2}
                                y={yStart + SEG_HEIGHT / 2}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-white font-black pointer-events-none select-none"
                                style={{ fontSize: '11px' }}
                            >
                                {seg.value}
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Tooltip */}
            {hoveredIndex !== null && (
                <div
                    className="absolute z-50 pointer-events-none"
                    style={{
                        left: `${(mousePos.x / SVG_WIDTH) * 100}%`,
                        top: `${(mousePos.y / SVG_HEIGHT) * 100}%`,
                        transform: 'translate(-50%, -130%)'
                    }}
                >
                    <div className="bg-slate-900/95 text-white px-3 py-1.5 rounded-lg shadow-2xl text-[11px] font-bold whitespace-nowrap">
                        {stages[hoveredIndex].name}: {stages[hoveredIndex].value}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-900/95" />
                    </div>
                </div>
            )}
        </div>
    );
};

// Date range label formatter
function formatDateLabel(dateRange?: string) {
    const now = new Date();
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    switch (dateRange) {
        case 'this_month': return fmt(new Date(now.getFullYear(), now.getMonth(), 1)) + ' – Present';
        case 'last_month': {
            const s = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const e = new Date(now.getFullYear(), now.getMonth(), 0);
            return `${fmt(s)} – ${fmt(e)}`;
        }
        case 'this_year': return `Jan ${now.getFullYear()} – Present`;
        case 'last_year': return `Jan ${now.getFullYear() - 1} – Dec ${now.getFullYear() - 1}`;
        default: return `Jan ${now.getFullYear() - 1} – Dec ${now.getFullYear() - 1}`;
    }
}

const Top3Recruiters: React.FC<Props> = ({ data, dateRange }) => {
    if (!data || data.length === 0) return null;

    const rankBadge = (rank: number) => {
        const styles: Record<number, string> = {
            1: 'bg-amber-50 text-amber-600 border-amber-200',
            2: 'bg-slate-100 text-slate-500 border-slate-200',
            3: 'bg-orange-50 text-orange-500 border-orange-200',
        };
        return styles[rank] || 'bg-slate-100 text-slate-500 border-slate-200';
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 flex items-center justify-between bg-slate-50/40 border-b border-slate-100/60 shrink-0">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-800 tracking-tight">Top 3 Recruiters</h3>
                    <InfoTooltip content="Top recruiters ranked by hiring ratio for the selected period." />
                </div>
                <span className="text-[10px] font-semibold text-slate-400">{formatDateLabel(dateRange)}</span>
            </div>

            {/* 3 Columns */}
            <div className="flex-1 grid grid-cols-3 divide-x divide-slate-100 min-h-0">
                {data.slice(0, 3).map((recruiter) => (
                    <div key={recruiter.rank} className="flex flex-col p-3 min-h-0">
                        {/* Recruiter header */}
                        <div className="flex items-start gap-2 mb-2 shrink-0">
                            <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-black shrink-0 ${rankBadge(recruiter.rank)}`}>
                                {recruiter.rank}
                            </span>
                            <div className="min-w-0">
                                <p className="text-[12px] font-black text-slate-800 leading-tight truncate">{recruiter.name}</p>
                                <p className="text-[10px] text-slate-400 font-semibold">Hiring ratio: {recruiter.hiringRatio}%</p>
                            </div>
                        </div>

                        {/* Funnel */}
                        <div className="flex-1 min-h-0 flex flex-col">
                            <MiniFunnel stages={recruiter.stages} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="px-5 py-3 border-t border-slate-50 flex justify-center flex-wrap gap-x-5 gap-y-1.5 bg-slate-50/20 shrink-0">
                {FUNNEL_STAGE_NAMES.map((name, i) => (
                    <div key={name} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: FUNNEL_COLORS[i] }} />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight">{name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Top3Recruiters;
