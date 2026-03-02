import React, { useState } from 'react';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    data?: {
        name: string;
        value: number;
        color: string;
    }[];
}

const StageConversion: React.FC<Props> = ({ data }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    if (!data || data.length === 0) return null;

    // Standardize data
    const funnelSegments = data.map((item, i) => {
        const overall = Math.round((item.value / data[0].value) * 100);
        const prevValue = i > 0 ? data[i - 1].value : item.value;
        const stagewise = Math.round((item.value / prevValue) * 100);
        return {
            ...item,
            overallPercent: `${overall}%`,
            stagewisePercent: `${stagewise}%`
        };
    });

    const colors = ['#CBD5E1', '#6366F1', '#10B981', '#F59E0B'];

    // Geometry Constants
    const SVG_WIDTH = 500;
    const SVG_HEIGHT = 320; // Compact height to prevent cropping
    const FUNNEL_TOP_WIDTH = 320;
    const FUNNEL_BOTTOM_WIDTH = 110;
    const GAP = 6;
    const SEGMENT_COUNT = 4;
    const SEG_HEIGHT = (SVG_HEIGHT - (SEGMENT_COUNT - 1) * GAP) / SEGMENT_COUNT;

    const renderFunnel = () => {
        return (
            <div className="relative w-full h-full flex items-center justify-center">
                <svg
                    viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                    preserveAspectRatio="xMidYMid meet"
                    className="w-full h-full overflow-visible select-none"
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const scaleX = SVG_WIDTH / rect.width;
                        const scaleY = SVG_HEIGHT / rect.height;
                        setMousePos({
                            x: (e.clientX - rect.left) * scaleX,
                            y: (e.clientY - rect.top) * scaleY
                        });
                    }}
                >
                    {/* Left side overall bracket (spans top 3 segments) */}
                    <g className="overall-bracket">
                        {(() => {
                            const y1 = 0;
                            const yTop3End = (SEG_HEIGHT + GAP) * 2 + SEG_HEIGHT;
                            return (
                                <g>
                                    <path
                                        d={`M 100,${y1} L 85,${y1} L 85,${yTop3End} L 100,${yTop3End}`}
                                        fill="none"
                                        stroke="#CBD5E1"
                                        strokeWidth="1.2"
                                        strokeDasharray="4,2"
                                    />
                                    <text
                                        x={75}
                                        y={(y1 + yTop3End) / 2}
                                        textAnchor="end"
                                        dominantBaseline="middle"
                                        className="text-[12px] font-black fill-slate-500"
                                    >
                                        10%
                                    </text>
                                </g>
                            );
                        })()}
                    </g>

                    {/* Right side stagewise brackets */}
                    <g className="stagewise-brackets">
                        {[1, 2, 3].map((idx) => {
                            const yStart = idx * (SEG_HEIGHT + GAP);
                            const yEnd = yStart + SEG_HEIGHT;
                            return (
                                <g key={idx}>
                                    <path
                                        d={`M ${SVG_WIDTH - 100},${yStart} L ${SVG_WIDTH - 85},${yStart} L ${SVG_WIDTH - 85},${yEnd} L ${SVG_WIDTH - 100},${yEnd}`}
                                        fill="none"
                                        stroke="#CBD5E1"
                                        strokeWidth="1.2"
                                        strokeDasharray="4,2"
                                    />
                                    <text
                                        x={SVG_WIDTH - 75}
                                        y={(yStart + yEnd) / 2}
                                        textAnchor="start"
                                        dominantBaseline="middle"
                                        className="text-[12px] font-black fill-slate-500"
                                    >
                                        {funnelSegments[idx].stagewisePercent}
                                    </text>
                                </g>
                            );
                        })}
                    </g>

                    {/* Funnel Segments */}
                    {funnelSegments.map((segment, i) => {
                        const y1 = i * (SEG_HEIGHT + GAP);
                        const y2 = y1 + SEG_HEIGHT;
                        const isLast = i === SEGMENT_COUNT - 1;

                        const taperHeight = (SEG_HEIGHT + GAP) * (SEGMENT_COUNT - 1) - GAP;

                        let w1 = FUNNEL_TOP_WIDTH - (y1 / taperHeight) * (FUNNEL_TOP_WIDTH - FUNNEL_BOTTOM_WIDTH);
                        let w2 = FUNNEL_TOP_WIDTH - (y2 / taperHeight) * (FUNNEL_TOP_WIDTH - FUNNEL_BOTTOM_WIDTH);

                        if (isLast) {
                            w1 = FUNNEL_BOTTOM_WIDTH;
                            w2 = FUNNEL_BOTTOM_WIDTH;
                        }

                        const x1 = (SVG_WIDTH - w1) / 2;
                        const x2 = (SVG_WIDTH - w2) / 2;
                        const x3 = x2 + w2;
                        const x4 = x1 + w1;

                        const points = `${x1},${y1} ${x2},${y2} ${x3},${y2} ${x4},${y1}`;

                        return (
                            <g key={i}>
                                <polygon
                                    points={points}
                                    fill={colors[i] || segment.color}
                                    className="transition-all duration-300 cursor-pointer hover:brightness-95"
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                />
                                <text
                                    x={SVG_WIDTH / 2}
                                    y={y1 + SEG_HEIGHT / 2}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="fill-white font-black pointer-events-none select-none"
                                    style={{ fontSize: '15px' }}
                                >
                                    {segment.value}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Tooltip */}
                {hoveredIndex !== null && (
                    <div
                        className="absolute z-50 pointer-events-none transition-transform duration-75 ease-out"
                        style={{
                            left: `${(mousePos.x / SVG_WIDTH) * 100}%`,
                            top: `${(mousePos.y / SVG_HEIGHT) * 100}%`,
                            transform: 'translate(-50%, -125%)'
                        }}
                    >
                        <div className="bg-slate-900/95 text-white px-3 py-1.5 rounded-lg shadow-2xl text-[11px] font-bold flex flex-col items-center">
                            <span className="whitespace-nowrap">{funnelSegments[hoveredIndex].name}: {funnelSegments[hoveredIndex].value}</span>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-900/95"></div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden group">
            <div className="p-4 flex justify-between items-center bg-slate-50/40 border-b border-slate-100/60">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-800 tracking-tight">Recruitment Funnel</h3>
                    <InfoTooltip content="Progression from candidate to offer acceptance." />
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center min-h-0 bg-white p-6">
                <div className="w-full h-full max-w-[500px] flex items-center justify-center">
                    {renderFunnel()}
                </div>
            </div>

            <div className="p-4 border-t border-slate-50 flex justify-center flex-wrap gap-x-6 gap-y-2 bg-slate-50/20">
                {funnelSegments.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shadow-inner" style={{ backgroundColor: colors[i] }} />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{s.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StageConversion;
