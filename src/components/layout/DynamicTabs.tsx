import React from 'react';
import type { ModuleOption, DateRangeOption, BusinessUnitOption } from '../../types';
import { useWidgetConfig } from '../../hooks/useWidgetConfig';
import { CustomizeWidgetsButton } from './CustomizeWidgetsPanel';

// Gemini People Components
import ExitByTypeAndReason from '../people/ExitByTypeAndReason';
import AttritionAnalysis from '../people/AttritionAnalysis';
import TalentRiskScore from '../people/TalentRiskScore';
import ManagerWatchlist from '../people/ManagerWatchlist';
import AttritionMetrics from '../people/AttritionMetrics';
import SkillsGap from '../people/SkillsGap';
import TopEmployees from '../people/TopEmployees';

// Project Management Components
import PMHealthBreakdown from '../project_management/PMHealthBreakdown';
import UpcomingExpirations from '../project_management/UpcomingExpirations';
import RevenueLeakage from '../project_management/RevenueLeakage';
import TopEffortConsumers from '../project_management/TopEffortConsumers';
import TimesheetCompliance from '../project_management/TimesheetCompliance';
import MissingAllocations from '../project_management/MissingAllocations';
import ResourceAllocationCentral from '../project_management/ResourceAllocationCentral';

// CRM Components
import CRMSummaryCards from '../crm/CRMSummaryCards';
import CRMFunnelSwitcher from '../crm/CRMFunnelSwitcher';
import CollectionEfficiency from '../crm/CollectionEfficiency';
import SalesMetrics from '../crm/SalesMetrics';
import ReceivablesAging from '../crm/ReceivablesAging';
import CollectionGoalCard from '../crm/CollectionGoalCard';
import CRMPipelineSummaries from '../crm/CRMPipelineSummaries';
import TopRevenueContributors from '../crm/TopRevenueContributors';
import LostDealAnalysis from '../crm/LostDealAnalysis';
import RevenueSourceMix from '../crm/RevenueSourceMix';
import RevenueTrend from '../crm/RevenueTrend';
import AvgDaysToPay from '../crm/AvgDaysToPay';

// Recruitment Components
import RecruitmentSummaryCards from '../recruitment/RecruitmentSummaryCards';
import StageConversion from '../recruitment/StageConversion';
import RecruitmentVelocity from '../people/RecruitmentVelocity';
import JobStatus from '../recruitment/JobStatus';
import OfferAcceptance from '../recruitment/OfferAcceptance';


