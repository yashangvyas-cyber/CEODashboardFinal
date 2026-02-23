import React from 'react';
import { FileText, Users } from 'lucide-react';
import type { BusinessUnitOption } from '../../types';

interface HeroSectionProps {
    selectedBU: BusinessUnitOption;
}

// Mock Global Snapshot Data
const getMocKpis = (bu: BusinessUnitOption) => {
    // Return different aggregates depending on the BU to show reactiveness
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
        }
    };
};

export const HeroSection: React.FC<HeroSectionProps> = ({ selectedBU }) => {
    const kpis = getMocKpis(selectedBU);

    return (
        <div className="w-full bg-slate-50 border-b border-slate-200 px-6 py-6 border-t flex flex-col gap-6">
            <div className="flex flex-col xl:flex-row gap-4 items-stretch w-full">

                {/* 
                  * WIDGET LOGIC & CONTEXT FOR DEVELOPERS:
                  * Title: Total Employees
                  * Source: Core HR / People System (e.g., Active Employees table)
                  * Formula: 
                  *   - Main Value: COUNT(Employee ID) WHERE Status = 'Active' AS OF TODAY.
                  *   - Trend Value: (Count Today) - (Count exactly 12 Months Ago). 
                  *   - Trend Percentage: (Trend Value / Count exactly 12 Months Ago) * 100.
                  */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-center min-w-[280px] shrink-0">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-800">{kpis.headcount.title}</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <h3 className="text-[28px] leading-none font-extrabold text-[#1a2332]">{kpis.headcount.value}</h3>
                                <span className="text-xs font-semibold text-slate-400">As of Today</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end text-right">
                            <span className="text-sm font-medium text-slate-800">Last 12 Months</span>
                            <span className={`text-sm font-bold mt-1 ${kpis.headcount.trendUp ? 'text-[#10b981]' : 'text-rose-500'}`}>
                                {kpis.headcount.trend}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 
                  * WIDGET LOGIC & CONTEXT FOR DEVELOPERS:
                  * Title: Global Snapshot Strip (Revenue, Collection, Billable, Open Roles)
                  * Description: Horizontal consolidated view of cross-departmental KPIs. 
                  * Revenue Source: CRM/Finance combined. Target is annual.
                  * Collection Source: Finance (Invoices paid / Invoices sent).
                  * Billable Source: PM Timesheets (Hours billed / Hours logged).
                  * Open Roles Source: ATS (Active critical requisitions).
                  */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 grid grid-cols-1 md:grid-cols-5 items-stretch overflow-hidden">

                    {/* Revenue Pulse */}
                    <div className="md:col-span-2 p-4 md:p-5 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center">
                        <div className="flex justify-between items-end mb-3">
                            <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <FileText className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                {kpis.revenue.title}
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-extrabold text-amber-500">{kpis.revenue.value}</span>
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-1">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: kpis.revenue.targetPercent }}></div>
                        </div>
                        <div className="text-right text-[10px] font-semibold text-slate-400">
                            {kpis.revenue.targetPercent} of Target
                        </div>
                    </div>

                    {/* Collection */}
                    <div className="col-span-1 p-4 md:p-5 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center min-w-[160px]">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-slate-500">{kpis.collection.title}</span>
                            <span className="text-sm font-extrabold text-[#10b981]">{kpis.collection.value}</span>
                        </div>
                        <div className="flex gap-1 h-1.5">
                            <div className="flex-1 bg-[#10b981] rounded-full"></div>
                            <div className="flex-1 bg-[#10b981] rounded-full"></div>
                            <div className="flex-1 bg-[#10b981] rounded-full"></div>
                            <div className="flex-1 bg-slate-200 rounded-full"></div>
                        </div>
                    </div>

                    {/* Billable */}
                    <div className="col-span-1 p-4 md:p-5 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center min-w-[150px]">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-slate-500">{kpis.billable.title}</span>
                            <span className="text-sm font-extrabold text-amber-500">{kpis.billable.value}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: kpis.billable.value }}></div>
                        </div>
                    </div>

                    {/* Open Roles */}
                    <div className="col-span-1 p-4 md:p-5 flex flex-col justify-center min-w-[150px]">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-slate-500">{kpis.openRoles.title}</span>
                            <span className="text-sm font-extrabold text-[#f43f5e]">{kpis.openRoles.value}</span>
                        </div>
                        <div className="text-[10px] font-semibold text-slate-400 flex items-center mt-1">
                            <Users className="w-3 h-3 mr-1" />
                            {kpis.openRoles.subtitle}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
