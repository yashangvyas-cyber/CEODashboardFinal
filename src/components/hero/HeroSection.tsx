import React from 'react';
import { FileText, Users, CalendarClock, Loader2 } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics';
import type { BusinessUnitOption } from '../../types';

interface HeroSectionProps {
    selectedBU: BusinessUnitOption;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ selectedBU }) => {

    // Connect to Supabase for Employee Data
    const { data: employeeData, loading: employeeLoading } = useDashboardMetrics(selectedBU);

    return (
        <div className="w-full bg-slate-50 border-b border-slate-200 px-6 py-4">
            <div className="flex flex-col xl:flex-row gap-4 items-stretch w-full">

                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-center min-w-[240px] shrink-0">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Total Employees</p>
                                <InfoTooltip content="Total Number of active employees across all business units." />
                            </div>
                            <div className="flex items-baseline gap-2 mt-0.5">
                                {employeeLoading ? (
                                    <div className="flex items-center mt-1">
                                        <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                                        <span className="text-xs text-slate-400 ml-2 font-medium">Loading live data...</span>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-2xl leading-none font-black text-[#1a2332]">
                                            {employeeData?.totalEmployees || 0}
                                        </h3>
                                        <span className="text-[10px] font-semibold text-slate-400 italic">Today</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {!employeeLoading && employeeData && (
                            <div className="flex flex-col items-end text-right">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">12M Trend</span>
                                <span className={`text-xs font-black mt-0.5 ${employeeData.employeeTrend >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                    {employeeData.employeeTrend >= 0 ? '+' : ''}{employeeData.employeeTrend} ({employeeData.employeeTrendPct}%)
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex-1 grid grid-cols-1 md:grid-cols-6 items-stretch overflow-hidden">

                    {/* Revenue Pulse */}
                    <div className="md:col-span-2 p-3 md:p-4 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center">
                        <div className="flex justify-between items-end mb-2">
                            <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                <FileText className="w-3 h-3 mr-1.5 text-slate-400" />
                                Revenue Pulse
                                <InfoTooltip content="Current year-to-date revenue compared against the annual target." />
                            </div>
                            <div className="text-right flex items-center">
                                {employeeLoading ? (
                                    <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                                ) : (
                                    <span className="text-sm font-black text-amber-500">₹{(employeeData?.revenueYTD || 0).toLocaleString()} YTD</span>
                                )}
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mb-1">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${employeeData?.revenueTargetPct || 0}%` }}></div>
                        </div>
                        <div className="text-right text-[9px] font-bold text-slate-400 lowercase italic">
                            {employeeData?.revenueTargetPct || 0}% of target
                        </div>
                    </div>

                    {/* Collection */}
                    <div className="col-span-1 p-3 md:p-4 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center min-w-[140px]">
                        <div className="flex justify-between items-center mb-1.5">
                            <div className="flex items-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Collection</span>
                                <InfoTooltip content="Percentage of invoiced revenue that has been successfully collected." />
                            </div>
                            <div className="flex justify-end mb-1.5 items-center">
                                {employeeLoading ? (
                                    <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                                ) : (
                                    <span className="text-sm font-black text-emerald-600">{employeeData?.collectionPct || 0}%</span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-1 h-1">
                            <div className={`flex-1 rounded-full ${employeeData?.collectionPct && employeeData.collectionPct > 25 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                            <div className={`flex-1 rounded-full ${employeeData?.collectionPct && employeeData.collectionPct > 50 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                            <div className={`flex-1 rounded-full ${employeeData?.collectionPct && employeeData.collectionPct > 75 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                            <div className={`flex-1 rounded-full ${employeeData?.collectionPct && employeeData.collectionPct > 95 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                        </div>
                    </div>

                    {/* Billable */}
                    <div className="col-span-1 p-3 md:p-4 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center min-w-[130px]">
                        <div className="flex justify-between items-center mb-1.5">
                            <div className="flex items-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Billable</span>
                                <InfoTooltip content="Percentage of technical staff currently assigned to revenue-generating projects." />
                            </div>
                            <div className="flex justify-end mb-1.5 items-center">
                                {employeeLoading ? (
                                    <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                                ) : (
                                    <span className="text-sm font-black text-amber-500">{employeeData?.billablePct || 0}%</span>
                                )}
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${employeeData?.billablePct || 0}%` }}></div>
                        </div>
                    </div>

                    {/* Open Roles */}
                    <div className="col-span-1 p-3 md:p-4 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center min-w-[130px]">
                        <div className="flex justify-between items-center mb-0.5">
                            <div className="flex items-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Open Roles</span>
                                <InfoTooltip content="Number of active critical job openings that are yet to be filled." />
                            </div>
                            <div className="flex justify-end mb-0.5 items-center">
                                {employeeLoading ? (
                                    <Loader2 className="w-4 h-4 text-rose-500 animate-spin" />
                                ) : (
                                    <span className="text-sm font-black text-rose-500">{employeeData?.openRoles || 0}</span>
                                )}
                            </div>
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 flex items-center mt-1 italic">
                            <Users className="w-2.5 h-2.5 mr-1" />
                            critical hires pending
                        </div>
                    </div>

                    {/* 30-Day Cash Forecast — NEW */}
                    <div className="col-span-1 p-3 md:p-4 flex flex-col justify-center min-w-[150px] bg-teal-50/40">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-teal-700 uppercase tracking-wider mb-1">
                            <CalendarClock className="w-3 h-3" />
                            30-Day Forecast
                            <InfoTooltip content="Projected cash collections expected over the next 30 days based on invoice due dates." />
                        </div>
                        <div className="flex items-baseline gap-2">
                            {employeeLoading ? (
                                <Loader2 className="w-4 h-4 text-teal-700 animate-spin" />
                            ) : (
                                <>
                                    <span className="text-sm font-black text-teal-700">₹{(employeeData?.cashForecast || 0).toLocaleString()}</span>
                                    <span className={`text-[10px] font-black ${employeeData?.cashForecastTrendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        +{employeeData?.cashForecastTrend || 0}%
                                    </span>
                                </>
                            )}
                        </div>
                        <div className="text-[9px] font-bold text-teal-600/60 italic mt-0.5">
                            projected collections
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