// Mock Data for People tab based on Gemini's structure
const mockPeopleData = {
    talentRisk: { compositeScore: 72, earlyAttrition: { exitsUnder90Days: 12, newJoins: 85 }, status: 'Elevated' },
    exitByTypeAndReason: {
        types: ['Resignation', 'Termination'],
        chartDataMap: {
            'Resignation': [
                { name: 'Better Opportunity', value: 2, color: '#ca8a04' },
                { name: 'Absconding', value: 2, color: '#5eead4' }
            ],
            'Termination': [
                { name: 'Layoff', value: 3, color: '#a78bfa' },
                { name: 'Poor Performance', value: 2, color: '#818cf8' },
                { name: 'Unsatisfactory Behavior', value: 2, color: '#c084fc' },
                { name: 'Work Not Satisfactory', value: 1, color: '#ef4444' },
                { name: 'Other', value: 2, color: '#f472b6' }
            ]
        }
    },
    exitTrend: {
        chartData: [
            { month: 'Jan-25', regrettable: 0, nonRegrettable: 0, unspecified: 0 },
            { month: 'Feb-25', regrettable: 0, nonRegrettable: 0, unspecified: 0 },
            { month: 'Mar-25', regrettable: 0, nonRegrettable: 0, unspecified: 0 },
            { month: 'Apr-25', regrettable: 0, nonRegrettable: 0, unspecified: 0 },
            { month: 'May-25', regrettable: 0, nonRegrettable: 0, unspecified: 0 },
            { month: 'Jun-25', regrettable: 0, nonRegrettable: 1, unspecified: 0 },
            { month: 'Jul-25', regrettable: 0, nonRegrettable: 1, unspecified: 1 },
            { month: 'Aug-25', regrettable: 0, nonRegrettable: 2, unspecified: 0 },
            { month: 'Sep-25', regrettable: 0, nonRegrettable: 2, unspecified: 0 },
            { month: 'Oct-25', regrettable: 0, nonRegrettable: 0, unspecified: 1 },
            { month: 'Nov-25', regrettable: 0, nonRegrettable: 1, unspecified: 0 },
            { month: 'Dec-25', regrettable: 1, nonRegrettable: 0, unspecified: 0 }
        ],
        kpis: {
            totalExits: {
                percent: '90.91%',
                count: '10 employees',
                breakdown: [
                    { type: 'Resignation', percent: '60%' },
                    { type: 'Termination', percent: '40%' }
                ]
            },
            avgMonthly: { percent: '7.58%', count: '0.83 employees' }
        }
    },
    leaveAndDeptRisk: {
        companyAvailability: { totalEmployees: 362, onLeave: 45 },
        deptRisk: [
            { name: 'Engineering', onLeave: 18, riskPercent: 65 }, { name: 'Sales', onLeave: 8, riskPercent: 30 },
            { name: 'Support', onLeave: 12, riskPercent: 55 }
        ],
        peakLeaveWarning: 'Mid-December'
    },
    managerWatchlist: [
        { id: 1, name: 'A. Patel', dept: 'Engineering', exits: 5, severity: 'danger', avatar: 'AP' },
        { id: 2, name: 'S. Jenkins', dept: 'Sales', exits: 3, severity: 'warning', avatar: 'SJ' },
        { id: 3, name: 'M. Chen', dept: 'Support', exits: 2, severity: 'warning', avatar: 'MC' }
    ],
    skillsGap: [
        { skill: 'React/Frontend', domain: 'Engineering', levels: { beginner: 5, intermediate: 15, experienced: 25 } },
        { skill: 'Python/AI', domain: 'AI/ML', levels: { beginner: 10, intermediate: 8, experienced: 5 } },
        { skill: 'Cloud Arch', domain: 'DevOps', levels: { beginner: 2, intermediate: 12, experienced: 18 } },
        { skill: 'DevOps', domain: 'DevOps', levels: { beginner: 8, intermediate: 20, experienced: 15 } },
        { skill: 'Project Mgmt', domain: 'Management', levels: { beginner: 3, intermediate: 10, experienced: 30 } },
        { skill: 'Node.js', domain: 'Engineering', levels: { beginner: 12, intermediate: 5, experienced: 8 } },
        { skill: 'TypeScript', domain: 'Engineering', levels: { beginner: 4, intermediate: 25, experienced: 40 } },
        { skill: 'Cyber Security', domain: 'Security', levels: { beginner: 15, intermediate: 5, experienced: 2 } },
        { skill: 'UX Design', domain: 'Design', levels: { beginner: 6, intermediate: 12, experienced: 9 } },
        { skill: 'QA Automation', domain: 'Engineering', levels: { beginner: 20, intermediate: 10, experienced: 5 } }
    ],
    topEmployees: [
        { rank: 1, name: 'Elena Fisher', role: 'Snr. Dev', badges: 12, avatarUrl: 'https://i.pravatar.cc/150?u=elena' },
        { rank: 2, name: 'Nathan Drake', role: 'Product Lead', badges: 10, avatarUrl: 'https://i.pravatar.cc/150?u=nathan' },
        { rank: 3, name: 'Chloe Frazer', role: 'UX Designer', badges: 9, avatarUrl: 'https://i.pravatar.cc/150?u=chloe' },
        { rank: 4, name: 'Sully V.', role: 'Ops Manager', badges: 8, avatarUrl: 'https://i.pravatar.cc/150?u=sully' },
        { rank: 5, name: 'Sam Drake', role: 'Security', badges: 7, avatarUrl: 'https://i.pravatar.cc/150?u=sam' }
    ]
};

