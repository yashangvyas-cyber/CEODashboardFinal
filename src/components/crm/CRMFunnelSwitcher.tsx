import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface FunnelSegment {
    label: string;
    overall: string;
    stagewise: string;
    color: string;
}

interface FunnelData {
    title: string;
    segments: FunnelSegment[];
}

interface Props {
    data?: {
        deals: FunnelData;
        leads: FunnelData;
    };
}

const CRMFunnelSwitcher: React.FC<Props> = ({ data }) => {
    const [activeMode, setActiveMode] = useState<'leads' | 'deals'>('deals');

    const defaultData = {
        deals: {
            title: "Deal Funnel",
            segments: [
                { label: "Open", overall: "53%", stagewise: "53%", color: "#93a5be" },
                { label: "Contacted", overall: "46%", stagewise: "86%", color: "#4ade80" },
                { label: "Proposal", overall: "43%", stagewise: "94%", color: "#a78bfa" },
                { label: "On Hold", overall: "40%", stagewise: "93%", color: "#22c55e" },
                { label: "Qualified", overall: "39%", stagewise: "96%", color: "#60a5fa" },
                { label: "Approved test", overall: "36%", stagewise: "93%", color: "#ca8a04" },
                { label: "Won", overall: "36%", stagewise: "100%", color: "#4ade80" },
            ]
        },
        leads: {
            title: "Lead Funnel",
            segments: [
                { label: "Open", overall: "7%", stagewise: "7%", color: "#ecfccb" },
                { label: "New", overall: "6%", stagewise: "87%", color: "#f87171" },
                { label: "Negotiation", overall: "6%", stagewise: "93%", color: "#dc2626" },
                { label: "Follow-Up", overall: "6%", stagewise: "96%", color: "#84cc16" },
                { label: "Proposal Sent", overall: "5%", stagewise: "83%", color: "#c084fc" },
                { label: "Interested", overall: "3%", stagewise: "65%", color: "#4ade80" },
                { label: "Testing", overall: "3%", stagewise: "100%", color: "#a3e635" },
                { label: "Qualified", overall: "3%", stagewise: "100%", color: "#2dd4bf" },
            ]
        }
    };

    const currentFunnel = activeMode === 'deals' ? (data?.deals || defaultData.deals) : (data?.leads || defaultData.leads);

    const renderFunnel = () => {
        const segments = currentFunnel.segments;
        const width = 300;
        const height = 400;
        const segmentHeight = height / segments.length;
        const topWidth = 240;
        const bottomWidth = 40;

        return (
            <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full h-full overflow-visible">
                {segments.map((segment, i) => {
                    const y1 = i * segmentHeight;
                    const y2 = (i + 1) * segmentHeight;

                    // Calculate trapezoid widths
                    const w1 = topWidth - (i / segments.length) * (topWidth - bottomWidth);
                    const w2 = topWidth - ((i + 1) / segments.length) * (topWidth - bottomWidth);

                    const x1 = (width - w1) / 2;
                    const x2 = (width - w2) / 2;
                    const x3 = x2 + w2;
                    const x4 = x1 + w1;

                    const points = `${x1},${y1} ${x2},${y2} ${x3},${y2} ${x4},${y1}`;

                    return (
                        <g key={i} className="group/segment">
                            <polygon
                                points={points}
                                fill={segment.color}
                                className="opacity-80 group-hover/segment:opacity-100 transition-opacity duration-300 shadow-sm"
                            />

                            {/* Dotted Lines for Labels */}
                            <line x1={x1 - 10} y1={y1} x2={x1 + 10} y2={y1} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,2" />
                            <line x1={x4 - 10} y1={y1} x2={x4 + 10} y2={y1} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,2" />

                            {/* Overall Percent (Left) */}
                            <text
                                x={x1 - 25}
                                y={y1 + segmentHeight / 2 + 4}
                                textAnchor="end"
                                className="text-[10px] font-bold fill-slate-500"
                            >
                                {segment.overall}
                            </text>
                            <line
                                x1={x1 - 20} y1={y1 + segmentHeight / 2}
                                x2={x1 - 5} y2={y1 + segmentHeight / 2}
                                stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2"
                            />

                            {/* Stagewise Percent (Right) */}
                            <text
                                x={x4 + 25}
                                y={y1 + segmentHeight / 2 + 4}
                                textAnchor="start"
                                className="text-[10px] font-bold fill-slate-500"
                            >
                                {segment.stagewise}
                            </text>
                            <line
                                x1={x4 + 5} y1={y1 + segmentHeight / 2}
                                x2={x4 + 20} y2={y1 + segmentHeight / 2}
                                stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2"
                            />
                        </g>
                    );
                })}
            </svg>
        );
    };

    return (
        <div className="premium-card p-6 flex flex-col h-full group hover-scale shadow-sm relative overflow-hidden bg-white">
            <div className="flex justify-between items-start mb-6 shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">{currentFunnel.title}</h3>
                    <Info className="w-4 h-4 text-slate-400 cursor-help" />
                </div>

                {/* Mode Switcher Buttons */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                    <button
                        onClick={() => setActiveMode('deals')}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all duration-300 ${activeMode === 'deals' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        DEALS
                    </button>
                    <button
                        onClick={() => setActiveMode('leads')}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all duration-300 ${activeMode === 'leads' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        LEADS
                    </button>
                </div>
            </div>

            <div className="flex justify-between px-10 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                <span>Overall</span>
                <span>Stagewise</span>
            </div>

            <div className="flex-1 min-h-0 py-4 flex items-center justify-center">
                <div className="w-full max-w-[320px] aspect-[3/4]">
                    {renderFunnel()}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 z-10">
                {currentFunnel.segments.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CRMFunnelSwitcher;
