import React from 'react';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    data?: {
        name: string;
        value: number;
        color: string;
    }[];
}

const StageConversion: React.FC<Props> = ({ data }) => {
    if (!data || data.length === 0) return null;

    // Calculate Percentages
    const firstValue = data[0].value;
    const funnelSegments = data.map((item, i) => {
        const overall = Math.round((item.value / firstValue) * 100);
        const prevValue = i > 0 ? data[i - 1].value : item.value;
        const stagewise = Math.round((item.value / prevValue) * 100);

        return {
            ...item,
            overall: `${overall}%`,
            stagewise: `${stagewise}%`
        };
    });

    // Reference vibrant color palette from screenshot
    const vibrantColors = [
        '#d9435e', // Red/Pink
        '#e18ac1', // Light Pink
        '#a8d672', // Lime Green
        '#4da6ff', // Sky Blue
        '#fef3c7', // Cream/Yellow
        '#633ebb', // Indigo/Purple
        '#cbd16e', // Olive/Gold
        '#b186da'  // Lavender
    ];

    const renderFunnel = () => {
        const width = 600;
        const height = 400;
        const gapHeight = 10;
        const totalGapHeight = (funnelSegments.length - 1) * gapHeight;
        const segmentHeight = (height - totalGapHeight) / funnelSegments.length;
        const topWidth = 500;
        const bottomWidth = 150; // More tapered like the screenshot

        return (
            <svg viewBox={`0 0 ${width} ${height + 40}`} className="w-full h-full overflow-visible">
                <defs>
                    <filter id="funnelShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15" />
                    </filter>
                </defs>
                {funnelSegments.map((segment, i) => {
                    const y1 = i * (segmentHeight + gapHeight);
                    const y2 = y1 + segmentHeight;

                    // Taper calculation
                    const w1 = topWidth - (y1 / height) * (topWidth - bottomWidth);
                    const w2 = topWidth - (y2 / height) * (topWidth - bottomWidth);

                    const x1 = (width - w1) / 2;
                    const x2 = (width - w2) / 2;
                    const x3 = x2 + w2;
                    const x4 = x1 + w1;

                    const points = `${x1},${y1} ${x2},${y2} ${x3},${y2} ${x4},${y1}`;
                    const segmentColor = vibrantColors[i % vibrantColors.length];

                    return (
                        <g key={i} className="group/segment">
                            <polygon
                                points={points}
                                fill={segmentColor}
                                filter="url(#funnelShadow)"
                                className="opacity-95 group-hover/segment:opacity-100 transition-all duration-300 pointer-events-auto"
                            />

                            {/* Center Value */}
                            <text
                                x={width / 2}
                                y={y1 + segmentHeight / 2 + 6}
                                textAnchor="middle"
                                className="font-black fill-white drop-shadow-md"
                                style={{ fontSize: '16px' }}
                            >
                                {segment.value}
                            </text>

                            {/* Overall (Left) */}
                            <g className="text-slate-500">
                                <text
                                    x={x1 - 50}
                                    y={y1 + segmentHeight / 2 + 5}
                                    textAnchor="end"
                                    className="font-bold tracking-tighter"
                                    style={{ fontSize: '13px' }}
                                >
                                    {segment.overall}
                                </text>
                                <line
                                    x1={x1 - 45} y1={y1 + segmentHeight / 2}
                                    x2={x1 - 5} y2={y1 + segmentHeight / 2}
                                    stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,2"
                                />
                            </g>

                            {/* Stagewise (Right) */}
                            <g className="text-slate-500">
                                <text
                                    x={x4 + 50}
                                    y={y1 + segmentHeight / 2 + 5}
                                    textAnchor="start"
                                    className="font-bold tracking-tighter"
                                    style={{ fontSize: '13px' }}
                                >
                                    {segment.stagewise}
                                </text>
                                <line
                                    x1={x4 + 5} y1={y1 + segmentHeight / 2}
                                    x2={x4 + 45} y2={y1 + segmentHeight / 2}
                                    stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,2"
                                />
                            </g>
                        </g>
                    );
                })}
            </svg>
        );
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col h-full group transition-all duration-300 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6 shrink-0 z-10">
                <div className="flex items-center">
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Stage Conversion Rate</h3>
                    <InfoTooltip content="Visualizes the recruitment funnel efficiency, showing how many candidates progress through each stage from sourcing to final joining." />
                </div>
            </div>

            <div className="flex justify-between px-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                <span className="w-16 text-right">Overall %</span>
                <span className="w-16 text-left">Stagewise %</span>
            </div>

            <div className="flex-1 min-h-0 py-4 flex items-center justify-center">
                <div className="w-full" style={{ maxWidth: '480px', margin: '0 auto' }}>
                    {renderFunnel()}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 z-10 border-t border-slate-50 pt-5">
                {funnelSegments.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: vibrantColors[i % vibrantColors.length] }} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StageConversion;