// Mock Data for Project Management tab based on live user reports
const mockPMData = {
    healthBreakdown: {
        fixedCost: { value: 68, status: 'Warning', text: 'Avg variance across 32 active projects' },
        hourly: { value: 39, status: 'Warning', text: 'Low billing efficiency across 31 buckets' },
        hirebase: { value: 92, status: 'Healthy', text: 'Optimal utilization for 23 active contracts' }
    },
    expirations: [
        { resourceOrProject: 'A. Patel (Assoc. SW Eng)', type: 'Hirebase', manager: 'Admin', daysRemaining: 1 },
        { resourceOrProject: 'A. Suthar (Accountant)', type: 'Hirebase', manager: 'Admin', daysRemaining: 3 },
        { resourceOrProject: 'D. Mehta (QA)', type: 'Hirebase', manager: 'BD', daysRemaining: 4 },
        { resourceOrProject: 'MI Hire (Hire Base)', type: 'Hirebase', manager: 'C. Patel', daysRemaining: 7 }
    ],
    hireVsExpire: {
        newlyHired: 12,
        expired: 4,
        netChange: 8
    },
    leakage: [
        { project: 'Alpha Software Req (Fixed)', type: 'Fixed Cost', actual: 2350, target: 2100, amount: 250 },
        { project: 'DB Hourly', type: 'Hourly', actual: 61, target: 24, amount: 37 },
        { project: 'Project 1 (DB Fixed)', type: 'Fixed Cost', actual: 950, target: 800, amount: 150 },
        { project: 'Charlie Portfolio App', type: 'Fixed Cost', actual: 2050, target: 2000, amount: 50 },
        { project: 'Alpha Enterprise Dev', type: 'Hourly', actual: 24, target: 16, amount: 8 }
    ],
    effortConsumers: [
        { name: 'E-commerce App', hours: 59, type: 'Hirebase' },
        { name: 'T&M Health', hours: 80, type: 'Hourly' },
        { name: 'Chatbot (Fixed)', hours: 25, type: 'Fixed Cost' },
        { name: 'Innovexa Cloud', hours: 16, type: 'Hirebase' },
        { name: 'Crypto Platform', hours: 10, type: 'Hourly' }
    ],
    compliance: [
        { department: 'Backend Engineering', unapproved: 45, missing: 12 },
        { department: 'Frontend UI', unapproved: 8, missing: 4 },
        { department: 'Quality Assurance', unapproved: 5, missing: 2 },
        { department: 'Business Analysis', unapproved: 0, missing: 0 }
    ],
    dailyAllocations: {
        missingLogs: [
            { department: 'Frontend UI', missingCount: 4 },
            { department: 'Backend Engineering', missingCount: 2 },
            { department: 'Business Analysis', missingCount: 1 }
        ],
        onBench: [
            { department: 'Frontend UI', benchCount: 1 },
            { department: 'Quality Assurance', benchCount: 2 },
            { department: 'Business Analysis', benchCount: 3 }
        ]
    },
    resourceCentral: {
        availability: { totalEmployees: 57, availableHours: 400, totalCapacity: 456, availablePercent: 88, overAllocated: 1, unallocatedHours: 400 },
        statusAllocation: [
            { name: 'In Development', hours: 20 },
            { name: 'Paused', hours: 16 },
            { name: 'Not Started', hours: 8 },
            { name: 'Hold', hours: 8 },
            { name: 'Signed Off', hours: 4 },
            { name: 'Ready?', hours: 0 }
        ],
        typeAllocation: [
            { name: 'Dedicated Resource', hours: 37 },
            { name: 'Fixed-Price', hours: 20 },
            { name: 'Time and Material', hours: 8 },
            { name: 'Inhouse', hours: 0 }
        ]
    }
};

