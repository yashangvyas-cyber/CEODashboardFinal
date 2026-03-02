import React from 'react';
import InfoTooltip from '../common/InfoTooltip';

interface FunnelSegment {
    label: string;
    overall: string;
    stagewise: string;
    color: string;
    value?: number;
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

const CRMSideBySideFunnel: React.FC<Props> = ({ data }) => {
    // Reference vibrant color palette from screenshot
    const vibrantColors = [
        '#d9435e', '#e18ac1', '#a8d672', '#4da6ff',
        '#fef3c7', '#633ebb', '#cbd16e', '#b186da'
    ];

    const defaultData = {
        deals: {
            title: "Deal Funnel",
            segments: [
                { label: "Open", overall: "53%", stagewise: "53%", value: 184, color: vibrantColors[0] },
                { label: "Contacted", overall: "46%", stagewise: "86%", value: 158, color: vibrantColors[1] },
                { label: "Proposal", overall: "43%", stagewise: "94%", value: 148, color: vibrantColors[2] },
                { label: "On Hold", overall: "40%", stagewise: "93%", value: 138, color: vibrantColors[3] },
                { label: "Qualified", overall: "39%", stagewise: "96%", value: 132, color: vibrantColors[4] },
                { label: "Approved", overall: "36%", stagewise: "93%", value: 122, color: vibrantColors[5] },
                { label: "Won", overall: "36%", stagewise: "100%", value: 122, color: vibrantColors[6] },
            ]
        },
        leads: {
            title: "Lead Funnel",
            segments: [
                { label: "Open", overall: "7%", stagewise: "7%", value: 1240, color: vibrantColors[0] },
                { label: "New", overall: "6%", stagewise: "87%", value: 1080, color: vibrantColors[1] },
                { label: "Negotiation", overall: "6%", stagewise: "93%", value: 1004, color: vibrantColors[2] },
                { label: "Follow-Up", overall: "6%", stagewise: "96%", value: 964, color: vibrantColors[3] },
                { label: "Proposal Sent", overall: "5%", stagewise: "83%", value: 800, color: vibrantColors[4] },
                { label: "Interested", overall: "3%", stagewise: "65%", value: 520, color: vibrantColors[5] },
                { label: "Testing", overall: "3%", stagewise: "100%", value: 520, color: vibrantColors[6] },
                { label: "Qualified", overall: "3%", stagewise: "100%", value: 520, color: vibrantColors[7] },
            ]
        }
    };

    const renderFunnelData = (targetFunnel: FunnelData) => {
        const segments = targetFunnel.segments;
        const width = 440;
        const height = 150;
        const gapHeight = 4;
        const totalGapHeight = (segments.length - 1) * gapHeight;
        const segmentHeight = (height - totalGapHeight) / segments.length;
        const topWidth = 280; // Slightly wider funnel
        const bottomWidth = 90;

        return (
            <svg viewBox={`0 0 ${width} ${height + 10}`} className="w-full h-full overflow-visible">
                <defs>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.1" />
                    </filter>
                </defs>
                {segments.map((segment, i) => {
                    const y1 = i * (segmentHeight + gapHeight);
                    const y2 = y1 + segmentHeight;

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
                                filter="url(#shadow)"
                                className="opacity-95 group-hover/segment:opacity-100 transition-opacity duration-300"
                            />

                            <text
                                x={width / 2}
                                y={y1 + segmentHeight / 2 + 3.5}
                                textAnchor="middle"
                                className="font-black fill-white"
                                style={{ fontSize: '10px', pointerEvents: 'none' }}
                            >
                                {segment.value || ''}
                            </text>

                            <g>
                                <text
                                    x={x1 - 32}
                                    y={y1 + segmentHeight / 2 + 3.5}
                                    textAnchor="end"
                                    className="font-bold fill-slate-500 tracking-tighter"
                                    style={{ fontSize: '9px' }}
                                >
                                    {segment.overall}
                                </text>
                                <line
                                    x1={x1 - 28} y1={y1 + segmentHeight / 2}
                                    x2={x1 - 5} y2={y1 + segmentHeight / 2}
                                    stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,2"
                                />
                            </g>

                            <g>
                                <text
                                    x={x4 + 32}
                                    y={y1 + segmentHeight / 2 + 3.5}
                                    textAnchor="start"
                                    className="font-bold fill-slate-500 tracking-tighter"
                                    style={{ fontSize: '9px' }}
                                >
                                    {segment.stagewise}
                                </text>
                                <line
                                    x1={x4 + 5} y1={y1 + segmentHeight / 2}
                                    x2={x4 + 28} y2={y1 + segmentHeight / 2}
                                    stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,2"
                                />
                            </g>
                        </g>
                    );
                })}
            </svg>
        );
    };

    const funnelsToRender = [data?.deals || defaultData.deals, data?.leads || defaultData.leads];

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-3 shadow-sm flex flex-col h-full hover:shadow transition-shadow w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2 shrink-0 z-10 w-full border-b border-slate-100/80 pb-2">
                <div className="flex items-center">
                    <h3 className="text-[11px] font-black text-slate-800 tracking-tight uppercase">Deal & Lead Funnels</h3>
                    <InfoTooltip content="Side-by-side visualization of the Deal and Lead conversion funnels." />
                </div>
            </div>

            <div className="flex flex-1 w-full gap-12 flex-col md:flex-row min-h-0 px-2 mt-1">
                {funnelsToRender.map((funnel, index) => (
                    <div key={index} className="flex-1 flex flex-col h-full w-full">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 text-center">{funnel.title}</h4>
                        <div className="flex justify-between px-12 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 w-full max-w-[400px] mx-auto">
                            <span>Overall</span>
                            <span>Stagewise</span>
                        </div>
                        {/* Chart */}
                        <div className="flex-1 w-full min-h-0 flex items-center justify-center overflow-visible">
                            <div className="w-full h-full max-h-[160px]">
                                {renderFunnelData(funnel)}
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-1 z-10 border-t border-slate-50 pt-1.5 px-2">
                            {funnel.segments.map((s, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: vibrantColors[i % vibrantColors.length] }} />
                                    <span className="text-[8px] font-bold text-slate-500 whitespace-nowrap uppercase tracking-tighter">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CRMSideBySideFunnel;
