import React from 'react';
import type { DateRangeOption } from '../../types';
import { UserMinus } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

interface Props {
    dateRange?: DateRangeOption;
    data?: any[];
}

const ManagerWatchlist: React.FC<Props> = ({ data = [] }) => {
    // We get the top 10 managers to mimic the dense donut chart from the screenshot
    const topManagers = [...data]
        .sort((a, b) => b.exits - a.exits)
        .slice(0, 10);

    const vibrantColors = [
        '#a8d672', '#a8d672', '#4da6ff', '#cbd16e', '#cbd16e',
        '#d9ca96', '#d98a5e', '#a8d672', '#43b87f', '#b186da'
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl">
                    {`${payload[0].name}: ${payload[0].value}`}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-6 shadow-sm flex flex-col h-full group hover:shadow-md hover:border-rose-100 transition-all duration-300 relative overflow-hidden">
            <div className="flex justify-between items-start mb-2 shrink-0 z-10">
                <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase"><UserMinus className="w-4 h-4 mr-2 text-rose-500 group-hover:scale-110 transition-transform inline-block mb-1" />
                        Exit by Reporting Manager
                        <InfoTooltip content="Overview of employee exits grouped by their reporting manager." /></h3>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 mt-4">
                {/* Donut Chart */}
                <div className="relative shrink-0 flex items-center justify-center w-full" style={{ height: 180 }}>
                    <PieChart width={180} height={180}>
                        <Pie
                            data={topManagers}
                            cx={90}
                            cy={90}
                            innerRadius={50}
                            outerRadius={85}
                            paddingAngle={1}
                            dataKey="exits"
                            nameKey="name"
                            stroke="none"
                        >
                            {topManagers.map((_entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={vibrantColors[index % vibrantColors.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    </PieChart>
                </div>

                {/* Legend */}
                <div className="w-full mt-4 flex flex-wrap justify-center gap-x-3 gap-y-2 px-1">
                    {topManagers.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-1.5 shrink-0">
                            <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: vibrantColors[index % vibrantColors.length] }}
                            />
                            <span className="text-[10px] font-bold text-slate-500 truncate max-w-[80px]" title={entry.name}>
                                {entry.name.length > 15 ? entry.name.substring(0, 15) + '...' : entry.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManagerWatchlist;