// Mock Data for CRM tab based on High-Fidelity reference
const mockCRMData = {
    summary: {
        totalWon: { value: "₹4.2Cr", count: "142 Deals" },
        invoiced: { value: "₹3.8Cr", percent: "90% of Won" },
        collected: { value: "₹3.45Cr", efficiency: "90.8% Efficiency" },
        outstanding: { value: "₹35L", label: "(Invoiced - Collected)" },
        unbilled: { value: "₹40L", label: "Won but not Invoiced" }
    },
    pipelineSummaries: {
        leads: { total: 1240, qualified: 850, unqualified: 390, qPercent: 68, uPercent: 32 },
        deals: { total: 345, won: 142, lost: 203, wPercent: 41, lPercent: 59 }
    },
    collectionEfficiency: {
        score: 90.8,
        trend: "+2.4% vs last month",
        chartData: [40, 55, 45, 60, 75, 65, 80, 70, 85, 90]
    },
    pipelineFunnel: {
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
    },
    salesMetrics: {
        avgDealSize: { value: 3.2, unit: "Cr", trend: 5.4 },
        salesCycle: { days: 22, target: 30 }
    },
    receivablesAging: {
        total: "₹19.5L",
        items: [
            { range: '1-15 Days', amount: '₹12.0L', value: 100, color: 'bg-slate-300' },
            { range: '16-30 Days', amount: '₹4.5L', value: 37.5, color: 'bg-slate-400' },
            { range: '31-45 Days', amount: '₹2.0L', value: 16.6, color: 'bg-slate-600' },
            { range: '45+ Days', amount: '₹1.0L', value: 8.3, color: 'bg-rose-500 shadow-sm shadow-rose-500/30' }
        ]
    },
    collectionGoal: {
        percentage: 86.3,
        target: "₹4.0Cr",
        collected: "₹3.45Cr"
    },
    topContributors: [
        { name: "Acme Corp Global", invoiced: "₹12.5L", percent: 88, status: 'GOOD' as const },
        { name: "TechStart Systems", invoiced: "₹8.5L", percent: 50, status: 'PARTIAL' as const },
        { name: "Global Dynamics", invoiced: "₹6.2L", percent: 100, status: 'COMPLETED' as const },
        { name: "Sirius Cybernetics", invoiced: "₹4.5L", percent: 22, status: 'LATE' as const },
        { name: "Massive Dynamic", invoiced: "₹3.8L", percent: 89, status: 'GOOD' as const },
    ],
    lostDealAnalysis: [
        { label: "Competitor", value: 40, color: "fill-rose-500 bg-rose-500" },
        { label: "Delayed", value: 30, color: "fill-amber-400 bg-amber-400" },
        { label: "Budget", value: 20, color: "fill-slate-400 bg-slate-400" },
        { label: "Other", value: 10, color: "fill-slate-200 bg-slate-200" }
    ],
    sourceMix: { new: 45, existing: 55 }
};

// Mock Data for Recruitment tab based on reference screenshots
const mockRecruitmentData = {
    hiringEfficiency: { interviewToHire: '8:1', timeToHire: 50 },
    candidateRatio: { totalCandidates: 399, totalHires: 36, hireRatio: 9 },
    stageConversion: [
        { name: 'Total Candidates', value: 399, color: '#be123c' }, // rose-700
        { name: 'Selected Candidates', value: 312, color: '#a3e635' }, // lime-400
        { name: 'Offered Candidates', value: 184, color: '#22c55e' }, // green-500
        { name: 'Offer Accepted', value: 162, color: '#d946ef' }, // fuchsia-500
        { name: 'Joined Candidates', value: 154, color: '#4ade80' }  // green-400
    ],
    jobStatus: {
        totalJobs: 68,
        chartData: [
            { name: 'Closed', value: 45, color: '#10b981' }, // emerald-500
            { name: 'Open', value: 23, color: '#f43f5e' }   // rose-500
        ]
    },
    offerAcceptance: {
        totalOffers: 162,
        chartData: [
            { name: 'Accepted', value: 142, color: '#10b981' }, // emerald-500
            { name: 'Declined/Pending', value: 20, color: '#f43f5e' } // rose-500
        ]
    }
};

interface DynamicTabsProps {
    activeTab: ModuleOption;
    dateRange: DateRangeOption;
    selectedBU: BusinessUnitOption;
}

