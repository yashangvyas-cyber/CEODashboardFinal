import React from 'react';
import { FileText, Users, CalendarClock } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';
import type { BusinessUnitOption } from '../../types';

interface HeroSectionProps {
    selectedBU: BusinessUnitOption;
}

// Mock Global Snapshot Data
const getMocKpis = (bu: BusinessUnitOption) => {
    const isAll = bu === 'all';
    return {
        headcount: {
            title: 'Total Employees',
            value: isAll ? '360' : '85',
            trend: isAll ? '+6 (1.69%)' : '+2 (2.41%)',
            trendUp: true
        },
        revenue: {
            title: 'Revenue Pulse',
            value: isAll ? '₹8.5Cr YTD' : '₹1.8Cr YTD',
            targetPercent: isAll ? '85%' : '72%',
            trendUp: false
        },
        collection: {
            title: 'Collection',
            value: isAll ? '92%' : '85%'
        },
        billable: {
            title: 'Billable',
            value: isAll ? '78%' : '65%'
        },
        openRoles: {
            title: 'Open Roles',
            value: isAll ? '14' : '4',
            subtitle: 'critical hires pending'
        },
        cashForecast: {
            title: '30-Day Forecast',
            value: isAll ? '₹1.2Cr' : '₹28L',
            subtitle: 'projected collections',
            trend: isAll ? '+8%' : '+5%',
            trendUp: true
        }
    };
};

export const HeroSection: React.FC<HeroSectionProps> = ({ selectedBU }) => {
    const kpis = getMocKpis(selectedBU);

    return (
        <div className="w-full bg-slate-50 border-b border-slate-200 px-6 py-4">
            <div className="flex flex-col xl:flex-row gap-4 items-stretch w-full">

                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-center min-w-[240px] shrink-0">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">{kpis.headcount.title}</p>
                                <InfoTooltip content="The total number of employees currently employed across all business units." />
                            </div>
                            <div className="flex items-baseline gap-2 mt-0.5">
                                <h3 className="text-2xl leading-none font-black text-[#1a2332]">{kpis.headcount.value}</h3>
                                <span className="text-[10px] font-semibold text-slate-400 italic">Today</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">12M Trend</span>
                            <span className={`text-xs font-black mt-0.5 ${kpis.headcount.trendUp ? 'text-emerald-600' : 'text-rose-500'}`}>
                                {kpis.headcount.trend}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex-1 grid grid-cols-1 md:grid-cols-6 items-stretch overflow-hidden">

                    {/* Revenue Pulse */}
                    <div className="md:col-span-2 p-3 md:p-4 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center">
                        <div className="flex justify-between items-end mb-2">
                            <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                <FileText className="w-3 h-3 mr-1.5 text-slate-400" />
                                {kpis.revenue.title}
                                <InfoTooltip content="Current year-to-date revenue compared against the annual target." />
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-black text-amber-500">{kpis.revenue.value}</span>
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mb-1">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: kpis.revenue.targetPercent }}></div>
                        </div>
                        <div className="text-right text-[9px] font-bold text-slate-400 lowercase italic">
                            {kpis.revenue.targetPercent} of target
                        </div>
                    </div>

                    {/* Collection */}
                    <div className="col-span-1 p-3 md:p-4 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center min-w-[140px]">
                        <div className="flex justify-between items-center mb-1.5">
                            <div className="flex items-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">{kpis.collection.title}</span>
                                <InfoTooltip content="Percentage of invoiced revenue that has been successfully collected." />
                            </div>
                            <div className="flex justify-end mb-1.5">
                                <span className="text-sm font-black text-emerald-600">{kpis.collection.value}</span>
                            </div>
                        </div>
                        <div className="flex gap-1 h-1">
                            <div className="flex-1 bg-emerald-500 rounded-full"></div>
                            <div className="flex-1 bg-emerald-500 rounded-full"></div>
                            <div className="flex-1 bg-emerald-500 rounded-full"></div>
                            <div className="flex-1 bg-slate-200 rounded-full"></div>
                        </div>
                    </div>

                    {/* Billable */}
                    <div className="col-span-1 p-3 md:p-4 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center min-w-[130px]">
                        <div className="flex justify-between items-center mb-1.5">
                            <div className="flex items-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">{kpis.billable.title}</span>
                                <InfoTooltip content="Percentage of technical staff currently assigned to revenue-generating projects." />
                            </div>
                            <div className="flex justify-end mb-1.5">
                                <span className="text-sm font-black text-amber-500">{kpis.billable.value}</span>
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: kpis.billable.value }}></div>
                        </div>
                    </div>

                    {/* Open Roles */}
                    <div className="col-span-1 p-3 md:p-4 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center min-w-[130px]">
                        <div className="flex justify-between items-center mb-0.5">
                            <div className="flex items-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">{kpis.openRoles.title}</span>
                                <InfoTooltip content="Number of active job openings that are yet to be filled." />
                            </div>
                            <div className="flex justify-end mb-0.5">
                                <span className="text-sm font-black text-rose-500">{kpis.openRoles.value}</span>
                            </div>
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 flex items-center mt-1 italic">
                            <Users className="w-2.5 h-2.5 mr-1" />
                            {kpis.openRoles.subtitle}
                        </div>
                    </div>

                    {/* 30-Day Cash Forecast — NEW */}
                    <div className="col-span-1 p-3 md:p-4 flex flex-col justify-center min-w-[150px] bg-teal-50/40">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-teal-700 uppercase tracking-wider mb-1">
                            <CalendarClock className="w-3 h-3" />
                            {kpis.cashForecast.title}
                            <InfoTooltip content="Projected cash collections expected over the next 30 days based on invoice due dates." />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm font-black text-teal-700">{kpis.cashForecast.value}</span>
                            <span className={`text-[10px] font-black ${kpis.cashForecast.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {kpis.cashForecast.trend}
                            </span>
                        </div>
                        <div className="text-[9px] font-bold text-teal-600/60 italic mt-0.5">
                            {kpis.cashForecast.subtitle}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

