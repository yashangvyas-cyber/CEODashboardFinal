import React from 'react';
import type { DateRangeOption } from '../../types';
import { Activity } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    dateRange: DateRangeOption;
    data?: any;
}

const CircularProgress = ({ value, label, text, colorClass, statusClass }: any) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const safeValue = Math.min(Math.max(value, 0), 100);
    const strokeDashoffset = circumference - (safeValue / 100) * circumference;

    return (
        <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="relative w-16 h-16 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r={radius} className="stroke-slate-100" strokeWidth="6" fill="transparent" />
                    <circle
                        cx="32" cy="32" r={radius}
                        className={`transition-all duration-1000 ease-out ${colorClass}`}
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-[11px] font-black ${statusClass}`}>{safeValue}%</span>
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-800 truncate">{label}</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight line-clamp-2">{text}</p>
            </div>
        </div>
    );
};

const PMHealthBreakdown: React.FC<Props> = ({ data }) => {
    if (!data) return null;

    const { fixedCost, timeAndMaterial, hirebase } = data;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6 shrink-0">
                <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase"><Activity className="w-4 h-4 mr-2 text-indigo-500" />
                        Project Delivery Health
                        <InfoTooltip content="Traffic-light view across 3 revenue streams. Fixed Cost: % of total hours (Estimated + Top-Ups) already spent. T&M: % of purchased hours that have been billed. Hirebase: % of contracts currently billable." /></h3>
                    <p className="text-xs text-slate-400 mt-1">Cross-model Execution Status</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-2">
                <CircularProgress
                    value={fixedCost.value}
                    label="Fixed Cost Portfolio Burn"
                    text={fixedCost.text}
                    colorClass={fixedCost.status === 'Warning' ? 'stroke-rose-500' : 'stroke-emerald-500'}
                    statusClass={fixedCost.status === 'Warning' ? 'text-rose-600' : 'text-emerald-600'}
                />
                <CircularProgress
                    value={timeAndMaterial?.value ?? 0}
                    label="T&M Portfolio Billed"
                    text={timeAndMaterial?.text ?? ''}
                    colorClass={timeAndMaterial?.status === 'Warning' ? 'stroke-amber-500' : 'stroke-emerald-500'}
                    statusClass={timeAndMaterial?.status === 'Warning' ? 'text-amber-600' : 'text-emerald-600'}
                />
                <CircularProgress
                    value={hirebase.value}
                    label="Hirebase Billable"
                    text={hirebase.text}
                    colorClass={hirebase.status === 'Warning' ? 'stroke-amber-500' : 'stroke-emerald-500'}
                    statusClass={hirebase.status === 'Warning' ? 'text-amber-600' : 'text-emerald-600'}
                />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-[10px] text-slate-400 bg-slate-50 p-2 rounded italic leading-tight">
                <strong>Logic:</strong> Fixed Cost burn = <em>Spent ÷ (Estimated + Top-Up hours)</em>. T&amp;M billed = <em>Total Billed ÷ Total Purchased hours</em>. Hirebase = <em>% of contracts flagged Billable</em>.
            </div>
        </div>
    );
};

export default PMHealthBreakdown;