export const DynamicTabs: React.FC<DynamicTabsProps> = ({ activeTab, dateRange }) => {
    const peopleWC = useWidgetConfig('people');
    const crmWC = useWidgetConfig('crm');
    const recruitmentWC = useWidgetConfig('recruitment');
    const pmWC = useWidgetConfig('project_management');

    // Current tab's widget config
    const wc = activeTab === 'people' ? peopleWC
        : activeTab === 'crm' ? crmWC
            : activeTab === 'recruitment' ? recruitmentWC
                : pmWC;

    return (
        <div className="w-full flex-1 flex flex-col pt-1 bg-slate-50/50">

            {/* ── Tab Header Bar with Customize Widgets ── */}
            <div className="px-6 pt-3 pb-2 flex items-center justify-end">
                <div className="relative">
                    <CustomizeWidgetsButton
                        tab={activeTab}
                        config={wc.config}
                        toggle={wc.toggle}
                    />
                </div>
            </div>

            {/* Tab Content Area */}
            <div className="flex-1">
                {activeTab === 'people' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 px-6 pb-12">
                        <div className="flex flex-col space-y-6">
                            {/* 3-COLUMN VERTICAL STACKING ARCHITECTURE */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                                {/* Column 1: The Trigger (3/12) */}
                                <div className="lg:col-span-3 flex flex-col gap-6">
                                    {peopleWC.isVisible('talentRiskScore') && <TalentRiskScore data={mockPeopleData.talentRisk} />}
                                    {peopleWC.isVisible('exitByTypeAndReason') && <ExitByTypeAndReason data={mockPeopleData.exitByTypeAndReason} />}
                                </div>

                                {/* Column 2: The Trend (6/12) */}
                                <div className="lg:col-span-6 flex flex-col gap-6">
                                    {peopleWC.isVisible('attritionAnalysis') && <AttritionAnalysis data={mockPeopleData.exitTrend} />}
                                    {peopleWC.isVisible('skillsGap') && <SkillsGap data={mockPeopleData.skillsGap} />}
                                </div>

                                {/* Column 3: The Impact (3/12) */}
                                <div className="lg:col-span-3 flex flex-col gap-6">
                                    {peopleWC.isVisible('attritionMetrics') && <AttritionMetrics data={mockPeopleData.exitTrend} />}
                                    {peopleWC.isVisible('managerWatchlist') && <ManagerWatchlist data={mockPeopleData.managerWatchlist} />}
                                    {peopleWC.isVisible('topEmployees') && <TopEmployees data={mockPeopleData.topEmployees} />}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'crm' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 px-6 pb-12">
                        <div className="flex flex-col space-y-6">

                            {crmWC.isVisible('crmSummaryCards') && <CRMSummaryCards dateRange="this_year" data={mockCRMData.summary} />}

                            {crmWC.isVisible('revenueTrend') && (
                                <div className="h-[340px]"><RevenueTrend /></div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                                {crmWC.isVisible('crmFunnelSwitcher') && (
                                    <div className="lg:col-span-8 flex flex-col min-h-[580px]">
                                        <CRMFunnelSwitcher data={mockCRMData.pipelineFunnel} />
                                    </div>
                                )}
                                <div className="lg:col-span-4 flex flex-col gap-4">
                                    {crmWC.isVisible('crmPipelineSummaries') && <CRMPipelineSummaries data={mockCRMData.pipelineSummaries} />}
                                    {crmWC.isVisible('salesMetrics') && <SalesMetrics dateRange="this_year" data={mockCRMData.salesMetrics} />}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                {crmWC.isVisible('receivablesAging') && (
                                    <div className="lg:col-span-4 flex flex-col min-h-[380px]">
                                        <ReceivablesAging dateRange="this_year" data={mockCRMData.receivablesAging} />
                                    </div>
                                )}
                                {crmWC.isVisible('avgDaysToPay') && (
                                    <div className="lg:col-span-4 flex flex-col min-h-[380px]">
                                        <AvgDaysToPay />
                                    </div>
                                )}
                                {crmWC.isVisible('collectionEfficiency') && (
                                    <div className="lg:col-span-2 flex flex-col min-h-[380px]">
                                        <CollectionEfficiency dateRange="this_year" data={mockCRMData.collectionEfficiency} />
                                    </div>
                                )}
                                {crmWC.isVisible('collectionGoalCard') && (
                                    <div className="lg:col-span-2 flex flex-col min-h-[380px]">
                                        <CollectionGoalCard dateRange="this_year" data={mockCRMData.collectionGoal} />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                {crmWC.isVisible('revenueSourceMix') && (
                                    <div className="lg:col-span-6 flex flex-col min-h-[400px]">
                                        <RevenueSourceMix data={mockCRMData.sourceMix} />
                                    </div>
                                )}
                                {crmWC.isVisible('lostDealAnalysis') && (
                                    <div className="lg:col-span-6 flex flex-col min-h-[400px]">
                                        <LostDealAnalysis data={mockCRMData.lostDealAnalysis} />
                                    </div>
                                )}
                            </div>

                            {crmWC.isVisible('topRevenueContributors') && (
                                <div className="min-h-[450px]">
                                    <TopRevenueContributors data={mockCRMData.topContributors} />
                                </div>
                            )}

                        </div>
                    </div>
                )}


                {activeTab === 'recruitment' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 px-6 pb-12">
                        <div className="flex flex-col space-y-6">

                            {recruitmentWC.isVisible('recruitmentSummaryCards') && (
                                <div className="grid grid-cols-12 gap-6 items-start">
                                    <RecruitmentSummaryCards data={mockRecruitmentData} />
                                </div>
                            )}

                            <div className="grid grid-cols-12 gap-6 items-start">
                                {recruitmentWC.isVisible('stageConversion') && (
                                    <div className="col-span-12 lg:col-span-4 flex flex-col h-fit">
                                        <StageConversion data={mockRecruitmentData.stageConversion} />
                                    </div>
                                )}
                                {recruitmentWC.isVisible('recruitmentVelocity') && (
                                    <div className="col-span-12 lg:col-span-4 flex flex-col h-full">
                                        <RecruitmentVelocity dateRange="last_year" />
                                    </div>
                                )}
                                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-fit">
                                    {recruitmentWC.isVisible('jobStatus') && <JobStatus data={mockRecruitmentData.jobStatus} />}
                                    {recruitmentWC.isVisible('offerAcceptance') && <OfferAcceptance data={mockRecruitmentData.offerAcceptance} />}
                                </div>
                            </div>

                        </div>
                    </div>
                )}


                {activeTab === 'project_management' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 px-6 pb-12">
                        <div className="flex flex-col space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-max">

                                {pmWC.isVisible('resourceAllocationCentral') && (
                                    <div className="lg:col-span-8 flex flex-col h-full">
                                        <ResourceAllocationCentral dateRange="this_year" data={mockPMData.resourceCentral} />
                                    </div>
                                )}
                                {pmWC.isVisible('missingAllocations') && (
                                    <div className="lg:col-span-4 flex flex-col h-full">
                                        <MissingAllocations dateRange={dateRange} data={mockPMData.dailyAllocations} />
                                    </div>
                                )}

                                {pmWC.isVisible('pmHealthBreakdown') && (
                                    <div className="lg:col-span-4 flex flex-col">
                                        <PMHealthBreakdown dateRange="this_year" data={mockPMData.healthBreakdown} />
                                    </div>
                                )}
                                {pmWC.isVisible('topEffortConsumers') && (
                                    <div className="lg:col-span-4 flex flex-col">
                                        <TopEffortConsumers dateRange="this_year" data={mockPMData.effortConsumers} />
                                    </div>
                                )}
                                {pmWC.isVisible('upcomingExpirations') && (
                                    <div className="lg:col-span-4 flex flex-col">
                                        <UpcomingExpirations dateRange="this_year" data={mockPMData.expirations} metricData={mockPMData.hireVsExpire} />
                                    </div>
                                )}

                                {pmWC.isVisible('revenueLeakage') && (
                                    <div className="lg:col-span-6 flex flex-col">
                                        <RevenueLeakage dateRange="this_year" data={mockPMData.leakage} />
                                    </div>
                                )}
                                {pmWC.isVisible('timesheetCompliance') && (
                                    <div className="lg:col-span-6 flex flex-col">
                                        <TimesheetCompliance dateRange={dateRange} data={mockPMData.compliance} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
