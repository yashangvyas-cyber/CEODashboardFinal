import React from 'react';
import { DateRangeOption } from '../../types';
import { Users, Timer, CheckCircle, TrendingUp } from 'lucide-react';

interface Props {
    dateRange: DateRangeOption;
}

const RecruitmentVelocity: React.FC<Props> = ({ dateRange }) => {
    // Metric 3: Offer Acceptance Rate (Gauge Data)
    const acceptanceRate = 88;

    // Widget C: Sourcing Efficacy Pie Data
    const sourcingData = [
        { label: "LinkedIn", value: 45, color: "text-blue-600", fill: "fill-blue-600" },
        { label: "Referrals", value: 30, color: "text-emerald-500", fill: "fill-emerald-500" },
        { label: "Agencies", value: 15, color: "text-purple-500", fill: "fill-purple-500" },
        { label: "Direct", value: 10, color: "text-slate-400", fill: "fill-slate-400" },
    ];

    // Logic for Multi-slice Pie (SVG)
    let cumulativePercent = 0;
    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    const slices = sourcingData.map((item) => {
        const startPercent = cumulativePercent;
        const endPercent = cumulativePercent + (item.value / 100);
        cumulativePercent = endPercent;

        const [startX, startY] = getCoordinatesForPercent(startPercent);
        const [endX, endY] = getCoordinatesForPercent(endPercent);
        const largeArcFlag = item.value / 100 > 0.5 ? 1 : 0;

        return {
            ...item,
            path: `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`
        };
    });

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
            <div className="p-6 border-b border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Recruitment Velocity</h3>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>

                {/* Top Metrics Grid - High Contrast */}
                <div className="grid grid-cols-3 gap-4">
                    {/* Metric 1 */}
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-center hover:bg-blue-50 transition-colors">
                        <div className="flex flex-col items-center">
                            <Users className="w-5 h-5 text-blue-500 mb-2" />
                            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">14</div>
                            <div className="text-xs font-bold text-slate-500 uppercase mt-1">Open Roles</div>
                        </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 text-center hover:bg-amber-50 transition-colors">
                        <div className="flex flex-col items-center">
                            <Timer className="w-5 h-5 text-amber-500 mb-2" />
                            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">42</div>
                            <div className="text-xs font-bold text-slate-500 uppercase mt-1">Avg Days</div>
                        </div>
                    </div>

                    {/* Metric 3 */}
                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-center hover:bg-emerald-50 transition-colors">
                        <div className="flex flex-col items-center">
                            <CheckCircle className="w-5 h-5 text-emerald-500 mb-2" />
                            <div className="text-3xl font-extrabold text-emerald-700 tracking-tight">88%</div>
                            <div className="text-xs font-bold text-emerald-600 uppercase mt-1">Accept Rate</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Widget C: Sourcing Efficacy Pie - Centered & Balanced */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50/20">
                <h4 className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-wide">Sourcing Channel Mix</h4>

                <div className="flex items-center w-full justify-around">
                    <div className="relative w-40 h-40">
                        <svg viewBox="-1.1 -1.1 2.2 2.2" className="w-full h-full transform -rotate-90 drop-shadow-lg">
                            {slices.map((slice, idx) => (
                                <path key={idx} d={slice.path} className={`${slice.fill} hover:opacity-90 transition-opacity cursor-pointer stroke-white stroke-[0.02]`} />
                            ))}
                        </svg>
                        {/* Inner Circle for Donut Effect */}
                        <div className="absolute inset-0 m-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner">
                            <Users className="w-6 h-6 text-slate-300" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {sourcingData.map((source, idx) => (
                            <div key={idx} className="flex items-center justify-between min-w-[120px]">
                                <div className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full ${source.color.replace('text-', 'bg-')} mr-2.5 shadow-sm ring-1 ring-white`}></div>
                                    <span className="text-xs font-bold text-slate-600">{source.label}</span>
                                </div>
                                <span className="text-xs font-bold text-slate-900 ml-3">{source.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentVelocity;